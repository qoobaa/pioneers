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

$.widget("ui.boardEdge", {
    _init: function() {
        var edge = this.getEdge();
        $(this.element).addClass("edge").addClass("col-" + edge.getCol());
        this.reset();
    },

    _clear: function() {
        $(this.element).removeClass("road-1 road-2 road-3 road-4").removeAttr("style");
    },

    reset: function(showEffect) {
        var edge = this.getEdge();
        this._clear();
        if(edge.isSettled()) {
            $(this.element).addClass("road-" + edge.getPlayer());
            if(showEffect) $(this.element).effect("pulsate");
        }
    },

    road: function(player) {
        var edge = this.getEdge();
        this._clear();
        $(this.element).addClass("road-" + player).css({ cursor: "pointer" });
    },

    getEdge: function() {
        return this._getData("edge");
    }
});

$.extend($.ui.boardEdge, {
    getter: "getEdge"
});
