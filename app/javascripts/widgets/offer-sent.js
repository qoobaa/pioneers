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

YUI.add("offer-sent", function(Y) {

    var OFFER_SENT = "offer-sent",
        getCN = Y.ClassNameManager.getClassName,
        C_OFFER_SENT = getCN(OFFER_SENT),
        DECLINE = "decline",
        C_DECLINE = getCN(OFFER_SENT, DECLINE),
        RESPONSE = "response",
        C_RESPONSE = getCN(OFFER_SENT, RESPONSE),
        ACCEPT = "accept",
        C_ACCEPT = getCN(OFFER_SENT, ACCEPT),
        CONTENT_BOX = "contentBox",
        DIV_TEMPLATE = '<div></div>',
        SPAN_TEMPLATE = "<span></span>",
        LABEL_TEMPLATE = "<label></label>",
        BUTTON_TEMPLATE = '<button type="button"></button>',
        LABEL = "label",
        VALUE = "value",
        C_LABEL = getCN(OFFER_SENT, RESPONSE, LABEL),
        C_VALUE = getCN(OFFER_SENT, RESPONSE, VALUE),
        BRICKS = "bricks",
        GRAIN = "grain",
        LUMBER = "lumber",
        ORE = "ore",
        WOOL = "wool",
        Widget = Y.Widget,
        Node = Y.Node,
        bind = Y.bind,
        each = Y.each,
        pioneers = Y.namespace("pioneers");

    function OfferSent() {
        OfferSent.superclass.constructor.apply(this, arguments);
    }

    Y.mix(OfferSent, {
        NAME: OFFER_SENT,
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

    Y.extend(OfferSent, Widget, {
        initializer: function() {
            this.valueNodes = [];
            this.acceptNodes = [];
        },

        renderUI: function() {
            this._renderOffer();
            this._renderDeclineButton();
        },

        bindUI: function() {
            this.decline.after("click", bind(this._afterDeclineClick, this));
        },

        syncUI: function() {
            this._uiSyncOffer();
            this._uiSyncResponses();
        },

        _afterDeclineClick: function(event) {
            this.fire(DECLINE);
        },

        _afterAcceptClick: function(playerNumber) {
            this.fire(ACCEPT, playerNumber);
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

        _uiSyncResponses: function() {
            var game = this.get("game"),
                offer = game.get("offer");

            if(offer) {
                var responses = offer.get("responses");

                each(this.valueNodes, function(node) {
                    node.set("innerHTML", "");
                }, this);

                each(this.acceptNodes, function(node) {
                    node.set("disabled", true);
                }, this);

                each(responses, function(response) {
                    this._uiSyncResponse(response);
                }, this);
            }
        },

        _uiSyncResponse: function(response) {
            var game = this.get("game"),
                playerNumber = response.player,
                player = game.player(playerNumber),
                agreed = response.agreed;

            if(!this.valueNodes[playerNumber]) {
                this._renderResponse(response);
            } else {
                this.valueNodes[playerNumber].set("innerHTML", agreed);
                this.acceptNodes[playerNumber].set("disabled", !agreed);
            }
        },

        _renderResponse: function(response) {
            var game = this.get("game"),
                playerNumber = response.player,
                player = game.player(playerNumber),
                playerName = player.get("name"),
                agreed = response.agreed,
                contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var itemNode = Node.create(DIV_TEMPLATE);
            contentBox.appendChild(itemNode);
            itemNode.addClass(C_RESPONSE);

            var labelNode = Node.create(LABEL_TEMPLATE);
            itemNode.appendChild(labelNode);
            labelNode.addClass(C_LABEL);
            labelNode.set("innerHTML", playerName);

            var valueNode = Node.create(SPAN_TEMPLATE);
            itemNode.appendChild(valueNode);
            valueNode.addClass(C_VALUE);
            valueNode.set("innerHTML", agreed);

            this.valueNodes[playerNumber] = valueNode;

            var accept = this._createButton(strings.accept, C_ACCEPT);
            itemNode.appendChild(accept);
            accept.set("disabled", !agreed);

            this.acceptNodes[playerNumber] = accept;
            accept.after("click", bind(this._afterAcceptClick, this, playerNumber));
        },

        _createButton: function(text, className) {
            var button = Y.Node.create(BUTTON_TEMPLATE);

            button.set("innerHTML", text);
            button.set("title", text);
            button.addClass(className);

            return button;
        }
    });

    Y.OfferSent = OfferSent;

}, '0.0.1', { requires: ["widget"] });
