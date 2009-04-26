BoardController = MVC.Controller.Stateful.extend('board', {

}, {
  init: function(element, attributes) {
    this._super(MVC.$E(element));
    this.board = new Pioneers.Board(attributes);
    this.setMode("robberMove");
    this.setPlayerNumber(1);
    $(this.element)
      .empty()
      .addClass("board size-" + this.getHeight() + "-" + this.getWidth())
      .append(new View({ url: "views/board/board.ejs" }).render({ board: this.board }));
  },

  ".hex mouseover": function(params) {
    if(this.getMode() == "robberMove") {
      var hex = this.getBoard().getHex(this.getElementPosition(params.element));
      if(hex.isRobbable()) $(params.element).addClass("settleable");
    }
  },

  ".hex click": function(params) {
    var hex = this.getBoard().getHex(this.getElementPosition(params.element));
    if(this.getMode() == "robberMove" && hex.isRobbable()) {
      $(this.element).find(".hexes li.settleable").removeClass("settleable");
      this.robberMoved(hex);
    }
  },

  robberMoved: function(hex) {
    this.setRobberHex(hex);
    var playerNumber = this.getPlayerNumber();
    var nodes = hex.getRobbableNodes(playerNumber);
    if(nodes.length > 0) {
      this.setMode("robbery");
    } else {
      this.setMode("default");
      this.robbed(hex);
    }
  },

  robbed: function(hex, playerNumber) {
    // TODO
    alert("robbed " + hex.getPosition() + ", player number " + playerNumber);
  },

  ".node mouseover": function(params) {
    var mode = this.getMode();
    var node = this.getBoard().getNode(this.getElementPosition(params.element));
    var playerNumber = this.getPlayerNumber();
    switch(mode) {
    case "robbery":
      var hex = this.getRobberHex();
      if(hex.getRobbableNodes(playerNumber).include(node)) {
        $(params.element).addClass("robbable-" + playerNumber);
      }
      break;
    case "buildSettlement":
    case "buildFirstSettlement":
      if(mode == "buildSettlement" && node.isValidForSettlement(playerNumber) ||
         mode == "buildFirstSettlement" && node.isValidForFirstSettlement(playerNumber)) {
        $(params.element).addClass("settleable-" + playerNumber);
      }
      break;
    case "buildCity":
      if(node.isValidForCity(playerNumber)) {
        $(params.element).addClass("expandable-" + playerNumber);
      }
      break;
    }
  },

  ".node click": function(params) {
    var mode = this.getMode();
    var node = this.getBoard().getNode(this.getElementPosition(params.element));
    var playerNumber = this.getPlayerNumber();
    switch(mode) {
    case "robbery":
      var hex = this.getRobberHex();
      $(this.element).find(".nodes li.robbable-" + playerNumber).removeClass("robbable-" + playerNumber);
      this.robbed(this.getRobberHex(), node.getPlayerNumber());
      break;
    case "buildSettlement":
    case "buildFirstSettlement":
      $(this.element).find(".nodes li.settleable-" + playerNumber).removeClass("settleable-" + playerNumber);
      this.settlementBuilt(node);
      break;
    case "buildCity":
      this.cityBuilt(node);
      $(this.element).find(".nodes li.expandable-" + playerNumber).removeClass("expandable-" + playerNumber);
      break;
    }
  },

  settlementBuilt: function(node) {
    // TODO
  },

  cityBuilt: function(node) {
    // TODO
  },

  ".edge mouseover": function(params) {
    var mode = this.getMode();
    if(mode == "buildRoad" || mode == "buildFirstRoad") {
      var edge = this.getBoard().getEdge(this.getElementPosition(params.element));
      var playerNumber = this.getPlayerNumber();
      if(mode == "buildRoad" && edge.isValidForRoad(playerNumber) || mode == "buildFirstRoad" && edge.isValidForFirstRoad(playerNumber)) {
        $(params.element).addClass("settleable-" + playerNumber);
      } else {
        $(params.element).addClass("unsettleable-" + playerNumber);
      }
    }
  },

  ".edge click": function(params) {
    var mode = this.getMode();
    if(mode == "buildRoad" || mode == "buildFirstRoad") {
      var edge = this.getBoard().getEdge(this.getElementPosition(params.element));
      var playerNumber = this.getPlayerNumber();
      $(this.element).find(".edges li.settleable-" + playerNumber).removeClass("settleable-" + playerNumber);
      $(this.element).find(".edges li.unsettleable-" + playerNumber).removeClass("unsettleable-" + playerNumber);
      this.roadBuilt(edge);
    }
  },

  roadBuilt: function(edge) {
    // TODO
  },

  getHeight: function() {
    return this.board.getHeight();
  },

  getWidth: function() {
    return this.board.getWidth();
  },

  getHexes: function() {
    return this.board.getHexes();
  },

  getBoard: function() {
    return this.board;
  },

  getElementPosition: function(element) {
    var row = $(element).attr("class").match(/row-\d+/)[0].match(/\d+/)[0];
    var col = $(element).attr("class").match(/col-\d+/)[0].match(/\d+/)[0];
    return [row, col];
  },

  getMode: function() {
    return this.mode;
  },

  setMode: function(mode) {
    this.mode = mode;
  },

  getPlayerNumber: function() {
    return this.playerNumber;
  },

  setPlayerNumber: function(playerNumber) {
    this.playerNumber = playerNumber;
  },

  setRobberHex: function(hex) {
    this.robberHex = hex;
  },

  getRobberHex: function() {
    return this.robberHex;
  }
}
);
