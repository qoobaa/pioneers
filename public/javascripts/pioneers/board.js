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

YUI.add("pioneers-board", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        BOARD = "pioneers-board",
        augment = Y.augment,
        Attribute = Y.Attribute,
        merge = Y.merge,
        extend = Y.extend,
        Base = Y.Base,
        map = Y.Array.map,
        each = Y.Array.each,
        grep = Y.Array.grep,
        Hex = pioneers.Hex,
        Edge = pioneers.Edge,
        Node = pioneers.Node;

    var Board = function() {
        pioneers.Board.superclass.constructor.apply(this, arguments);
    };

    Board.NAME = BOARD;

    Board.ATTRS =  {
        hexes: {
        },
        nodes: {
        },
        edges: {
        },
        size: {
        }
    };

    extend(Board, Base, {
        initializer: function() {
            this._createHexes();
            this._createNodes();
            this._createEdges();
        },

        _array2D: function(size) {
            var array = [];
            for(var i = 0; i < 10; i++) {
                array[i] = [];
            }
            return array;
        },

        hex: function(position) {
            var row = this.hexes2D[position[0]];
            return row ? row[position[1]] : undefined;
        },

        node: function(position) {
            var row = this.nodes2D[position[0]];
            return row ? row[position[1]] : undefined;
        },

        edge: function(position) {
            var row = this.edges2D[position[0]];
            return row ? row[position[1]] : undefined;
        },

        settlements: function(player) {
            return grep(this.nodes, function(node) {
                return node.isSettlement(player);
            });
        },

        nodesValidForSettlement: function(player) {
            return grep(this.nodes, function(node) {
                return node.isValidForSettlement(player);
            });
        },

        nodesValidForFirstSettlement: function(player) {
            return grep(this.nodes, function(node) {
                return node.isValidForFirstSettlement(player);
            });
        },

        edgesValidForRoad: function(player) {
            return grep(this.edges, function(edge) {
                return edge.isValidForRoad(player);
            });
        },

        edgesValidForFirstRoad: function(player) {
            return grep(this.edges, function(edge) {
                return edge.isValidForFirstRoad(player);
            });
        },

        robberRow: function() {
            var robberPosition = this.get("robberPosition");
            return robberPosition[0];
        },

        robberCol: function() {
            var robberPosition = this.get("robberPosition");
            return robberPosition[1];
        },

        height: function() {
            return this.get("size")[0];
        },

        width: function() {
            return this.get("size")[1];
        },

        _createHexes: function() {
            var that = this,
                hexes = this.get("hexes"),
                height = this.get("height");

            this.hexes2D = this._array2D(height);
            this.hexes = map(hexes, function(hex) {
                var h = new Hex(merge(hex, { board: that }));
                that.hexes2D[h.row()][h.col()] = h;
                return h;
            });
        },

        _createNodes: function() {
            var that = this,
                nodes = this.get("nodes"),
                height = this.height();

            this.nodes2D = this._array2D(height);
            this.nodes = map(nodes, function(node) {
                var n = new Node(merge(node, { board: that}));
                that.nodes2D[n.row()][n.col()] = n;
                return n;
            });

            each(this.hexes, function(hex) {
                each(hex.nodePositions(), function(position) {
                    if(that.node(position) === undefined) {
                        var n = new Node({ board: that, position: position });
                        that.nodes.push(n);
                        that.nodes2D[n.row()][n.col()] = n;
                    }
                });
            });
        },

        _createEdges: function() {
            var that = this,
                edges = this.get("edges"),
                height = this.height();

            this.edges2D = this._array2D(height);
            this.edges = map(edges, function(edge) {
                var e = new Edge(merge(edge, { board: that }));
                that.edges2D[e.row()][e.col()] = e;
                return e;
            });

            each(this.hexes, function(hex) {
                each(hex.edgePositions(), function(position) {
                    if(that.edge(position) === undefined) {
                        var e = new Edge({ board: that, position: position });
                        that.edges.push(e);
                        that.edges2D[e.row()][e.col()] = e;
                    }
                });
            });
        }
    });

    pioneers.Board = Board;

}, '0.0.1', { requires: ["attributes", "collection", "pioneers-hex", "pioneers-node", "pioneers-edge"] });
