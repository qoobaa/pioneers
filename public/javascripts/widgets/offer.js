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

$.widget("ui.offer", {
    _init: function() {
        var that = this;
        this.element.addClass("ui-offer ui-widget");

        var ul = $("<ul/>").appendTo(this.element);
        var li;

        $.each(this.options.resourceTypes, function(key, value) {
            li = $("<li/>").appendTo(ul).text(value);
            that[value] = $("<div/>").appendTo(li).addClass("ui-offer-" + value).resource({ step: 1, max: 99, min: -that.options[value], value: 0 });
        });

        li = $("<li/>").appendTo(ul);
        this.accept = $("<a/>").appendTo(li).attr("href", "").addClass("ui-offer-accept ui-state-disabled").text("accept").click(function(event) {
            if(that._isValid()) {
                var values = $.map(that.options.resourceTypes, function(resource) {
                    return that[resource].resource("value");
                });
                that._trigger("accept", event, values);
                that._reset();
            }
            return false;
        });

        this.element.find(".ui-resource").bind("resourcechange", function() {
            if(that._isValid()) {
                that.accept.removeClass("ui-state-disabled");
            } else {
                that.accept.addClass("ui-state-disabled");
            }
        });
    },

    resources: function(resources) {
        var that = this;
        $.each(this.options.resourceTypes, function(key, value) {
            if(resources[value]) {
                that.options[value] = resources[value];
                that[value].resource("min", -resources[value]);
            }
        });
        this._reset();
    },

    _reset: function() {
        var that = this;
        $.each(this.options.resourceTypes, function(key, value) {
            that[value].resource("value", 0);
        });
    },

    _isValid: function() {
        var that = this;
        var negative = false, positive = false;
        $.each(this.options.resourceTypes, function(key, value) {
            var resources = that[value].resource("value");
            if(resources < 0) {
                negative = true;
            }
            if(resources > 0) {
                positive = true;
            }
        });
        return positive && negative;
    }
});

$.extend($.ui.offer, {
    defaults: {
        resourceTypes: ["bricks", "grain", "lumber", "ore", "wool"]
    }
});
