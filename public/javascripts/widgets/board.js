// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

$.widget("ui.board", {

    // widget public methods

    buildFirstSettlementMode: function(player) {
        this._setMode("buildFirstSettlement");
        this._setPlayer(player);
    },

    buildSettlementMode: function(player) {
        this._setMode("buildSettlement");
        this._setPlayer(player);
    },

    buildCityMode: function(player) {
        this._setMode("buildCity");
        this._setPlayer(player);
    },

    buildRoadMode: function(player) {
        this._setMode("buildRoad");
        this._setPlayer(player);
    },

    buildFirstRoadMode: function(player) {
        this._setMode("buildFirstRoad");
        this._setPlayer(player);
    },

    buildFirstRoadMode: function(player) {
        this._setMode("buildFirstRoad");
        this._setPlayer(player);
    },

    moveRobberMode: function(player) {
        this._setMode("moveRobber");
        this._setPlayer(player);
    },

    defaultMode: function() {
        this._setMode("default");
    },

    robberMoved: function(robbery) {
        var board = this._getBoard();
        var oldPosition = board.getRobberPosition();
        board.setRobberPosition(robbery.position);
        this.element.find(".hexes .row-" + oldPosition[0] + " .col-" + oldPosition[1]).boardHex("reset");
        this.element.find(".hexes .row-" + robbery.position[0] + " .col-" + robbery.position[1]).boardHex("reset", true);
    },

    nodeChanged: function(node) {
        var board = this._getBoard();
        var boardNode = board.getNode(node.position);
        boardNode.setState(node.state);
        boardNode.setPlayer(node.player);
        boardNode.setId(node.id);
        this.element.find(".nodes .row-" + node.position[0] + " .col-" + node.position[1]).boardNode("reset", true);
    },

    edgeChanged: function(edge) {
        var board = this._getBoard();
        var boardEdge = board.getEdge(edge.position);
        boardEdge.setPlayer(edge.player);
        this.element.find(".edges .row-" + edge.position[0] + " .col-" + edge.position[1]).boardEdge("reset", true);
    },

    // constructor

    _init: function() {
        this._setData("board", new Pioneers.Board(this._getBoardAttributes()));
        this._setData("mode", "default");
        this.element.addClass("board size-" + this._getBoard().getHeight() + "-" + this._getBoard().getWidth());
        this.element.empty();
        this._createHexes();
        this._createNodes();
        this._createEdges();
    },

    _createHexes: function() {
        var that = this;
        var board = this._getBoard();
        var hexesTable = $("<table/>").addClass("hexes").appendTo(this.element);
        var hexesTableBody = $("<tbody/>").appendTo(hexesTable);
        for(var row = 0; row < board.getHeight(); row++) {
            var hexesTr = $("<tr/>").addClass("row-" + row).appendTo(hexesTableBody);
            for(var col = 0; col < board.getWidth(); col++) {
                var hex = board.getHex([row, col]);
                if(hex != undefined) $("<td/>").appendTo(hexesTr).boardHex({ hex: hex });
            }
        }

        hexesTable.mouseout(function(event) {
            $(event.target).closest(".hex").boardHex("reset");
        });

        hexesTable.mouseover(function(event) {
            var boardHex = $(event.target).closest(".hex");
            var hex = boardHex.boardHex("getHex");
            if(that._getMode() == "moveRobber" && hex != undefined) {
                if(hex.isValidForRobber()) boardHex.boardHex("robber");
            }
        });

        hexesTable.click(function(event) {
            var boardHex = $(event.target).closest(".hex");
            var hex = boardHex.boardHex("getHex");
            if(that._getMode() == "moveRobber" && hex != undefined) {
                if(hex.isValidForRobber()) that._moveRobber(event, hex);
            }
        });
    },

    _createNodes: function() {
        var that = this;
        var board = this._getBoard();
        var nodesTable = $("<table/>").addClass("nodes").appendTo(this.element);
        var nodesTableBody = $("<tbody/>").appendTo(nodesTable);
        for(var row = 0; row < board.getNodeHeight(); row++) {
            var nodesTr = $("<tr/>").addClass("row-" + row).appendTo(nodesTableBody);
            for(var col = 0; col < board.getNodeWidth(); col++) {
                var node = board.getNode([row, col]);
                if(node != undefined) $("<td/>").appendTo(nodesTr).boardNode({ node: node });
            }
        }

        nodesTable.mouseout(function(event) {
            $(event.target).closest(".node").boardNode("reset");
        });

        nodesTable.mouseover(function(event) {
            var player = that._getPlayer();
            var boardNode = $(event.target).closest(".node");
            var node = boardNode.boardNode("getNode");
            if(node != undefined) {
                switch(that._getMode()) {
                case "buildFirstSettlement":
                    if(node.isValidForFirstSettlement(player)) boardNode.boardNode("settlement", player);
                    break;
                case "buildSettlement":
                    if(node.isValidForSettlement(player)) boardNode.boardNode("settlement", player);
                    break;
                case "buildCity":
                    if(node.isValidForCity(player)) boardNode.boardNode("city", player);
                    break;
                case "robbery":
                    var hex = that._getHex();
                    if($.inArray(node, hex.getRobbableNodes(player)) != -1) boardNode.boardNode("robbable", player);
                    break;
                }
            }
        });

        nodesTable.click(function(event) {
            var player = that._getPlayer();
            var boardNode = $(event.target).closest(".node");
            var node = boardNode.boardNode("getNode");
            if(node != undefined) {
                switch(that._getMode()) {
                case "buildFirstSettlement":
                    if(node.isValidForFirstSettlement(player)) that._buildSettlement(event, node);
                    break;
                case "buildSettlement":
                    if(node.isValidForSettlement(player)) that._buildSettlement(event, node);
                    break;
                case "buildCity":
                    if(node.isValidForCity(player)) that._buildCity(event, node);
                    break;
                case "robbery":
                    var hex = that._getHex();
                    if($.inArray(node, hex.getRobbableNodes(player)) != -1) that._rob(event, hex, node.getPlayer());
                    break;
                }
            }
        });
    },

    _createEdges: function() {
        var that = this;
        var board = this._getBoard();
        var edgesTable = $("<table/>").addClass("edges").appendTo(this.element);
        var edgesTableBody = $("<tbody/>").appendTo(edgesTable);
        for(var row = 0; row < board.getEdgeHeight(); row++) {
            var edgesTr = $("<tr/>").addClass("row-" + row).appendTo(edgesTableBody);
            for(var col = 0; col < board.getEdgeWidth(); col++) {
                var edge = board.getEdge([row, col]);
                if(edge != undefined) $("<td/>").appendTo(edgesTr).boardEdge({ edge: edge });
            }
        }

        edgesTable.mouseout(function(event) {
            $(event.target).closest(".edge").boardEdge("reset");
        });

        edgesTable.mouseover(function(event) {
            var player = that._getPlayer();
            var boardEdge = $(event.target).closest(".edge");
            var edge = boardEdge.boardEdge("getEdge");
            if(edge != undefined) {
                switch(that._getMode()) {
                case "buildFirstRoad":
                    if(edge.isValidForFirstRoad(player)) boardEdge.boardEdge("road", player);
                    break;
                case "buildRoad":
                    if(edge.isValidForRoad(player)) boardEdge.boardEdge("road", player);
                    break;
                }
            }
        });

        edgesTable.click(function(event) {
            var player = that._getPlayer();
            var boardEdge = $(event.target).closest(".edge");
            var edge = boardEdge.boardEdge("getEdge");
            if(edge != undefined) {
                switch(that._getMode()) {
                case "buildFirstRoad":
                    if(edge.isValidForFirstRoad(player)) that._buildRoad(event, edge);
                    break;
                case "buildRoad":
                    if(edge.isValidForRoad(player)) that._buildRoad(event, edge);
                    break;
                }
            }
        });
    },

    // event responses

    _moveRobber: function(event, hex) {
        var player = this._getPlayer();
        this._setHex(hex);
        if(hex.getRobbableNodes(player).length == 0) {
            this._rob(event, hex);
        } else {
            this._setMode("robbery");
        }
    },

    _rob: function(event, hex, player) {
        this._setMode("default");
        this._trigger("robbed", event, [hex.getPosition(), player]);
    },

    _buildSettlement: function(event, node) {
        this._setMode("default");
        this._trigger("settlementbuilt", event, [node.getPosition()]);
    },

    _buildCity: function(event, node) {
        this._setMode("default");
        this._trigger("citybuilt", event, [node.getPosition()]);
    },

    _buildRoad: function(event, edge) {
        this._setMode("default");
        this._trigger("roadbuilt", event, [edge.getPosition()]);
    },

    // getters and setters

    _setMode: function(mode) {
        this._setData("mode", mode);
    },

    _getBoard: function() {
        return this._getData("board");
    },

    _getBoardAttributes: function() {
        return this._getData("boardAttributes");
    },

    _getMode: function() {
        return this._getData("mode");
    },

    _setPlayer: function(player) {
        this._setData("player", player);
    },

    _getPlayer: function() {
        return this._getData("player");
    },

    _setHex: function(hex) {
        this._setData("hex", hex);
    },

    _getHex: function(hex) {
        return this._getData("hex");
    }
});
