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
    this.hexes = $.map(attributes,
                       function(hexAttributes) {
                         return new Pioneers.Hex(board, hexAttributes);
                       }
                      );
  };

  this.createNodes = function(attributes) {
    var board = this;
    this.nodes = [];
    $.each(this.getHexes(),
           function() {
             $.each(this.getNodePositions(),
                    function() {
                      var position = this;
                      var attr = $.grep(attributes,
                                        function(nodeAttributes) {
                                          return nodeAttributes.row == position[0] && nodeAttributes.col == position[1];
                                        }
                                       )[0];
                      attr = attr || { position: this };
                      if(board.getNode(this) == null) {
                        board.nodes.push(new Pioneers.Node(board, attr));
                      }
                    }
                   );
           }
          );
  };

  this.createEdges = function(attributes) {
    var board = this;
    this.edges = [];
    $.each(this.getHexes(),
           function() {
             $.each(this.getEdgePositions(),
                    function() {
                      var position = this;
                      var attr = $.grep(attributes,
                                        function(edgeAttributes) {
                                          return edgeAttributes.row == position[0] && edgeAttributes.col == position[1];
                                        }
                                       )[0];
                      attr = attr || { position: this };
                      if(board.getEdge(this) == null) {
                        board.edges.push(new Pioneers.Edge(board, attr));
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

  this.getEdges = function() {
    return this.edges;
  };

  this.getHex = function(position) {
    return $.grep(this.getHexes(),
                  function(hex) {
                    return hex.getRow() == position[0] && hex.getCol() == position[1];
                  }
                 )[0];
  };

  this.getNode = function(position) {
    return $.grep(this.getNodes(),
                  function(node) {
                    return node.getRow() == position[0] && node.getCol() == position[1];
                  }
                 )[0];
  };

  this.getEdge = function(position) {
    return $.grep(this.getEdges(),
                  function(edge) {
                    return edge.getRow() == position[0] && edge.getCol() == position[1];
                  }
                 )[0];
  };

  this.getSettlements = function(playerId) {
    return $.grep(this.getNodes(),
                  function(node) {
                    return node.isSettlement(playerId);
                  }
                 );
  };

  this.game = game;
  this.createHexes(attributes.hexes);
  this.createNodes(attributes.nodes);
  this.createEdges(attributes.edges);
};
