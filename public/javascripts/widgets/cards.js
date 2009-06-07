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

$.widget("ui.cards", {
    _init: function() {
        this.element.addClass("ui-widget ui-cards");
        this.cards = $("<ul/>").appendTo(this.element);
    },

    update: function(attributes) {
        var that = this;
        this.cards.empty();
        this.options.cardPlayed = attributes.cardPlayed;
        $.each(attributes.cards, function(key, value) {
            var li = $("<li/>").appendTo(that.cards);
            var a = $("<a/>").appendTo(li).attr("href", "").text(value.type);
            a.click(function(event) {
                if(value.state === "untapped" && that.options.cardPlayed === false) {
                    that._trigger("played", event, [value]);
                }
                return false;
            });
            if(value.state !== "untapped") {
                a.addClass("ui-disabled");
            }
        });
    }
});
