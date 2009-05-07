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

$.widget("ui.build", {
  disable: function(element) {
    if(!element) {
      $(this.element).addClass("disabled");
    } else {
      $(this.element).find("." + element).addClass("disabled");
    }
  },

  enable: function(element) {
    if(!element) {
      $(this.element).removeClass("disabled");
    } else {
      $(this.element).find("." + element).removeClass("disabled");
    }
  },

  _init: function() {
    $(this.element).addClass("build");
    var that = this;

    var div = $("<div/>").appendTo(this.element);
    var ul = $("<ul/>").appendTo(div);
    var li;

    li = $("<li/>").appendTo(ul);
    $("<a/>").appendTo(li).attr("href", "").addClass("settlement").text("Settlement").click(function(event) {
      if(!$(that.element).hasClass("disabled") && !$(this).hasClass("disabled")) {
        that._trigger("Settlement", event);
      }
      return false;
    });

    li = $("<li/>").appendTo(ul);
    $("<a/>").appendTo(li).attr("href", "").addClass("city").text("City").click(function(event) {
      if(!$(that.element).hasClass("disabled") && !$(this).hasClass("disabled")) {
        that._trigger("City", event);
      }
      return false;
    });

    li = $("<li/>").appendTo(ul);
    $("<a/>").appendTo(li).attr("href", "").addClass("road").text("Road").click(function(event) {
      if(!$(that.element).hasClass("disabled") && !$(this).hasClass("disabled")) {
        that._trigger("Road", event);
      }
      return false;
    });

    li = $("<li/>").appendTo(ul);
    $("<a/>").appendTo(li).attr("href", "").addClass("card").text("Card").click(function(event) {
      if(!$(that).hasClass("disabled") && !$(this).hasClass("disabled")) {
        that._trigger("Card", event);
      }
      return false;
    });
  }
});
