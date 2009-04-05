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

Pioneers.initGame = function(gameId) {
  $.getJSON("/games/" + gameId + ".json",
            function(data) {
              Pioneers.game = new Pioneers.Game(data.game);
              Pioneers.timerId = setInterval(
                function() {
                  Pioneers.updateGame(gameId);
                }, 5000);
            }
           );
};

Pioneers.updateGame = function(gameId) {
  $.getJSON("/games/" + gameId + ".json",
            function(data) {
              Pioneers.game.update(data);
            }
           );
};

$(function() {
    Pioneers.initGame(10);

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
