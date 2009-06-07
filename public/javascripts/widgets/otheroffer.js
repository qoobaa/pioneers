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

$.widget("ui.otheroffer", {
    _init: function() {
        var that = this;
        this.element.addClass("ui-otheroffer ui-widget");

        var dl = $("<dl/>").appendTo(this.element);

        $.each(this.options.resourceTypes, function(key, value) {
            $("<dt/>").appendTo(dl).text(value);
            that[value] = $("<dd/>").appendTo(dl);
        });

        this.decline = $("<a/>").appendTo(this.element).attr("href", "").text("decline").click(function(event) {
            that._trigger("declined", event);
            return false;
        });

        this.accept = $("<a/>").appendTo(this.element).attr("href", "").text("accept").click(function(event) {
            if(that._isAcceptable()) {
                that._trigger("accepted", event);
            }
            return false;
        });

        this.options.resources = {};
        this._refresh();
    },

    resources: function(resources) {
        var that = this;
        $.each(this.options.resourceTypes, function(key, value) {
            if(resources[value] !== undefined) {
                that.options.resources[value] = resources[value];
            }
        });
        this._refresh();
    },

    offer: function(offer) {
        var that = this;
        $.each(this.options.resourceTypes, function(key, value) {
            that.options[value] = offer[value];
        });
        this._refresh();
    },

    _refresh: function() {
        var that = this;
        $.each(this.options.resourceTypes, function(key, value) {
            that[value].text(that.options[value]);
        });
        if(this._isAcceptable()) {
            this.accept.removeClass("ui-disabled");
        } else {
            this.accept.addClass("ui-disabled");
        }
    },

    _isAcceptable: function() {
        var that = this;
        var acceptable = true;
        $.each(this.options.resourceTypes, function(key, value) {
            acceptable = acceptable && (that.options.resources[value] - that.options[value] >= 0);
        });
        return acceptable;
    }
});

$.extend($.ui.otheroffer, {
    defaults: {
        resourceTypes: ["bricks", "grain", "lumber", "ore", "wool"]
    }
});
