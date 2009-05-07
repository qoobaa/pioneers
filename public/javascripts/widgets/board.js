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

  buildFirstSettlementMode: function(playerNumber) {
    this._setMode("buildFirstSettlement");
    this._setPlayerNumber(playerNumber);
  },

  buildSettlementMode: function(playerNumber) {
    this._setMode("buildSettlement");
    this._setPlayerNumber(playerNumber);
  },

  buildCityMode: function(playerNumber) {
    this._setMode("buildCity");
    this._setPlayerNumber(playerNumber);
  },

  buildRoadMode: function(playerNumber) {
    this._setMode("buildRoad");
    this._setPlayerNumber(playerNumber);
  },

  buildFirstRoadMode: function(playerNumber) {
    this._setMode("buildFirstRoad");
    this._setPlayerNumber(playerNumber);
  },

  buildFirstRoadMode: function(playerNumber) {
    this._setMode("buildFirstRoad");
    this._setPlayerNumber(playerNumber);
  },

  moveRobberMode: function(playerNumber) {
    this._setMode("moveRobber");
    this._setPlayerNumber(playerNumber);
  },

  defaultMode: function() {
    this._setMode("default");
  },

  robberMoved: function(hex) {
    var board = this._getBoard();
    var oldPosition = board.getRobberPosition();
    board.setRobberPosition(hex.position);
    this.element.find(".hexes .row-" + oldPosition[0] + " .col-" + oldPosition[1]).boardHex("reset");
    this.element.find(".hexes .row-" + hex.position[0] + " .col-" + hex.position[1]).boardHex("reset", true);
  },

  settlementBuilt: function(node) {
    var board = this._getBoard();
    var boardNode = board.getNode(node.position);
    boardNode.setState("settlement");
    boardNode.setPlayerNumber(node.playerNumber);
    boardNode.setId(node.id);
    this.element.find(".nodes .row-" + node.position[0] + " .col-" + node.position[1]).boardNode("reset", true);
  },

  cityBuilt: function(node) {
    var board = this._getBoard();
    var boardNode = board.getNode(node.position);
    boardNode.setState("city");
    this.element.find(".nodes .row-" + node.position[0] + " .col-" + node.position[1]).boardNode("reset", true);
  },

  roadBuilt: function(edge) {
    var board = this._getBoard();
    var boardEdge = board.getEdge(edge.position);
    boardEdge.setPlayerNumber(edge.playerNumber);
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
    var boardWidget = this;
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
      if(boardWidget._getMode() == "moveRobber" && hex != undefined) {
        if(hex.isValidForRobber()) boardHex.boardHex("robber");
      }
    });

    hexesTable.click(function(event) {
      var boardHex = $(event.target).closest(".hex");
      var hex = boardHex.boardHex("getHex");
      if(boardWidget._getMode() == "moveRobber" && hex != undefined) {
        if(hex.isValidForRobber()) boardWidget._moveRobber(event, hex);
      }
    });
  },

  _createNodes: function() {
    var boardWidget = this;
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
      var playerNumber = boardWidget._getPlayerNumber();
      var boardNode = $(event.target).closest(".node");
      var node = boardNode.boardNode("getNode");
      if(node != undefined) {
        switch(boardWidget._getMode()) {
        case "buildFirstSettlement":
          if(node.isValidForFirstSettlement(playerNumber)) boardNode.boardNode("settlement", playerNumber);
          break;
        case "buildSettlement":
          if(node.isValidForSettlement(playerNumber)) boardNode.boardNode("settlement", playerNumber);
          break;
        case "buildCity":
          if(node.isValidForCity(playerNumber)) boardNode.boardNode("city", playerNumber);
          break;
        case "robbery":
          var hex = boardWidget._getHex();
          if($.inArray(node, hex.getRobbableNodes(playerNumber)) != -1) boardNode.boardNode("robbable", playerNumber);
          break;
        }
      }
    });

    nodesTable.click(function(event) {
      var playerNumber = boardWidget._getPlayerNumber();
      var boardNode = $(event.target).closest(".node");
      var node = boardNode.boardNode("getNode");
      if(node != undefined) {
        switch(boardWidget._getMode()) {
        case "buildFirstSettlement":
          if(node.isValidForFirstSettlement(playerNumber)) boardWidget._buildSettlement(event, node);
          break;
        case "buildSettlement":
          if(node.isValidForSettlement(playerNumber)) boardWidget._buildSettlement(event, node);
          break;
        case "buildCity":
          if(node.isValidForCity(playerNumber)) boardWidget._buildCity(event, node);
          break;
        case "robbery":
          var hex = boardWidget._getHex();
          if($.inArray(node, hex.getRobbableNodes(playerNumber)) != -1) boardWidget._rob(event, hex, node.getPlayerNumber());
          break;
        }
      }
    });
  },

  _createEdges: function() {
    var boardWidget = this;
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
      var playerNumber = boardWidget._getPlayerNumber();
      var boardEdge = $(event.target).closest(".edge");
      var edge = boardEdge.boardEdge("getEdge");
      if(edge != undefined) {
        switch(boardWidget._getMode()) {
        case "buildFirstRoad":
          if(edge.isValidForFirstRoad(playerNumber)) boardEdge.boardEdge("road", playerNumber);
          break;
        case "buildRoad":
          if(edge.isValidForRoad(playerNumber)) boardEdge.boardEdge("road", playerNumber);
          break;
        }
      }
    });

    edgesTable.click(function(event) {
      var playerNumber = boardWidget._getPlayerNumber();
      var boardEdge = $(event.target).closest(".edge");
      var edge = boardEdge.boardEdge("getEdge");
      if(edge != undefined) {
        switch(boardWidget._getMode()) {
        case "buildFirstRoad":
          if(edge.isValidForFirstRoad(playerNumber)) boardWidget._buildRoad(event, edge);
          break;
        case "buildRoad":
          if(edge.isValidForRoad(playerNumber)) boardWidget._buildRoad(event, edge);
          break;
        }
      }
    });
  },

  // event responses

  _moveRobber: function(event, hex) {
    var playerNumber = this._getPlayerNumber();
    this._setHex(hex);
    if(hex.getRobbableNodes(playerNumber).length == 0) {
      this._rob(event, hex);
    } else {
      this._setMode("robbery");
    }
  },

  _rob: function(event, hex, playerNumber) {
    this._setMode("default");
    this._trigger("Robbed", event, [hex.getPosition(), playerNumber]);
  },

  _buildSettlement: function(event, node) {
    this._setMode("default");
    this._trigger("SettlementBuilt", event, [node.getPosition()]);
  },

  _buildCity: function(event, node) {
    this._setMode("default");
    this._trigger("CityBuilt", event, [node.getId()]);
  },

  _buildRoad: function(event, edge) {
    this._setMode("default");
    this._trigger("RoadBuilt", event, [edge.getPosition()]);
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

  _setPlayerNumber: function(playerNumber) {
    this._setData("playerNumber", playerNumber);
  },

  _getPlayerNumber: function() {
    return this._getData("playerNumber");
  },

  _setHex: function(hex) {
    this._setData("hex", hex);
  },

  _getHex: function(hex) {
    return this._getData("hex");
  }
});
