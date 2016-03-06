var WebSocketServer = require('websocket').server
  , config          = require('./../etc/config.json')

var plugins = {};
var validPlugins = [];
var subscribers = {};
var wsServer;


function notifySubscribers(pl, mess) {
  var sp = pl.split('.');
  var plugin = sp[0];
  var graph = sp.slice(1).join('.');
  mess.name = pl;
  var m = JSON.stringify({type: 'data', data: mess});
  subscribers[plugin][graph].forEach(function (c) {
    c.sendUTF(m);
  });
}

function init(server) {

  config.plugins.forEach(function (p) {
    plugins[p] = require('./../plugins/' + p);
    if ( plugins[p].setup && config.pluginConfig[p] ) {
      plugins[p].setup(config.pluginConfig[p]);
    }
  });

  Object.keys(plugins).forEach(function (p) {
    var datasets = plugins[p].test();
    if ( datasets instanceof Array ) {
      subscribers[p] = {};
      datasets.forEach(function (ds) {
        validPlugins.push(p + '.' + ds);
        subscribers[p][ds] = [];
      });
    }
  });

  validPlugins.sort();

  wsServer = new WebSocketServer({ httpServer: server });

  wsServer.on('request', function(req) {
    var connection = req.accept(null, req.origin);

    connection.sendUTF(JSON.stringify({type: 'plugins', valid: validPlugins}));

    connection.on('message', function(m) {
      var mess = JSON.parse(m.utf8Data);

      switch(mess.type) {
        case 'subscribe':
          var mp = mess.plugin.split(/\./);
          var plugin = mp[0];
          var graph = mp.slice(1).join('.');
          if ( subscribers[plugin] && subscribers[plugin][graph] ) {
            subscribers[plugin][graph].push(connection);
          } else {
            connection.sendUTF(JSON.stringify({type: 'error', message: 'No such plugin'}));
          }

          break;
        case 'unsubscribe':
          var mp = mess.plugin.split(/\./);
          var plugin = mp[0];
          var graph = mp.slice(1).join('.');
          subscribers[plugin][graph] = subscribers[mp[0]][mp[1]].filter(function (ar) {
            return (ar != connection);
          });
          break;
      }
    });

    connection.on('close', function(conn) {
      validPlugins.forEach(function (pl) {
        var mp = pl.split(/\./);
        var plugin = mp[0];
        var graph = mp.slice(1).join('.');
        subscribers[plugin][graph] = subscribers[plugin][graph].filter(function (ar) {
          return (ar != connection);
        });
      });
    });
  });


  // We want to sleep a little to align the graphs with whole seconds.  It's prettier.
  var _ws = (Math.ceil(new Date().getTime() / 1000) * 1000) - new Date().getTime();

  setTimeout(function () {
    setInterval(function () {
      Object.keys(subscribers).forEach(function (pl) {
        plugins[pl].run(notifySubscribers);
      });
    }, 1000);
  }, _ws);
}

exports.init = init;
