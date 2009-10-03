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
            game: {
            },
            steps: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game"),
                        player = game.userPlayer(),
                        bricks = player.get("bricksRate"),
                        grain = player.get("grainRate"),
                        lumber = player.get("lumberRate"),
                        ore = player.get("oreRate"),
                        wool = player.get("woolRate");
                    return {
                        bricks: bricks,
                        grain: grain,
                        lumber: lumber,
                        ore: ore,
                        wool: wool
                    };
                }
            },
            min: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game"),
                        player = game.userPlayer(),
                        bricks = player.get("bricks"),
                        grain = player.get("grain"),
                        lumber = player.get("lumber"),
                        ore = player.get("ore"),
                        wool = player.get("wool");
                    return {
                        bricks: - bricks,
                        grain: - grain,
                        lumber: - lumber,
                        ore: - ore,
                        wool: - wool
                    };
                }
            },
            max: {
                readOnly: true,
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
            return Exchange.superclass._validateValue.apply(this, arguments) &&
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
        },

        bindUI: function() {
            Exchange.superclass.bindUI.apply(this, arguments);
            this.acceptButton.after("click", Y.bind(this._afterAcceptClick, this));
        },

        _afterAcceptClick: function(event) {
            var values = this._getSpinnersValues();

            this.fire(EXCHANGE, values);
        }
    });

    Y.Exchange = Exchange;

}, '0.0.1', { requires: ["resources"] });
