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

Pioneers.UserPlayer = function(game, attributes) {
  this.getId = function() {
    return this.id;
  };

  this.getNumber = function() {
    return this.number;
  };

  this.getBricks = function() {
    return this.bricks;
  };

  this.getGrain = function() {
    return this.grain;
  };

  this.getLumber = function() {
    return this.lumber;
  };

  this.getOre = function() {
    return this.ore;
  };

  this.getWool = function() {
    return this.wool;
  };

  this.getSettlements = function() {
    return this.settlements;
  };

  this.getCities = function() {
    return this.cities;
  };

  this.getRoads = function() {
    return this.roads;
  };

  this.getState = function() {
    return this.state;
  };

  this.getVisiblePoints = function() {
    return this.visiblePoints;
  };

  this.getHiddenPoints = function() {
    return this.hiddenPoints;
  };

  this.getPoints = function() {
    return this.visiblePoints + this.hiddenPoints;
  };

  this.getBricksExchangeRate = function() {
    return this.bricksExchangeRate;
  };

  this.getGrainExchangeRate = function() {
    return this.grainExchangeRate;
  };

  this.getLumberExchangeRate = function() {
    return this.lumberExchangeRate;
  };

  this.getOreExchangeRate = function() {
    return this.oreExchangeRate;
  };

  this.getWoolExchangeRate = function() {
    return this.woolExchangeRate;
  };

  this.canBuildSettlement = function() {
    return this.getSettlements() >= 1 &&
      this.getBricks() >= 1 &&
      this.getGrain() >= 1 &&
      this.getLumber() >= 1 &&
      this.getWool() >= 1;
  };

  this.canBuildCity = function() {
    return this.getCities() >= 1 &&
      this.getGrain() >= 2 &&
      this.getOre() >= 3;
  };

  this.canBuildRoad = function() {
    return this.getRoads() >= 1 &&
      this.getBricks() >= 1 &&
      this.getLumber() >= 1;
  };

  this.canBuyCard = function() {
    return this.getGrain() >= 1 &&
      this.getOre() >= 1 &&
      this.getWool() >= 1;
  };

  this.setBricks = function(bricks) {
    this.bricks = bricks;
    $("#player dd.bricks").text(bricks);
    $("#offer_bricks").resource("setMin", -bricks);
  };

  this.setGrain = function(grain) {
    this.grain = grain;
    $("#player dd.grain").text(grain);
    $("#offer_grain").resource("setMin", -grain);
  };

  this.setLumber = function(lumber) {
    this.lumber = lumber;
    $("#player dd.lumber").text(lumber);
    $("#offer_lumber").resource("setMin", -lumber);
  };

  this.setOre = function(ore) {
    this.ore = ore;
    $("#player dd.ore").text(ore);
    $("#offer_ore").resource("setMin", -ore);
  };

  this.setWool = function(wool) {
    this.wool = wool;
    $("#player dd.wool").text(wool);
    $("#offer_wool").resource("setMin", -wool);
  };

  this.setSettlements = function(settlements) {
    this.settlements = settlements;
    $("#player dd.settlements").text(settlements);
  };

  this.setCities = function(cities) {
    this.cities = cities;
    $("#player dd.cities").text(cities);
  };

  this.setRoads = function(roads) {
    this.roads = roads;
    $("#player dd.roads").text(roads);
  };

  this.setState = function(state) {
    this.state = state;
  };

  this.setBricksExchangeRate = function(bricksExchangeRate) {
    this.bricksExchangeRate = bricksExchangeRate;
    $("#exchange_bricks").resource("setStep", bricksExchangeRate);
  };

  this.setGrainExchangeRate = function(grainExchangeRate) {
    this.grainExchangeRate = grainExchangeRate;
    $("#exchange_grain").resource("setStep", grainExchangeRate);
  };

  this.setLumberExchangeRate = function(lumberExchangeRate) {
    this.lumberExchangeRate = lumberExchangeRate;
    $("#exchange_lumber").resource("setStep", lumberExchangeRate);
  };

  this.setOreExchangeRate = function(oreExchangeRate) {
    this.oreExchangeRate = oreExchangeRate;
    $("#exchange_ore").resource("setStep", oreExchangeRate);
  };

  this.setWoolExchangeRate = function(woolExchangeRate) {
    this.woolExchangeRate = woolExchangeRate;
    $("#exchange_wool").resource("setStep", woolExchangeRate);
  };

  this.createCards = function(attributes) {
    var userPlayer = this;
    this.cards = $.map(attributes,
                       function(card) {
                         return new Pioneers.Card(userPlayer, card);
                       }
                      );
  };

  this.updateCards = function(attributes) {
    var userPlayer = this;
    $.each(attributes,
           function() {
             var card = userPlayer.getCard(this.id);
             if(card != null) {
               card.update(this);
             } else {
               userPlayer.cards.push(new Pioneers.Card(userPlayer, this));
             }
           }
          );
  };

  this.getCard = function(cardId) {
    return $.grep(this.cards,
                  function(card) {
                    return cardId == card.getId();
                  }
                 )[0];
  };

  this.update = function(attributes) {
    this.updateCards(attributes.cards);
    if(this.getBricks() != attributes.bricks) this.setBricks(attributes.bricks);
    if(this.getGrain() != attributes.grain) this.setGrain(attributes.grain);
    if(this.getLumber() != attributes.lumber) this.setLumber(attributes.lumber);
    if(this.getOre() != attributes.ore) this.setOre(attributes.ore);
    if(this.getWool() != attributes.wool) this.setWool(attributes.wool);
    if(this.getSettlements() != attributes.settlements) this.setSettlements(attributes.settlements);
    if(this.getCities() != attributes.cities) this.setCities(attributes.cities);
    if(this.getRoads() != attributes.roads) this.setRoads(attributes.roads);
    if(this.getState() != attributes.state) this.setState(attributes.state);
    if(this.getBricksExchangeRate() != attributes.bricksExchangeRate) this.setBricksExchangeRate(attributes.bricksExchangeRate);
    if(this.getGrainExchangeRate() != attributes.grainExchangeRate) this.setGrainExchangeRate(attributes.grainExchangeRate);
    if(this.getLumberExchangeRate() != attributes.lumberExchangeRate) this.setLumberExchangeRate(attributes.lumberExchangeRate);
    if(this.getOreExchangeRate() != attributes.oreExchangeRate) this.setOreExchangeRate(attributes.oreExchangeRate);
    if(this.getWoolExchangeRate() != attributes.woolExchangeRate) this.setWoolExchangeRate(attributes.woolExchangeRate);

    this.visiblePoints = attributes.visiblePoints;
    this.hiddenPoints = attributes.hiddenPoints;
  };

  this.game = game;
  this.id = attributes.id;
  this.number = attributes.number;
  this.createCards(attributes.cards);
  this.update(attributes);
};
