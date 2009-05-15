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

$.widget("ui.userPlayer", {

    _init: function() {
        $(this.element).addClass("player");

        var playerDl = $("<dl/>").appendTo(this.element);
        $("<dt/>").appendTo(playerDl).text("Bricks");
        $("<dd/>").appendTo(playerDl).addClass("bricks");
        $("<dt/>").appendTo(playerDl).text("Grain");
        $("<dd/>").appendTo(playerDl).addClass("grain");
        $("<dt/>").appendTo(playerDl).text("Lumber");
        $("<dd/>").appendTo(playerDl).addClass("lumber");
        $("<dt/>").appendTo(playerDl).text("Ore");
        $("<dd/>").appendTo(playerDl).addClass("ore");
        $("<dt/>").appendTo(playerDl).text("Wool");
        $("<dd/>").appendTo(playerDl).addClass("wool");
        $("<dt/>").appendTo(playerDl).text("Settlements");
        $("<dd/>").appendTo(playerDl).addClass("settlements");
        $("<dt/>").appendTo(playerDl).text("Cities");
        $("<dd/>").appendTo(playerDl).addClass("cities");
        $("<dt/>").appendTo(playerDl).text("Roads");
        $("<dd/>").appendTo(playerDl).addClass("roads");

        this._refreshBricks();
        this._refreshGrain();
        this._refreshLumber();
        this._refreshOre();
        this._refreshWool();
        this._refreshSettlements();
        this._refreshCities();
        this._refreshRoads();
    },

    _refreshBricks: function(highlight) {
        var bricks = $(this.element).find(".bricks").text(this.getBricks());
        if(highlight) bricks.effect("highlight");
    },

    _refreshGrain: function(highlight) {
        var grain = $(this.element).find(".grain").text(this.getGrain());
        if(highlight) grain.effect("highlight");
    },

    _refreshLumber: function(highlight) {
        var lumber = $(this.element).find(".lumber").text(this.getLumber());
        if(highlight) lumber.effect("highlight");
    },

    _refreshOre: function(highlight) {
        var ore = $(this.element).find(".ore").text(this.getOre());
        if(highlight) ore.effect("highlight");
    },

    _refreshWool: function(highlight) {
        var wool = $(this.element).find(".wool").text(this.getWool());
        if(highlight) wool.effect("highlight");
    },

    _refreshSettlements: function(highlight) {
        var settlements = $(this.element).find(".settlements").text(this.getSettlements());
        if(highlight) settlements.effect("highlight");
    },

    _refreshCities: function(highlight) {
        var cities = $(this.element).find(".cities").text(this.getCities());
        if(highlight) cities.effect("highlight");
    },

    _refreshRoads: function(highlight) {
        var roads = $(this.element).find(".roads").text(this.getRoads());
        if(highlight) roads.effect("highlight");
    },

    // getters and setters

    getPlayerNumber: function() {
        return this._getData("playerNumber");
    },

    getSettlements: function() {
        return this._getData("settlements");
    },

    setSettlements: function(settlements) {
        this._setData("settlements", settlements);
    },

    getCities: function() {
        return this._getData("cities");
    },

    setCities: function(cities) {
        this._setData("cities", cities);
    },

    getRoads: function() {
        return this._getData("roads");
    },

    setRoads: function(roads) {
        this._setData("roads", roads);
    },

    getVisiblePoints: function() {
        return this._getData("visiblePoints");
    },

    setVisiblePoints: function(visiblePoints) {
        this._setData("visiblePoints", visiblePoints);
    },

    getHiddenPoints: function() {
        return this._getData("hiddenPoints");
    },

    setHiddenPoints: function(hiddenPoints) {
        this._setData("hiddenPoints", hiddenPoints);
    },

    getBricks: function() {
        return this._getData("bricks");
    },

    setBricks: function(bricks) {
        this._setData("bricks", bricks);
    },

    getBricksExchangeRate: function() {
        return this._getData("bricksExchangeRate");
    },

    setBricksExchangeRate: function(bricksExchangeRate) {
        this._setData("bricksExchangeRate", bricksExchangeRate);
    },

    getGrain: function() {
        return this._getData("grain");
    },

    setGrain: function(grain) {
        this._setData("grain", grain);
    },

    getGrainExchangeRate: function() {
        return this._getData("grainExchangeRate");
    },

    setGrainExchangeRate: function(grainExchangeRate) {
        this._setData("grainExchangeRate", grainExchangeRate);
    },

    getLumber: function() {
        return this._getData("lumber");
    },

    setLumber: function(lumber) {
        this._setData("lumber", lumber);
    },

    getLumberExchangeRate: function() {
        return this._getData("lumberExchangeRate");
    },

    setLumberExchangeRate: function(lumberExchangeRate) {
        this._setData("lumberExchangeRate", lumberExchangeRate);
    },

    getOre: function() {
        return this._getData("ore");
    },

    setOre: function(ore) {
        this._setData("ore", ore);
    },

    getOreExchangeRate: function() {
        return this._getData("oreExchangeRate");
    },

    setOreExchangeRate: function(oreExchangeRate) {
        this._setData("oreExchangeRate", oreExchangeRate);
    },

    getWool: function() {
        return this._getData("wool");
    },

    setWool: function(wool) {
        this._setData("wool", wool);
    },

    getWoolExchangeRate: function() {
        return this._getData("woolExchangeRate");
    },

    setWoolExchangeRate: function(woolExchangeRate) {
        this._setData("woolExchangeRate", woolExchangeRate);
    }
});

$.extend($.ui.userPlayer, {
    getter: ["getBricks", "getBricksExchangeRate", "getGrain", "getGrainExchangeRate", "getLumber", "getLumberExchangeRate", "getOre", "getWool", "getWoolExchangeRate"]
    //setter: ["setPoints", "setResources", "setState", "setCards"]
});
