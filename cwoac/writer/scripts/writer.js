var writer = (function (my)
{
  // handy pointer to canvas element
  var canvas;
  // even more handy pointer to the canvas' context
  var context;

  // for dragging
  var dragOffsetX;
  var dragOffsetY;
  
  // need to deduce which events are which.
  var mouseDownTime=0;
  var mouseUpTime=0;
  var mouseIsDrag=false;
  var clickBoxState=false;
  var clickBox=null;

  // polyfill for firefox
  function fixEventOffsets( e )
  {
    if (! e.hasOwnProperty('offsetX')) 
    {
      var curleft = curtop = 0;
      if (e.offsetParent) 
      {
        var obj=e;
        do 
        {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }
      e.offsetX=e.layerX-curleft;
      e.offsetY=e.layerY-curtop;
    }
    return e;
  }

  // mouse handlers

  function mouseDownHandler(e)
  {
    mouseDownTime = e.timeStamp;
    mouseIsDrag = false;

    e = fixEventOffsets(e);

    // did he click anything?
    clickBox=my.boxes.pick(e);
    clickBoxState = clickBox!=null && clickBox.selected;
    
    // if the user clicks an unselected box and doesn't have shift held down deselect anything else.
    if( !e.shiftKey && !clickBoxState )
      my.boxes.selectNone();

    // select the clicked box (if any)
    my.boxes.select(clickBox);
    // for all selected boxes, save their original location in case we do a drag-n-drop and need to snap back 
    my.boxes.forEachSelected(function(box){
      box.origX = box.x;
      box.origY = box.y;
    })

    // setup for drag deltas
    dragOffsetX = e.offsetX;
    dragOffsetY = e.offsetY;


    if( my.boxes.selectedCount() == 0 ) 
    {
      my.band.enable();
      my.band.set(dragOffsetX,dragOffsetY);
    }

    // enable drag handler
    canvas.addEventListener("mousemove",mouseMoveHandler);
  }

  // handles drags. Note, not on by default, added/removed by mouseUp/Down Handlers.
  function mouseMoveHandler(e)
  {
    e = fixEventOffsets(e);

    if( my.boxes.selectedCount() >0 && !my.band.isEnabled() )
    {
      // we are click-dragging one or more boxes.
      var deltaX = e.offsetX - dragOffsetX;
      var deltaY = e.offsetY - dragOffsetY;
      my.boxes.forEachSelected( function(box) {
        box.x += deltaX;
        box.y += deltaY;
      });
    }
    else
    {
      // We must be drawing a rubber band.
      my.band.move(e.offsetX,e.offsetY);
      my.band.select();
    }
    // update the offsets for next call to mouseMove
    dragOffsetX = e.offsetX;
    dragOffsetY = e.offsetY;
    // redraw the screen.
    redraw();
  }

  function mouseUpHandler(e)
  {
    e = fixEventOffsets(e);

    // was this a double click?
    if(    e.timeStamp - mouseUpTime < 200 
        && e.timeStamp - mouseDownTime < 200 )
    {
      mouseUpTime = 0;
      my.boxes.add( e );
    }
    else
    {
      // have we done a drag-n-drop?
      var target = my.boxes.pickUnselected(e);
      if( target )
      {
        //link each selected box to the target and put them back in place.
        my.boxes.forEachSelected( function(box){ 
          my.lines.add(box,target);
          box.x = box.origX;
          box.y = box.origY;
        });
      }
      // all the work for clicks / drags will have been already completed.
      mouseUpTime = e.timeStamp;
    }

    clickBox = null;
    my.band.disable();
    canvas.removeEventListener("mousemove",mouseMoveHandler);
    redraw();
  }


  // publicly exposed stuff

  // Call this whenever the screen is dirty
  redraw = function()
  {
    // reset the contents of the canvas
    canvas.width = canvas.width;
    my.lines.draw(context);
    my.boxes.draw(context);
    if( my.band.isEnabled() ) my.band.draw(context);
  }

  resize = function()
  {
    // TODO:: Figure out what these should really be
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;    
    redraw();
  }

  initialise = function()
  {
    if( !my.features.testForFeatures() ) window.location = "missing_features.html";
    canvas = document.getElementById("theCanvas");
    context = canvas.getContext("2d");
    canvas.addEventListener("mousedown",mouseDownHandler,false);
    canvas.addEventListener("mouseup",mouseUpHandler,false);
    resize();
  }

  my.redraw = redraw;
  my.resize = resize;
  my.fixEventOffsets = fixEventOffsets;
  my.initialise = initialise;

  return my;
}( writer || {}));