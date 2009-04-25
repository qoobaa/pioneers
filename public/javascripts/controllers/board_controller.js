BoardController = MVC.Controller.Stateful.extend('board', {

}, {
  init: function(element, attributes) {
    this._super(MVC.$E(element));
    this.board = new Pioneers.Board(attributes);
    this.setMode("buildFirstRoad");
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
    if(this.getMode() == "robberMove") {
      var hex = this.getBoard().getHex(this.getElementPosition(params.element));
      $(this.element).find(".hexes li.settleable").removeClass("settleable");
    }
  },

  ".node mouseover": function(params) {
    var mode = this.getMode();
    switch(mode) {
    case "robbery":

      break;
    case "buildSettlement":
    case "buildFirstSettlement":

      break;
    case "buildCity":

      break;
    }
  },

  ".node click": function(params) {
    var mode = this.getMode();
    switch(mode) {
    case "robbery":

      break;
    case "buildSettlement":
    case "buildFirstSettlement":

      break;
    case "buildCity":

      break;
    }
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
    }
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
  }
}
);
