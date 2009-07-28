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
    "board": {
        fullpath: "/javascripts/board.js",
        requires: ["widget", "pioneers-board"]
    },
    "game": {
        fullpath: "/javascripts/game.js",
        requires: ["widget", "pioneers-game", "board", "exchange", "discard", "offer", "build", "cards", "before-roll"]
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
    },
    "pioneers-game": {
        fullpath: "/javascripts/pioneers/game.js",
        requires: ["base", "pioneers-board", "pioneers-player"]
    },
    "pioneers-player": {
        fullpath: "/javascripts/pioneers/player.js",
        requires: ["base"]
    }
}
    }).use("io-base", "json-parse", "game", function(Y) {
        // temporary for testing purposes
        window.Y = Y;

        var parse = Y.JSON.parse,
            io = Y.io,
            later = Y.later,
            uri = "/games/1.json",
            initialized = false;

        function complete(id, response) {
            gameAttributes = parse(response.responseText);
            if(initialized) {
                // game.setAttrs(gameAttributes.game);
                // gameWidget.syncUI();
            } else {
                game = new Y.pioneers.Game(gameAttributes.game);
                gameWidget = new Y.Game({ game: game });
                gameWidget.render();
                // initialized = true;
                // later(5000, this, function() {
                //     io(uri);
                // }, null, false);
            }
        };

        Y.on('io:complete', complete, this);

        var request = io(uri);
});
