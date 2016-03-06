/*
  TODO: varnish_threads.
*/
var varnishstat;
try {
  varnishstat = require('varnishstat');
} catch(err) {
  varnishstat = false;
}

function hasPlugin() {
  if ( varnishstat ) {
    return ['request_rate',
            'cache_hitrate',
            'backend_traffic',
            'objects',
            'transfer_rates',
            'memory_usage',
            'objects_per_objhead',
            'losthdr',
            'obj_sendfile_vs_write',
            'hcb',
            'esi',
            'objoverflow',
            'session',
            'session_herd',
            'shm_writes',
            'shm',
            'allocations',
            'purges',
            'expunge',
            'lru',
            'data_structures'];
  }
  else {
    return false;
  }
}

function runPlugin(ret) {
  var val = varnishstat.fetchStats();

  ret('varnish.cache_hitrate', {
    time: new Date().getTime(),
    type: 'gauge',
    draw: 'stacked',
    data: {
      cache_hit    : (val.cache_hit     / val.client_req) * 100,
      cache_miss   : (val.cache_miss    / val.client_req) * 100,
      cache_hitpass: (val.cache_hitpass / val.client_req) * 100
    }
  });
  ret('varnish.request_rate', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      cache_hit         : val.cache_hit,
      cache_hitpass     : val.cache_hitpass,
      cache_miss        : val.cache_miss,
      backend_conn      : val.backend_conn,
      backend_unhealthy : val.backend_unhealthy,
      client_req        : val.client_req,
      client_conn       : val.client_conn,
      s_pipe            : val.s_pipe,
      s_pass            : val.s_pass
    }
  });
  ret('varnish.backend_traffic', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      backend_conn     : val.backend_conn,
      backend_unhealthy: val.backend_unhealthy,
      backend_busy     : val.backend_busy,
      backend_fail     : val.backend_fail,
      backend_reuse    : val.backend_reuse,
      backend_recycle  : val.backend_recycle,
      backend_unused   : val.backend_unused,
      backend_req      : val.backend_req
    }
  });
  ret('varnish.objects', {
    time: new Date().getTime(),
    type: 'gauge',
    draw: 'line',
    data: {
      n_object     : val.n_object,
      n_objecthead : val.n_objecthead
    }
  });
  ret('varnish.transfer_rates', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      s_hdrbytes  : val.s_hdrbytes,
      s_bodybytes : val.s_bodybytes
    }
  });
  ret('varnish.memory_usage', {
    time: new Date().getTime(),
    type: 'gauge',
    draw: 'line',
    data: {
      sm_balloc : val.sm_balloc,
      sma_nbytes: val.sma_nbytes,
      sms_nbytes: val.sms_nbytes
    }
  });
  ret('varnish.objects_per_objhead', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      obj_per_objhead : val.n_object / val.n_objecthead
    }
  });
  ret('varnish.losthdr', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      losthdr : val.losthdr
    }
  });
  ret('varnish.obj_sendfile_vs_write', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      n_objsendfile : val.n_objsendfile,
      n_objwrite    : val.n_objwrite
    }
  });
  ret('varnish.hcb', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      hcb_nolock : val.hcb_nolock,
      hcb_lock   : val.hcb_lock,
      hcb_insert : val.hcb_insert
    }
  });
  ret('varnish.esi', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      esi_parse  : val.esi_parse,
      esi_errors : val.esi_errors
    }
  });
  ret('varnish.objoverflow', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      n_objoverflow  : val.n_objoverflow
    }
  });
  ret('varnish.session', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      sess_closed   : val.sess_closed,
      sess_pipeline : val.sess_pipeline,
      sess_readahead: val.sess_readahead,
      sess_linger   : val.sess_linger
    }
  });
  ret('varnish.session_herd', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      sess_herd   : val.sess_herd
    }
  });
  ret('varnish.shm_writes', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      shm_records   : val.shm_records,
      shm_writes    : val.shm_writes
    }
  });
  ret('varnish.shm', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      shm_flushes : val.shm_flushes,
      shm_cont    : val.shm_cont,
      shm_cycles  : val.shm_cycles
    }
  });
  ret('varnish.allocations', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      sm_nreq  : val.sm_nreq,
      sma_nreq : val.sma_nreq,
      sms_nreq : val.sms_nreq
    }
  });
  ret('varnish.purges', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      n_ban_add      : val.n_ban_add,
      n_ban_retire   : val.n_ban_retire,
      n_ban_obj_test : val.n_ban_obj_test,
      n_ban_re_test  : val.n_ban_re_test,
      n_ban_dups     : val.n_ban_dups
    }
  });
  ret('varnish.expunge', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      n_expired   : val.n_expired,
      n_lru_nuked : val.n_lru_nuked
    }
  });
  ret('varnish.lru', {
    time: new Date().getTime(),
    type: 'counter',
    draw: 'line',
    data: {
      n_lru_saved : val.n_lru_saved,
      n_lru_moved : val.n_lru_moved
    }
  });
  ret('varnish.data_structures', {
    time: new Date().getTime(),
    type: 'gauge',
    draw: 'line',
    data: {
      n_srcaddr      : val.n_srcaddr,
      n_srcaddr_acct : val.n_srcaddr_acct,
      n_sess_mem     : val.n_sess_mem,
      n_sess         : val.n_sess,
      n_smf          : val.n_smf,
      n_smf_frag     : val.n_smf_frag,
      n_smf_large    : val.n_smf_large,
      n_vbe_conn     : val.n_vbe_conn,
      n_bereq        : val.n_bereq
    }
  });

}

module.exports = {
  test : hasPlugin,
  run  : runPlugin
};
