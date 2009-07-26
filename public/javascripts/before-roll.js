// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or
// modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of
// the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public
// License along with this program.  If not, see
// <http://www.gnu.org/licenses/>.

YUI.add("before-roll", function(Y) {
    var BEFORE_ROLL = "before-roll",
        ARMY = "army",
        ROLL = "roll",
        CARD = "card",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_ROLL = getCN(BEFORE_ROLL, ROLL),
        C_ARMY = getCN(BEFORE_ROLL, ARMY),
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_LABEL = getCN(BEFORE_ROLL, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        Widget = Y.Widget,
        Node = Y.Node,
        bind = Y.bind;

    function BeforeRoll() {
        BeforeRoll.superclass.constructor.apply(this, arguments);
    }

    Y.mix(BeforeRoll, {
        NAME: BEFORE_ROLL,
        ATTRS: {
            cards: {
                value: [
                ]
            },
            strings: {
                value: {
                    label: "Before roll",
                    army: "Army card",
                    roll: "Roll dice"
                }
            }
        }
    });

    Y.extend(BeforeRoll, Widget, {
        renderUI: function() {
            this._renderLabel();
            this._renderButtons();
        },

        bindUI: function() {
            this.after("cardsChange", bind(this._afterCardsChange, this));
            Y.on("click", bind(this._armyClick, this), this.armyNode);
            Y.on("click", bind(this._rollClick, this), this.rollNode);
        },

        _afterCardsChange: function(event) {
            this._uiSyncButtons(event.newVal);
        },

        syncUI: function() {
            this._uiSyncButtons(this.get("cards"));
        },

        _armyClick: function(event) {
            this.fire(CARD, this._armyCard(this.get("cards")));
        },

        _rollClick: function(event) {
            this.fire(ROLL);
        },

        _uiSyncButtons: function(cards) {
            this.armyNode.set("disabled", !this._armyCard(cards));
        },

        _armyCard: function(cards) {
            return Y.Array.find(cards, function(card) {
                return card.type === "army";
            });
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var army = this._createButton(strings.army, C_ARMY);
            this.armyNode = contentBox.appendChild(army);

            var roll = this._createButton(strings.roll, C_ROLL);
            this.rollNode = contentBox.appendChild(roll);
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", strings.label);

            this.labelNode = contentBox.appendChild(label);
        },

        _createButton: function(text, className) {
            var button = Y.Node.create(BUTTON_TEMPLATE);

            button.set("innerHTML", text);
            button.set("title", text);
            button.addClass(className);

            return button;
        }
    });

    Y.BeforeRoll = BeforeRoll;

}, '0.0.1', { requires: ["widget"] });
