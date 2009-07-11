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

YUI.add("board", function(Y) {

    var BOARD = "board",
        HEXES = "hexes",
        NODES = "nodes",
        EDGES = "edges",
        HEX = "hex",
        EDGE = "edge",
        NODE = "node",
        ROW = "row",
        COL = "col",
        ROBBER = "robber",
        ROLL = "roll",
        HARBOR = "harbor",
        SIZE = "size",
        ROAD = "road",
        getCN = Y.ClassNameManager.getClassName,
        C_BOARD = getCN(BOARD, BOARD),
        C_ROBBER = getCN(BOARD, HEX, ROBBER),
        C_ROLL = getCN(BOARD, HEX, ROLL),
        BOARD_TEMPLATE = '<table class="' + C_BOARD + '"></table>',
        TBODY_TEMPLATE = '<tbody></tbody>',
        TR_TEMPLATE = '<tr></tr>',
        TD_TEMPLATE = '<td></td>',
        ROBBER_TEMPLATE = '<span class="' + C_ROBBER + '">robber</span>',
        ROLL_TEMPLATE = '<span class="' + C_ROLL + '"></span>',
        HARBOR_TEMPLATE = '<span></span>',
        CONTENT_BOX = "contentBox",
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        isValue = Y.Lang.isValue,
        each = Y.each,
        bind = Y.bind,
        pioneers = Y.namespace("pioneers");

    function Board() {
        Board.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Board, {
        NAME: BOARD,
        ATTRS: {
            board: {
            }
        }
    });

    Y.extend(Board, Widget, {
        initializer: function() {
            var board = this.get("board");
            this.board = new pioneers.Board(board);
        },

        renderUI: function() {
            this._renderBoard();
            this._renderHexes();
            this._renderNodes();
            this._renderEdges();
        },

        _renderBoard: function() {
            var contentBox = this.get(CONTENT_BOX),
                height = this.board.height(),
                width = this.board.width(),
                sizeClassName = this.getClassName(BOARD, SIZE, height, width);

            var board = Y.Node.create(BOARD_TEMPLATE);

            board.addClass(sizeClassName);

            this.boardNode = contentBox.appendChild(board);
        },

        _renderHexes: function() {
            var height = this.board.height(),
                width = this.board.width(),
                hexesClassName = this.getClassName(HEXES),
                hexes = this._createTbody(hexesClassName);

            this.hexesNode = this.boardNode.appendChild(hexes);

            for(var row = 0; row < height; row++) {
                var rowClassName = this.getClassName(HEXES, ROW, row),
                    tr = this._createTr(rowClassName),
                    rowNode = this.hexesNode.appendChild(tr);
                for(var col = 0; col < width; col++) {
                    var hex = this.board.hex([row, col]);
                    if(hex) {
                        var colClassName = this.getClassName(HEXES, COL, col),
                            colNode = this._createHex(hex);
                        colNode.addClass(colClassName);
                        rowNode.appendChild(colNode);
                    }
                }
            }
        },

        _createHex: function(hex) {
            var isSettleable = hex.isSettleable(),
                isHarbor = hex.isHarbor(),
                harborPosition = hex.get("harborPosition"),
                harborType = hex.get("harborType"),
                type = hex.get("type"),
                roll = hex.get("roll"),
                className = this.getClassName(HEX),
                typeClassName = this.getClassName(HEX, type),
                harborClassName = this.getClassName(HEX, HARBOR),
                harborTypeClassName = this.getClassName(HARBOR, harborType, harborPosition),
                colNode = Node.create(TD_TEMPLATE);

            colNode.addClass(className);
            colNode.addClass(typeClassName);

            if(isSettleable) {
                var robberSpan = Node.create(ROBBER_TEMPLATE);
                colNode.appendChild(robberSpan);
            }

            if(roll) {
                var rollSpan = Node.create(ROLL_TEMPLATE);
                rollSpan.set("innerHTML", roll);
                colNode.appendChild(rollSpan);
            }

            if(isHarbor) {
                var harborSpan = Node.create(HARBOR_TEMPLATE);
                harborSpan.addClass(harborClassName);
                harborSpan.addClass(harborTypeClassName);
                harborSpan.set("innerHTML", harborType);
                colNode.appendChild(harborSpan);
            }

            return colNode;
        },

        _renderNodes: function() {
            var height = this.board.nodeHeight(),
                width = this.board.nodeWidth(),
                nodesClassName = this.getClassName(NODES),
                nodes = this._createTbody(nodesClassName);

            this.nodesNode = this.boardNode.appendChild(nodes);

            for(var row = 0; row < height; row++) {
                var rowClassName = this.getClassName(NODES, ROW, row),
                    tr = this._createTr(rowClassName),
                    rowNode = this.nodesNode.appendChild(tr);
                for(var col = 0; col < width; col++) {
                    var node = this.board.node([row, col]);
                    if(node) {
                        var colClassName = this.getClassName(NODES, COL, col),
                            colNode = this._createNode(node);
                        colNode.addClass(colClassName);
                        rowNode.appendChild(colNode);
                    }
                }
            }
        },

        _createNode: function(node) {
            var col = node.col(),
                colNode = Node.create(TD_TEMPLATE),
                className = this.getClassName(NODE);

            colNode.addClass(className);

            return colNode;
        },

        _renderEdges: function() {
            var height = this.board.edgeHeight(),
                width = this.board.edgeWidth(),
                edgesClassName = this.getClassName(EDGES),
                edges = this._createTbody(edgesClassName);

            this.edgesNode = this.boardNode.appendChild(edges);

            for(var row = 0; row < height; row++) {
                var rowClassName = this.getClassName(EDGES, ROW, row),
                    tr = this._createTr(rowClassName),
                    rowNode = this.edgesNode.appendChild(tr);
                for(var col = 0; col < width; col++) {
                    var edge = this.board.edge([row, col]);
                    if(edge) {
                        var colClassName = this.getClassName(EDGES, COL, col),
                            colNode = this._createEdge(edge);
                        colNode.addClass(colClassName);
                        rowNode.appendChild(colNode);
                    }
                }
            }
        },

        _createEdge: function(edge) {
            var className = this.getClassName(EDGE),
                colNode = Node.create(TD_TEMPLATE);

            colNode.addClass(className);

            return colNode;
        },

        _createTbody: function(className) {
            var tbody = Node.create(TBODY_TEMPLATE);

            tbody.addClass(className);

            return tbody;
        },

        _createTr: function(className) {
            var tr = Node.create(TR_TEMPLATE);

            tr.addClass(className);

            return tr;
        },

        syncUI: function() {
            this._uiSyncRobber(this.board.get("robberPosition"));
            this._uiSyncNodes();
            this._uiSyncEdges();
        },

        _uiSyncRobber: function(position, oldPosition) {
            var robberClass = this.getClassName(ROBBER);

            if(isValue(oldPosition)) {
                var robberNode = this._findBoardNode(HEXES, oldPosition);
                robberNode.removeClass(robberClass);
            }

            var robberNode = this._findBoardNode(HEXES, position);
            robberNode.addClass(robberClass);
        },

        _uiSyncNodes: function() {
            var that = this;
            each(this.board.settledNodes(), function(node) {
                that._uiSyncNode(node);
            });
        },

        _uiSyncNode: function(node) {
            var position = node.get("position"),
                state = node.get("state"),
                player = node.get("player"),
                nodeNode = this._findBoardNode(NODES, position),
                oldClass = this.getClassName("settlement", player),
                newClass = this.getClassName(state, player);
            nodeNode.removeClass(oldClass);
            nodeNode.addClass(newClass);
        },

        _uiSyncEdges: function() {
            var that = this;
            each(this.board.settledEdges(), function(edge) {
                that._uiSyncEdge(edge);
            });
        },

        _uiSyncEdge: function(edge) {
            var position = edge.get("position"),
                player = edge.get("player"),
                edgeNode = this._findBoardNode(EDGES, position),
                roadClass = this.getClassName(ROAD, player);
            edgeNode.addClass(roadClass);
        },

        _findBoardNode: function(type, position) {
            var row = position[0],
                col = position[1],
                contentBox = this.get(CONTENT_BOX),
                rowClass = this.getClassName(type, ROW, row),
                colClass = this.getClassName(type, COL, col),
                node = contentBox.query("." + rowClass + " ." + colClass);
            return node;
        }
    });

    Y.Board = Board;

}, '0.0.1', { requires: ["widget", "pioneers-board"] });
