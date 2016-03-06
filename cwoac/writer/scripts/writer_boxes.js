var writer = (function (my)
{
  my.boxes = (function ()
{
  var boxes = [];
  var selectList = [];

  // create a small, empty box.
  function add( e )
  {
    var box = {};
    box.x = e.offsetX-25;
    box.y = e.offsetY-25;
    box.w = 50;
    box.h = 50;
    box.selected = false;
    box.links = [];
    boxes.push( box );
  }

  // checks if there is a link from one box to another.
  // note that links have a direction.
  function IsLinked( from, to )
  {
    if( !from || !to ) return false;

    from.links.forEach( function(link){ 
      if( link==to ) return true;
    });

    return false;
  }

  function selectNone()
  {
    boxes.forEach( function(entry){ entry.selected=false; });
    selectList = [];
  }

  function select( box )
  {
    // if the box is already selected, do nothin
    if( box && selectList.indexOf(box) == -1 )
    {
      box.selected = true;
      selectList.push(box);
    }
  }

  function selectOnly( box )
  {
    selectNone();
    selectBox(box);
  }

  function deselect( box )
  {
    // if the box is already unselected, do nothing
    if( selectList.indexOf(box) > -1 )
    {
      box.selected = false;
      selectList.splice(selectList.indexOf(box),1);
    }
  }

  function toggleSelect( box )
  {
    if( selectList.indexOf(box) == -1 )
    {
      selectBox(box);
    }
    else
    {
      deselectBox(box);
    }
  }

  function selectedCount()
  {
    return selectList.length;
  }

  function forEach( func )
  {
    boxes.forEach(func);
  }

  function forEachSelected( func )
  {
    selectList.forEach( func );
  }


  function drawBox( box, context )
  {
    if( box.selected )
      context.strokeStyle = "#ff0000";
    else
      context.strokeStyle = "#000000";

    // TODO:: sort by stroke style and use .rect and .stroke
    context.strokeRect( box.x, box.y, box.w, box.h );
  }

  function draw( context )
  {
    boxes.forEach( function(b){drawBox(b,context)} );
  }

  // attempts to pick a box under the cursor
  // ignores already selected boxes
  // picks the top-most box it finds
  // used by drag-n-drop.
  function pickUnselected( e )
  {
    var box = null;
    // loop in reverse order to depth sort
    for( var i=boxes.length-1; i>=0; i-- )
    {
      if(   !boxes[i].selected
          && e.offsetX>boxes[i].x
          && e.offsetX<boxes[i].x+boxes[i].w
          && e.offsetY>boxes[i].y
          && e.offsetY<boxes[i].y+boxes[i].h)
      {
        box = boxes[i];
        break;
      }
    }

    return box;
  }

  // attempts to select a box under the cursor
  // will pick the top-most box it finds, if any
  // used by click + double-click
  function pick( e )
  {
    var box = null;
    // loop in reverse order to depth sort
    for( var i=boxes.length-1; i>=0; i-- )
    {
      if(    e.offsetX>boxes[i].x
          && e.offsetX<boxes[i].x+boxes[i].w
          && e.offsetY>boxes[i].y
          && e.offsetY<boxes[i].y+boxes[i].h)
      {
        box = boxes[i];
        break;
      }
    }

    return box;
  }


  var my = {};

  my.toggleSelect = toggleSelect;
  my.select = select;
  my.deselect = deselect;
  my.selectOnly = selectOnly;
  my.selectNone = selectNone;
  my.IsLinked = IsLinked;
  my.add = add
  my.selectedCount = selectedCount;
  my.forEach = forEach;
  my.forEachSelected = forEachSelected;
  my.draw = draw;
  my.pickUnselected = pickUnselected;
  my.pick = pick;

  return my;
}());
  return my;
}( writer || {} ));