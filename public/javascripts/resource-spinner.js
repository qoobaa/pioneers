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

// Filters added to this controller apply to all controllers in the
// application.  Likewise, all the methods added will be available for
// all controllers.

YUI.add('resource-spinner', function(Y) {
    var RESOURCE_SPINNER = "resource-spinner",
        CONTENT_BOX = "contentBox",
        INPUT_CLASS = Y.ClassNameManager.getClassName(RESOURCE_SPINNER, "value"),
        INPUT_TEMPLATE = '<input type="text" class="' + INPUT_CLASS + '">',
        BUTTON_TEMPLATE = '<button type="button"></button>',
        Widget = Y.Widget,
        Node = Y.Node,
        isNumber = Y.Lang.isNumber,
        bind = Y.bind;

    function ResourceSpinner() {
        ResourceSpinner.superclass.constructor.apply(this, arguments);
    }

    Y.mix(ResourceSpinner, {
        NAME: RESOURCE_SPINNER,
        ATTRS: {
            min: {
                value: -19
            },
            max: {
                value: 19
            },
            value: {
                value: 0,
                validator: function(value) {
                    return this._validateValue(value);
                }
            },
            step: {
                value: 4
            },

            strings: {
                value: {
                    increment: "Increment",
                    decrement: "Decrement"
                }
            }
        }
    });

    Y.extend(ResourceSpinner, Widget, {
        initializer: function() {

        },

        destructor: function() {

        },

        renderUI: function() {
            this._renderDecrementButton();
            this._renderInput();
            this._renderIncrementButton();
        },

        bindUI: function() {
            this.after("valueChange", this._afterValueChange);

            Y.on("click", bind(this._onDecrementClick, this), this.decrementNode);
            Y.on("click", bind(this._onIncrementClick, this), this.incrementNode);
            Y.on("change", bind(this._onInputChange, this));
        },

        _onDecrementClick: function(event) {
            var value = this.get("value"),
                step = this.get("step");
            if(value > 0) {
                this.set("value", value - 1);
            } else {
                this.set("value", value - step);
            }
            this._syncUI();
        },

        _onIncrementClick: function(event) {
            var value = this.get("value"),
                step = this.get("step");
            if(value >= 0) {
                this.set("value", value + 1);
            } else {
                this.set("value", value + step);
            }
            this._syncUI();
        },

        _onInputChange: function(event) {
            if(!this._validateValue(this.inputNode.get("value"))) {
                this.syncUI();
            }
        },

        _afterValueChange: function(event) {
            this._uiSetValue(event.newVal);
        },

        syncUI : function() {
            this._uiSetValue(this.get("value"));
        },

        _renderInput : function() {
            var contentBox = this.get(CONTENT_BOX),
                input = contentBox.query("." + INPUT_CLASS),
                strings = this.get("strings");

            if(!input) {
                input = Node.create(INPUT_TEMPLATE);
                contentBox.appendChild(input);
            }

            this.inputNode = input;
        },

        _renderDecrementButton : function() {
            var contentBox = this.get("contentBox"),
                strings = this.get("strings");

            var decrement = this._createButton(strings.decrement, this.getClassName("decrement"));

            this.decrementNode = contentBox.appendChild(decrement);
        },

        _renderIncrementButton : function() {
            var contentBox = this.get("contentBox"),
                strings = this.get("strings");

            var increment = this._createButton(strings.increment, this.getClassName("increment"));

            this.incrementNode = contentBox.appendChild(increment);
        },

        _createButton : function(text, className) {
            var button = Node.create(BUTTON_TEMPLATE);

            button.set("innerHTML", text);
            button.set("title", text);
            button.addClass(className);

            return button;
        },

        _uiSetValue : function(value) {
            this.inputNode.set("value", value);
        },

        _validateValue: function(value) {
            var min = this.get("min"),
                max = this.get("max");

            return (isNumber(value) && value >= min && value <= max && this._followsStep(value));
        },

        _followsStep: function(value) {
            var step = this.get("step");

            if(value < 0) {
                return value % step === 0;
            }
            return true;
        }
    });

    Y.ResourceSpinner = ResourceSpinner;

}, '3.0.0b1', { requires: ["widget"] });


