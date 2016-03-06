var http            = require('http')
  , pupilServer     = require('./lib/pupilserver')
  , express         = require('./lib/express')


var server = http.createServer(express.app).listen(express.app.get('port'), function(){
  console.log("Pupil running on port " + express.app.get('port'));
});

pupilServer.init(server);
