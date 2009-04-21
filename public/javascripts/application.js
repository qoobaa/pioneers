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
              //Pioneers.periodicallyUpdate(gameId);
            }
           );
};

Pioneers.updateGame = function(gameId) {
  $.getJSON("/games/" + gameId + ".json",
            function(data) {
              Pioneers.game.update(data.game);
            }
           );
};

Pioneers.periodicallyUpdate = function(gameId, interval) {
  Pioneers.timerId = setInterval(
    function() {
      Pioneers.updateGame(gameId);
    }, interval || 5000);
};

$(function() {
    Pioneers.controllers.applicationController = new Pioneers.ApplicationController();
  //   Pioneers.initGame(10);
  //   $("#offer_bricks").resource({step: 1});
  //   $("#offer_grain").resource({step: 1});
  //   $("#offer_lumber").resource({step: 1});
  //   $("#offer_ore").resource({step: 1});
  //   $("#offer_wool").resource({step: 1});
  //   $("#exchange_bricks").resource();
  //   $("#exchange_grain").resource();
  //   $("#exchange_lumber").resource();
  //   $("#exchange_ore").resource();
  //   $("#exchange_wool").resource();
  //   $("#menu").tabs();
  //   $("#build .road").click(
  //     function() {
  //       $("#board").board("buildRoadMode", 1);
  //       return false;
  //     }
  //   );
  //   $("#build .settlement").click(
  //     function() {
  //       $("#board").board("buildSettlementMode", 1);
  //       return false;
  //     }
  //   );
  //   $("#build .city").click(
  //     function() {
  //       $("#board").board("buildCityMode", 1);
  //       return false;
  //     }
  //   );
  //   $("#build .cancel").click(
  //     function() {
  //       $("#board").board("defaultMode");
  //       return false;
  //     }
  //   );
  }
);
