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

YUI.add("pioneers-node", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        Position = pioneers.Position,
        NODE = "pioneers-node",
        augment = Y.augment,
        Attribute = Y.Attribute,
        extend = Y.extend,
        Base = Y.Base,
        map = Y.Array.map,
        each = Y.Array.each,
        grep = Y.Array.grep,
        find = Y.Array.find,
        isValue = Y.Lang.isValue;

    Node = function() {
        pioneers.Node.superclass.constructor.apply(this, arguments);
    };

    Node.NAME = NODE;

    Node.ATTRS =  {

    };

    extend(Node, Base, {
        isSettled: function() {
            return isValue(this.get("player"));
        },

        _hasPlayerAndState: function(otherPlayer, otherState) {
            var state = this.get("state"),
                player = this.get("player");
            if(isValue(otherPlayer)) {
                return otherState === state && otherPlayer === player;
            } else {
                return otherState === state;
            }
        },

        isSettlement: function(otherPlayer) {
            this._hasPlayerAndState(otherPlayer, "settlement");
        },

        isCity: function(otherPlayer) {
            this._hasPlayerAndState(otherPlayer, "city");
        },

        hexPositions: function() {
            var col = this.col(),
                row = this.row();

            if(col % 2 == 0) {
                return [[row - 1, col / 2],
                        [row - 1, col / 2 - 1],
                        [row, col / 2 - 1]];
            } else {
                return [[row - 1, (col - 1) / 2],
                        [row, (col - 1) / 2 - 1],
                        [row, (col - 1) / 2]];
            }
        },

        isSettleable: function() {
            return isValue(find(this.hexes(), function(hex) {
                return hex.isSettleable();
            }));
        },

        nodePositions: function() {
            var col = this.col(),
                row = this.row();

            if(col % 2 == 0) {
                return [[row - 1, col + 1], [row, col - 1], [row, col + 1]];
            } else {
                return [[row, col + 1], [row, col - 1], [row + 1, col - 1]];
            }
        },

        hasSettlementInNeighbourhood: function() {
            return isValue(find(this.nodes(), function(node) {
                return node.isSettled();
            }));
        },

        edgePositions: function() {
            var col = this.col(),
                row = this.row();

            if(col % 2 == 0) {
                return [[row - 1, 3 * col / 2 + 3], [row, 3 * col / 2 + 1], [row, 3 * col / 2 + 2]];
            } else {
                return [[row, 3 * ((col - 1) / 2 + 1) + 1], [row, 3 * ((col - 1) / 2 + 1) - 1], [row, 3 * ((col - 1) / 2 + 1)]];
            }
        },

        roads: function(player) {
            return $.grep(this.edges(), function(edge) {
                return edge.get("player") === player;
            });
        },

        hasRoad: function(player) {
            return !this.roads(player).length;
        },

        isValidForFirstSettlement: function() {
            return !this.isSettled() &&
                this.isSettleable() &&
                !this.hasSettlementInNeighbourhood();
        },

        isValidForSettlement: function(player) {
            return !this.isSettled() &&
                !this.hasSettlementInNeighbourhood() &&
                this.hasRoad(player);
        },

        isValidForCity: function(player) {
            return this.isSettlement(player);
        }
    });

    augment(Node, Position);

    pioneers.Node = Node;

}, '0.0.1', { requires: ["base", "collection", "pioneers-position"] });
