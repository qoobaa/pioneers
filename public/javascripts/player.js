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

Pioneers.Player = function(game, attributes) {
  this.getId = function() {
    return this.id;
  };

  this.getNumber = function() {
    return this.number;
  };

  this.getName = function() {
    return this.name;
  };

  this.getPoints = function() {
    return this.points;
  };

  this.getResources = function() {
    return this.resources;
  };

  this.getCards = function() {
    return this.cards;
  };

  this.getState = function() {
    return this.state;
  };

  this.getIsUserIdle = function() {
    return this.isUserIdle;
  };

  this.setPoints = function(points) {
    this.points = points;
    $("#player li.player-" + this.getNumber() + " .points").text(points);
  };

  this.setResources = function(resources) {
    this.resources = resources;
    $("#player li.player-" + this.getNumber() + " .resources").text(resources);
  };

  this.setCards = function(cards) {
    this.cards = cards;
    $("#player li.player-" + this.getNumber() + " .cards").text(cards);
  };

  this.setState = function(state) {
    this.state = state;
    $("#player li.player-" + this.getNumber() + " .state").text(state);
  };

  this.setIsUserIdle = function(isUserIdle) {
    this.isUserIdle = isUserIdle;
  };

  this.update = function(attributes) {
    if(this.getPoints() != attributes.points) this.setPoints(attributes.points);
    if(this.getResources() != attributes.resources) this.setResources(attributes.resources);
    if(this.getIsUserIdle() != attributes.isUserIdle) this.setIsUserIdle(attributes.isUserIdle);
    if(this.getCards() != attributes.cards) this.setCards(attributes.cards);
    if(this.getState() != attributes.state) this.setState(attributes.state);
  };

  this.game = game;
  this.id = attributes.id;
  this.number = attributes.number;
  this.name = attributes.name;
  this.points = attributes.points;
  this.resources = attributes.resources;
  this.cards = attributes.cards;
  this.state = attributes.state;
};
