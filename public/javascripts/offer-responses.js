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

YUI.add("offer-responses", function(Y) {

    var OFFER_RESPONSES = "offer-responses",
        getCN = Y.ClassNameManager.getClassName,
        C_OFFER_RESPONSES = getCN(OFFER_RESPONSES),
        CONTENT_BOX = "contentBox",
        DIV_TEMPLATE = '<div></div>',
        Widget = Y.Widget,
        Node = Y.Node,
        bind = Y.bind,
        pioneers = Y.namespace("pioneers");

    function OfferResponses() {
        OfferResponses.superclass.constructor.apply(this, arguments);
    }

    Y.mix(OfferResponses, {
        NAME: OFFER_RESPONSES,
        ATTRS: {
            game: {
            }
        }
    });

    Y.extend(OfferResponses, Widget, {
        renderUI: function() {
            this._renderOffer();
        },

        _renderOffer: function() {
            var game = this.get("game"),
                contentBox = this.get(CONTENT_BOX);

            offerNode = Node.create("");
        }
    });

    Y.OfferResponses = OfferResponses;

}, '0.0.1', { requires: ["widget"] });
