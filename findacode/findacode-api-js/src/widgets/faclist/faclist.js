(function($, undefined){

  $.widget("fac.faclist", $.fac.facbase, {
    
    options: {
      loadList: function() { return $.Deferred().resolve(); },
      loggedOutMessage: 'Please login to view the list.',
      minHeight: 300,
      noDataMessage: 'No data was found.',
      popopenEntryOptions: {}
    },
    
    _create: function() {
      var self = this,
          elem = this.element.html(''),
          o = this.options;
      
      self._facCreate(true);
      
      self.listDefer = $.Deferred().resolve();
      
      var widgetWrapper = $('<div>').addClass('fac-list ui-widget').appendTo(elem);
      
      self.elems.list = $('<div>').addClass('fac-list-wrapper ui-widget-content').css('min-height', o.minHeight).appendTo(widgetWrapper);
      
      // Add logged-out message
      self.elems.loggedOutMessage = $('<p class="fac-list-loggedout-message">').html(o.loggedOutMessage).appendTo(self.elems.list);
      
      // Add no-data-found message
      self.elems.noDataMessage = $('<p class="fac-list-nodata-message">').html(o.noDataMessage).appendTo(self.elems.list);
    },
    
    _init: function() {
      this.refreshList();
    },
    
    refreshList: function() {
      var list = this.elems.list,
          self = this;
      
      if( !$.isLoggedIn() ) {
        self._facLogout();
        return;
      }
      
      this.elems.noDataMessage.hide();
      
      // Add spinner
      list.spinner();
      
      // Cancel previous calls
      self.listDefer.reject();
      
      // Make the loadList call and save the deferred
      self.listDefer = self.options.loadList().done(function(jsonReturn){
        self._clearList();
        
        // If there is list data, create the entries
        if( jsonReturn && jsonReturn.data && jsonReturn.data.length > 0 ) {
          $.each(jsonReturn.data, function(i, info) {
            self._createEntry(info);
          });
        } else {
          self.elems.noDataMessage.show();
        }
        
        list.spinner('destroy');
      });
    },
    
    _createEntry: function(info) {
      var list = this.elems.list,
          self = this;
          
      $('<div>')
        .addClass('fac-list-entry-popopen')
        .appendTo(list)
        .popopen( $.type(self.options.popopenEntryOptions) == 'function' ? self.options.popopenEntryOptions(info) : self.options.popopenEntryOptions );
    },
    
    _setOption: function( key, value ) {
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    _clearList: function() {
      this._trigger('clearList');
      $('.fac-list-entry-popopen', this.elems.list).popopen('destroy').remove();
    },
    
    _facLogin: function() {
      // Hide logged out message
      this.elems.loggedOutMessage.hide();
      
      this.refreshList();
    },
    
    _facLogout: function() {
      // Cleanup popen widgets
      this._clearList();
      
      // Show logged out message
      this.elems.loggedOutMessage.show();
      
      // Hide no-data message
      this.elems.noDataMessage.hide();
    },
    
    destroy: function() {
      this._clearList();
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));