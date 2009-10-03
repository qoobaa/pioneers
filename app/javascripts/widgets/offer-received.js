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

YUI.add("offer-received", function(Y) {

    var OFFER_RECEIVED = "offer-received",
        getCN = Y.ClassNameManager.getClassName,
        C_OFFER_RECEIVED = getCN(OFFER_RECEIVED),
        DECLINE = "decline",
        ACCEPT = "accept",
        C_DECLINE = getCN(OFFER_RECEIVED, DECLINE),
        C_ACCEPT = getCN(OFFER_RECEIVED, ACCEPT),
        CONTENT_BOX = "contentBox",
        DIV_TEMPLATE = '<div></div>',
        SPAN_TEMPLATE = "<span></span>",
        LABEL_TEMPLATE = "<label></label>",
        BUTTON_TEMPLATE = '<button type="button"></button>',
        LABEL = "label",
        VALUE = "value",
        NAME = "name",
        BRICKS = "bricks",
        GRAIN = "grain",
        LUMBER = "lumber",
        ORE = "ore",
        WOOL = "wool",
        Widget = Y.Widget,
        Node = Y.Node,
        bind = Y.bind,
        isValue = Y.Lang.isValue,
        pioneers = Y.namespace("pioneers");

    function OfferReceived() {
        OfferReceived.superclass.constructor.apply(this, arguments);
    }

    Y.mix(OfferReceived, {
        NAME: OFFER_RECEIVED,
        ATTRS: {
            game: {
            },
            strings: {
                value: {
                    bricks: "Bricks",
                    grain: "Grain",
                    lumber: "Lumber",
                    ore: "Ore",
                    wool: "Wool",
                    decline: "Decline",
                    accept: "Accept"
                }
            }
        }
    });

    Y.extend(OfferReceived, Widget, {
        renderUI: function() {
            this._renderOffer();
            this._renderDeclineButton();
            this._renderAcceptButton();
        },

        bindUI: function() {
            this.decline.after("click", bind(this._afterDeclineClick, this));
            this.accept.after("click", bind(this._afterAcceptClick, this));
        },

        syncUI: function() {
            this._uiSyncOffer();
            this._uiSyncAccept();
            this._uiSyncDecline();
        },

        _afterDeclineClick: function(event) {
            this.fire(DECLINE);
        },

        _afterAcceptClick: function(event) {
            this.fire(ACCEPT);
        },

        _renderOffer: function() {
            var game = this.get("game"),
                contentBox = this.get(CONTENT_BOX);

            this._renderItem(BRICKS);
            this._renderItem(GRAIN);
            this._renderItem(LUMBER);
            this._renderItem(ORE);
            this._renderItem(WOOL);
        },

        _renderItem: function(type) {
            var game = this.get("game"),
                offer = game.get("offer"),
                value = offer ? offer.get(type) : 0,
                contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings"),
                itemClassName = this.getClassName(type),
                labelClassName = this.getClassName(type, LABEL),
                valueClassName = this.getClassName(type, VALUE);

            var itemNode = Node.create(DIV_TEMPLATE);
            contentBox.appendChild(itemNode);
            itemNode.addClass(itemClassName);

            var labelNode = Node.create(LABEL_TEMPLATE);
            itemNode.appendChild(labelNode);
            labelNode.addClass(labelClassName);
            labelNode.set("innerHTML", strings[type]);

            var valueNode = Node.create(SPAN_TEMPLATE);
            itemNode.appendChild(valueNode);
            valueNode.addClass(valueClassName);
            valueNode.set("innerHTML", value);

            this[type + "Node"] = valueNode;
        },

        _renderDeclineButton: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var decline = this._createButton(strings.decline, C_DECLINE);
            this.decline = contentBox.appendChild(decline);
        },

        _renderAcceptButton: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var accept = this._createButton(strings.accept, C_ACCEPT);
            this.accept = contentBox.appendChild(accept);
        },

        _createButton: function(text, className) {
            var button = Y.Node.create(BUTTON_TEMPLATE);

            button.set("innerHTML", text);
            button.set("title", text);
            button.addClass(className);

            return button;
        },

        _uiSyncOffer: function() {
            var game = this.get("game"),
                offer = game.get("offer");

            if(offer) {
                var bricks = offer.get("bricks"),
                    grain = offer.get("grain"),
                    lumber = offer.get("lumber"),
                    ore = offer.get("ore"),
                    wool = offer.get("wool");

                this.bricksNode.set("innerHTML", bricks);
                this.grainNode.set("innerHTML", grain);
                this.lumberNode.set("innerHTML", lumber);
                this.oreNode.set("innerHTML", ore);
                this.woolNode.set("innerHTML", wool);
            }
        },

        _uiSyncAccept: function() {
            this.accept.set("disabled", !this._isAcceptEnabled());
        },

        _uiSyncDecline: function() {
            this.decline.set("disabled", !this._isDeclineEnabled());
        },

        _isAcceptEnabled: function() {
            var game = this.get("game"),
                player = game.userPlayer(),
                playerNumber = player.get("number");
                offer = game.get("offer");

            if(offer) {
                var offerBricks = offer.get("bricks"),
                    offerGrain = offer.get("grain"),
                    offerLumber = offer.get("lumber"),
                    offerOre = offer.get("ore"),
                    offerWool = offer.get("wool"),
                    playerBricks = player.get("bricks"),
                    playerGrain = player.get("grain"),
                    playerLumber = player.get("lumber"),
                    playerOre = player.get("ore"),
                    playerWool = player.get("wool");

                return playerBricks >= offerBricks &&
                    playerGrain >= offerGrain &&
                    playerLumber >= offerLumber &&
                    playerOre >= offerOre &&
                    playerWool >= offerWool &&
                    !isValue(offer.playerResponse(playerNumber));
            } else {
                return false;
            }
        },

        _isDeclineEnabled: function() {
            var game = this.get("game"),
                player = game.userPlayer(),
                playerNumber = player.get("number"),
                offer = game.get("offer");

            if(offer) {
                return !isValue(offer.playerResponse(playerNumber));
            } else {
                return false;
            }
        }
    });

    Y.OfferReceived = OfferReceived;

}, '0.0.1', { requires: ["widget"] });
