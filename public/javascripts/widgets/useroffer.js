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

$.widget("ui.useroffer", {
    _init: function() {
        var that = this;
        this.element.addClass("ui-useroffer ui-widget");

        this.responses = $("<dl/>").appendTo(this.element);

        var dl = $("<dl/>").appendTo(this.element);

        $.each(this.options.resourceTypes, function(key, value) {
            $("<dt/>").appendTo(dl).text(value);
            that[value] = $("<dd/>").appendTo(dl);
        });

        $("<a/>").appendTo(this.element).attr("href", "").text("cancel").click(function(event) {
            that._trigger("cancelled", event);
            return false;
        });

        this._refresh();
    },

    offer: function(offer) {
        var that = this;
        $.each(this.options.resourceTypes, function(key, value) {
            that.options[value] = offer[value];
        });
        this.responses.empty();
        this._refresh();
    },

    response: function(response) {
        var that = this;
        $("<dt/>").appendTo(this.responses).text("player " + response.player);
        var dd = $("<dd/>").appendTo(this.responses);
        if(response.agreed) {
            $("<a/>").appendTo(dd).attr("href", "").text("accepted").click(function(event) {
                that._trigger("accepted", event, [response.player]);
                return false;
            });
        } else {
            dd.text("declined");
        }
    },

    _refresh: function() {
        var that = this;
        $.each(this.options.resourceTypes, function(key, value) {
            that[value].text(that.options[value]);
        });
    }
});

$.extend($.ui.useroffer, {
    defaults: {
        resourceTypes: ["bricks", "grain", "lumber", "ore", "wool"]
    }
});
