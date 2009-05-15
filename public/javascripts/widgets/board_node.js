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

$.widget("ui.boardNode", {
    _init: function() {
        var node = this.getNode();
        $(this.element).addClass("node").addClass("col-" + node.getCol());
        this.reset();
    },

    _clear: function() {
        $(this.element).removeClass("settlement-1 settlement-2 settlement-3 settlement-4 city-1 city-2 city-3 city-4 robbable-1 robbable-2 robbable-3 robbable-4").removeAttr("style");
    },

    reset: function(showEffect) {
        var node = this.getNode();
        this._clear();
        if(node.isSettled()) {
            $(this.element).addClass(node.getState() + "-" + node.getPlayerNumber());
            if(showEffect) $(this.element).effect("pulsate");
        }
    },

    settlement: function(playerNumber) {
        var node = this.getNode();
        this._clear();
        $(this.element).addClass("settlement-" + playerNumber).css({ cursor: "pointer" });;
    },

    city: function(playerNumber) {
        var node = this.getNode();
        this._clear();
        playerNumber = playerNumber || node.getPlayerNumber();
        $(this.element).addClass("city-" + playerNumber).css({ cursor: "pointer" });;
    },

    robbable: function(playerNumber) {
        var node = this.getNode();
        this.reset();
        $(this.element).addClass("robbable-" + playerNumber).css({ cursor: "pointer" });;
    },

    getNode: function() {
        return this._getData("node");
    }
});

$.extend($.ui.boardNode, {
    getter: "getNode"
});
