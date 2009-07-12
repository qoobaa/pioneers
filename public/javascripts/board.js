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
        SETTLEMENT = "settlement",
        CITY = "city",
        ROAD = "road",
        OK = "ok",
        NO = "no",
        getCN = Y.ClassNameManager.getClassName,
        C_BOARD = getCN(BOARD, BOARD),
        C_ROBBER_SPAN = getCN(BOARD, HEX, ROBBER),
        C_ROLL_SPAN = getCN(BOARD, HEX, ROLL),
        C_HEX = getCN(BOARD, HEX),
        C_NODE = getCN(BOARD, NODE),
        C_EDGE = getCN(BOARD, EDGE),
        C_ROBBER = getCN(BOARD, ROBBER),
        C_OK = getCN(BOARD, OK),
        C_NO = getCN(BOARD, NO),
        BOARD_TEMPLATE = '<table class="' + C_BOARD + '"></table>',
        TBODY_TEMPLATE = '<tbody></tbody>',
        TR_TEMPLATE = '<tr></tr>',
        TD_TEMPLATE = '<td></td>',
        ROBBER_TEMPLATE = '<span class="' + C_ROBBER_SPAN + '">robber</span>',
        ROLL_TEMPLATE = '<span class="' + C_ROLL_SPAN + '"></span>',
        HARBOR_TEMPLATE = '<span></span>',
        CONTENT_BOX = "contentBox",
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        isValue = Y.Lang.isValue,
        isArray = Y.Lang.isArray,
        each = Y.each,
        bind = Y.bind,
        find = Y.Array.find,
        pioneers = Y.namespace("pioneers");

    function Board() {
        Board.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Board, {
        NAME: BOARD,
        ATTRS: {
            board: {
            },
            player: {
            },
            // "firstSettlement", "settlement", "first road", "road", "city", "robber", "rob"
            mode: {
                value: "default"
            },
            robberPosition: {
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
                position = hex.get("position"),
                className = C_HEX,
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

            colNode.setAttribute("position", position.join());

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
            var position = node.get("position"),
                colNode = Node.create(TD_TEMPLATE),
                className = C_NODE;

            colNode.addClass(className);
            colNode.setAttribute("position", position.join());

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
            var position = edge.get("position"),
                className = C_EDGE,
                colNode = Node.create(TD_TEMPLATE);

            colNode.addClass(className);
            colNode.setAttribute("position", position.join());

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
            this._uiSyncHexes();
            this._uiSyncNodes();
            this._uiSyncEdges();
        },

        _uiSyncHexes: function() {
            each(this.board.hexes, function(hex) {
                this._uiSyncHex(hex);
            }, this);
        },

        _uiSyncHex: function(hex) {
            var hexNode = this._findBoardNode(HEXES, hex);

            this._removeClasses(hexNode);

            if(hex.hasRobber()) {
                hexNode.addClass(C_ROBBER);
            }
        },

        _uiSyncNodes: function() {
            each(this.board.settledNodes(), function(node) {
                this._uiSyncNode(node);
            }, this);
        },

        _uiSyncNode: function(node) {
            var state = node.get("state"),
                player = node.get("player"),
                isSettled = node.isSettled(),
                nodeNode = this._findBoardNode(NODES, node),
                className = this.getClassName(state, player);

            this._removeClasses(nodeNode);

            if(isSettled) {
                nodeNode.addClass(className);
            }
        },

        _uiSyncEdges: function() {
            each(this.board.settledEdges(), function(edge) {
                this._uiSyncEdge(edge);
            }, this);
        },

        _uiSyncEdge: function(edge) {
            var player = edge.get("player"),
                isSettled = edge.isSettled(),
                edgeNode = this._findBoardNode(EDGES, edge),
                className = this.getClassName(ROAD, player);

            this._removeClasses(edgeNode);

            if(isSettled) {
                edgeNode.addClass(className);
            }
        },

        _removeClasses: function(node){
            node.removeClass(C_ROBBER);
            node.removeClass(C_NO);
            node.removeClass(C_OK);
            for(var i = 0; i < 5; i++) {
                var settlementClassName = this.getClassName(SETTLEMENT, i),
                    cityClassName = this.getClassName(CITY, i),
                    roadClassName = this.getClassName(ROAD, i);
                node.removeClass(settlementClassName);
                node.removeClass(cityClassName);
                node.removeClass(roadClassName);
            }
        },

        _findBoardNode: function(type, position) {
            if(isArray(position)) {
                var row = position[0],
                    col = position[1];
            } else {
                var row = position.row(),
                    col = position.col();
            }
            var contentBox = this.get(CONTENT_BOX),
                rowClass = this.getClassName(type, ROW, row),
                colClass = this.getClassName(type, COL, col),
                node = contentBox.query("." + rowClass + " ." + colClass);

            return node;
        },

        bindUI: function() {
            var hexNodes = Y.all("." + C_HEX),
                nodeNodes = Y.all("." + C_NODE),
                edgeNodes = Y.all("." + C_EDGE);

            hexNodes.on("mouseover", bind(this._hexesMouseOver, this));
            hexNodes.on("mouseout", bind(this._hexesMouseOut, this));
            hexNodes.on("click", bind(this._hexesClick, this));
            nodeNodes.on("mouseover", bind(this._nodesMouseOver, this));
            nodeNodes.on("mouseout", bind(this._nodesMouseOut, this));
            nodeNodes.on("click", bind(this._nodesClick, this));
            edgeNodes.on("mouseover", bind(this._edgesMouseOver, this));
            edgeNodes.on("mouseout", bind(this._edgesMouseOut, this));
            edgeNodes.on("click", bind(this._edgesClick, this));
        },

        _hexesMouseOver: function(event) {
            var mode = this.get("mode"),
                hexNode = event.currentTarget,
                position = hexNode.getAttribute("position").split(","),
                hex = this.board.hex(position);

            if(mode === "robber") {
                hexNode.addClass(C_ROBBER);
                if(hex.isRobbable()) {
                    hexNode.addClass(C_OK);
                } else {
                    hexNode.addClass(C_NO);
                }
            }
        },

        _hexesMouseOut: function(event) {
            var mode = this.get("mode"),
                hexNode = event.currentTarget,
                position = hexNode.getAttribute("position").split(","),
                hex = this.board.hex(position);

            if(mode === "robber") {
                this._uiSyncHex(hex);
            }
        },

        _hexesClick: function(event) {
            var mode = this.get("mode"),
                hexNode = event.currentTarget,
                position = hexNode.getAttribute("position").split(","),
                player = this.get("player"),
                hex = this.board.hex(position);

            if(mode === "robber") {
                if(hex.isRobbable()) {
                    this.set("robberPosition", position);
                    if(hex.robbableNodes(player).length) {
                        this.set("mode", "robbery");
                    } else {
                        this.set("mode", "default");
                    }
                }
            }
        },

        _nodesMouseOver: function(event) {
            var mode = this.get("mode"),
                nodeNode = event.currentTarget,
                position = nodeNode.getAttribute("position").split(","),
                robberPosition = this.get("robberPosition"),
                node = this.board.node(position),
                player = this.get("player"),
                className;

            switch(mode) {
            case "firstSettlement":
                className = this.getClassName(SETTLEMENT, player);
                nodeNode.addClass(className);

                if(node.isValidForFirstSettlement(player)) {
                    nodeNode.addClass(C_OK);
                } else {
                    nodeNode.addClass(C_NO);
                }
                break;
            case "settlement":
                className = this.getClassName(SETTLEMENT, player);
                nodeNode.addClass(className);

                if(node.isValidForSettlement(player)) {
                    nodeNode.addClass(C_OK);
                } else {
                    nodeNode.addClass(C_NO);
                }
                break;
            case "city":
                className = this.getClassName(SETTLEMENT, player);
                nodeNode.addClass(className);

                if(node.isValidForCity(player)) {
                    nodeNode.addClass(C_OK);
                } else {
                    nodeNode.addClass(C_NO);
                }
                break;
            case "robbery":
                var hex = this.board.hex(robberPosition),
                    isNodeRobbable = !!find(hex.robbableNodes(player), function(hexNode) {
                        return hexNode && hexNode.col() === node.col() && hexNode.row() === node.row();
                    });

                if(isNodeRobbable) {
                    nodeNode.addClass(C_OK);
                } else {
                    nodeNode.addClass(C_NO);
                }
                break;
            }
        },

        _nodesMouseOut: function(event) {
            var mode = this.get("mode"),
                nodeNode = event.currentTarget,
                position = nodeNode.getAttribute("position").split(","),
                node = this.board.node(position);

            if(mode === "firstSettlement" || mode === "settlement" || mode === "city" || mode === "rob") {
                this._uiSyncNode(node);
            }
        },

        _nodesClick: function(event) {
            var mode = this.get("mode"),
                nodeNode = event.currentTarget,
                position = nodeNode.getAttribute("position").split(","),
                robberPosition = this.get("robberPosition"),
                node = this.board.node(position),
                player = this.get("player");

            switch(mode) {
            case "firstSettlement":
                if(node.isValidForFirstSettlement(player)) {
                    this.set("mode", "default");
                    // TODO: fire settlement built
                }
                break;
            case "settlement":
                if(node.isValidForSettlement(player)) {
                    this.set("mode", "default");
                    // TODO: fire settlement built
                }
                break;
            case "city":
                if(node.isValidForCity(player)) {
                    this.set("mode", "default");
                    // TODO: fire city built
                }
                break;
            case "robbery":
                var hex = this.board.hex(robberPosition),
                    isNodeRobbable = !!find(hex.robbableNodes(player), function(hexNode) {
                        return hexNode && hexNode.col() === node.col() && hexNode.row() === node.row();
                    });

                if(isNodeRobbable) {
                    this.set("mode", "default");
                    // TODO: fire robbed
                }
                break;
            }
        },

        _edgesMouseOver: function(event) {
            var mode = this.get("mode"),
                edgeNode = event.currentTarget,
                position = edgeNode.getAttribute("position").split(","),
                edge = this.board.edge(position),
                player = this.get("player"),
                className = this.getClassName(ROAD, player);

            switch(mode) {
            case "firstRoad":
                edgeNode.addClass(className);
                if(edge.isValidForFirstRoad(player)) {
                    edgeNode.addClass(C_OK);
                } else {
                    edgeNode.addClass(C_NO);
                }
                break;
            case "road":
                edgeNode.addClass(className);
                if(edge.isValidForRoad(player)) {
                    edgeNode.addClass(C_OK);
                } else {
                    edgeNode.addClass(C_NO);
                }
                break;
            }
        },

        _edgesMouseOut: function(event) {
            var mode = this.get("mode"),
                edgeNode = event.currentTarget,
                position = edgeNode.getAttribute("position").split(","),
                edge = this.board.edge(position);

            if(mode === "firstRoad" || mode === "road") {
                this._uiSyncEdge(edge);
            }
        },

        _edgesClick: function(event) {
            var mode = this.get("mode"),
                edgeNode = event.currentTarget,
                position = edgeNode.getAttribute("position").split(","),
                edge = this.board.edge(position),
                player = this.get("player"),
                className = this.getClassName(ROAD, player);

            switch(mode) {
            case "firstRoad":
                if(edge.isValidForFirstRoad(player)) {
                    this.set("mode", "default");
                    // TODO: fire road built
                }
                break;
            case "road":
                if(edge.isValidForRoad(player)) {
                    this.set("mode", "default");
                    // TODO: fire road built
                }
                break;
            }
        }
    });

    Y.Board = Board;

}, '0.0.1', { requires: ["widget", "pioneers-board"] });
