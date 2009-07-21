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

YUI.add("year-of-plenty", function(Y) {
    var YEAR_OF_PLENTY = "year-of-plenty",
        CONTENT_BOX = "contentBox",
        Resources = Y.Resources,
        bind = Y.bind;

    function YearOfPlenty() {
        YearOfPlenty.superclass.constructor.apply(this, arguments);
    }

    Y.mix(YearOfPlenty, {
        NAME: YEAR_OF_PLENTY,
        ATTRS: {
            card: {
                value: null
            },
            label: {
                value: "Year of plenty"
            },
            max: {
                value: {
                    bricks: 2,
                    grain: 2,
                    lumber: 2,
                    ore: 2,
                    wool: 2
                }
            }
        }
    });

    Y.extend(YearOfPlenty, Resources, {
        bindUI: function() {
            YearOfPlenty.superclass.bindUI.apply(this, arguments);
            this.after("cardChange", bind(this._afterCardChange, this));
        },

        _afterCardChange: function(event) {
            this._uiSyncButton(this._getSpinnersValues());
        },

        _validateValue: function(value) {
            return YearOfPlenty.superclass._validateValue.apply(this, arguments) &&
                this._isValidYearOfPlenty(value);
        },

        _onAcceptClick: function() {
            var value = this._getSpinnersValues(),
                card = this.get("card");
            value.id = card.id;
            this.set("card", null);
            this.fire("yearOfPlenty", value);
        },

        _isValidYearOfPlenty: function(value) {
            return value.bricks +
                value.grain +
                value.lumber +
                value.ore +
                value.wool === 2 &&
                this.get("card") !== null;
        }
    });

    Y.YearOfPlenty = YearOfPlenty;

}, '0.0.1', { requires: ["resources"] });
