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
  _init: function() {
    this._setData("board", new Pioneers.Board(this._getBoardAttributes()));
    this.element.addClass("board size-" + this._getBoard().getHeight() + "-" + this._getBoard().getWidth());
    this.element.empty();
    this._createHexes();
    //this._createNodes();
    //this._createEdges();
  },

  _createHexes: function() {
    var board = this;
    var height = this._getBoard().getHeight();
    var width = this._getBoard().getWidth();

    var hexesTable = $("<table/>").addClass("hexes").appendTo(this.element);
    var hexesTableBody = $("<tbody/>").appendTo(hexesTable);
    for(var row = 0; row < height; row++) {
      var hexesTr = $("<tr/>").addClass("row-" + row).appendTo(hexesTableBody);
      for(var col = 0; col < width; col++) {
        var hex = this._getBoard().getHex([row, col]);
        if(hex != undefined) {
          var hexTd = $("<td/>").appendTo(hexesTr).addClass("row-" + row).addClass("col-" + col).addClass(hex.getType()).addClass("hex");
          $("<span/>").addClass("robber").text("robber").appendTo(hexTd);
          if(hex.getRoll() != undefined) $("<span/>").addClass("roll roll-" + hex.getRoll()).text(hex.getRoll()).appendTo(hexTd);
          if(hex.isHarbor()) $("<span/>").addClass(hex.getHarborType() + "-" + hex.getHarborPosition()).text(hex.getHarborType()).appendTo(hexTd);
          if(hex.hasRobber()) hexTd.addClass("robber");
        }
      }
    }
  },

  _createHex: function(hex) {
    var board = this;
    var hexLi = this.element.find(".hexes .row-" + hex.getRow() + " .col-" + hex.getCol()).addClass(hex.getType()).addClass("hex");
    $("<span/>").addClass("robber").text("robber").appendTo(hexLi);
    if(hex.getRoll() != undefined) $("<span/>").addClass("roll roll-" + hex.getRoll()).text(hex.getRoll()).appendTo(hexLi);
    if(hex.isHarbor()) $("<span/>").addClass(hex.getHarborType() + "-" + hex.getHarborPosition()).text(hex.getHarborType()).appendTo(hexLi);
    if(hex.getRow() == this._getBoard().getRobberPosition()[0] && hex.getCol() == this._getBoard().getRobberPosition()[1]) hexLi.addClass("robber");
  },

           _createNodes: function() {
             var board = this;
             var nodesDiv = $("<div/>").addClass("nodes").appendTo(this.element);
             var nodesUl = $("<ul/>").appendTo(nodesDiv);
             for(var row = 0; row < this._getBoard().getHeight() + 1; row++) {
               var rowLi = $("<li/>").addClass("row-" + row).appendTo(nodesUl);
               var rowUl = $("<ul/>").appendTo(rowLi);
               for(var col = 0; col < this._getBoard().getWidth() * 2 + 2; col++) {
                 $("<li/>").addClass("col-" + col).appendTo(rowUl);
               }
             }
             $.each(this._getBoard().getNodes(),
                    function() {
                      board._createNode(this);
                    }
                   );
           },

           _createNode: function(node) {
             var board = this;
             var nodeLi = this.element.find(".nodes .row-" + node.getRow() + " .col-" + node.getCol()).addClass("node");
             nodeLi.removeClass("settlement city player-1 player-2 player-3 player-4");
             if(node.isSettled()) nodeLi.addClass(node.getState()).addClass("player-" + node.getPlayerNumber());
             return nodeLi;
           },

           _createEdges: function() {
             var board = this;
             var edgesDiv = $("<div/>").addClass("edges").appendTo(this.element);
             var edgesUl = $("<ul/>").appendTo(edgesDiv);
             for(var row = 0; row < this._getBoard().getHeight() + 1; row++) {
               var rowLi = $("<li/>").addClass("row-" + row).appendTo(edgesUl);
               var rowUl = $("<ul/>").appendTo(rowLi);
               for(var col = 0; col < this._getBoard().getWidth() * 3 + 4; col++) {
                 $("<li/>").addClass("col-" + col).appendTo(rowUl);
               }
             }
             $.each(this._getBoard().getEdges(),
                    function() {
                      board._createEdge(this);
                    }
                   );
           },

           _createEdge: function(edge) {
             var board = this;
             var edgeLi = this.element.find(".edges .row-" + edge.getRow() + " .col-" + edge.getCol()).addClass("edge");
             if(edge.isSettled()) edgeLi.addClass("road player-" + edge.getPlayerNumber());
             return edgeLi;
           },

           _getBoard: function() {
             return this._getData("board");
           },

           _getBoardAttributes: function() {
             return this._getData("boardAttributes");
           },

           buildFirstSettlementMode: function(playerNumber) {
             this._setMode("buildFirstSettlement");
             this._setPlayerNumber(playerNumber);
             this._buildSettlementModeOn();
           },

           buildSettlementMode: function(playerNumber) {
             this._setMode("buildSettlement");
             this._setPlayerNumber(playerNumber);
             this._buildSettlementModeOn();
           },

           _buildSettlementModeOn: function() {
             var playerNumber = this._getPlayerNumber();
             var board = this;
             board.element.find(".nodes li li").addClass("unsettleable-" + playerNumber);
             var nodes = null;

             switch(this._getMode()) {
             case "buildFirstSettlement":
               nodes = this._getBoard().getNodesValidForFirstSettlement(playerNumber);
               break;
             case "buildSettlement":
               nodes = this._getBoard().getNodesValidForSettlement(playerNumber);
               break;
             }

             $.each(nodes,
                    function() {
                      var node = this;
                      board.element.find(".nodes .row-" + this.getRow() + " .col-" + this.getCol())
                        .addClass("settleable-" + playerNumber)
                        .removeClass("unsettleable-" + playerNumber)
                        .click(
                          function() {
                            board._settlementBuilt(node);
                          }
                        );
                    }
                   );
           },

           _settlementBuilt: function(node) {
             var playerNumber = this._getPlayerNumber();
             alert("settlement built on node [" + node.getRow() + ", " + node.getCol() + "] by player number " + playerNumber);
             this._setMode("default");
           },

           _buildSettlementModeOff: function() {
             var playerNumber = this._getPlayerNumber();
             this.element.find(".nodes li li").removeClass("unsettleable-" + playerNumber).removeClass("settleable-" + playerNumber).unbind();
           },

           buildCityMode: function(playerNumber) {
             this._setMode("buildCity");
             this._setPlayerNumber(playerNumber);
             this._buildCityModeOn();
           },

           _buildCityModeOn: function() {
             var playerNumber = this._getPlayerNumber();
             var board = this;
             board.element.find(".nodes li li").addClass("unexpandable-" + playerNumber);
             var nodes = null;

             $.each(this._getBoard().getSettlements(playerNumber),
                    function() {
                      var node = this;
                      board.element.find(".nodes .row-" + this.getRow() + " .col-" + this.getCol())
                        .addClass("expandable-" + playerNumber)
                        .removeClass("unexpandable-" + playerNumber)
                        .click(
                          function() {
                            board._cityBuilt(node);
                          }
                        );
                    }
                   );
           },

           _buildCityModeOff: function() {
             var playerNumber = this._getPlayerNumber();
             this.element.find(".nodes li li").removeClass("expandable-" + playerNumber).removeClass("unexpandable-" + playerNumber).unbind();
           },

           _cityBuilt: function(node) {
             var playerNumber = this._getPlayerNumber();
             alert("city built on node#" + node.getId() + " by player number " + playerNumber);
             this._setMode("default");
           },

           buildRoadMode: function(playerNumber) {
             this._setMode("buildRoad");
             this._setPlayerNumber(playerNumber);
             this._buildRoadModeOn();
           },

           buildFirstRoadMode: function(playerNumber) {
             this._setMode("buildFirstRoad");
             this._setPlayerNumber(playerNumber);
             this._buildRoadModeOn();
           },

           _buildRoadModeOn: function() {
             var board = this;
             var playerNumber = this._getPlayerNumber();
             board.element.find(".edges li li").addClass("unsettleable-" + playerNumber);
             var edges = null;

             switch(this._getMode()) {
             case "buildFirstRoad":
               edges = this._getBoard().getEdgesValidForFirstRoad(playerNumber);
               break;
             case "buildRoad":
               edges = this._getBoard().getEdgesValidForRoad(playerNumber);
               break;
             }

             $.each(edges,
                    function() {
                      var edge = this;
                      board.element.find(".edges .row-" + this.getRow() + " .col-" + this.getCol())
                        .addClass("settleable-" + playerNumber)
                        .removeClass("unsettleable-" + playerNumber)
                        .click(
                          function() {
                            board._roadBuilt(edge);
                          }
                        );
                    }
                   );
           },

           _roadBuilt: function(edge) {
             var playerNumber = this._getPlayerNumber();
             alert("road built on edge [" + edge.getRow() + ", " + edge.getCol() + "], by player number " + playerNumber);
             this._setMode("default");
           },

           _buildRoadModeOff: function() {
             var playerNumber = this._getPlayerNumber();
             this.element.find(".edges li li").removeClass("unsettleable-" + playerNumber).removeClass("settleable-" + playerNumber).unbind();
           },

           buildFirstRoadMode: function(playerNumber) {
             this._setMode("buildFirstRoad");
             this._setPlayerNumber(playerNumber);
           },

           robberMoveMode: function(playerNumber) {
             var board = this;
             this._setMode("robberMove");
             this._setPlayerNumber(playerNumber);

             this.element.find(".hexes li li").addClass("unsettleable");

             var settleableHexes = $.grep(this._getBoard().getHexes(),
                                          function(hex) {
                                            return hex.isSettleable();
                                          }
                                         );

             $.each(settleableHexes,
                    function() {
                      var hex = this;
                      board.element.find(".hexes .row-" + this.getRow() + " .col-" + this.getCol()).addClass("settleable").removeClass("unsettleable").click(
                        function() {
                          board.robberMoved(hex);
                        }
                      );
                      board.element.find(".hexes li li.robber").removeClass("settleable").unbind();
                    }
                   );
           },

           _robberMoveModeOff: function() {
             this.element.find(".hexes li li").removeClass("unsettleable").removeClass("settleable").unbind();
             this.element.find(".nodes li li").removeClass("robbable").unbind();
           },

           _robberMoved: function(hex) {
             this.element.find(".hexes li li").removeClass("unsettleable").removeClass("settleable").unbind();
             var board = this;
             var playerNumber = this._getPlayerNumber();
             var robbableNodes = hex.getRobbableNodes(playerNumber);
             if(robbableNodes.length == 0) {
               board.robbed(hex);
             } else {
               $.each(robbableNodes,
                      function() {
                        var robbedPlayerNumber = this.getPlayerNumber();
                        board.element.find(".nodes .row-" + this.getRow() + " .col-" + this.getCol()).addClass("robbable").click(
                          function() {
                            board.robbed(hex, robbedPlayerNumber);
                          }
                        );
                      }
                     );
             }
           },

           _robbed: function(hex, playerNumber) {
             alert("robber moved to hex [" + hex.getRow() + ", " + hex.getCol() + "], robbed player number " + playerNumber);
             this._setMode("default");
           },

           defaultMode: function() {
             this._setMode("default");
           },

           _setMode: function(mode) {
             switch(this._getMode()) {
             case "buildFirstSettlement":
             case "buildSettlement":
               this._buildSettlementModeOff();
               break;
             case "buildCity":
               this._buildCityModeOff();
               break;
             case "buildFirstRoad":
             case "buildRoad":
               this._buildRoadModeOff();
               break;
             case "robberMove":
               this._robberMoveModeOff();
               break;
             }
             this._setData("mode", mode);
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

           settlementBuilt: function(nodeAttributes) {
             var node = this._getBoard().getNode(nodeAttributes.position);
             node.setPlayerNumber(nodeAttributes.playerNumber);
             node.setState(nodeAttributes.state);
             node.setId(nodeAttributes.id);
             this._createNode(node).effect("pulsate");
           },

           cityBuilt: function(nodeAttributes) {
             var node = this._getBoard().getNode(nodeAttributes.position);
             node.setState(nodeAttributes.state);
             this._createNode(node).effect("pulsate");
           },

           roadBuilt: function(edgeAttributes) {
             var edge = this._getBoard().getEdge(edgeAttributes.position);
             edge.setPlayerNumber(edgeAttributes.playerNumber);
             this._createEdge(edge).effect("pulsate");
           }
         }
        );
