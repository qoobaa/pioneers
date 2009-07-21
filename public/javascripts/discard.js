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

YUI.add("discard", function(Y) {
    var DISCARD = "discard",
        CONTENT_BOX = "contentBox",
        Resources = Y.Resources,
        bind = Y.bind;

    function Discard() {
        Discard.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Discard, {
        NAME: DISCARD,
        ATTRS: {
            label: {
                value: "Discard"
            },
            limit: {
                value: 0
            }
        }
    });

    Y.extend(Discard, Resources, {
        _validateValue: function(value) {
            return Discard.superclass._validateValue.apply(this, arguments) &&
                this._isValidDiscard(value);
        },

        _isValidDiscard: function(value) {
            var min = this.get("min"),
                limit = this.get("limit");

            return -min.bricks + value.bricks +
                -min.grain + value.grain +
                -min.lumber + value.lumber +
                -min.ore + value.ore +
                -min.wool + value.wool === limit;
        }
    });

    Y.Discard = Discard;

}, '0.0.1', { requires: ["resources"] });
