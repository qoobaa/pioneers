var Pioneers = {
  loadHexes: function(game_id) {
    $.getJSON("/games/" + game_id + "/hexes.json", null,
              function(data) {
                var hexes = data["hexes"];

                // init array
                Pioneers.hexes = new Array(10);
                for(var row = 0; row < 10; row++) {
                  Pioneers.hexes[row] = new Array(10);
                }

                // set hexes
                for(var i in hexes) {
                  var hex = hexes[i];
                  Pioneers.hexes[hex.position[0]][hex.position[1]] = hex;
                }
              }
             );
  },

  loadGame: function(game_id) {
    $.getJSON("/games/" + game_id + ".json", null,
              function(data) {
                Pioneers.game = data["game"];
              }
             );
  },

  updateGame: function(game_id) {
    $.getJSON("/games/" + game_id + ".json", null,
              function(data) {
                Pioneers.game = data["game"];
              }
             );
  },

  periodicallyLoadGame: function(game_id, interval) {
    var loadGame = function() {
      Pioneers.loadGame(game_id);
      setTimeout(loadGame, interval || 3500);
    };
    loadGame();
  }
};

$(function() {
    Pioneers.loadHexes(10);
    // alert(document.location.pathname);
    // Pioneers.periodicallyLoadGame(10);

    // $("#map ul#nodes li ul li").hover(
    //   function() {
    //     var settlement = "<div class='settlement player-1'></div>";
    //     $(settlement).appendTo(this).click(
    //       function() {
    //         var position = $(this).parents("li").map(
    //           function()
    //           {
    //             return $(this).attr("class").match(/\d+/);
    //           }
    //         ).get().reverse();
    //         alert(position.join());
    //       }
    //     );
    //   },
    //   function() {
    //     $(this).empty();
    //   }
    // );
  }
 );
