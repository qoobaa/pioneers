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

$.widget("ui.build", {
    _init: function() {
        $(this.element).addClass("ui-widget ui-build");
        var that = this;

        var div = $("<div/>").appendTo(this.element);
        var ul = $("<ul/>").appendTo(div);
        var li;

        li = $("<li/>").appendTo(ul);
        $("<a/>").appendTo(li).attr("href", "").addClass("settlement").text("Settlement").click(function(event) {
            if(!that.options.disabled && that._isSettlementEnabled()) {
                that._trigger("settlementclick", event);
            }
            return false;
        });

        li = $("<li/>").appendTo(ul);
        $("<a/>").appendTo(li).attr("href", "").addClass("city").text("City").click(function(event) {
            if(!that.options.disabled && that._isCityEnabled()) {
                that._trigger("cityclick", event);
            }
            return false;
        });

        li = $("<li/>").appendTo(ul);
        $("<a/>").appendTo(li).attr("href", "").addClass("road").text("Road").click(function(event) {
            if(!that.options.disabled && that._isRoadEnabled()) {
                that._trigger("roadclick", event);
            }
            return false;
        });

        li = $("<li/>").appendTo(ul);
        $("<a/>").appendTo(li).attr("href", "").addClass("card").text("Card").click(function(event) {
            if(!that.options.disabled && that._isCardEnabled()) {
                that._trigger("cardclick", event);
            }
            return false;
        });
    },

    resources: function(resources) {
        var that = this;
        $.each(resources, function(key, value) {
            that.options[key] = resources[key];
        });
    },

    _isSettlementEnabled: function() {
        return this.options.bricks > 0 && this.options.grain > 0 && this.options.lumber > 0 && this.options.wool > 0 && this.options.settlements > 0;
    },

    _isCityEnabled: function() {
        return this.options.grain > 1 && this.options.ore > 2 && this.options.cities > 0;
    },

    _isRoadEnabled: function() {
        return this.options.bricks > 0 && this.options.lumber > 0 && this.options.roads > 0;
    },

    _isCardEnabled: function() {
        return this.options.grain > 0 && this.options.ore > 0 && this.options.wool > 0 && this.options.cards > 0;
    }
});
