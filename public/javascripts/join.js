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
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        BUTTON_TEMPLATE = '<button type="button"></button>',
        C_LABEL = getCN(JOIN, "label"),
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
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
                    join: ""
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

        },

        _afterDisabledChange: function(event) {
            this.syncUI();
        },

        syncUI: function() {
            this._uiSyncButtons(this.get("resources"));
        },

        _uiSyncButtons: function(resources) {
            this.settlementNode.set("disabled", !this._isSettlementEnabled(resources));
        },

        _renderButtons: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var card = this._createButton(strings.card, C_CARD);
            this.cardNode = contentBox.appendChild(card);
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", strings.label);

            this.labelNode = contentBox.appendChild(label);
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
