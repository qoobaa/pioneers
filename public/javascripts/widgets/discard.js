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

$.widget("ui.discard", {

    // bglow, limit

    _init: function() {
        this.element.addClass("ui-discard ui-widget");

        this.bricks = $("<div/>").addClass("ui-discard-bricks").appendTo(this.element).resource({ step: 1, max: 0, min: this.options.bricks, value: 0 });
        this.grain = $("<div/>").addClass("ui-discard-grain").appendTo(this.element).resource({ step: 1, max: 0, min: this.options.grain, value: 0 });
        this.lumber = $("<div/>").addClass("ui-discard-lumber").appendTo(this.element).resource({ step: 1, max: 0, min: this.options.lumber, value: 0 });
        this.ore = $("<div/>").addClass("ui-discard-ore").appendTo(this.element).resource({ step: 1, max: 0, min: this.options.ore, value: 0 });
        this.wool = $("<div/>").addClass("ui-discard-wool").appendTo(this.element).resource({ step: 1, max: 0, min: this.options.wool, value: 0 });

        this.accept = $("<a/>").attr("href", "").addClass("ui-discard-accept").text("Accept").appendTo(this.element);
    },

    bricks: function(bricks) {
        this.options.bricks = bricks;
    },

    grain: function(grain) {
        this.options.grain = grain;
    },

    lumber: function(lumber) {
        this.options.lumber = lumber;
    },

    ore: function(ore) {
        this.options.ore = ore;
    },

    wool: function(wool) {
        this.options.wool = wool;
    }
});
