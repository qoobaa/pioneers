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

$.widget("ui.boardHex", {
  _init: function() {
    var hex = this.getHex();
    $(this.element).addClass("hex").addClass("col-" + hex.getCol()).addClass(hex.getType());
    if(hex.isSettleable()) $("<span/>").addClass("robber").text("robber").appendTo(this.element);
    if(hex.getRoll() != undefined) $("<span/>").addClass("roll roll-" + hex.getRoll()).text(hex.getRoll()).appendTo(this.element);
    if(hex.isHarbor()) $("<span/>").addClass(hex.getHarborType() + "-" + hex.getHarborPosition()).text(hex.getHarborType()).appendTo(this.element);
    this.reset();
  },

  _clear: function() {
    $(this.element).removeClass("robber").removeAttr("style");
  },

  reset: function() {
    var hex = this.getHex();
    this._clear();
    if(hex.hasRobber()) $(this.element).addClass("robber");
  },

  robber: function() {
    var hex = this.getHex();
    this._clear();
    $(this.element).addClass("robber").css({ cursor: "pointer" });;
  },

  getHex: function() {
    return this._getData("hex");
  }
});

$.extend($.ui.boardHex, {
  getter: "getHex"
});
