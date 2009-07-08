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

// Filters added to this controller apply to all controllers in the
// application.  Likewise, all the methods added will be available for
// all controllers.

YUI.add("cards", function(Y) {
    var CARDS = "cards",
        CARD = "card",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_LABEL = getCN(CARDS, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        bind = Y.bind;

    function Cards() {
        Cards.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Cards, {
        NAME: CARDS,
        ATTRS: {
            cards: {
                value: [
                    // { type: "army", id: 5, state: "untapped" },
                    // { type: "army", id: 6, state: "tapped" },
                    // { type: "victoryPoint", id: 10, state: "untapped" },
                    // { type: "yearOfPlenty", id: 8, state: "untapped" }
                ]
            },
            strings: {
                value: {
                    label: "Cards",
                    yearOfPlenty: "Year of plenty",
                    monopoly: "Monopoly",
                    army: "Army",
                    roadBuilding: "Road building",
                    victoryPoint: "Victory point"
                }
            }
        }
    });

    Y.extend(Cards, Widget, {
        initializer: function() {
            this.publish(CARD);
        },

        renderUI: function() {
            this._renderLabel();
            this._renderButtons();
        },

        bindUI: function() {
            this.after("cardsChange", bind(this._afterCardsChange, this));
        },

        _afterCardsChange: function(event) {
            this._renderButtons();
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings"),
                cards = this.get("cards"),
                that = this;

            contentBox.queryAll("button").remove();

            Y.each(cards, function(card) {
                that._renderButton(card);
            });
        },

        _renderButton: function(card) {
            var contentBox = this.get(CONTENT_BOX),
                buttonString = this.get("strings." + card.type),
                className = this.getClassName(card.type);

            var cardNode = this._createButton(buttonString, className);
            contentBox.appendChild(cardNode);

            cardNode.set("disabled", card.state === "tapped" || card.type === "victoryPoint");

            Y.on("click", bind(this._cardClicked, this, card), cardNode);
        },

        _cardClicked: function(card) {
            this.fire(CARD, card);
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

    Y.Cards = Cards;

}, '0.0.1', { requires: ["widget"] });
