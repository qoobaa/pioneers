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
        requires: ["resources"]
    },
    "cards": {
        fullpath: "/javascripts/cards.js",
        requires: ["resources", "collection"]
    }
}
    }).use("exchange", "discard", "offer", "build", "year-of-plenty", "monopoly", "cards", function(Y) {
        exchange = new Y.Exchange();
        exchange.render();
        exchange.after("valueChange", function(event) {
            console.log(event.newVal);
        });
        discard = new Y.Discard();
        discard.render();
        discard.after("valueChange", function(event) {
            console.log(event.newVal);
        });
        offer = new Y.Offer();
        offer.render();
        offer.after("valueChange", function(event) {
            console.log(event.newVal);
        });
        yearOfPlenty = new Y.YearOfPlenty();
        yearOfPlenty.render();
        yearOfPlenty.after("valueChange", function(event) {
            console.log(event.newVal);
        });
        build = new Y.Build();
        build.render();
        build.after("road", function() { console.log("road"); });
        build.after("settlement", function() { console.log("settlement"); });
        build.after("city", function() { console.log("city"); });
        build.after("card", function() { console.log("card"); });
        monopoly = new Y.Monopoly();
        monopoly.render();
        monopoly.after("bricks", function() { console.log("bricks"); });
        monopoly.after("grain", function() { console.log("grain"); });
        monopoly.after("lumber", function() { console.log("lumber"); });
        monopoly.after("ore", function() { console.log("ore"); });
        monopoly.after("wool", function() { console.log("wool"); });
        cards = new Y.Cards();
        cards.render();
        cards.after("card", function(event, card) {
            console.log(event.details[0]);
        });
});
