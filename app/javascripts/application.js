//= require <lib/yui/yui>
//= require <lib/oop/oop>
//= require <lib/event-custom/event-custom>
//= require <lib/io/io-base>
//= require <lib/json/json-parse>
//= require <lib/attribute/attribute>
//= require <lib/event/event-base>
//= require <lib/pluginhost/pluginhost>
//= require <lib/dom/dom>
//= require <lib/node/node>
//= require <lib/event/event-delegate>
//= require <lib/event/event-focus>
//= require <lib/base/base>
//= require <lib/classnamemanager/classnamemanager>
//= require <lib/widget/widget>
//= require <lib/collection/collection>
//= require <lib/widget/widget-position>
//= require <lib/widget/widget-position-ext>
//= require <lib/widget/widget-stack>
//= require <lib/widget/widget-stdmod>
//= require <lib/overlay/overlay>

//= require <pioneers/board>
//= require <pioneers/edge>
//= require <pioneers/game>
//= require <pioneers/hex>
//= require <pioneers/node>
//= require <pioneers/offer>
//= require <pioneers/player>
//= require <pioneers/position>

//= require <widgets/after-roll>
//= require <widgets/before-roll>
//= require <widgets/board>
//= require <widgets/build>
//= require <widgets/cards>
//= require <widgets/discard>
//= require <widgets/exchange>
//= require <widgets/game-status>
//= require <widgets/game>
//= require <widgets/join>
//= require <widgets/monopoly>
//= require <widgets/offer-received>
//= require <widgets/offer-sent>
//= require <widgets/offer>
//= require <widgets/players>
//= require <widgets/resource-spinner>
//= require <widgets/resources>
//= require <widgets/user-player>
//= require <widgets/year-of-plenty>

YUI({
    modules: {
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
        var parse = Y.JSON.parse,
            io = Y.io,
            pathname = document.location.pathname;

        if(pathname.match(/^\/games\/\d+$/)) {
            function success(id, response) {
                var gameAttributes = parse(response.responseText),
                    gameObject = new Y.pioneers.Game(gameAttributes);

                var game = new Y.Game({ game: gameObject });

                game.render();
            };

            var request = io(pathname + ".json", { on: { success: success } });
        }


    // spinner = new Y.ResourceSpinner();
    // spinner.render();

    // overlay = new Y.Overlay({
    //     bodyContent: "body <a href='#'>test</a>",
    //     width: 350,
    //     centered: true
    // });

    // overlay.render();
});
