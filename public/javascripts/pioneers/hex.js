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

YUI.add("pioneers-hex", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        HEX = "pioneers-hex",
        augment = Y.augment,
        Attribute = Y.Attribute,
        extend = Y.extend,
        Base = Y.Base,
        Position = pioneers.Position,
        map = Y.Array.map,
        each = Y.Array.each,
        filter = Y.Array.filter;

    var Hex = function() {
        pioneers.Hex.superclass.constructor.apply(this, arguments);
    };

    Hex.NAME = HEX;

    Hex.ATTRS =  {
        position: {
        },
        type: {
        },
        harborType: {
        },
        harborPosition: {
        },
        board: {
        },
        roll: {
        }
    };

    extend(Hex, Base, {
        hasRobber: function() {
            var row = this.row(),
                col = this.col(),
                board = this.get("board");

            return row === board.robberRow() && col === board.robberCol();
        },

        isSettleable: function() {
            return this.get("type") !== "sea";
        },

        isRobbable: function() {
            return this.isSettleable() && !this.hasRobber();
        },

        isHarbor: function() {
            return !!this.get("harborType");
        },

        hexPositions: function() {
            var row = this.row(),
                col = this.col();

            return [[row - 1, col + 1],
                    [row - 1, col],
                    [row, col - 1],
                    [row + 1, col - 1],
                    [row + 1, col],
                    [row, col + 1]];
        },

        nodePositions: function() {
            var row = this.row(),
                col = this.col();

            return [[row, 2 * col + 3],
                    [row, 2 * col + 2],
                    [row, 2 * col + 1],
                    [row + 1, 2 * col],
                    [row + 1, 2 * col + 1],
                    [row + 1, 2 * col + 2]];
        },

        robbableNodes: function(player) {
            return filter(this.nodes(), function(node) {
                return node.isSettled() && node.get("player") !== player;
            });
        },

        edgePositions: function() {
            var row = this.row(),
                col = this.col();

            return [[row, 3 * col + 5],
                    [row, 3 * col + 4],
                    [row, 3 * col + 3],
                    [row + 1, 3 * col + 2],
                    [row + 1, 3 * col + 4],
                    [row, 3 * col + 6]];
        }
    });

    augment(Hex, Position);

    pioneers.Hex = Hex;

}, '0.0.1', { requires: ["attributes", "collection", "pioneers-position"] });
