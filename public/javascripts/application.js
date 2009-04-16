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
              Pioneers.periodicallyUpdate(gameId);
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

$.fn.extend({
              // TODO: refactoring
              numeric: function(step, min) {
                var field = $(this).hide();
                field.val(0);
                field.siblings("a.minus").remove();
                field.siblings("a.plus").remove();
                field.siblings("span.value").remove();
                var minus = $("<a href='' class='minus'>-</a>");
                var plus = $("<a href='' class='plus'>+</a>");
                var showValue = function(element, value) {
                  element.text(Math.abs(value));
                  if(value > 0) element.removeClass("neutral negative").addClass("positive");
                  else if(value < 0) element.removeClass("positive neutral").addClass("negative");
                  else element.removeClass("positive negative").addClass("neutral");
                };
                var value = $("<span class='value neutral'>" + 0 + "</span>");
                minus.insertBefore(this).click(
                  function() {
                    var val = parseInt(field.val());
                    if(val > 0) val--;
                    else if(val - step >= min) val -= step;
                    field.val(val);
                    showValue(value, val);
                    return false;
                  }
                );
                value.insertBefore(this);
                plus.insertAfter(this).click(
                  function() {
                    var val = parseInt(field.val());
                    if(val >= 0) val++;
                    else val += step;
                    field.val(val);
                    showValue(value, val);
                    return false;
                  }
                );
              }
            }
           );

$(function() {
    Pioneers.initGame(10);
    // $("#menu").tabs();
  }
 );
