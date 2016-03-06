  var writer = (function (my)
{
  my.lines = (function (writer)
{

 
  var lines = [];
  var context = null;


  // Creates a line from one box to another
  function add( from, to )
  {
    // don't allow links to yourself.
    if( !from || !to || from == to ) return;
    // only one link per box pair
    if( writer.boxes.IsLinked(from,to) ) return;

    var line = {}
    line.from = from;
    line.to = to;
    from.links.push( line );
    lines.push( line );

  }


  function drawLine( line )
  {
    /*
     * drawing proper lines bound to the edges of the boxes is hard!
     *
     * Note we do all this rather than simply fill the rectangle as we will want to draw arrows
     * we need to figure out the orientation of the target box compared to the souce box
     */ 

    // calculate the midpoints of the two boxes
    var ax = line.from.x + ( line.from.w / 2 );
    var ay = line.from.y + ( line.from.h / 2 );
    var bx = line.to.x + ( line.to.w / 2 );
    var by = line.to.y + ( line.to.h / 2 );
    // these will hold the actual points we draw between
    var Ax = ax;
    var Ay = ay;
    var Bx = bx;
    var By = by;
    // some handy lengths that we will need later on
    var dx = Math.abs(ax-bx);
    var dy = Math.abs(ay-by);

    /*
     *  First we figure out which quadrant we are dealing with
     *  
     *  bx<ax | bx>ax
     *  by<ay | by<ay
     *  -------------
     *  bx<ax | bx>ax
     *  by>ay | by>ay
     *
     *  Then need to figure out which octant to map to.
     *   
     *  \8|1/
     *  7\|/2
     *  -----
     *  6/|\3
     *  /5|4\ 
     *
     *  As we are always drawing centre to centre, as long as the boxes are the same size
     *  the lines must be in opposite quadrants.
     *
     *  TODO:: cache these calculations
     *  TODO:: draw arrows
     *  TODO:: calculate quadrants for mismatched box sizes
     */

    if( bx > ax )
    {
      if( by < ay )
      {
        if( dx < dy )
        {
          // octant #1
          Ay = line.from.y;
          Ax = line.from.x+(line.from.w + ((line.from.h*dx)/dy))/2;
          By = line.to.y+line.to.h;
          Bx = line.to.x+(line.to.w - ((line.to.h*dx)/dy))/2;
        }
        else
        {
          // octant #2
          Ax = line.from.x+line.from.w;
          Ay = line.from.y+(line.from.h - ((line.from.w*dy)/dx))/2;
          Bx = line.to.x;
          By = line.to.y+(line.to.h + ((line.to.w*dy)/dx))/2;
        }
      }
      else
      {
        if( dx > dy )
        {
          // octant #3
          Ax = line.from.x+line.from.w;
          Ay = line.from.y+(line.from.h + ((line.from.w*dy)/dx))/2;
          Bx = line.to.x;
          By = line.to.y+(line.to.h - ((line.to.w*dy)/dx))/2;
        }
        else
        {
          // octant #4
          Ay = line.from.y+line.from.h;
          Ax = line.from.x+(line.from.w + ((line.from.h*dx)/dy))/2;
          By = line.to.y;
          Bx = line.to.x+(line.to.w - ((line.to.h*dx)/dy))/2;
        }
      }
    }
    else
    {
      if( by>ay )
      {
        if( dx < dy )
        {
          // octant #5
          Ay = line.from.y+line.from.h;
          Ax = line.from.x+(line.from.w - ((line.from.h*dx)/dy))/2;
          By = line.to.y;
          Bx = line.to.x+(line.to.w + ((line.to.h*dx)/dy))/2;
        }
        else
        {
          // octant #6
          Ax = line.from.x;
          Ay = line.from.y+(line.from.h + ((line.from.w*dy)/dx))/2;
          Bx = line.to.x+line.to.w;
          By = line.to.y+(line.to.h - ((line.to.w*dy)/dx))/2;
        }
      }
      else
      {
        if( dx < dy )
        {
          // octant #8
          Ay = line.from.y;
          Ax = line.from.x+(line.from.w - ((line.from.h*dx)/dy))/2;
          By = line.to.y+line.to.h;
          Bx = line.to.x+(line.to.w + ((line.to.h*dx)/dy))/2;
        }
        else
        {
          // octant #7
          Ax = line.from.x;
          Ay = line.from.y+(line.from.h - ((line.from.w*dy)/dx))/2;
          Bx = line.to.x+line.to.w;
          By = line.to.y+(line.to.h + ((line.to.w*dy)/dx))/2;
        }
      }
    }


    context.moveTo( Ax,Ay );
    context.lineTo( Bx,By );
  }

  function draw( drawContext )
  {
    context = drawContext;
    lines.forEach(drawLine);
    drawContext.strokeStyle = "#0000ff";
    drawContext.stroke();
  }

  var my = {};
  my.draw = draw;
  my.add = add;

  return my;
}(my));
  return my;
}( writer || {} ));