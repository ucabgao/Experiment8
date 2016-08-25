/* @flow */

window.pupilGraphers = {};
window.pupilClients = {};
window.pupilPlugins = {};

declare function parseInt (x: string, y: number) :number;

interface a {
    data: Array<string | number>;
}

function PupilUpdatePluginList() {
  var cont = document.getElementById('plugins');
  while ( cont.hasChildNodes() ) {
    cont.removeChild(cont.lastChild);
  }

  Object.keys(window.pupilPlugins).forEach(function (host) {
    window.pupilPlugins[host].forEach(function (plugin) {
      var a = document.createElement('a');
      a.href = 'javascript:window.pupilClients["' + host + '"].subscribe("' + plugin + '")';
      a.innerHTML = plugin;
      cont.appendChild(a);
    });
  });
}

function PupilStorePlugins(host, message) {
  if ( typeof(window.pupilPlugins[host]) === 'undefined' ) {
    window.pupilPlugins[host] = [];
  }

  message.forEach(function (p) {
    window.pupilPlugins[host].push(p);
  });

  PupilUpdatePluginList();
}

function PupilGrapher(host, name, data) {
  var self = this;

  this.createDOMBox = function (name) {
    var gelement = document.getElementById('graphs');
  
    var container = document.createElement('div');
    container.className = 'container';
    container.id = name.replace(/\./g, '_');
  
    var controlpanel = document.createElement('div');
    controlpanel.className = 'controlpanel';
    controlpanel.innerHTML = '<h2>' + name + '</h2>';
 
    container.appendChild(controlpanel);

    var graph_legend = document.createElement('div');
    graph_legend.className = 'graph_legend';
    graph_legend.id = name.replace(/\./g, '_') + '_legend';
    container.appendChild(graph_legend);

    var graph = document.createElement('div');
    graph.className = 'graph';
    graph.id = name.replace(/\./g, '_') + '_graph';
    container.appendChild(graph);

    var br = document.createElement('br');
    br.style.clear = 'right';
    container.appendChild(br);
 
    gelement.appendChild(container);
  };

  this.addData = function (data:a) {
    var i = 0;
    Object.keys(data.data).forEach(function (d) {
      var realval;
      if ( self.type === 'counter' ) {
        realval = parseInt(data.data[d],10) - self.lastval[d];
        self.lastval[d] = parseInt(data.data[d],10);
      } else {
        realval = parseInt(data.data[d],10);
      }
      self.seriesData[d].push({ x: (parseInt(data.time, 10) / 1000), y: realval });
      self.seriesDesc[i].data = self.seriesData[d].slice(-300);
      i++;
    });
    self.graph.update();
  };

  this.createGraph = function (name, data) {

    var palette = new Rickshaw.Color.Palette( { scheme: 'munin' } );

    var seriesData = { };
    var seriesDesc = [ ];

    self.seriesData = seriesData;
    self.seriesDesc = seriesDesc;

    if ( data.type === 'counter' ) {
      self.type = 'counter';
      self.lastval = {};
    }

    Object.keys(data.data).forEach(function (d) {
      var firstval;
      if ( self.type === 'counter' ) {
        self.lastval[d] = parseInt(data.data[d],10);
        firstval = 0;
      } else {
        firstval = parseInt(data.data[d],10);
      }

      seriesData[d] = [ { x: (parseInt(data.time, 10) / 1000), y: firstval } ];
      seriesDesc.push({
        color: palette.color(),
        data: seriesData[d],
        name: d
      });
    });

    // instantiate our graph!
    var graph = new Rickshaw.Graph( {
      element: document.getElementById(name.replace(/\./g, '_') + '_graph'),
      width: 750,
      height: 220,
      renderer: 'line',
      background: 'silver',
      interpolation: 'direct',
      series: seriesDesc
    });

    if ( typeof(data.draw) != 'undefined' && data.draw === 'stacked' ) {
      graph.configure({ renderer: 'area' });
    }

    var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );
    
    var y_axis = new Rickshaw.Graph.Axis.Y( {
      graph: graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    });


    graph.render();
    var legend = new Rickshaw.Graph.Legend( {
      graph: graph,
      element: document.getElementById(name.replace(/\./g, '_') + '_legend')
    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
      graph: graph,
      legend: legend
    });

    var order = new Rickshaw.Graph.Behavior.Series.Order( {
      graph: graph,
      legend: legend
    });

    var highlight = new Rickshaw.Graph.Behavior.Series.Highlight( {
      graph: graph,
      legend: legend
    });

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph
    });

    self.graph = graph;
  };

  this.createDOMBox(name);
  this.createGraph(name, data);
  return this;
}

function PupilClient(remote) {
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  window.pupilClients[remote] = this;
  window.pupilGraphers[remote] = {};
  var self = this;

  var connection = new WebSocket('ws://'+remote);
  this.validPlugins = [];

  this.subscribe = function (plugin) {
    connection.send(JSON.stringify({ type: 'subscribe', plugin: plugin }));
  };
  this.unsubscribe = function (plugin) {
    connection.send(JSON.stringify({ type: 'unsubscribe', plugin: plugin }));
  };
  connection.onopen = function () {
    console.log('Connected to websocket: ' + remote);
  };
  connection.onerror = function (err) {
    console.log('error: ' + error);
  };
  connection.onclose = function () {
    console.log('Websocket connection closed.');
  };
  connection.onmessage = function (message) {
//    console.log(message.data);
    var m = JSON.parse(message.data);
    switch (m.type) {
      case 'plugins':
        self.validPlugins = m.valid;
        PupilStorePlugins(remote, m.valid);
        break;
      case 'data':
        if ( typeof(window.pupilGraphers[remote][m.data.name]) === 'undefined' ) {
          window.pupilGraphers[remote][m.data.name] = new PupilGrapher(remote, m.data.name, m.data);
        } else {
          window.pupilGraphers[remote][m.data.name].addData(m.data);
        }
        break;
    }
  };

}
