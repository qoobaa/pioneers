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
    _init: function() {
        var that = this;
        this.element.addClass("ui-discard ui-widget");

        var ul = $("<ul/>").appendTo(this.element);
        var li;

        li = $("<li/>").appendTo(ul).text("Bricks");
        this.bricks = $("<div/>").addClass("ui-discard-bricks").appendTo(li).resource({ step: 1, max: 0, min: -this.options.bricks, value: 0 });
        li = $("<li/>").appendTo(ul).text("Grain");
        this.grain = $("<div/>").addClass("ui-discard-grain").appendTo(li).resource({ step: 1, max: 0, min: -this.options.grain, value: 0 });
        li = $("<li/>").appendTo(ul).text("Lumber");
        this.lumber = $("<div/>").addClass("ui-discard-lumber").appendTo(li).resource({ step: 1, max: 0, min: -this.options.lumber, value: 0 });
        li = $("<li/>").appendTo(ul).text("Ore");
        this.ore = $("<div/>").addClass("ui-discard-ore").appendTo(li).resource({ step: 1, max: 0, min: -this.options.ore, value: 0 });
        li = $("<li/>").appendTo(ul).text("Wool");
        this.wool = $("<div/>").addClass("ui-discard-wool").appendTo(li).resource({ step: 1, max: 0, min: -this.options.wool, value: 0 });
        li = $("<li/>").appendTo(ul);

        this.accept = $("<a/>").attr("href", "").addClass("ui-discard-accept ui-state-disabled").text("Accept").appendTo(li).click(function(event) {
            if(!$(event.target).hasClass("ui-state-disabled")) {
                var values = $.map(["bricks", "grain", "lumber", "ore", "wool"], function(resource) {
                    return that[resource].resource("value");
                });
                that._trigger("accept", event, values);
                that._reset();
            }
            return false;
        });

        this.element.find(".ui-resource").bind("resourcechange", function() {
            if(that._isLimitReached()) {
                that.accept.removeClass("ui-state-disabled");
            } else {
                that.accept.addClass("ui-state-disabled");
            }
        });
    },

    bricks: function(bricks) {
        this.options.bricks = bricks;
        this._reset();
    },

    grain: function(grain) {
        this.options.grain = grain;
        this._reset();
    },

    lumber: function(lumber) {
        this.options.lumber = lumber;
        this._reset();
    },

    ore: function(ore) {
        this.options.ore = ore;
        this._reset();
    },

    wool: function(wool) {
        this.options.wool = wool;
        this._reset();
    },

    limit: function(limit) {
        this.options.limit = limit;
        this._reset();
    },

    _reset: function() {
        this.bricks.resource("value", 0);
        this.grain.resource("value", 0);
        this.lumber.resource("value", 0);
        this.ore.resource("value", 0);
        this.wool.resource("value", 0);
    },

    _isLimitReached: function() {
        var discarded =
            this.bricks.resource("value") +
            this.grain.resource("value") +
            this.lumber.resource("value") +
            this.ore.resource("value") +
            this.wool.resource("value");
        var resources =
            this.options.bricks +
            this.options.grain +
            this.options.lumber +
            this.options.ore +
            this.options.wool;
        return this.options.limit === resources + discarded;
    }
});
