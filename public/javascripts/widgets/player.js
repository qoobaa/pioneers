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

$.widget("ui.player", {
  // public methods

  toggleCurrent: function() {
    $(this.element).toggleClass("current", 300);
  },

  // constructor

  _init: function() {
    $(this.element).addClass("player-" + this.getNumber());
    var playerDl = $("<dl/>").appendTo(this.element);

    $("<dt/>").appendTo(playerDl).text("Name");
    $("<dd/>").appendTo(playerDl).addClass("name");
    $("<dt/>").appendTo(playerDl).text("State");
    $("<dd/>").appendTo(playerDl).addClass("state");
    $("<dt/>").appendTo(playerDl).text("Resources");
    $("<dd/>").appendTo(playerDl).addClass("resources");
    $("<dt/>").appendTo(playerDl).text("Cards");
    $("<dd/>").appendTo(playerDl).addClass("cards");
    $("<dt/>").appendTo(playerDl).text("Points");
    $("<dd/>").appendTo(playerDl).addClass("points");

    this._refreshName();
    this._refreshResources();
    this._refreshCards();
    this._refreshPoints();
    this._refreshState();
  },

  _refreshName: function(highlight) {
    var name = $(this.element).find(".name").text(this.getName());
    if(highlight) name.effect("highlight");
  },

  _refreshResources: function(highlight) {
    var resources = $(this.element).find(".resources").text(this.getResources());
    if(highlight) resources.effect("highlight");
  },

  _refreshCards: function(highlight) {
    var cards = $(this.element).find(".cards").text(this.getCards());
    if(highlight) cards.effect("highlight");
  },

  _refreshPoints: function(highlight) {
    var points = $(this.element).find(".points").text(this.getPoints());
    if(highlight) points.effect("highlight");
  },

  _refreshState: function(highlight) {
    var state = $(this.element).find(".state").text(this.getState());
    if(highlight) state.effect("highlight");
  },

  // getters and setters

  getNumber: function() {
    return this._getData("number");
  },

  getCards: function() {
    return this._getData("cards");
  },

  setCards: function(cards) {
    this._setData("cards", cards);
    this._refreshCards(true);
  },

  getPoints: function() {
    return this._getData("points");
  },

  setPoints: function(points) {
    this._setData("points", points);
    this._refreshPoints(true);
  },

  getResources: function() {
    return this._getData("resources");
  },

  setResources: function(resources) {
    this._setData("resources", resources);
    this._refreshResources(true);
  },

  getState: function() {
    return this._getData("state");
  },

  getName: function() {
    return this._getData("name");
  }
});

$.extend($.ui.player, {
  getter: ["getPoints", "getResources", "getName", "getState", "getCards", "getNumber"],
  setter: ["setPoints", "setResources", "setState", "setCards"]
});
