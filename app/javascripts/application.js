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

YUI().use("io-base", "json-parse", "game", "overlay", function(Y) {
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
});
