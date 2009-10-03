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

YUI.add("pioneers-position", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        map = Y.Array.map,
        reject = Y.Array.reject,
        isValue = Y.Lang.isValue;

    var Position = function() {

    };

    Position.prototype.row = function() {
        var position = this.get("position");
        return position[0];
    };

    Position.prototype.col = function() {
        var position = this.get("position");
        return position[1];
    };

    Position.prototype.hexes = function() {
        var board = this.get("board");

        return map(this.hexPositions(), function(position) {
            return board.hex(position);
        });
    };

    Position.prototype.nodes = function() {
        var board = this.get("board");

        return map(this.nodePositions(), function(position) {
            return board.node(position);
        });
    };

    Position.prototype.edges = function() {
        var board = this.get("board");

        return map(this.edgePositions(), function(position) {
            return board.edge(position);
        });
    };

    pioneers.Position = Position;

}, '0.0.1', { requires: ["collection"] });
