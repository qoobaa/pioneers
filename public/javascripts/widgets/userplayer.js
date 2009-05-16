// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

$.widget("ui.userplayer", {
    _init: function() {
        this.element.addClass("ui-widget ui-user-player");

        var playerDl = $("<dl/>").appendTo(this.element);
        $("<dt/>").appendTo(playerDl).text("Bricks");
        this.bricks = $("<dd/>").appendTo(playerDl).addClass("bricks");
        $("<dt/>").appendTo(playerDl).text("Grain");
        this.grain = $("<dd/>").appendTo(playerDl).addClass("grain");
        $("<dt/>").appendTo(playerDl).text("Lumber");
        this.lumber = $("<dd/>").appendTo(playerDl).addClass("lumber");
        $("<dt/>").appendTo(playerDl).text("Ore");
        this.ore = $("<dd/>").appendTo(playerDl).addClass("ore");
        $("<dt/>").appendTo(playerDl).text("Wool");
        this.wool = $("<dd/>").appendTo(playerDl).addClass("wool");
        $("<dt/>").appendTo(playerDl).text("Settlements");
        this.settlements = $("<dd/>").appendTo(playerDl).addClass("settlements");
        $("<dt/>").appendTo(playerDl).text("Cities");
        this.cities = $("<dd/>").appendTo(playerDl).addClass("cities");
        $("<dt/>").appendTo(playerDl).text("Roads");
        this.roads = $("<dd/>").appendTo(playerDl).addClass("roads");

        this._refresh("bricks");
        this._refresh("grain");
        this._refresh("lumber");
        this._refresh("ore");
        this._refresh("wool");
        this._refresh("settlements");
        this._refresh("cities");
        this._refresh("roads");
    },

    _refresh: function(key, highlight) {
        if(this[key]) {
            this[key].text(this.options[key]);
            if(highlight) this[key].effect("highlight");
        }
    },

    _setData: function(key, value) {
        if(this.options[key] !== value) {
            this._trigger(key + "change", null, [value]);
            this.options[key] = value;
            this._refresh(key, true);
        }
    },

    update: function(attributes) {
        var that = this;
        $.each(attributes, function(key, value) {
            that._setData(key, value);
        });
    }
});

