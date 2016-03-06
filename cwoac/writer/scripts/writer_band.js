var writer = (function (my)
{
  my.band = (function (writer)
{

  // the rubber band for multi-selection
  x=0;
  y=0;
  w=0;
  h=0;
  inUse = false;

  function select()
  {
    // shouldn't trigger, but hey.
    if( !inUse ) return;

    // deselect everything as the band may have shrunk
    writer.boxes.selectNone();

    var top;
    var bottom;
    var left;
    var right;
    
    //  work out which corner x,y refer to.
    if( w > 0 )
    {
      left = x;
      right = x + w;
    }
    else
    {
      left = x + w;
      right = x;
    }

    if( h > 0 )
    {
      top = y;
      bottom = y + h;
    }
    else
    {
      top = y + h;
      bottom = y;
    }


    // every box that is touched by the band is selected
    writer.boxes.forEach( function(box){
      if(    (box.x + box.w >= left && box.x <= right)
          && (box.y + box.h >= top && box.y <= bottom) )
      {
        writer.boxes.select(box)
      }
    });
  }

  function enable()  { inUse = true;  }
  function disable() { inUse = false; }
  function isEnabled() { return inUse; } 

  function move(X,Y)
  {
      w=X-x;
      h=Y-y;
  }

  function set(X,Y)
  {
    x=X;
    y=Y;
  }

  function draw(context)
  {
    context.strokeStyle = "#00ff00";
    context.strokeRect( x, y, w, h );
  }

  var my = {};
  my.select = select;
  my.draw = draw;
  my.enable = enable;
  my.disable = disable;
  my.isEnabled = isEnabled;
  my.move = move;
  my.set = set;
  
  return my;
}(my));
  return my;
}( writer || {} ));