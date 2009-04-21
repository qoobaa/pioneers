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

Pioneers.Card = function(userPlayer, attributes) {
  this.getId = function() {
    return this.id;
  };

  this.getType = function() {
    return this.type;
  };

  this.getState = function() {
    return this.state;
  };

  this.setState = function(state) {

  };

  this.update = function(attributes) {
    if(attributes.state != this.getState()) this.setState(attributes.state);
  };

  this.userPlayer = userPlayer;
  this.id = attributes.id;
  this.type = attributes.type;
  this.state = attributes.state;
  $("<li id='card-" + this.getId() + "'>" + this.getType() + "</li>").appendTo("#cards ul");
};
