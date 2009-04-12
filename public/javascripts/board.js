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

  this.createNodes = function() {
    var board = this;
    this.nodes = [];
    $.each(this.getHexes(),
           function() {
             $.each(this.getNodePositions(),
                    function() {
                      if(board.getNode(this) == null) {
                        board.nodes.push(new Pioneers.Node(board, this));
                      }
                    }
                   );
           }
          );
  };

  this.createEdges = function() {
    var board = this;
    this.edges = [];
    $.each(this.getHexes(),
           function() {
             $.each(this.getEdgePositions(),
                    function() {
                      if(board.getEdge(this) == null) {
                        board.edges.push(new Pioneers.Edge(board, this));
                      }
                    }
                   );
           }
          );
  };

  this.updateNodes = function(nodes) {
    // for(i in nodes) {
    //   var position = nodes[i].position;
    //   if(this.nodes[position[0]][position[1]] == null) {
    //     var node = new Pioneers.Node(this, attributes[i]);
    //     this.nodes[node.row()][node.col()] = node;
    //     this.nodesList.push(node);
    //   } else {
    //     this.nodes[position[0]][position[1]].update(nodes[i]);
    //   }
    // }
  };

  this.updateEdges = function(attributes) {
    // var edges = attributes;
    // for(i in edges) {
    //   var position = edges[i].position;
    //   if(this.edges[position[0]][position[1]] == null) {
    //     var edge = new Pioneers.Edge(this, attributes[i]);
    //     this.edges[edge.row()][edge.col()] = edge;
    //     this.edgesList.push(edge);
    //   } else {
    //     this.edges[position[0]][position[1]].update(edges[i]);
    //   }
    // }
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

  this.getSettlements = function() {
    var playerId = this.game.userPlayer.id;
    return  $.grep(this.nodesList,
                   function(node) {
                     return node.state == "settlement" && node.playerId == playerId;
                   }
                  );
  };

  this.getCities = function() {
    var playerId = this.game.userPlayer.id;
    return  $.grep(this.nodesList,
                   function(node) {
                     return node.state == "city" && node.playerId == playerId;
                   }
                  );
  };

  this.getSettlementsAndCities = function() {
    return $.merge(this.settlements(), this.cities());
  };

  this.getRoads = function() {
    var playerId = this.game.userPlayer.id;
    return $.grep(this.edgesList,
                  function(edge) {
                    return edge.playerId == playerId;
                  }
                 );
  };

  this.game = game;
  this.createHexes(attributes.hexes);
  this.createNodes(attributes.nodes);
  this.createEdges(attributes.edges);
};
