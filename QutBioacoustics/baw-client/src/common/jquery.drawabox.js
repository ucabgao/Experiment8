﻿(function ($) {

    var SELECTED_ATTRIBUTE = "data-selected";
    var HOVER_ATTRIBUTE = "data-hover";

    var clickLocation = function (e) {
        var posx = 0;
        var posy = 0;
        if (!e) {
            e = window.event;
        }
        if (!e) {
            return { posx: 0, posy: 0 };
        }
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        // The minus ones allow a new box to be drawn right up to the edge
        return { posx: posx - 1, posy: posy - 1 };
    };

    var elementPosition = function (obj) {
        var curleft = 0;
        var curtop = 0;
        if (obj && obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        return { posx: curleft, posy: curtop };
    };

    var setBoxBoxPosition = function ($box, startPos, currentPos) {
        if (startPos.x > currentPos.x) {
            $box.css('left', currentPos.x + 'px');
        } else {
            $box.css('left', startPos.x + 'px');
        }
        if (startPos.y > currentPos.y) {
            $box.css('top', currentPos.y + 'px');
        } else {
            $box.css('top', startPos.y + 'px');
        }
    };

    var maxChildrenCheck = function (max, $ele) {
        if (max) {
            var numKids = $ele.children().length;
            return (numKids >= max);
        } else {
            return false;
        }
    };

    var mousedown = function (e) {
        // only want to handle clicks on container, not on existing boxs
        if (e.target != this || e.which != 1) {
            return;
        }

        e.preventDefault();

        var $thisMouseDown = $(this);
        var dataMouseDown = $thisMouseDown.data('drawboxes');

        // do not execute if no more boxs allowed
        if (dataMouseDown.maxChildrenReached) {
            // TODO: raise too-many-boxes event
            console.warn("too many boxes, further addition of boxes disabled");
            return;
        }

        // get position of mouse click
        var docClickLocation = clickLocation(e);
        var containerOffset = $thisMouseDown.offset();

        var clickPos = {
            x: baw.parseInt(docClickLocation.posx - containerOffset.left),
            y: baw.parseInt(docClickLocation.posy - containerOffset.top)
        };

        // update stored values
        dataMouseDown.mousedown = true;
        dataMouseDown.mousedownPos = clickPos;
    };

    var mouseup = function (e) {

        var $thisMouseUp = $(this);
        var dataMouseUp = $thisMouseUp.data('drawboxes');

        var wasMouseDownSet = dataMouseUp.mousedown;
        var currentBoxId = dataMouseUp.currentMouseDragBoxId;

        // mousedown must be true, we must actually have a currentId
        if (!wasMouseDownSet || !currentBoxId) {
            return;
        }

        var $box = $('#' + currentBoxId);
        // 02-Feb-14, ANT: removed, seems redundant, removal does not seem to affect functionality
        //$box.draggable({ containment: 'parent' })
         //   .resizable({ containment: 'parent', handles: 'all' });

        // update stored values
        dataMouseUp.mousedown = false;
        dataMouseUp.currentMouseDragBoxId = "";

        // raise moved event
        dataMouseUp.options.boxResized($box);
    };

    var dataIdKey = 'data-id';

    function createBox($parent, contextData, width, height, top, left, uniqueId, silent) {

        if (contextData === undefined) {
            throw "Context data must be given";
        }
        var closeIconTemplate = '<span class="close-icon glyphicon glyphicon-remove"></span>';


        uniqueId = uniqueId || (-1 * Number.Unique());
        $('.boxItem').attr(SELECTED_ATTRIBUTE, false);
        var newId = "boxItem_" + uniqueId;

        if (!silent) {
            contextData.currentMouseDragBoxId = newId;
        }

        if (contextData.options.showOnly === true) {
            closeIconTemplate = "";
        }

        // removed 'overflow:hidden' from default style... it was messing up a trick i was trying to do

        $parent.append('<div '+ SELECTED_ATTRIBUTE +'="' + (silent ? 'false' : 'true') + '" id="' + newId + '" class="boxItem ui-widget" style="width:' + width + 'px;height:' + height + 'px;">' + closeIconTemplate + '</div>');

        var $newBox = $('#' + newId);
        $newBox.attr(dataIdKey, uniqueId);

        // add selection highlight
        function raiseSelectCallback() {

            $('.boxItem').attr(SELECTED_ATTRIBUTE, false);
            var $t = $(this);
            $t.attr(SELECTED_ATTRIBUTE, true);
            contextData.options.boxSelected($t);
        }

        switch (contextData.options.selectionCallbackTrigger) {
            case "mousedown" : $newBox.mousedown(raiseSelectCallback); break;
            case "both" : $newBox.click(raiseSelectCallback); $newBox.mousedown(raiseSelectCallback); break;
            case "click" : $newBox.click(raiseSelectCallback); break;
            default : $newBox.click(raiseSelectCallback); break;
        }

        function onHover(event) {
            var hovering = event.type === "mouseover" ||
                event.type === "mouseenter";
            var $t = $(this);
            $t.attr(HOVER_ATTRIBUTE, hovering);
            contextData.options.boxSelected($t);
        }

        $newBox.hover(onHover);

        if (contextData.options.showOnly !== true) {
            // add delete click handler
            $('#' + newId + ' span').click(function () {
                var $t = $(this).parent(),
                    $container = $t.parent();
                $t.remove();

                contextData.maxChildrenReached = maxChildrenCheck($container.data('drawboxes').options.maxBoxes, $container);

                contextData.options.boxDeleted($t);
            });
            // add other events
            $newBox.resizable({
                handles: "all",
                containment: "parent",
                resize: function (event, ui) { contextData.options.boxResizing($newBox); },
                stop: function (event, ui) { contextData.options.boxResized($newBox); }
            });
            // temporary function used for testing a bug
            // window.hack = function(left, top) {$newBox.css({left:left, top:top}); contextData.options.boxMoved($newBox)};
            $newBox.draggable({
                containment: 'parent',
                drag: function (event, ui) { contextData.options.boxMoving($newBox); },
                stop: function (event, ui) { contextData.options.boxMoved($newBox); }
            });
        }

        if (left) {
            $newBox.css('left', left + 'px');
        }
        if (top) {
            $newBox.css('top', top + 'px');
        }

        contextData.maxChildrenReached = maxChildrenCheck(contextData.options.maxBoxes, $newBox);

        // raise new box event and selected events
        if (!silent) {
            contextData.options.newBox($newBox);
            contextData.options.boxSelected($newBox);
        }

        return $newBox;
    }

    var mousemove = function (e) {

        var $thisMouseMove = $(this);
        var dataMouseMove = $thisMouseMove.data('drawboxes');

        var wasMouseDownSet = dataMouseMove.mousedown;

        // mousedown must be true
        if (!wasMouseDownSet) {
            return;
        }

        // box must be selected

        //var wasMouseDownSet = dataMouseMove.mousedown;
        var currentBoxId = dataMouseMove.currentMouseDragBoxId;

        // get postion of mouse
        var docClickLocation = clickLocation(e);
        var containerOffset = $thisMouseMove.offset();
        var containerWidth = $thisMouseMove.width();
        var containerHeight = $thisMouseMove.height();

        var currentPos = {
            x: Math.min(baw.parseInt(docClickLocation.posx - containerOffset.left), containerWidth),
            y: Math.min(baw.parseInt(docClickLocation.posy - containerOffset.top), containerHeight)
        };

        var startClickPos = dataMouseMove.mousedownPos;

        // create new box or update box being dragged
        var xdiff = Math.abs(currentPos.x - startClickPos.x);
        var ydiff = Math.abs(currentPos.y - startClickPos.y);


        // minimum dimensions before valid box
        var distance = Math.min(xdiff, ydiff);

        if (!currentBoxId) {

            // no box created yet. Only create box once dragged for 10 pixels
            if (distance > 10) {
                var $newBox = createBox($thisMouseMove, dataMouseMove, xdiff, ydiff, startClickPos.y, startClickPos.x);
                setBoxBoxPosition($newBox, startClickPos, currentPos);
            }
        } else {
            var $box = $('#' + currentBoxId);
            $box.width(xdiff);
            $box.height(ydiff);
            setBoxBoxPosition($box, startClickPos, currentPos);

            // raise moved event
            dataMouseMove.options.boxResizing($box);
        }
    };

    var removePx = function (cssValue) {
        if (!cssValue) {
            return 0;
        }
        var pos = cssValue.indexOf("px");
        if (pos == -1) {
            //throw new Error("Non pixel quantity given, cannot convert:" + cssValue);
            return NaN;
        } else {
            return baw.parseInt(cssValue.substring(0, pos));
        }
    };

    /**
     * This is dodgy as fuck - if the border width changes...
     * This varies based on box-sizing as well
     * This value needs to be set because of a jquery-ui bug with resizeable and border-box
     * http://bugs.jqueryui.com/ticket/8932
     * @type {number}
     */
    var BORDER_MODEL_DIFFERANCE = 2;

    var getBox = function ($element) {
        var selectedAttr = $element.attr(SELECTED_ATTRIBUTE);
        var hoveringAttr = $element.attr(HOVER_ATTRIBUTE);

        return {
            id: parseInt($element.attr(dataIdKey), 10),
            left: removePx($element.css("left")),
            top: removePx($element.css("top")),
            width: removePx($element.css("width")) + BORDER_MODEL_DIFFERANCE,  // box model - border not included in widths
            height: removePx($element.css("height")) + BORDER_MODEL_DIFFERANCE, // box model - border not included in widths
            selected: (!!selectedAttr) && selectedAttr == "true",
            hovering: (!!hoveringAttr) && hoveringAttr == "true"
        };
    };

    /**
     * Remaps a given a callback to a callback format with an extra argument that provides box information
     * @param callbackFunction - the original callback
     * @return {Function} - the augmented callback
     */
    var remap = function (callbackFunction) {
        var bevent = function (element) {
            var boxSimpleData = getBox(element);
            return callbackFunction.apply(element, [element, boxSimpleData]);
        };

        return callbackFunction ? bevent : function () { };
    };

    var methods = {};
    methods.init = function (options) {

        if (options && !(options instanceof Object)) {
            throw new Error("If defined, eventMap should be an object");
        }

        if (!options) {
            options = {};
        }

        // Create some defaults, extending them with any options that were provided
        options = $.extend({
            maxBoxes: Infinity,
            initialBoxes: [],
            /// Should only should allow selection events to be raised
            showOnly: false,
            selectionCallbackTrigger: "click"
            //            'location': 'top',
            //            'background-color': 'blue'
        }, options);


        var maxBoxes = baw.parseInt(options.maxBoxes);
        if (isNaN(maxBoxes) && maxBoxes < 1) {
            throw new Error("Max boxes must be an int greater than zero (or undefined)");
        }
        if (maxBoxes < options.initialBoxes.length) {
            throw "max boxes must be greater than the initial number of boxes that are to be drawn";
        }

        if (!(  options.selectionCallbackTrigger === "click" ||
                options.selectionCallbackTrigger === "mousedown" ||
                options.selectionCallbackTrigger === "both"
             )) {
            throw "`selectionCallbackTrigger` must be set to either `click`, `mousedown`, or `both`.";
        }

        // note: technically callbacks not events
        // note: each function will be called with element of focus, and a bounds box (see remap func)
        var events = [
            "newBox", "boxSelected",
            "boxResizing", "boxResized", "boxMoving", "boxMoved", "boxDeleted"
        ];
        for (var i = 0; i < events.length; i++) {
            var eventName = events[i];
            options[eventName] = remap(options[eventName]);

            if (options.showOnly && i > 1) {
                console.warn("drawabox.init: The show `only` option has been enabled. The event handler you assigned to options." + eventName + " will never be called");
            }
        }

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('drawboxes');

            if (!data) {
                // If the plugin hasn't been initialized yet
                // Do more setup stuff here

                $this.data('drawboxes', {
                    target: $this,
                    mousedown: false,
                    mousedownPos: { posx: 0, posy: 0 },
                    currentMouseDragBoxId: "",
                    maxChildrenReached: maxChildrenCheck(options.maxBoxes, $this),
                    options: options
                });

                if (options.showOnly !== true) {
                    $this.mousedown(mousedown);
                    $this.mouseup(mouseup);
                    $this.mousemove(mousemove);
                }

                if (options.initialBoxes.length > 0) {

                    for (var j = 0; j < options.initialBoxes.length; j++) {
                        var box = options.initialBoxes[j];

                        // create box!
                        createBox($this, $this.data(dataIdKey), box.width, box.height, box.top, box.left);
                    }
                }
            }
        });
    };

    methods.showOnly = function (options, suppliedBoxes) {
        options = $.extend(options, { showOnly: true, initialBoxes: suppliedBoxes });
        return methods.init(options);
    };

    methods.getBoxes = function () {

        return this.each(function () {

            // return all the boxes made by this plugin
            var $this = $(this),
                data = $this.data('drawboxes');

            var boxes = [];

            var kids = data.target.children();
            for (var i = 0; i < kids.length; i++) {
                var $kid = $(kids[i]);
                boxes[i] = getBox($kid);
            }

            return boxes;
        });
    };

    /**
     * Allows reverse binding to drawabox
     * @param {number} id - the id
     * @param {number} top - the top position of the box in px
     * @param {number} left - the left position of the box in px
     * @param {number} height - the height of the box in px
     * @param {number} width - the width of the box in px
     * @param {boolean|undefined} selected - should this element be selected
     * @return {undefined}
     */
    methods.setBox = function setBox(id, top, left, height, width, selected) {
        return this.each(function () {

            var matchingBoxElement = [].slice.call(this.children).filter(function(element) {
               return element.getAttribute("data-id") === id.toString();
            })[0];

            if (matchingBoxElement) {
                matchingBoxElement.style.width  = (width  - BORDER_MODEL_DIFFERANCE || matchingBoxElement.style.width  )  + "px";
                matchingBoxElement.style.height = (height - BORDER_MODEL_DIFFERANCE || matchingBoxElement.style.height )  + "px";
                matchingBoxElement.style.top    = (top                              || matchingBoxElement.style.top    )  + "px";
                matchingBoxElement.style.left   = (left                             || matchingBoxElement.style.left   )  + "px";

                if (selected !== undefined) {
                    matchingBoxElement.setAttribute(SELECTED_ATTRIBUTE, (!!selected).toString());
                }
            }
            else {
                throw "Don't have a box by that ID (" + id + ")";
            }
        });
    };

    /**
     * Checks whether an box is present in drawabox
     * @param {number} id - the id to search for
     * @returns {Array}
     */
    methods.exists = function setBox(id) {
        var result = [];
        this.each(function (index) {

            var elements = this.querySelectorAll(".boxItem[data-id='" + id.toString() + "']");

            if (elements.length === 0) {
                result[index] = false;
            }
            else if (elements.length > 1) {
                throw "There should never be more than one match. Internal state broken";
            }
            else {
                result[index] = elements[0];
            }
        });

        return result;
    };

    methods.insert = function insert(id) {

        var result = [];
        this.each(function(){

            var $this = $(this);

            if (this.querySelectorAll(".boxItem[data-id='" + id.toString() + "']").length !== 0) {
                throw "An element with that id already exists, cannot insert";
            }

            var newBox = createBox($this, $this.data('drawboxes'),0, 0, 0, 0, id, true);
            result.push(newBox);
        });
        return result;
    };


    methods.destroy = function () {
        return this.each(function () {

            var $this = $(this),
                data = $this.data('drawboxes');

            // Namespacing FTW
            $(window).unbind('.drawabox');
            //data.tooltip.remove();
            $this.removeData('drawboxes');

        });
    };

    $.fn.drawabox = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.drawabox');
        }

    };

})(jQuery);