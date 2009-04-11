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

Pioneers.Map = function(game, attributes) {
  this.createHexes = function(attributes) {
    this.hexes = Pioneers.utils.makeArray2D(10, 10);
    this.hexesList = [];
    for(var i in attributes) {
      var hex = new Pioneers.Hex(this, attributes[i]);
      this.hexes[hex.row()][hex.col()] = hex;
      this.hexesList.push(hex);
    }
  };

  this.createNodes = function(attributes) {
    this.nodes = Pioneers.utils.makeArray2D(10, 10);
    this.nodesList = [];
    for(var i in attributes) {
      var node = new Pioneers.Node(this, attributes[i]);
      this.nodes[node.row()][node.col()] = node;
      this.nodesList.push(node);
    }
  };

  this.createEdges = function(attributes) {
    this.edges = Pioneers.utils.makeArray2D(10, 10);
    this.edgesList = [];
    for(var i in attributes) {
      var edge = new Pioneers.Edge(this, attributes[i]);
      this.edges[edge.row()][edge.col()] = edge;
      this.edgesList.push(edge);
    }
  };

  this.updateNodes = function(nodes) {
    for(i in nodes) {
      var position = nodes[i].position;
      if(this.nodes[position[0]][position[1]] == null) {
        var node = new Pioneers.Node(this, attributes[i]);
        this.nodes[node.row()][node.col()] = node;
        this.nodesList.push(node);
      } else {
        this.nodes[position[0]][position[1]].update(nodes[i]);
      }
    }
  };

  this.updateEdges = function(attributes) {
    var edges = attributes;
    for(i in edges) {
      var position = edges[i].position;
      if(this.edges[position[0]][position[1]] == null) {
        var edge = new Pioneers.Edge(this, attributes[i]);
        this.edges[edge.row()][edge.col()] = edge;
        this.edgesList.push(edge);
      } else {
        this.edges[position[0]][position[1]].update(edges[i]);
      }
    }
  };

  this.update = function(attributes) {
    this.updateNodes(attributes.nodes);
    this.updateEdges(attributes.edges);
  };

  this.settlements = function() {
    var playerId = this.game.userPlayer.id;
    return  $.grep(this.nodesList,
                   function(node) {
                     return node.state == "settlement" && node.playerId == playerId;
                   }
                  );
  };

  this.cities = function() {
    var playerId = this.game.userPlayer.id;
    return  $.grep(this.nodesList,
                   function(node) {
                     return node.state == "city" && node.playerId == playerId;
                   }
                  );
  };

  this.settlementsAndCities = function() {
    return $.merge(this.settlements(), this.cities());
  };

  this.roads = function() {
    var playerId = this.game.userPlayer.id;
    return $.grep(this.edgesList,
                  function(edge) {
                    return edge.playerId == playerId;
                  }
                 );
  };

  this.hex = function(position) {
    return this.hexes[position[0]][position[1]];
  };

  this.node = function(position) {
    return this.nodes[position[0]][position[1]];
  };

  this.edge = function(position) {
    return this.edges[position[0]][position[1]];
  };

  this.game = game;
  this.createHexes(attributes.hexes);
  this.createNodes(attributes.nodes);
  this.createEdges(attributes.edges);
};
