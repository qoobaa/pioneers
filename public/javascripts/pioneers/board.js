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

YUI.add("pioneers-board", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        BOARD = "pioneers-board",
        Attribute = Y.Attribute,
        augment = Y.augment,
        merge = Y.merge,
        extend = Y.extend,
        Base = Y.Base,
        map = Y.Array.map,
        each = Y.Array.each,
        filter = Y.Array.filter,
        reduce = Y.Array.reduce,
        Hex = pioneers.Hex,
        Edge = pioneers.Edge,
        Node = pioneers.Node;

    var Board = function() {
        pioneers.Board.superclass.constructor.apply(this, arguments);
    };

    Board.NAME = BOARD;

    Board.ATTRS =  {
        size: {
            writeOnce: true,
            value: [0, 0]
        },
        robberPosition: {
            value: [0, 0]
        },
        robberRow: {
            setter: function(value) {
                var col = this.get("col");
                return [parseInt(value), col];
            },
            getter: function() {
                return this.get("robberPosition")[0];
            }
        },
        robberCol: {
            setter: function(value) {
                var row = this.get("row");
                return [row, parseInt(value)];
            },
            getter: function() {
                return this.get("robberPosition")[1];
            }
        },
        height: {
            readOnly: true,
            getter: function() {
                return this.get("size")[0];
            }
        },
        width: {
            readOnly: true,
            getter: function() {
                return this.get("size")[1];
            }
        },
        nodeHeight: {
            readOnly: true,
            getter: function() {
                return this.get("height") + 1;
            }
        },
        edgeHeight: {
            readOnly: true,
            getter: function() {
                return this.get("height") + 1;
            }
        },
        nodeWidth: {
            readOnly: true,
            getter: function() {
                return this.get("width") * 2 + 2;
            }
        },
        edgeWidth: {
            readOnly: true,
            getter: function() {
                return this.get("width") * 3 + 5;
            }
        },
        hexes: {
            writeOnce: true
        },
        nodes: {
            setter: function(values) {
                var initialized = this.get("initialized");
                if(initialized) {
                    each(values, function(value) {
                        var position = value.position,
                            node = this.node(position);
                        node.setAttrs(value);
                    }, this);
                }
            }
        },
        edges: {
            setter: function(values) {
                var initialized = this.get("initialized");
                if(initialized) {
                    each(values, function(value) {
                        var position = value.position,
                            edge = this.edge(position);
                        edge.setAttrs(value);
                    }, this);
                }
            }
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

        hexesList: function() {
            var hexes = this.hexes;
            return reduce(hexes, [], function(hexes, h) {
                return hexes.concat(h);
            });
        },

        nodesList: function() {
            var nodes = this.nodes;
            return reduce(nodes, [], function(nodes, n) {
                return nodes.concat(n);
            });
        },

        edgesList: function() {
            var edges = this.edges;
            return reduce(edges, [], function(edges, e) {
                return edges.concat(e);
            });
        },

        hex: function(position) {
            var hexes = this.hexes,
                row = hexes[position[0]];
            return row ? row[position[1]] : undefined;
        },

        node: function(position) {
            var nodes = this.nodes,
                row = nodes[position[0]];
            return row ? row[position[1]] : undefined;
        },

        edge: function(position) {
            var edges = this.edges,
                row = edges[position[0]];
            return row ? row[position[1]] : undefined;
        },

        settledNodes: function() {
            var nodes = this.nodesList();
            return filter(nodes, function(node) {
                return node && node.isSettled();
            });
        },

        settledEdges: function() {
            var edges = this.edgesList();
            return filter(edges, function(edge) {
                return edge && edge.isSettled();
            });
        },

        settlements: function(player) {
            var nodes = this.nodesList();
            return filter(nodes, function(node) {
                return node && node.isSettlement(player);
            });
        },

        nodesValidForSettlement: function(player) {
            var nodes = this.nodesList();
            return filter(nodes, function(node) {
                return node && node.isValidForSettlement(player);
            });
        },

        nodesValidForFirstSettlement: function(player) {
            var nodes = this.nodesList();
            return filter(nodes, function(node) {
                return node && node.isValidForFirstSettlement(player);
            });
        },

        edgesValidForRoad: function(player) {
            var edges = this.edgesList();
            return filter(edges, function(edge) {
                return edge && edge.isValidForRoad(player);
            });
        },

        edgesValidForFirstRoad: function(player) {
            var edges = this.edgesList();
            return filter(edges, function(edge) {
                return edge && edge.isValidForFirstRoad(player);
            });
        },

        _createHexes: function() {
            var hexes = this.get("hexes"),
                height = this.get("height");

            this.hexes = this._array2D(height);

            each(hexes, function(hex) {
                var h = new Hex(merge(hex, { board: this }));
                this.hexes[h.row()][h.col()] = h;
            }, this);
        },

        _createNodes: function() {
            var nodes = this.get("nodes"),
                height = this.get("height"),
                hexes = this.hexesList();

            this.nodes = this._array2D(height);

            each(nodes, function(node) {
                var n = new Node(merge(node, { board: this }));
                this.nodes[n.row()][n.col()] = n;
            }, this);

            each(hexes, function(hex) {
                if(hex) {
                    each(hex.nodePositions(), function(position) {
                        if(!this.node(position)) {
                            var n = new Node({ board: this, position: position });
                            this.nodes[n.row()][n.col()] = n;
                        }
                    }, this);
                }
            }, this);
        },

        _createEdges: function() {
            var edges = this.get("edges"),
                height = this.get("height"),
                hexes = this.hexesList();

            this.edges = this._array2D(height);

            each(edges, function(edge) {
                var e = new Edge(merge(edge, { board: this }));
                this.edges[e.row()][e.col()] = e;
            }, this);

            each(hexes, function(hex) {
                if(hex) {
                    each(hex.edgePositions(), function(position) {
                        if(!this.edge(position)) {
                            var e = new Edge({ board: this, position: position });
                            this.edges[e.row()][e.col()] = e;
                        }
                    }, this);
                }
            }, this);
        },

        canBuildSettlement: function(player) {
            return !!this.nodesValidForSettlement(player).length;
        },

        canBuildFirstSettlement: function(player) {
            return !!this.nodesValidForFirstSettlement(player).length;
        },

        canBuildFirstRoad: function(player) {
            return !!this.edgesValidForFirstRoad(player).length;
        },

        canBuildRoad: function(player) {
            return !!this.edgesValidForRoad(player).length;
        },

        canBuildCity: function(player) {
            return !!this.settlements(player).length;
        },

        canRobOtherPlayer: function(player, position) {
            var hex = this.hex(position);

            return !!hex.robbableNodes(player).length;
        }
    });

    pioneers.Board = Board;

}, '0.0.1', { requires: ["base", "collection", "pioneers-hex", "pioneers-node", "pioneers-edge"] });
