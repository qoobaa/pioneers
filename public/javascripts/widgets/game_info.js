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

$.widget("ui.gameInfo", {
    _init: function() {
        $(this.element).addClass("gameinfo");
        var gameDl = $("<dl/>").appendTo(this.element);
        $("<dt/>").appendTo(gameDl).text("State");
        $("<dd/>").appendTo(gameDl).addClass("state");
        $("<dt/>").appendTo(gameDl).text("Phase");
        $("<dd/>").appendTo(gameDl).addClass("phase");
        $("<dt/>").appendTo(gameDl).text("Turn");
        $("<dd/>").appendTo(gameDl).addClass("turn");
        $("<dt/>").appendTo(gameDl).text("Roll");
        $("<dd/>").appendTo(gameDl).addClass("roll");
        this._refreshState();
        this._refreshPhase();
        this._refreshTurn();
        this._refreshRoll();
    },

    _refreshState: function(highlight) {
        var state = $(this.element).find("dd.state").text(this._getState());
        if(highlight) state.effect("highlight");
    },

    _refreshPhase: function(highlight) {
        var phase = $(this.element).find("dd.phase").text(this._getPhase());
        if(highlight) phase.effect("highlight");
    },

    _refreshTurn: function(highlight) {
        var turn = $(this.element).find("dd.turn").text(this._getTurn());
        if(highlight) turn.effect("highlight");
    },

    _refreshRoll: function(highlight) {
        var roll = $(this.element).find("dd.roll").text(this._getRoll());
        if(highlight) roll.effect("highlight");
    },

    _getState: function() {
        return this._getData("state");
    },

    _getPhase: function() {
        return this._getData("phase");
    },

    _getTurn: function() {
        return this._getData("turn");
    },

    _getRoll: function() {
        return this._getData("roll");
    }
});
