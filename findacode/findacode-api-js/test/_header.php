<?
  if( !isset($widget_theme) ) {
    $widget_theme = 'ui_lightness';
  }
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Widget Tests</title>
  <link type="text/css" href="../bin/styles/<? echo $widget_theme; ?>/FAC.css" rel="Stylesheet" />
  <style>
    body { padding-top: 1em; }
    #login-status { position: fixed; right: .5em; top: .5em; }
    #setup-buttons { position: fixed; left: .5em; top: .5em; font-size: .8em; }
  </style>
  <script src="../bin/FAC.dev.js" ></script>
  <script>
    FAC(document).ready(function(){
      // Point the widgets to the dev machine for api access
      FAC.settings('api', 'http://api-dev.findacode.com/v2/');
      
      // Create login widget
      FAC('#login-status').loginstatus();
      
      // Create setup button and fire setup event immediately
      FAC('#setup').button().click(function(){
        FAC.events.trigger('test-setup');
      });
      FAC.events.trigger('test-setup');
      
      // Create destroy button
      FAC('#destroy').button().click(function(){
        FAC.events.trigger('test-destroy');
      });
    });
  </script>
</head>
<body class="fac">
<div id="setup-buttons">
  <button id="setup">Setup</button>
  <button id="destroy">Destroy</button>
</div>
<div id="login-status"></div>