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
});
