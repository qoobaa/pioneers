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

$.widget("ui.beforeroll", {
    _init: function() {
        $(this.element).addClass("ui-widget ui-beforeroll");
        var that = this;

        var div = $("<div/>").appendTo(this.element);
        var ul = $("<ul/>").appendTo(div);
        var li;

        li = $("<li/>").appendTo(ul);
        this.playArmyCard = $("<a/>").appendTo(li).attr("href", "").addClass("play-army-card").text("play army card").click(function(event) {
            if(that._isPlayArmyCardEnabled()) {
                that._trigger("armycardplayed", event, [that.options.card]);
            }
            return false;
        });

        li = $("<li/>").appendTo(ul);
        this.rollDice = $("<a/>").appendTo(li).attr("href", "").addClass("roll-dice").text("roll dice").click(function(event) {
            that._trigger("dicerolled", event);
            return false;
        });
    },

    update: function(attributes) {
        var that = this;
        this.options.card = $.grep(attributes.cards, function(card) {
            return card.type === "Card::Army" && card.state === "untapped" ? card : undefined;
        })[0];
        if(this._isPlayArmyCardEnabled()) {
            this.playArmyCard.removeClass("ui-disabled");
        } else {
            this.playArmyCard.addClass("ui-disabled");
        }
    },

    _isPlayArmyCardEnabled: function() {
        return this.options.card !== undefined;
    }
});
