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

YUI.add("cards", function(Y) {
    var CARDS = "cards",
        CARD = "card",
        CONTENT_BOX = "contentBox",
        YEAR_OF_PLENTY = "yearOfPlenty",
        MONOPOLY = "monopoly",
        getCN = Y.ClassNameManager.getClassName,
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_LABEL = getCN(CARDS, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        Widget = Y.Widget,
        YearOfPlenty = Y.YearOfPlenty,
        Monopoly = Y.Monopoly,
        Node = Y.Node,
        isValue = Y.Lang.isValue,
        bind = Y.bind;

    function Cards() {
        Cards.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Cards, {
        NAME: CARDS,
        ATTRS: {
            game: {
            },
            cards: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game");

                    return game.get("userCards");
                }
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
            this._renderYearOfPlenty();
            this._renderMonopoly();
        },

        bindUI: function() {
            this.after("disabledChange", this._afterDisabledChange);
            this.monopoly.after(MONOPOLY, bind(this._afterMonopoly, this));
            this.yearOfPlenty.after(YEAR_OF_PLENTY, bind(this._afterYearOfPlenty, this));
        },

        _afterDisabledChange: function(event) {
            this.syncUI();
        },

        _afterMonopoly: function(event) {
            this.monopoly.hide();
            this.fire(CARD, event.details[0]);
        },

        _afterYearOfPlenty: function(event) {
            this.yearOfPlenty.set("value", {bricks: 0, grain: 0, lumber: 0, ore: 0, wool: 0});
            this.yearOfPlenty.hide();
            this.fire(CARD, event.details[0]);
        },

        syncUI: function() {
            this._renderButtons();
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings"),
                cards = this.get("cards"),
                cardsClassName = this.getClassName(CARD);

            contentBox.queryAll("." + cardsClassName).remove();

            Y.each(cards, function(card) {
                this._renderButton(card);
            }, this);
        },

        _renderButton: function(card) {
            var contentBox = this.get(CONTENT_BOX),
                buttonString = this.get("strings." + card.type),
                className = this.getClassName(card.type),
                cardsClassName = this.getClassName(CARD),
                game = this.get("game"),
                disabled = this.get("disabled");

            var cardNode = this._createButton(buttonString, [className, cardsClassName].join(" "));
            contentBox.appendChild(cardNode);

            var tapped = (card.state !== "untapped"),
                victoryPoint = (card.type === "victoryPoint"),
                armyCard = (card.type === "army"),
                cardPlayed = isValue(game.get("card")),
                afterRoll = game.isUserAfterRoll(),
                beforeRoll = game.isUserBeforeRoll();

            cardNode.set("disabled", disabled || tapped || victoryPoint || cardPlayed || !(armyCard && beforeRoll || afterRoll));

            Y.on("click", bind(this._cardClicked, this, card), cardNode);
        },

        _renderYearOfPlenty: function() {
            var contentBox = this.get(CONTENT_BOX),
                className = this.getClassName(YEAR_OF_PLENTY);

            var yearOfPlentyNode = Node.create('<div class="' + className + '"></div>');
            this.yearOfPlenty = new YearOfPlenty({ contentBox: yearOfPlentyNode });

            contentBox.appendChild(yearOfPlentyNode);
            this.yearOfPlenty.render();
            this.yearOfPlenty.hide();
        },

        _renderMonopoly: function() {
            var contentBox = this.get(CONTENT_BOX),
                className = this.getClassName(MONOPOLY);

            var monopolyNode = Node.create('<div class="' + className + '"></div>');
            this.monopoly = new Monopoly({ contentBox: monopolyNode });

            contentBox.appendChild(monopolyNode);
            this.monopoly.render();
            this.monopoly.hide();
        },

        _cardClicked: function(card) {
            switch(card.type) {
            case "monopoly":
                this.monopoly.set("card", card);
                this.yearOfPlenty.hide();
                this.monopoly.show();
                break;
            case "yearOfPlenty":
                this.yearOfPlenty.set("card", card);
                this.monopoly.hide();
                this.yearOfPlenty.show();
                break;
            default:
                this.fire(CARD, { id: card.id });
            }
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

}, '0.0.1', { requires: ["widget", "year-of-plenty", "monopoly"] });
