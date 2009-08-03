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

YUI.add("pioneers-edge", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        EDGE = "pioneers-edge",
        augment = Y.augment,
        Attribute = Y.Attribute,
        Position = pioneers.Position,
        extend = Y.extend,
        Base = Y.Base,
        map = Y.Array.map,
        each = Y.Array.each,
        reject = Y.Array.reject,
        filter = Y.Array.filter,
        find = Y.Array.find,
        isValue = Y.Lang.isValue;

    Edge = function() {
        pioneers.Edge.superclass.constructor.apply(this, arguments);
    };

    Edge.NAME = EDGE;

    Edge.ATTRS =  {
        board: {
        },
        position: {
        },
        player: {
        }
    };

    extend(Edge, Base, {
        isSettled: function(player) {
            var edgePlayer = this.get("player");

            if(arguments.length) {
                return edgePlayer === player;
            } else {
                return isValue(edgePlayer);
            }
        },

        isRoad: function(player) {
            return this.get("player") === player;
        },

        hexPositions: function() {
            var col = this.col(),
                row = this.row();

            if(col % 3 == 0) {
                return [[row, col / 3 - 1], [row, col / 3 - 2]];
            } else if(col % 3 == 1) {
                return [[row - 1, (col - 1) / 3 - 1], [row, (col - 1) / 3 - 1]];
            } else {
                return [[row - 1, (col - 2) / 3], [row, (col - 2) / 3 - 1]];
            }
        },

        isSettleable: function() {
            return isValue(find(this.hexes(), function(hex) {
                return hex && hex.isSettleable();
            }));
        },

        rightNodePosition: function() {
            var col = this.col(),
                row = this.row();

            if(col % 3 === 0) {
                return [row, 2 * col / 3 - 1];
            } else if(col % 3 === 1) {
                return [row, 2 * (col - 1) / 3];
            } else {
                return [row, 2 * (col - 2) / 3 + 1];
            }
        },

        leftNodePosition: function() {
            var col = this.col(),
                row = this.row();

            if(col % 3 === 0) {
                return [row + 1, 2 * col / 3 - 2];
            } else if(col % 3 === 1) {
                return [row, 2 * (col - 1) / 3 - 1];
            } else {
                return [row, 2 * (col - 2) / 3];
            }
        },

        nodePositions: function() {
            return [this.leftNodePosition(), this.rightNodePosition()];
        },

        leftNode: function() {
            var board = this.get("board");
            return board.node(this.leftNodePosition());
        },

        rightNode: function() {
            var board = this.get("board");
            return board.node(this.rightNodePosition());
        },

        settlements: function(player) {
            return filter(this.nodes(), function(node) {
                return node && node.isSettlement(player);
            });
        },

        hasSettlement: function(player) {
            return !!this.settlements(player).length;
        },

        hasSettlementWithoutRoad: function(player) {
            return isValue(find(this.settlements(player), function(settlement) {
                return settlement && !settlement.hasRoad(player);
            }));
        },

        leftEdgePositions: function() {
            var col = this.col(),
                row = this.row();

            if(col % 3 === 0) {
                return [[row + 1, col - 2], [row + 1, col - 1]];
            } else if(col % 3 === 1) {
                return [[row, col - 2], [row, col - 1]];
            } else {
                return [[row - 1, col + 1], [row, col - 1]];
            }
        },

        rightEdgePositions: function() {
            var col = this.col(),
                row = this.row();

            if(col % 3 == 0) {
                return [[row, col + 1], [row, col - 1]];
            } else if(col % 3 === 1) {
                return [[row - 1, col + 2], [row, col + 1]];
            } else {
                return [[row, col + 2], [row, col + 1]];
            }
        },

        edgePositions: function() {
            return this.leftEdgePositions().concat(this.rightEdgePositions());
        },

        leftEdges: function() {
            var board = this.get("board");
            return map(this.leftEdgePositions(), function(position) {
                return board.edge(position);
            });
        },

        rightEdges: function() {
            var board = this.get("board");
            return map(this.rightEdgePositions(), function(position) {
                return board.edge(position);
            });
        },

        leftRoads: function(player) {
            var leftNode = this.leftNode(),
                leftEdges = this.leftEdges();

            if(!leftNode.isSettled() || leftNode.isSettled(player)) {
                return filter(leftEdges, function(edge) {
                    return edge && edge.isSettled(player);
                });
            } else {
                return [];
            }
        },

        rightRoads: function(player) {
            var rightNode = this.rightNode(),
                rightEdges = this.rightEdges();

            if(!rightNode.isSettled() || rightNode.isSettled(player)) {
                return filter(rightEdges, function(edge) {
                    return edge && edge.isSettled(player);
                });
            } else {
                return [];
            }
        },

        roads: function(player) {
            return this.leftRoads(player).concat(this.rightRoads(player));
        },

        hasRoad: function(player) {
            return !!this.roads(player).length;
        },

        isValidForFirstRoad: function(player) {
            return !this.isSettled() && this.isSettleable() && this.hasSettlementWithoutRoad(player);
        },

        isValidForRoad: function(player) {
            return !this.isSettled() && this.isSettleable() && (this.hasSettlement(player) || this.hasRoad(player));
        }
    });

    augment(Edge, Position);

    pioneers.Edge = Edge;

}, '0.0.1', { requires: ["base", "collection", "pioneers-position"] });
