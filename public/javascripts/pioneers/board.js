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

var Pioneers = Pioneers || {};

Pioneers.Board = function(attributes) {
  this.createHexes = function(attributes) {
    var board = this;
    this.hexes2D = Pioneers.utils.makeArray2D(this.getHeight(), this.getWidth());
    this.hexes = $.map(attributes,
                       function(hexAttributes) {
                         var hex = new Pioneers.Hex(board, hexAttributes);
                         board.hexes2D[hex.getRow()][hex.getCol()] = hex;
                         return hex;
                       }
                      );
  };

  this.createNodes = function(attributes) {
    var board = this;
    this.nodes2D = Pioneers.utils.makeArray2D(this.getNodeHeight(), this.getNodeWidth());
    this.nodes = $.map(attributes,
                       function(nodeAttributes) {
                         var node = new Pioneers.Node(board, nodeAttributes);
                         board.nodes2D[node.getRow()][node.getCol()] = node;
                         return node;
                       }
                      );
    $.each(this.getHexes(),
           function() {
             $.each(this.getNodePositions(),
                    function() {
                      if(board.getNode(this) == undefined) {
                        var node = new Pioneers.Node(board, { position: this });
                        board.nodes.push(node);
                        board.nodes2D[node.getRow()][node.getCol()] = node;
                      }
                    }
                   );
           }
          );
  };

  this.createEdges = function(attributes) {
    var board = this;
    this.edges2D = Pioneers.utils.makeArray2D(this.getEdgeHeight(), this.getEdgeWidth());
    this.edges = $.map(attributes,
                       function(edgeAttributes) {
                         var edge = new Pioneers.Edge(board, edgeAttributes);
                         board.edges2D[edge.getRow()][edge.getCol()] = edge;
                         return edge;
                       }
                      );
    $.each(this.getHexes(),
           function() {
             $.each(this.getEdgePositions(),
                    function() {
                      if(board.getEdge(this) == undefined) {
                        var edge = new Pioneers.Edge(board, { position: this });
                        board.edges.push(edge);
                        board.edges2D[edge.getRow()][edge.getCol()] = edge;
                      }
                    }
                   );
           }
          );
  };

  this.getHexes = function() {
    return this.hexes;
  };

  this.getNodes = function() {
    return this.nodes;
  };

  this.getEdges = function() {
    return this.edges;
  };

  this.getHex = function(position) {
    var row = this.hexes2D[position[0]];
    return row ? row[position[1]] : undefined;
  };

  this.getNode = function(position) {
    var row = this.nodes2D[position[0]];
    return row ? row[position[1]] : undefined;
  };

  this.getEdge = function(position) {
    var row = this.edges2D[position[0]];
    return row ? row[position[1]] : undefined;
  };

  this.getSettlements = function(playerNumber) {
    return $.grep(this.getNodes(),
                  function(node) {
                    return node.isSettlement(playerNumber);
                  }
                 );
  };

  this.getNodesValidForSettlement = function(playerNumber) {
    return $.grep(this.nodes,
                  function(node) {
                    return node.isValidForSettlement(playerNumber);
                  }
                 );
  };

  this.getNodesValidForFirstSettlement = function(playerNumber) {
    return $.grep(this.nodes,
                  function(node) {
                    return node.isValidForFirstSettlement(playerNumber);
                  }
                 );
  };

  this.getEdgesValidForRoad = function(playerNumber) {
    return $.grep(this.edges,
                  function(edge) {
                    return edge.isValidForRoad(playerNumber);
                  }
                 );
  };

  this.getEdgesValidForFirstRoad = function(playerNumber) {
    return $.grep(this.edges,
                  function(edge) {
                    return edge.isValidForFirstRoad(playerNumber);
                  }
                 );
  };

  this.getHeight = function() {
    return this.size[0];
  };

  this.getNodeHeight = function() {
    return this.getHeight() + 1;
  };

  this.getEdgeHeight = function() {
    return this.getHeight() + 1;
  };

  this.getWidth = function() {
    return this.size[1];
  };

  this.getNodeWidth = function() {
    return this.getWidth() * 2 + 2;
  };

  this.getEdgeWidth = function() {
    return this.getWidth() * 3 + 5;
  };

  this.getRobberPosition = function() {
    return this.robberPosition;
  };

  this.getRobberRow = function() {
    return this.robberPosition[0];
  };

  this.getRobberCol = function() {
    return this.robberPosition[1];
  };

  this.setRobberPosition = function(position) {
    this.robberPosition = position;
  };

  this.init = function(attributes) {
    this.size = attributes.size;
    this.robberPosition = attributes.robberPosition;
    this.createHexes(attributes.hexes);
    this.createNodes(attributes.nodes);
    this.createEdges(attributes.edges);
  };

  this.init(attributes);
};
