// Copyright (c) 2009 Jakub Kuźma

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

$.widget("ui.messageblock", {
    _init: function() {
        this.element.addClass("message-block");
    },

    add: function(type, message, classNames) {
        var ul = this.element.find("ul." + type);
        if(ul.length === 0) {
            ul = $("<ul/>").addClass(type).appendTo(this.element);
        }
        $("<li/>").appendTo(ul).addClass(classNames).text(message);
    },

    remove: function(classNames) {
        var selector = classNames ? "." + classNames.replace(/\s+/g, ".") : "";
        this.element.find("li" + selector).remove();
        this.element.find("ul:empty").remove();
    }
});
