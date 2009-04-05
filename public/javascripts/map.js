Pioneers.Map = function(attributes) {
  this.createHexes = function(attributes) {
    var hexes = Pioneers.utils.makeArray2D(10, 10);
    for(var i in attributes) {
      var hex = new Pioneers.Hex(attributes[i]);
      hexes[hex.row()][hex.col()] = hex;
      hex.map = this;
    }
    return hexes;
  };

  this.createNodes = function(attributes) {
    var nodes = Pioneers.utils.makeArray2D(10, 10);
    for(var i in attributes) {
      var node = new Pioneers.Node(attributes[i]);
      nodes[node.row()][node.col()] = node;
      node.map = this;
    }
    return nodes;
  };

  this.createEdges = function(attributes) {
    var edges = Pioneers.utils.makeArray2D(10, 10);
    for(var i in attributes) {
      var edge = new Pioneers.Edge(attributes[i]);
      edges[edge.row()][edge.col()] = edge;
      edge.map = this;
    }
    return edges;
  };

  this.hexes = this.createHexes(attributes.hexes);
  this.nodes = this.createNodes(attributes.nodes);
  this.edges = this.createEdges(attributes.edges);
};
