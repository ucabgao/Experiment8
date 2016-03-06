var fs = require('fs');

function hasPlugin() {
  var datapoints = [];

  try {
    fs.readFileSync('/proc/net/dev', 'utf8')
      .split('\n')
      .slice(2,-1)
      .forEach(function (e) {
        var netif = e.replace(/^\s+/g,'').split(/:*\s+/)[0];
        datapoints.push(netif + '.bytes');
        datapoints.push(netif + '.packets');
        datapoints.push(netif + '.errs');
        datapoints.push(netif + '.drop');
        datapoints.push(netif + '.fifo');
        datapoints.push(netif + '.compressed');
      }
    );
  }
  catch (err) {
    datapoints = false;
  }

  return datapoints;
}

function runPlugin(ret) {
  fs.readFile('/proc/net/dev', 'utf8', function (err, data) {
    if ( err ) throw err;

    var d = data.split('\n').slice(2,-1).forEach(function (e) {
      var cur = e.replace(/^\s+/g,'').split(/:*\s+/);

      ret('net.' + cur[0] + '.bytes', {
        time : new Date().getTime(),
        type : 'counter',
        data : {
          rx : cur[1],
          tx : cur[9]
        }
      });
      ret('net.' + cur[0] + '.packets', {
        time : new Date().getTime(),
        type : 'counter',
        data : {
          rx : cur[2],
          tx : cur[10]
        }
      });
      ret('net.' + cur[0] + '.errs', {
        time : new Date().getTime(),
        type : 'counter',
        data : {
          rx : cur[3],
          tx : cur[11]
        }
      });
      ret('net.' + cur[0] + '.drop', {
        time : new Date().getTime(),
        type : 'counter',
        data : {
          rx : cur[4],
          tx : cur[12]
        }
      });
      ret('net.' + cur[0] + '.fifo', {
        time : new Date().getTime(),
        type : 'counter',
        data : {
          rx : cur[5],
          tx : cur[13]
        }
      });
      ret('net.' + cur[0] + '.compressed', {
        time : new Date().getTime(),
        type : 'counter',
        data : {
          rx : cur[7],
          tx : cur[15]
        }
      });
    })
  });
}

module.exports = {
  test : hasPlugin,
  run  : runPlugin
};
