// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or
// modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of
// the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public
// License along with this program.  If not, see
// <http://www.gnu.org/licenses/>.

YUI.add("join", function(Y) {
    var JOIN = "join",
        QUIT = "quit",
        START = "start",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_JOIN = getCN(JOIN, JOIN),
        C_QUIT = getCN(JOIN, QUIT),
        C_START = getCN(JOIN, START),
        C_LABEL = getCN(JOIN, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        FORM_TEMPLATE = '<form method="post"></form>',
        METHOD_TEMPLATE = '<input type="hidden" name="_method"></input>',
        SUBMIT_TEMPLATE = '<input type="submit"></input>',
        Widget = Y.Widget,
        Node = Y.Node,
        isValue = Y.Lang.isValue,
        bind = Y.bind;

    function Join() {
        Join.superclass.constructor.apply(this, arguments);
    }

    Y.mix(Join, {
        NAME: JOIN,
        ATTRS: {
            game: {
            },
            strings: {
                value: {
                    label: "Join",
                    join: "Join",
                    quit: "Quit",
                    start: "Start"
                }
            }
        }
    });

    Y.extend(Join, Widget, {
        renderUI: function() {
            this._renderLabel();
            this._renderButtons();
        },

        bindUI: function() {
            this.after("disabledChange", this._afterDisabledChange);
            this.startNode.after("click", bind(this._afterStartClick, this));
        },

        _afterStartClick: function() {
            this.fire(START);
        },

        _afterDisabledChange: function(event) {
            this.syncUI();
        },

        syncUI: function() {
            this._uiSyncButtons();
        },

        _uiSyncButtons: function() {
            var game = this.get("game"),
                player = game.userPlayer(),
                state = isValue(player) ? player.get("state") : undefined;

            this.joinNode.query("input").set("disabled", isValue(player));
            this.quitNode.query("input").set("disabled", !isValue(player));
            this.startNode.set("disabled", state === "ready");
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings"),
                game = this.get("game"),
                id = game.get("id");

            var join = this._createForm("post", "/games/" + id + "/player", strings.join, C_JOIN);
            this.joinNode = contentBox.appendChild(join);

            var quit = this._createForm("delete", "/games/" + id + "/player", strings.quit, C_QUIT);
            this.quitNode = contentBox.appendChild(quit);

            var start = this._createButton(strings.start, C_START);
            this.startNode = contentBox.appendChild(start);
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", strings.label);

            this.labelNode = contentBox.appendChild(label);
        },

        _createForm: function(method, action, text, className) {
            var form = Y.Node.create(FORM_TEMPLATE),
                submit = Y.Node.create(SUBMIT_TEMPLATE),
                input = Y.Node.create(METHOD_TEMPLATE);


            submit.set("value", text);
            submit.set("title", text);
            submit.addClass(className);

            form.set("action", action);
            form.appendChild(submit);

            if(method !== "post") {
                input.set("value", method);
                form.appendChild(input);
            }

            return form;
        },

        _createButton: function(text, className) {
            var button = Y.Node.create(BUTTON_TEMPLATE);

            button.set("innerHTML", text);
            button.set("title", text);
            button.addClass(className);

            return button;
        }
    });

    Y.Join = Join;

}, '0.0.1', { requires: ["widget"] });
