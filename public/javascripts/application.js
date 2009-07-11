YUI({ modules: {
    "resource-spinner": {
        fullpath: "/javascripts/resource-spinner.js",
        requires: ["widget"]
    },
    "resources": {
        fullpath: "/javascripts/resources.js",
        requires: ["widget", "resource-spinner"]
    },
    "exchange": {
        fullpath: "/javascripts/exchange.js",
        requires: ["resources"]
    },
    "discard": {
        fullpath: "/javascripts/discard.js",
        requires: ["resources"]
    },
    "offer": {
        fullpath: "/javascripts/offer.js",
        requires: ["resources"]
    },
    "build": {
        fullpath: "/javascripts/build.js",
        requires: ["widget"]
    },
    "year-of-plenty": {
        fullpath: "/javascripts/year-of-plenty.js",
        requires: ["resources"]
    },
    "monopoly": {
        fullpath: "/javascripts/monopoly.js",
        requires: ["widget"]
    },
    "cards": {
        fullpath: "/javascripts/cards.js",
        requires: ["year-of-plenty", "monopoly"]
    },
    "before-roll": {
        fullpath: "/javascripts/before-roll.js",
        requires: ["widget", "collection"]
    },
    "pioneers-board": {
        fullpath: "/javascripts/pioneers/board.js",
        requires: ["base", "collection", "pioneers-hex", "pioneers-node", "pioneers-edge"]
    },
    "pioneers-hex": {
        fullpath: "/javascripts/pioneers/hex.js",
        requires: ["base", "collection", "pioneers-position"]
    },
    "pioneers-node": {
        fullpath: "/javascripts/pioneers/node.js",
        requires: ["base", "collection", "pioneers-position"]
    },
    "pioneers-edge": {
        fullpath: "/javascripts/pioneers/edge.js",
        requires: ["base", "collection", "pioneers-position"]
    },
    "pioneers-position": {
        fullpath: "/javascripts/pioneers/position.js",
        requires: ["collection"]
    }
}
    }).use("exchange", "discard", "offer", "build", "year-of-plenty", "monopoly", "cards", "before-roll", "pioneers-board", function(Y) {
        window.Y = Y;

        game = {"id": 1, "cardPlayed": false, "discardPlayer": 0, "discardLimit": 0, "phase": "before_roll", "player": 1, "roll": null, "state": "playing", "turn": 41, "winner": null, "cards": 18, "players": [{"number": 1, "state": "ready", "name": "alice", "cards": 6, "points": 4, "resources": 4, "bricks": 2, "bricksRate": 4, "grain": 0, "grainRate": 4, "lumber": 0, "lumberRate": 4, "ore": 0, "oreRate": 4, "wool": 2, "woolRate": 4, "settlements": 1, "cities": 5, "roads": 7}, {"number": 2, "state": "ready", "name": "bob", "cards": 1, "points": 4, "resources": 3, "bricks": 2, "bricksRate": 4, "grain": 0, "grainRate": 4, "lumber": 0, "lumberRate": 4, "ore": 1, "oreRate": 4, "wool": 0, "woolRate": 4, "settlements": 1, "cities": 5, "roads": 11}], "board": {"nodes": [{"position": [5, 8], "player": 1, "state": "city", "id": 1}, {"position": [3, 6], "player": 2, "state": "city", "id": 2}, {"position": [3, 11], "player": 2, "state": "city", "id": 3}, {"position": [4, 5], "player": 1, "state": "city", "id": 4}, {"position": [4, 3], "player": 1, "state": "city", "id": 5}, {"position": [5, 6], "player": 1, "state": "city", "id": 6}], "hexes": [{"position": [0, 3], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [0, 4], "roll": null, "type": "sea", "harborPosition": 4, "harborType": "generic"}, {"position": [0, 5], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [0, 6], "roll": null, "type": "sea", "harborPosition": 3, "harborType": "generic"}, {"position": [1, 2], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [1, 3], "roll": 5, "type": "hill", "harborPosition": null, "harborType": null}, {"position": [1, 4], "roll": 2, "type": "mountain", "harborPosition": null, "harborType": null}, {"position": [1, 5], "roll": 6, "type": "field", "harborPosition": null, "harborType": null}, {"position": [1, 6], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [2, 1], "roll": null, "type": "sea", "harborPosition": 5, "harborType": "lumber"}, {"position": [2, 2], "roll": 10, "type": "forest", "harborPosition": null, "harborType": null}, {"position": [2, 3], "roll": 9, "type": "pasture", "harborPosition": null, "harborType": null}, {"position": [2, 4], "roll": null, "type": "desert", "harborPosition": null, "harborType": null}, {"position": [2, 5], "roll": 3, "type": "hill", "harborPosition": null, "harborType": null}, {"position": [2, 6], "roll": null, "type": "sea", "harborPosition": 2, "harborType": "wool"}, {"position": [3, 0], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [3, 1], "roll": 8, "type": "pasture", "harborPosition": null, "harborType": null}, {"position": [3, 2], "roll": 3, "type": "hill", "harborPosition": null, "harborType": null}, {"position": [3, 3], "roll": 11, "type": "pasture", "harborPosition": null, "harborType": null}, {"position": [3, 4], "roll": 4, "type": "forest", "harborPosition": null, "harborType": null}, {"position": [3, 5], "roll": 8, "type": "mountain", "harborPosition": null, "harborType": null}, {"position": [3, 6], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [4, 0], "roll": null, "type": "sea", "harborPosition": 5, "harborType": "bricks"}, {"position": [4, 1], "roll": 4, "type": "field", "harborPosition": null, "harborType": null}, {"position": [4, 2], "roll": 6, "type": "mountain", "harborPosition": null, "harborType": null}, {"position": [4, 3], "roll": 5, "type": "field", "harborPosition": null, "harborType": null}, {"position": [4, 4], "roll": 10, "type": "forest", "harborPosition": null, "harborType": null}, {"position": [4, 5], "roll": null, "type": "sea", "harborPosition": 2, "harborType": "ore"}, {"position": [5, 0], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [5, 1], "roll": 11, "type": "forest", "harborPosition": null, "harborType": null}, {"position": [5, 2], "roll": 12, "type": "field", "harborPosition": null, "harborType": null}, {"position": [5, 3], "roll": 9, "type": "pasture", "harborPosition": null, "harborType": null}, {"position": [5, 4], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [6, 0], "roll": null, "type": "sea", "harborPosition": 0, "harborType": "generic"}, {"position": [6, 1], "roll": null, "type": "sea", "harborPosition": 0, "harborType": "grain"}, {"position": [6, 2], "roll": null, "type": "sea", "harborPosition": null, "harborType": null}, {"position": [6, 3], "roll": null, "type": "sea", "harborPosition": 1, "harborType": "generic"}], "edges": [{"position": [5, 13], "player": 1}, {"position": [3, 11], "player": 2}, {"position": [3, 17], "player": 2}, {"position": [4, 8], "player": 1}, {"position": [4, 7], "player": 1}, {"position": [3, 16], "player": 2}, {"position": [5, 11], "player": 1}, {"position": [3, 14], "player": 2}, {"position": [5, 10], "player": 1}, {"position": [5, 8], "player": 1}, {"position": [4, 9], "player": 1}, {"position": [5, 14], "player": 1}], "size": [7, 7], "robberPosition": [4, 2]}};

        // exchange = new Y.Exchange();
        // exchange.render();
        // exchange.after("valueChange", function(event) {
        //     console.log(event.newVal);
        // });
        // discard = new Y.Discard();
        // discard.render();
        // discard.after("valueChange", function(event) {
        //     console.log(event.newVal);
        // });
        // offer = new Y.Offer();
        // offer.render();
        // offer.after("valueChange", function(event) {
        //     console.log(event.newVal);
        // });
        // // yearOfPlenty = new Y.YearOfPlenty();
        // // yearOfPlenty.render();
        // // yearOfPlenty.after("valueChange", function(event) {
        // //     console.log(event.newVal);
        // // });
        // build = new Y.Build();
        // build.render();
        // build.after("road", function() { console.log("road"); });
        // build.after("settlement", function() { console.log("settlement"); });
        // build.after("city", function() { console.log("city"); });
        // build.after("card", function() { console.log("card"); });
        // // monopoly = new Y.Monopoly();
        // // monopoly.render();
        // // monopoly.after("bricks", function() { console.log("bricks"); });
        // // monopoly.after("grain", function() { console.log("grain"); });
        // // monopoly.after("lumber", function() { console.log("lumber"); });
        // // monopoly.after("ore", function() { console.log("ore"); });
        // // monopoly.after("wool", function() { console.log("wool"); });
        // cards = new Y.Cards();
        // cards.render();
        // cards.after("card", function(event, card) {
        //     console.log(event.details[0]);
        // });
        // beforeRoll = new Y.BeforeRoll();
        // beforeRoll.render();
        // beforeRoll.after("roll", function(event) {
        //     console.log("roll");
        // });
        // beforeRoll.after("card", function(event, card) {
        //     console.log(event.details[0]);
        // });

        // Foo = function() {

        // };

        // Foo.prototype.add = function() {
        //     return this.one() + this.two();
        // };

        // Bar = function() {

        // };

        // Bar.prototype.one = function() {
        //     return 1;
        // };

        // Bar.prototype.two = function() {
        //     return 2;
        // };

        // Y.augment(Bar, Foo);
});
