YUI({ modules: {
         "resource-spinner": {
             type: "js",
             fullpath: "/javascripts/resource-spinner.js",
             requires: ["widget"]
         },
         "resources": {
             type: "js",
             fullpath: "/javascripts/resources.js",
             requires: ["widget", "resource-spinner"]
         },
         "exchange": {
             type: "js",
             fullpath: "/javascripts/exchange.js",
             requires: ["resources"]
         },
         "discard": {
             type: "js",
             fullpath: "/javascripts/discard.js",
             requires: ["resources"]
         },
         "offer": {
             type: "js",
             fullpath: "/javascripts/offer.js",
             requires: ["resources"]
         }
      }
    }).use("exchange", "discard", "offer", function(Y) {
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
});
