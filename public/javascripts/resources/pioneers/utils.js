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
Pioneers.utils = Pioneers.utils || {};

Pioneers.utils.makeArray2D = function(sizeOrHeight, nothingOrWidth) {
  var height = (arguments.length == 1) ? sizeOrHeight[0] : sizeOrHeight;
  var width = (arguments.length == 1) ? sizeOrHeight[1] : nothingOrWidth;
  var array = new Array(height);
  for(var row = 0; row < 10; row++) {
    array[row] = new Array(width);
  }
  return array;
};
