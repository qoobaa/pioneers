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
        grep = Y.Array.grep,
        find = Y.Array.find,
        isValue = Y.Lang.isValue;

    Edge = function() {
        pioneers.Edge.superclass.constructor.apply(this, arguments);
    };

    Edge.NAME = EDGE;

    Edge.ATTRS =  {

    };

    extend(Edge, Base, {
        isSettled: function() {
            return isValue(this.get("player"));
        },

        hexPositions: function() {
            var col = this.col(),
                row = this.row();

            if(col % 3 == 0) {
                return [[row, col / 3 - 1],
                        [row, col / 3 - 2]];
            } else if(col % 3 == 1) {
                return [[row - 1, (col - 1) / 3 - 1],
                        [row, (col - 1) / 3 - 1]];
            } else {
                return [[row - 1, (col - 2) / 3],
                        [row, (col - 2) / 3 - 1]];
            }
        },

        isSettleable: function() {
            return isValue(find(this.hexes(), function(hex) {
                return hex.isSettleable();
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
            return grep(this.nodes(), function(node) {
                return node.isSettlement(player);
            });
        },

        hasSettlement: function(player) {
            return !!getSettlements(player).length;
        },

        hasSettlementWithoutRoad: function(player) {
            return isValue(find(this.settlements(player), function(settlement) {
                return !settlement.hasRoad(player);
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
                return [[row, col + 1],
                        [row, col - 1]];
            } else if(col % 3 === 1) {
                return [[row - 1, col + 2],
                        [row, col + 1]];
            } else {
                return [[row, col + 2],
                        [row, col + 1]];
            }
        },

        edgePositions: function() {
            var leftEdgePositions = this.leftEdgePositions(),
                rightEdgePositions = this.rightEdgePositions();

            // can't find merge for arrays :-/
            return [leftEdgePositions[0], leftEdgePositions[1],
                    rightEdgePositions[0], rightEdgePositions[1]];
        },

        leftEdges: function() {
            var board = this.get("board");
            return map(this.leftEdgePositions(), function(position) {
                return board.edge(position);
            });
        },

        rightEdges: function() {
            var board = this.get("board");
            return $.map(this.rightEdgePositions(), function(position) {
                return board.edge(position);
            });
        },

        leftRoads: function(player) {
            var leftNode = this.leftNode(),
                leftEdges = this.leftEdges();
            if(!leftNode.isSettled() || leftNode.get("player") === player) {
                return grep(leftEdges, function(edge) {
                    return edge.player == player;
                });
            } else {
                return [];
            }
        },

        rightRoads: function(player) {
            var rightNode = this.rightNode(),
                rightEdges = this.rightEdges();
            if(!rightNode.isSettled() || rightNode.get("player") === player) {
                return grep(rightEdges, function(edge) {
                    return edge.player == player;
                });
            } else {
                return [];
            }
        },

        getRoads: function(player) {
            var leftRoad = this.leftRoad(player),
                rightRoad = this.rightRoad(player);

            return [leftRoad[0], leftRoad[1], rightRoad[0], rightRoad[1]];
        },

        hasRoad: function(player) {
            return !!this.roads(player).length;
        },

        isValidForFirstRoad: function(player) {
            return !this.isSettled() && this.isSettleable() && this.hasSettlementWithoutRoad(player);
        },

        isValidForRoad: function(player) {
            return !this.isSettled() && (this.hasSettlement(player) || this.hasRoad(player));
        }
    });

    augment(Edge, Position);

    pioneers.Edge = Edge;

}, '0.0.1', { requires: ["attributes", "collection", "pioneers-position"] });
