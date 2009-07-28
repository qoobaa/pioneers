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
        GOOD = "good",
        BAD = "bad",
        getCN = Y.ClassNameManager.getClassName,
        C_BOARD = getCN(BOARD, BOARD),
        C_ROBBER_SPAN = getCN(BOARD, HEX, ROBBER),
        C_ROLL_SPAN = getCN(BOARD, HEX, ROLL),
        C_HEX = getCN(BOARD, HEX),
        C_NODE = getCN(BOARD, NODE),
        C_EDGE = getCN(BOARD, EDGE),
        C_ROBBER = getCN(BOARD, ROBBER),
        C_GOOD = getCN(BOARD, GOOD),
        C_BAD = getCN(BOARD, BAD),
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
            game: {

            },
            board: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game");
                    return game.board;
                }
            },
            player: {
                readOnly: true,
                getter: function() {
                    var game = this.get("game");
                    return game.get("userPlayer");
                }
            },
            mode: {
                value: "default"
            },
            robberPosition: {

            },
            robbedPlayer: {

            }
        }
    });

    Y.extend(Board, Widget, {
        renderUI: function() {
            this._renderBoard();
            this._renderHexes();
            this._renderNodes();
            this._renderEdges();
        },

        _renderBoard: function() {
            var contentBox = this.get(CONTENT_BOX),
                board = this.get("board"),
                height = board.get("height"),
                width = board.get("width"),
                sizeClassName = this.getClassName(BOARD, SIZE, height, width);

            var boardNode = Y.Node.create(BOARD_TEMPLATE);

            boardNode.addClass(sizeClassName);

            this.boardNode = contentBox.appendChild(boardNode);
        },

        _renderHexes: function() {
            var board = this.get("board"),
                height = board.get("height"),
                width = board.get("width"),
                hexesClassName = this.getClassName(HEXES),
                hexes = this._createTbody(hexesClassName);

            this.hexesNode = this.boardNode.appendChild(hexes);

            this.hexNodes = [];
            for(var row = 0; row < height; row++) {
                var rowClassName = this.getClassName(HEXES, ROW, row),
                    tr = this._createTr(rowClassName),
                    rowNode = this.hexesNode.appendChild(tr);
                this.hexNodes[row] = [];
                for(var col = 0; col < width; col++) {
                    var hex = board.hex([row, col]);
                    if(hex) {
                        var colNode = this._createHex(hex);
                        this.hexNodes[row][col] = rowNode.appendChild(colNode);
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
                harborClassName = this.getClassName(HEX, HARBOR),
                harborTypeClassName = this.getClassName(HARBOR, harborType, harborPosition),
                colNode = Node.create(TD_TEMPLATE);

            colNode.addClass(C_HEX);

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
            var board = this.get("board"),
                height = board.get("nodeHeight"),
                width = board.get("nodeWidth"),
                nodesClassName = this.getClassName(NODES),
                nodes = this._createTbody(nodesClassName);

            this.nodesNode = this.boardNode.appendChild(nodes);
            this.nodeNodes = [];

            for(var row = 0; row < height; row++) {
                var rowClassName = this.getClassName(NODES, ROW, row),
                    tr = this._createTr(rowClassName),
                    rowNode = this.nodesNode.appendChild(tr);
                this.nodeNodes[row] = [];
                for(var col = 0; col < width; col++) {
                    var node = board.node([row, col]);
                    if(node) {
                        var colNode = this._createNode(node);
                        this.nodeNodes[row][col] = rowNode.appendChild(colNode);
                    }
                }
            }
        },

        _createNode: function(node) {
            var position = node.get("position"),
                colNode = Node.create(TD_TEMPLATE);

            colNode.addClass(C_NODE);

            colNode.setAttribute("position", position.join());

            return colNode;
        },

        _renderEdges: function() {
            var board = this.get("board"),
                height = board.get("edgeHeight"),
                width = board.get("edgeWidth"),
                edgesClassName = this.getClassName(EDGES),
                edges = this._createTbody(edgesClassName);

            this.edgesNode = this.boardNode.appendChild(edges);
            this.edgeNodes = [];

            for(var row = 0; row < height; row++) {
                var rowClassName = this.getClassName(EDGES, ROW, row),
                    tr = this._createTr(rowClassName),
                    rowNode = this.edgesNode.appendChild(tr);
                this.edgeNodes[row] = [];
                for(var col = 0; col < width; col++) {
                    var edge = board.edge([row, col]);
                    if(edge) {
                        var colNode = this._createEdge(edge);
                        this.edgeNodes[row][col] = rowNode.appendChild(colNode);
                    }
                }
            }
        },

        _createEdge: function(edge) {
            var position = edge.get("position"),
                colNode = Node.create(TD_TEMPLATE);

            colNode.addClass(C_EDGE);

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
            var board = this.get("board"),
                robberPosition = board.get("robberPosition"),
                hex = board.hex(robberPosition);

            each(board.hexesList(), function(hex) {
                this._uiSyncHex(hex);
            }, this);
        },

        _uiSyncHex: function(hex) {
            var row = hex.row(),
                col = hex.col(),
                hexNode = this.hexNodes[row][col],
                className = C_HEX,
                type = hex.get("type"),
                typeClassName = this.getClassName(HEX, type),
                colClassName = this.getClassName(HEXES, COL, col),
                classNames = [typeClassName, colClassName, className];


            hexNode.removeAttribute("class");

            if(hex.hasRobber()) {
                classNames.push(C_ROBBER);
            }

            hexNode.setAttribute("class", classNames.join(" "));
        },

        _uiSyncNodes: function() {
            var board = this.get("board");

            each(board.nodesList(), function(node) {
                this._uiSyncNode(node);
            }, this);
        },

        _uiSyncNode: function(node) {
            var state = node.get("state"),
                player = node.get("player"),
                isSettled = node.isSettled(),
                row = node.row(),
                col = node.col(),
                nodeNode = this.nodeNodes[row][col],
                className = C_NODE,
                colClassName = this.getClassName(NODES, COL, col),
                classNames = [className, colClassName];

            nodeNode.removeAttribute("class");

            if(isSettled) {
                var settledClassName = this.getClassName(state, player);
                classNames.push(settledClassName);
            }

            nodeNode.setAttribute("class", classNames.join(" "));
        },

        _uiSyncEdges: function() {
            var board = this.get("board");
            each(board.edgesList(), function(edge) {
                this._uiSyncEdge(edge);
            }, this);
        },

        _uiSyncEdge: function(edge) {
            var player = edge.get("player"),
                isSettled = edge.isSettled(),
                row = edge.row(),
                col = edge.col(),
                edgeNode = this.edgeNodes[row][col],
                className = C_EDGE,
                colClassName = this.getClassName(EDGES, COL, col),
                classNames = [className, colClassName];

            edgeNode.removeAttribute("class");

            if(isSettled) {
                var settledClassName = this.getClassName(ROAD, player);
                classNames.push(settledClassName);
            }

            edgeNode.setAttribute("class", classNames.join(" "));
        },

        bindUI: function() {
            var contentBox = this.get(CONTENT_BOX),
                hexNodes = contentBox.queryAll("." + C_HEX),
                nodeNodes = contentBox.queryAll("." + C_NODE),
                edgeNodes = contentBox.queryAll("." + C_EDGE);

            hexNodes.on("mouseover", bind(this._hexesMouseOver, this));
            hexNodes.on("mouseout", bind(this._hexesMouseOut, this));
            hexNodes.on("click", bind(this._hexesClick, this));
            nodeNodes.on("mouseover", bind(this._nodesMouseOver, this));
            nodeNodes.on("mouseout", bind(this._nodesMouseOut, this));
            nodeNodes.on("click", bind(this._nodesClick, this));
            edgeNodes.on("mouseover", bind(this._edgesMouseOver, this));
            edgeNodes.on("mouseout", bind(this._edgesMouseOut, this));
            edgeNodes.on("click", bind(this._edgesClick, this));

            this.on("modeChange", bind(this._modeChange, this));
            this.after("modeChange", bind(this._afterModeChange, this));
        },

        _modeChange: function(event) {
            var board = this.get("board"),
                player = this.get("player"),
                robberPosition = this.get("robberPosition");

            if(!isValue(player)) {
                event.preventDefault();
                return;
            }

            switch(event.newVal) {
            // case "firstSettlement":
            //     if(!board.canBuildFirstSettlement(player)) {
            //         event.preventDefault();
            //     }
            //     break;
            // case "settlement":
            //     if(!board.canBuildSettlement(player)) {
            //         event.preventDefault();
            //     }
            //     break;
            // case "firstRoad":
            //     if(!board.canBuildFirstRoad(player)) {
            //         event.preventDefault();
            //     }
            //     break;
            // case "road":
            //     if(!board.canBuildRoad(player)) {
            //         event.preventDefault();
            //     }
            //     break;
            // case "city":
            //     if(!board.canBuildCity(player)) {
            //         event.preventDefault();
            //     }
            //     break;
            case "robbery":
                if(!board.canRobOtherPlayer(player, robberPosition)) {
                    event.newVal = "default";
                }
                break;
            }
        },

        _afterModeChange: function(event) {
            var robberPosition = this.get("robberPosition"),
                robbedPlayer = this.get("robbedPlayer"),
                nodePosition = this.get("nodePosition"),
                edgePosition = this.get("edgePosition");

            if(event.newVal === "default") {
                switch(event.prevVal) {
                case "firstSettlement":
                case "settlement":
                    this.fire(SETTLEMENT, nodePosition);
                    break;
                case "city":
                    this.fire(CITY, nodePosition);
                    break;
                case "firstRoad":
                case "road":
                    this.fire(ROAD, edgePosition);
                    break;
                case "robber":
                case "robbery":
                    this.fire(ROBBER, robberPosition, robbedPlayer);
                    break;
                }

                this.set("robberPosition");
                this.set("robbedPlayer");
                this.set("nodePosition");
                this.set("edgePosition");
            }
        },

        _hexesMouseOver: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                hexNode = event.currentTarget,
                position = this._getPosition(hexNode),
                hex = board.hex(position);

            if(mode === "robber") {
                hexNode.addClass(C_ROBBER);
                if(hex.isRobbable()) {
                    hexNode.addClass(C_GOOD);
                } else {
                    hexNode.addClass(C_BAD);
                }
            }
        },

        _hexesMouseOut: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                hexNode = event.currentTarget,
                position = this._getPosition(hexNode),
                hex = board.hex(position);

            if(mode === "robber") {
                this._uiSyncHex(hex);
            }
        },

        _hexesClick: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                hexNode = event.currentTarget,
                position = this._getPosition(hexNode),
                player = this.get("player"),
                hex = board.hex(position);

            if(mode === "robber") {
                if(hex.isRobbable()) {
                    this.set("robberPosition", position);
                    this.set("mode", "robbery");
                }
            }
        },

        _nodesMouseOver: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                nodeNode = event.currentTarget,
                position = this._getPosition(nodeNode),
                robberPosition = this.get("robberPosition"),
                node = board.node(position),
                player = this.get("player"),
                className;

            switch(mode) {
            case "firstSettlement":
                className = this.getClassName(SETTLEMENT, player);
                nodeNode.addClass(className);

                if(node.isValidForFirstSettlement(player)) {
                    nodeNode.addClass(C_GOOD);
                } else {
                    nodeNode.addClass(C_BAD);
                }
                break;
            case "settlement":
                className = this.getClassName(SETTLEMENT, player);
                nodeNode.addClass(className);

                if(node.isValidForSettlement(player)) {
                    nodeNode.addClass(C_GOOD);
                } else {
                    nodeNode.addClass(C_BAD);
                }
                break;
            case "city":
                className = this.getClassName(CITY, player);
                nodeNode.addClass(className);

                if(node.isValidForCity(player)) {
                    nodeNode.addClass(C_GOOD);
                } else {
                    nodeNode.addClass(C_BAD);
                }
                break;
            case "robbery":
                var hex = board.hex(robberPosition),
                    isNodeRobbable = !!find(hex.robbableNodes(player), function(hexNode) {
                        return hexNode && hexNode.col() === node.col() && hexNode.row() === node.row();
                    });

                if(isNodeRobbable) {
                    nodeNode.addClass(C_GOOD);
                } else {
                    nodeNode.addClass(C_BAD);
                }
                break;
            }
        },

        _nodesMouseOut: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                nodeNode = event.currentTarget,
                position = this._getPosition(nodeNode),
                node = board.node(position);

            if(mode === "firstSettlement" || mode === "settlement" || mode === "city" || mode === "rob") {
                this._uiSyncNode(node);
            }
        },

        _nodesClick: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                nodeNode = event.currentTarget,
                position = this._getPosition(nodeNode),
                robberPosition = this.get("robberPosition"),
                node = board.node(position),
                player = this.get("player");

            switch(mode) {
            case "firstSettlement":
                if(node.isValidForFirstSettlement(player)) {
                    this.set("nodePosition", position);
                    this.set("mode", "default");
                }
                break;
            case "settlement":
                if(node.isValidForSettlement(player)) {
                    this.set("nodePosition", position);
                    this.set("mode", "default");
                }
                break;
            case "city":
                if(node.isValidForCity(player)) {
                    this.set("nodePosition", position);
                    this.set("mode", "default");
                }
                break;
            case "robbery":
                var hex = board.hex(robberPosition),
                    isNodeRobbable = !!find(hex.robbableNodes(player), function(hexNode) {
                        return hexNode && hexNode.col() === node.col() && hexNode.row() === node.row();
                    });

                if(isNodeRobbable) {
                    this.set("robbedPlayer", node.get("player"));
                    this.set("mode", "default");
                }
                break;
            }
        },

        _edgesMouseOver: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                edgeNode = event.currentTarget,
                position = this._getPosition(edgeNode),
                edge = board.edge(position),
                player = this.get("player"),
                className = this.getClassName(ROAD, player);

            switch(mode) {
            case "firstRoad":
                edgeNode.addClass(className);
                if(edge.isValidForFirstRoad(player)) {
                    edgeNode.addClass(C_GOOD);
                } else {
                    edgeNode.addClass(C_BAD);
                }
                break;
            case "road":
                edgeNode.addClass(className);
                if(edge.isValidForRoad(player)) {
                    edgeNode.addClass(C_GOOD);
                } else {
                    edgeNode.addClass(C_BAD);
                }
                break;
            }
        },

        _edgesMouseOut: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                edgeNode = event.currentTarget,
                position = this._getPosition(edgeNode),
                edge = board.edge(position);

            if(mode === "firstRoad" || mode === "road") {
                this._uiSyncEdge(edge);
            }
        },

        _edgesClick: function(event) {
            var board = this.get("board"),
                mode = this.get("mode"),
                edgeNode = event.currentTarget,
                position = this._getPosition(edgeNode),
                edge = board.edge(position),
                player = this.get("player"),
                className = this.getClassName(ROAD, player);

            switch(mode) {
            case "firstRoad":
                if(edge.isValidForFirstRoad(player)) {
                    this.set("edgePosition", position);
                    this.set("mode", "default");
                }
                break;
            case "road":
                if(edge.isValidForRoad(player)) {
                    this.set("edgePosition", position);
                    this.set("mode", "default");
                }
                break;
            }
        },

        _getPosition: function(node) {
            var position = node.getAttribute("position");
            if(isValue(position)) {
                position = position.split(",");
                return [parseInt(position[0]), parseInt(position[1])];
            }
            return null;
        }
    });

    Y.Board = Board;

}, '0.0.1', { requires: ["widget", "pioneers-board"] });
