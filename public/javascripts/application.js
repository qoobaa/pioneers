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
        requires: ["widget"]
    },
    "after-roll": {
        fullpath: "/javascripts/after-roll.js",
        requires: ["widget"]
    },
    "board": {
        fullpath: "/javascripts/board.js",
        requires: ["widget", "pioneers-board"]
    },
    "players": {
        fullpath: "/javascripts/players.js",
        requires: ["widget"]
    },
    "user-player": {
        fullpath: "/javascripts/user-player.js",
        requires: ["widget"]
    },
    "join": {
        fullpath: "/javascripts/join.js",
        requires: ["widget"]
    },
    "game": {
        fullpath: "/javascripts/game.js",
        requires: ["widget", "pioneers-game", "board", "exchange", "discard", "offer", "build", "cards", "before-roll", "after-roll", "io-base", "json-parse", "players", "game-status", "offer-sent", "offer-received", "user-player", "join"]
    },
    "game-status": {
        fullpath: "/javascripts/game-status.js",
        requires: ["widget"]
    },
    "offer-sent": {
        fullpath: "/javascripts/offer-sent.js",
        requires: ["widget", "pioneers-offer"]
    },
    "offer-received": {
        fullpath: "/javascripts/offer-received.js",
        requires: ["widget", "pioneers-offer"]
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
        requires: ["base", "pioneers-board", "pioneers-player", "pioneers-offer"]
    },
    "pioneers-player": {
        fullpath: "/javascripts/pioneers/player.js",
        requires: ["base"]
    },
    "pioneers-offer": {
        fullpath: "/javascripts/pioneers/offer.js",
        requires: ["base"]
    }
}
    }).use("io-base", "json-parse", "game", "overlay", function(Y) {
        // temporary for testing purposes
        window.Y = Y;

        var parse = Y.JSON.parse,
            io = Y.io,
            pathname = document.location.pathname;



        if(pathname.match(/^\/games\/\d+$/)) {
            function success(id, response) {
                var gameAttributes = parse(response.responseText),
                    gameObject = new Y.pioneers.Game(gameAttributes);

                game = new Y.Game({ game: gameObject });

                game.render();
            };

            var request = io(pathname + ".json", { on: { success: success } });
        }


        var overlay = new Y.Overlay();
        overlay.render();
});
