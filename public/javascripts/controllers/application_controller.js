ApplicationController = MVC.Controller.extend("main", {
  load: function(params) {
    var id = document.location.pathname.match(/\d+/)[0];
    Game.find(id, this.continue_to("game_loaded"));
  },

  game_loaded: function(response) {
    //$("#board").board({ boardAttributes: response.board });
    var board = new BoardController("board", response.board);
    document.domain = document.domain;
    Orbited.settings.hostname = "localhost";
    Orbited.settings.port = "8000";
    Orbited.settings.protocol = "http";
    Orbited.settings.streaming = true;
    TCPSocket = Orbited.TCPSocket;

    var stomp = new STOMPClient();
    stomp.onmessageframe = function(frame) { StompController.dispatch("onmessageframe", frame); };
    stomp.onconnectedframe = function(frame) { stomp.subscribe(document.location.pathname); };
    $(window).bind("beforeunload", function() { stomp.reset(); });
    stomp.connect("localhost", "61613");
  }
});
