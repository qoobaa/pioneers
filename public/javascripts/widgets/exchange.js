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

$.widget("ui.exchange", {
    _init: function() {
        var that = this;
        this.element.addClass("ui-exchange ui-widget");

        var ul = $("<ul/>").appendTo(this.element);
        var li;

        $.each(this.options.resourceTypes, function(key, value) {
            li = $("<li/>").appendTo(ul).text(value);
            that[value] = $("<div/>").appendTo(li).addClass("ui-exchange-" + value).resource({ step: that.options[value + "Rate"], max: 99, min: -that.options[value], value: 0 });
        });

        li = $("<li/>").appendTo(ul);
        this.accept = $("<a/>").appendTo(li).attr("href", "").addClass("ui-exchange-accept ui-state-disabled").text("accept").click(function(event) {
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
            if(resources[value] !== undefined) {
                that.options[value] = resources[value];
                that[value].resource("min", -resources[value]);
            }
            var rate = resources[value + "Rate"];
            if(rate !== undefined) {
                that.options[value + "Rate"] = rate;
                that[value].resource("step", rate);
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
        var given = 0, wanted = 0;
        $.each(this.options.resourceTypes, function(key, value) {
            var resources = that[value].resource("value");
            var rate = that.options[value + "Rate"];
            if(resources < 0) {
                given += -resources / rate;
            } else if (resources > 0) {
                wanted += resources;
            }
        });
        return given === wanted && given > 0;
    }
});

$.extend($.ui.exchange, {
    defaults: {
        resourceTypes: ["bricks", "grain", "lumber", "ore", "wool"]
    }
});
