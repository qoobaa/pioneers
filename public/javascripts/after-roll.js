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

YUI.add("after-roll", function(Y) {
    var AFTER_ROLL = "after-roll",
        ARMY = "army",
        END_TURN = "end-turn",
        CARD = "card",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_END_TURN = getCN(AFTER_ROLL, END_TURN),
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_LABEL = getCN(AFTER_ROLL, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        Widget = Y.Widget,
        Node = Y.Node,
        bind = Y.bind;

    function AfterRoll() {
        AfterRoll.superclass.constructor.apply(this, arguments);
    }

    Y.mix(AfterRoll, {
        NAME: AFTER_ROLL,
        ATTRS: {
            strings: {
                value: {
                    label: "After roll",
                    endTurn: "End turn"
                }
            }
        }
    });

    Y.extend(AfterRoll, Widget, {
        renderUI: function() {
            this._renderLabel();
            this._renderButtons();
        },

        bindUI: function() {
            Y.on("click", bind(this._endTurnClick, this), this.endTurnNode);
        },

        _endTurnClick: function(event) {
            this.fire(END_TURN);
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var endTurn = this._createButton(strings.endTurn, C_END_TURN);
            this.endTurnNode = contentBox.appendChild(endTurn);
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

    Y.AfterRoll = AfterRoll;

}, '0.0.1', { requires: ["widget"] });
