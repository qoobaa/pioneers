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

YUI.add("offer", function(Y) {
    var OFFER = "offer",
        CONTENT_BOX = "contentBox",
        Resources = Y.Resources,
        bind = Y.bind;

    function Offer() {
        Offer.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Offer, {
        NAME: OFFER,
        ATTRS: {
            label: {
                value: "Offer"
            },
            max: {
                value: {
                    bricks: 19,
                    grain: 19,
                    lumber: 19,
                    ore: 19,
                    wool: 19
                }
            }
        }
    });

    Y.extend(Offer, Resources, {
        _validateValue: function(value) {
            return bind(Offer.superclass._validateValue, this, value)() &&
                this._isValidOffer(value);
        },

        _isValidOffer: function(value) {
            var minus = value.bricks < 0 ||
                value.grain < 0 ||
                value.lumber < 0 ||
                value.ore < 0 ||
                value.wool < 0;
            var plus = value.bricks > 0 ||
                value.grain > 0 ||
                value.lumber > 0 ||
                value.ore > 0 ||
                value.wool > 0;
            return minus && plus;
        }
    });

    Y.Offer = Offer;

}, '0.0.1', { requires: ["resources"] });
