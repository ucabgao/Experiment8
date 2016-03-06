var mysql;
var conn;

function setup(config) {
  try {
    mysql = require('mysql-libmysqlclient');

    try {
      conn = mysql.createConnectionSync();
      conn.connectSync(config.host,config.username,config.password,'information_schema');
    } catch(err) {
      console.log('mysql: Unable to connect to database.');
    }
  } catch(err) {
    console.log(err);
    console.log('mysql: mysql-libmysqlclient failed to load. (May not be installed or built correctly)');
  }
}

function hasPlugin() {
  if ( conn ) {
    return ['commands',
            'handlers',
            'network_traffic',
            'select_types',
            'slow_queries',
            'open_current',
            'open_persecond',
            'sorts',
            'table_locks',
            'tmp_tables',
            'connections_current',
            'connections_created',
            'innodb_rows'];
  } else {
    return false;
  }
}

function sendStats(stats, ret) {
  ret('mysql.commands', {
    time: new Date().getTime(),
    name: 'mysql.commands',
    type: 'counter',
    draw: 'stacked',
    data: {
      replace_select : stats.Com_replace_select,
      update_multi   : stats.Com_update_multi,
      insert_select  : stats.Com_insert_select,
      delete_multi   : stats.Com_delete_multi,
      load           : stats.Com_load,
      delete         : stats.Com_delete,
      replace        : stats.Com_replace,
      update         : stats.Com_update,
      insert         : stats.Com_insert,
      select         : stats.Com_select
    }
  });
  ret('mysql.handlers', {
    time: new Date().getTime(),
    name: 'mysql.handlers',
    type: 'counter',
    draw: 'stacked',
    data: {
      write         : stats.Handler_write,
      update        : stats.Handler_update,
      delete        : stats.Handler_delete,
      read_first    : stats.Handler_read_first,
      read_key      : stats.Handler_read_key,
      read_next     : stats.Handler_read_next,
      read_prev     : stats.Handler_read_prev,
      read_rnd      : stats.Handler_read_rnd,
      read_rnd_next : stats.Handler_read_rnd_next,
    }
  });
  ret('mysql.network_traffic', {
    time: new Date().getTime(),
    name: 'mysql.network_traffic',
    type: 'counter',
    draw: 'line',
    data: {
      rx : stats.Bytes_received,
      tx : stats.Bytes_sent
    }
  });
  ret('mysql.select_types', {
    time: new Date().getTime(),
    name: 'mysql.select_types',
    type: 'counter',
    draw: 'stacked',
    data: {
      full_join       : stats.Select_full_join,
      full_range_join : stats.Select_full_range_join,
      range           : stats.Select_range,
      range_check     : stats.Select_range_check,
      scan            : stats.Select_scan
    }
  });
  ret('mysql.slow_queries', {
    time: new Date().getTime(),
    name: 'mysql.slow_queries',
    type: 'counter',
    draw: 'line',
    data: {
      slow_queries : stats.Slow_queries
    }
  });
  ret('mysql.open_current', {
    time: new Date().getTime(),
    name: 'mysql.open_current',
    type: 'gauge',
    draw: 'line',
    data: {
      files             : stats.Open_files,
      streams           : stats.Open_streams,
      table_definitions : stats.Open_table_definitions,
      tables            : stats.Open_tables
    }
  });
  ret('mysql.open_persecond', {
    time: new Date().getTime(),
    name: 'mysql.open_persecond',
    type: 'counter',
    draw: 'line',
    data: {
      files             : stats.Opened_files,
      table_definitions : stats.Opened_table_definitions,
      tables            : stats.Opened_tables
    }
  });
  ret('mysql.sorts', {
    time: new Date().getTime(),
    name: 'mysql.sorts',
    type: 'counter',
    draw: 'line',
    data: {
      K_rows       : stats.Sort_rows / 1024,
      range        : stats.Sort_range,
      merge_passes : stats.Sort_merge_passes,
      scan         : stats.Sort_scan
    }
  });
  ret('mysql.table_locks', {
    time: new Date().getTime(),
    name: 'mysql.table_locks',
    type: 'counter',
    draw: 'line',
    data: {
      immediate : stats.Table_locks_immediate,
      waited    : stats.Table_locks_waited
    }
  });
  ret('mysql.tmp_tables', {
    time: new Date().getTime(),
    name: 'mysql.tmp_tables',
    type: 'counter',
    draw: 'line',
    data: {
      disk_tables : stats.Created_tmp_disk_tables,
      tables      : stats.Created_tmp_tables,
      files       : stats.Created_tmp_files
    }
  });
  ret('mysql.connections_current', {
    time: new Date().getTime(),
    name: 'mysql.connections_current',
    type: 'gauge',
    draw: 'line',
    data: {
      max_connections      : stats.max_connections,
      max_used_connections : stats.Max_used_connections,
      threads_connected    : stats.Threads_connected
    }
  });
  ret('mysql.connections_created', {
    time: new Date().getTime(),
    name: 'mysql.connections_created',
    type: 'counter',
    draw: 'line',
    data: {
      aborted_clients  : stats.Aborted_clients,
      aborted_connects : stats.Aborted_connects,
      connections      : stats.Connections
    }
  });
  ret('mysql.innodb_rows', {
    time: new Date().getTime(),
    name: 'mysql.innodb_rows',
    type: 'counter',
    draw: 'line',
    data: {
      deleted  : stats.Innodb_rows_deleted,
      inserted : stats.Innodb_rows_inserted,
      read     : stats.Innodb_rows_read,
      updated  : stats.Innodb_rows_updated
    }
  });

}

function gatherInnoDBBufferPool(stats, cb) {
  conn.query('SELECT * FROM INNODB_BUFFER_POOL_STATS;', function(err, res) {
    if ( err === null ) {
      res.fetchAll(function (err, rows) {
        rows.forEach(function (row) {
          Object.keys(row).forEach(function (key) {
            stats[key] = row[key];
          });
        });
      });
    }
    sendStats(stats, cb);
  });
}
function gatherStatus(stats, cb) {
  conn.query('SHOW GLOBAL STATUS;', function(err, res) {
    res.fetchAll(function (err, rows) {
      rows.forEach(function (row) {
        stats[row.Variable_name] = row.Value;
      });
      gatherInnoDBBufferPool(stats, cb);
    });
  });
}

function gatherVariables(stats, cb) {
  conn.query('SHOW GLOBAL VARIABLES;', function(err, res) {
    res.fetchAll(function (err, rows) {
      rows.forEach(function (row) {
        stats[row.Variable_name] = row.Value;
      });
      gatherStatus(stats, cb);
    });
  });
}

function runPlugin(ret) {
  var stats = {};
  gatherVariables(stats, ret);
}

module.exports = {
  test  : hasPlugin,
  run   : runPlugin,
  setup : setup
};
