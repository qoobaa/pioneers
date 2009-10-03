// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or
// modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of
// the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public
// License along with this program.  If not, see
// <http://www.gnu.org/licenses/>.

YUI.add("pioneers-player", function(Y) {
    var pioneers = Y.namespace("pioneers"),
        PLAYER = "pioneers-player",
        augment = Y.augment,
        Attribute = Y.Attribute,
        merge = Y.merge,
        extend = Y.extend,
        Base = Y.Base,
        map = Y.Array.map,
        each = Y.Array.each,
        filter = Y.Array.filter,
        Hex = pioneers.Hex,
        Edge = pioneers.Edge,
        Node = pioneers.Node;

    var Player = function() {
        pioneers.Player.superclass.constructor.apply(this, arguments);
    };

    Player.NAME = PLAYER;

    Player.ATTRS =  {
        number: {
            writeOnce: true
        },
        state: {
        },
        name: {
            writeOnce: true
        },
        cards: {
        },
        points: {
        },
        bricks: {
        },
        bricksRate: {
        },
        grain: {
        },
        grainRate: {
        },
        lumber: {
        },
        lumberRate: {
        },
        ore: {
        },
        oreRate: {
        },
        wool: {
        },
        woolRate: {
        },
        settlements: {
        },
        cities: {
        },
        roads: {
        },
        resources: {
        }
    };

    extend(Player, Base, {

    });

    pioneers.Player = Player;

}, '0.0.1', { requires: ["base"] });
