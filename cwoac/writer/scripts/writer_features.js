var writer = (function (my)
{
  my.features = (function ()
{
  // used if we run this on a browser missing needed features
  function logFeature( msg )
  {
    var ol = document.getElementById("features");
    var li = document.createElement("li");
    li.innerHTML = msg;
    ol.appendChild(li);
  }

  // check we are able to run.
  function testForFeatures()
  {
    return Modernizr.canvas && Modernizr.canvastext && Modernizr.indexeddb;
  }

  listMissingFeatures = function()
  {
    if( !Modernizr.canvas ) logFeature( "No canvas.");
    if( !Modernizr.canvastext ) logFeature( "No canvas text.");
    if( !Modernizr.indexeddb ) logFeature( "No indexeddb.");
  }

  var my = {};
  my.listMissingFeatures = listMissingFeatures;
  my.testForFeatures = testForFeatures;

  return my;
}());
  return my;
}( writer || {} ));
