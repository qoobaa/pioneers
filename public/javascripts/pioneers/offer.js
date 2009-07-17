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

YUI.add("pioneers-offer", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        OFFER = "pioneers-offer",
        augment = Y.augment,
        Attribute = Y.Attribute,
        merge = Y.merge,
        extend = Y.extend,
        Base = Y.Base,
        map = Y.Array.map,
        each = Y.Array.each,
        filter = Y.Array.filter,
        find = Y.Array.find,
        Hex = pioneers.Hex,
        Edge = pioneers.Edge,
        Node = pioneers.Node;

    var Offer = function() {
        pioneers.Offer.superclass.constructor.apply(this, arguments);
    };

    Offer.NAME = OFFER;

    Offer.ATTRS =  {
        id: {
            writeOnce: true
        },
        sender: {

        },
        recipient: {

        },
        bricks: {

        },
        grain: {

        },
        lumber: {

        },
        ore: {

        },
        wool: {

        },
        state: {

        },
        responses: {
            value: [],
            setter: function(values) {
                var initialized = this.get("initialized");

                if(initialized) {
                    var responses = this.get("responses");
                    each(values, function(value) {
                        // RESPONSE ADDED (value)
                        responses.push(value);
                    }, this);
                    return responses;
                } else {
                    return values;
                }
            }
        }
    };

    extend(Offer, Base, {

    });

    pioneers.Offer = Offer;

}, '0.0.1', { requires: ["base"] });
