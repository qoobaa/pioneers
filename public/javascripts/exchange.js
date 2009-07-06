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

YUI.add("exchange", function(Y) {
    var EXCHANGE = "exchange",
        CONTENT_BOX = "contentBox",
        Resources = Y.Resources,
        bind = Y.bind;

    function Exchange() {
        Exchange.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Exchange, {
        NAME: EXCHANGE,
        ATTRS: {
            label: {
                value: "Exchange"
            },
            steps: {
                value: {
                    bricks: 4,
                    grain: 4,
                    lumber: 4,
                    ore: 4,
                    wool: 4
                }
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

    Y.extend(Exchange, Resources, {
        _validateValue: function(value) {
            return bind(Exchange.superclass._validateValue, this, value)() &&
                this._isValidExchange(value);
        },

        _isValidExchange: function(value) {
            var steps = this.get("steps"),
                bricks = value.bricks >= 0 ? value.bricks : value.bricks / steps.bricks,
                grain = value.grain >= 0 ? value.grain : value.grain / steps.grain,
                lumber = value.lumber >= 0 ? value.lumber : value.lumber / steps.lumber,
                ore = value.ore >= 0 ? value.ore : value.ore / steps.ore,
                wool = value.wool >= 0 ? value.wool : value.wool / steps.wool;
            return bricks + grain + lumber + ore + wool === 0;
        }
    });

    Y.Exchange = Exchange;

}, '0.0.1', { requires: ["resources"] });
