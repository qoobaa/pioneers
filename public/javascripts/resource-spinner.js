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

YUI.add("resource-spinner", function(Y) {
    var RESOURCE_SPINNER = "resource-spinner",
        BOUNDING_BOX = "boundingBox",
        CONTENT_BOX = "contentBox",
        getCN = Y.ClassNameManager.getClassName,
        C_INPUT = getCN(RESOURCE_SPINNER, "value"),
        C_LABEL = getCN(RESOURCE_SPINNER, "label"),
        INPUT_TEMPLATE = '<input type="text" class="' + C_INPUT + '">',
        BUTTON_TEMPLATE = '<button type="button"></button>',
        LABEL_TEMPLATE = '<label class="' + C_LABEL + '"></label>',
        isNumber = Y.Lang.isNumber;

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
            label: {
                value: "Resources"
            },
            strings: {
                value: {
                    increment: "+",
                    decrement: "-"
                }
            }
        }
    });

    Y.extend(ResourceSpinner, Y.Widget, {
        renderUI: function() {
            this._renderDecrementButton();
            this._renderInput();
            this._renderIncrementButton();
            this._renderLabel();
        },

        bindUI: function() {
            this.after("disabledChange", this._afterDisabledChange);
            this.after("valueChange", this._afterValueChange);
            this.after("minChange", this._afterMinChange);
            this.after("maxChange", this._afterMaxChange);
            this.after("stepChange", this._afterStepChange);

            Y.on("click", Y.bind(this._onDecrementClick, this), this.decrementNode);
            Y.on("click", Y.bind(this._onIncrementClick, this), this.incrementNode);
            Y.on("change", Y.bind(this._onInputChange, this));
        },

        _afterDisabledChange: function() {
            this.syncUI();
        },

        _onDecrementClick: function(event) {
            var value = this.get("value");
            this.set("value", this._decrementValue(value));
            this._syncUI();
        },

        _decrementValue: function(value) {
            var step = this.get("step");
            if(value > 0) {
                return value - 1;
            } else {
                return value - step;
            }
        },

        _incrementValue: function(value) {
            var step = this.get("step");
            if(value >= 0) {
                return value + 1;
            } else {
                return value + step;
            }
        },

        _onIncrementClick: function(event) {
            var value = this.get("value");
            this.set("value", this._incrementValue(value));
            this._syncUI();
        },

        _onInputChange: function(event) {
            if(!this._validateValue(this.inputNode.get("value"))) {
                this.syncUI();
            }
        },

        _afterValueChange: function(event) {
            this._uiSetValue(event.newVal);
            this._uiSyncButtons(event.newVal);
        },

        _afterMinChange: function(event) {
            if(!this._validateValue(this.get("value"))) {
                this.set("value", 0);
            }
            this._uiSyncButtons(this.get("value"));
        },

        _afterMaxChange: function(event) {
            if(!this._validateValue(this.get("value"))) {
                this.set("value", 0);
            }
            this._uiSyncButtons(this.get("value"));
        },

        _afterStepChange: function(event) {
            if(!this._validateValue(this.get("value"))) {
                this.set("value", 0);
            }
            this._uiSyncButtons(this.get("value"));
        },

        syncUI: function() {
            this._uiSetValue(this.get("value"));
            this._uiSyncButtons(this.get("value"));
        },

        _uiSyncButtons: function(value) {
            var incrementedValue = this._incrementValue(value),
                decrementedValue = this._decrementValue(value),
                disabled = this.get("disabled");
            this.decrementNode.set("disabled", disabled || !this._validateValue(decrementedValue));
            this.incrementNode.set("disabled", disabled || !this._validateValue(incrementedValue));
        },

        _renderInput: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var input = Y.Node.create(INPUT_TEMPLATE);
            contentBox.appendChild(input);

            this.inputNode = input;
        },

        _renderLabel: function() {
            var contentBox = this.get(CONTENT_BOX),
                labelString = this.get("label");

            var label = Y.Node.create(LABEL_TEMPLATE);
            label.set("innerHTML", labelString);

            contentBox.insertBefore(label, this.decrementNode);

            this.labelNode = label;
        },

        _renderDecrementButton: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var decrement = this._createButton(strings.decrement, this.getClassName("decrement"));

            this.decrementNode = contentBox.appendChild(decrement);
        },

        _renderIncrementButton: function() {
            var contentBox = this.get(CONTENT_BOX),
                strings = this.get("strings");

            var increment = this._createButton(strings.increment, this.getClassName("increment"));

            this.incrementNode = contentBox.appendChild(increment);
        },

        _createButton: function(text, className) {
            var button = Y.Node.create(BUTTON_TEMPLATE);

            button.set("innerHTML", text);
            button.set("title", text);
            button.addClass(className);

            return button;
        },

        _uiSetValue: function(value) {
            this.inputNode.set("value", value);
        },

        _validateValue: function(value) {
            var min = this.get("min"),
                max = this.get("max");

            return (isNumber(value) &&
                    value >= min &&
                    value <= max &&
                    this._followsStep(value));
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

}, '0.0.1', { requires: ["widget"] });
