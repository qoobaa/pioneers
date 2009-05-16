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

$.widget("ui.gameinfo", {
    _init: function() {
        this.element.addClass("ui-widget ui-gameinfo");

        var gameDl = $("<dl/>").appendTo(this.element);

        $("<dt/>").appendTo(gameDl).text("State");
        this.state = $("<dd/>").appendTo(gameDl).addClass("ui-gameinfo-state");
        $("<dt/>").appendTo(gameDl).text("Phase");
        this.phase = $("<dd/>").appendTo(gameDl).addClass("ui-gameinfo-phase");
        $("<dt/>").appendTo(gameDl).text("Turn");
        this.turn = $("<dd/>").appendTo(gameDl).addClass("ui-gameinfo-turn");
        $("<dt/>").appendTo(gameDl).text("Roll");
        this.roll = $("<dd/>").appendTo(gameDl).addClass("ui-gameinfo-roll");

        this._refresh("state");
        this._refresh("phase");
        this._refresh("turn");
        this._refresh("roll");
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
