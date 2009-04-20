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

Pioneers.Board = function(game, attributes) {
  this.createHexes = function(attributes) {
    var board = this;
    this.hexes2D = Pioneers.utils.makeArray2D(10, 10);
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
    this.nodes = [];
    this.nodes2D = Pioneers.utils.makeArray2D([11, 25]);
    $.each(this.getHexes(),
           function() {
             $.each(this.getNodePositions(),
                    function() {
                      var position = this;
                      var attr = $.grep(attributes,
                                        function(nodeAttributes) {
                                          return nodeAttributes.position[0] == position[0] && nodeAttributes.position[1] == position[1];
                                        }
                                       )[0];
                      attr = attr || { position: position };
                      if(board.getNode(position) == null) {
                        var node = new Pioneers.Node(board, attr);
                        board.nodes.push(node);
                        board.nodes2D[position[0]][position[1]] = node;
                      }
                    }
                   );
           }
          );
  };

  this.createEdges = function(attributes) {
    var board = this;
    this.edges = [];
    this.edges2D = Pioneers.utils.makeArray2D([11, 40]);
    $.each(this.getHexes(),
           function() {
             $.each(this.getEdgePositions(),
                    function() {
                      var position = this;
                      var attr = $.grep(attributes,
                                        function(edgeAttributes) {
                                          return edgeAttributes.position[0] == position[0] && edgeAttributes.position[1] == position[1];
                                        }
                                       )[0];
                      attr = attr || { position: this };
                      if(board.getEdge(this) == null) {
                        var edge = new Pioneers.Edge(board, attr);
                        board.edges.push(edge);
                        board.edges2D[position[0]][position[1]] = edge;
                      }
                    }
                   );
           }
          );
  };

  this.updateNodes = function(nodes) {
    var board = this;
    $.each(nodes,
           function() {
             board.getNode(this.position).update(this);
           }
          );
  };

  this.updateEdges = function(edges) {
    var board = this;
    $.each(edges,
           function() {
             board.getEdge(this.position).update(this);
           }
          );
  };

  this.update = function(attributes) {
    this.updateNodes(attributes.nodes);
    this.updateEdges(attributes.edges);
  };

  this.getHexes = function() {
    return this.hexes;
  };

  this.getNodes = function() {
    return this.nodes;
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

  this.getHeight = function() {
    return this.size[0];
  };

  this.getWidth = function() {
    return this.size[1];
  };

  this.getRobberPosition = function() {
    return this.robberPosition;
  };

  this.game = game;
  this.size = attributes.size;
  this.robberPosition = attributes.robberPosition;
  this.createHexes(attributes.hexes);
  this.createNodes(attributes.nodes);
  this.createEdges(attributes.edges);
};
