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

Pioneers.UserPlayer = function(attributes) {
  this.update = function(attributes) {
    this.id = attributes.id;
    this.bricks = attributes.bricks;
    this.grain = attributes.grain;
    this.lumber = attributes.lumber;
    this.ore = attributes.ore;
    this.wool = attributes.wool;
    this.settlements = attributes.settlements;
    this.cities = attributes.cities;
    this.roads = attributes.roads;
    this.state = attributes.state;
    this.visiblePoints = attributes.visiblePoints;
    this.hiddenPoints = attributes.hiddenPoints;
    this.bricksExchangeRate = attributes.bricksExchangeRate;
    this.grainExchangeRate = attributes.grainExchangeRate;
    this.lumberExchangeRate = attributes.lumberExchangeRate;
    this.oreExchangeRate = attributes.oreExchangeRate;
    this.woolExchangeRate = attributes.woolExchangeRate;
    this.updateView();
  };

  this.updateView = function() {
    this.rootElement.children("dd.bricks").text(this.bricks);
    this.rootElement.children("dd.grain").text(this.grain);
    this.rootElement.children("dd.lumber").text(this.lumber);
    this.rootElement.children("dd.ore").text(this.ore);
    this.rootElement.children("dd.wool").text(this.wool);
    this.rootElement.children("dd.settlements").text(this.settlements);
    this.rootElement.children("dd.cities").text(this.cities);
    this.rootElement.children("dd.roads").text(this.roads);
  };

  this.rootElement = $("dl#player");
  this.update(attributes);
};
