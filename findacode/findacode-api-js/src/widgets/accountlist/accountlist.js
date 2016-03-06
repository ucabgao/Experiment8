(function($, undefined){

  $.widget("fac.accountlist", $.fac.facbase, {
    
    options: {
      'accountButtons': [ ]
    },
    
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
      
      elem.html('');
      var widgetWrapper = $('<div>').addClass('fac-accountlist ui-widget').appendTo(elem);
      
      // Setup header
      var accountFilterTimer;
      var header = $('<div>').addClass('fac-accountlist-header').appendTo(widgetWrapper).append('<span class="fac-label">Filter</span>');
      self.elems.filter = $('<input>').appendTo(header).keyup(function(){       
        // Ignore keypresses if the value didn't change or if it is blank
        if($(this).val() != self.previousUserFilter) {
          if(accountFilterTimer) {
            clearTimeout(accountFilterTimer);
          }
          accountFilterTimer = setTimeout(function(){
            self._init();
          }, 500);
        }
        self.previousUserFilter = $(this).val();
      });
      
      var limitWrapper = $('<div>').addClass('fac-accountlist-limit-wrap').appendTo(header);
      limitWrapper.append('<span class="fac-label">Show</span>');
      self.elems.activeLimit = $('<select><option value="Y">Active Accounts</option><option value="">All</option></select>')
        .appendTo(limitWrapper)
        .multiselect({
          multiple: false,
          header: false,
          height: 'auto',
          selectedList: 1,
          minWidth: '10em',
          close: function(event,ui) {
            self._init();
          }
        });
      
      // Add list wrapper
      self.elems.list = $('<div>').addClass('fac-accountlist-list ui-widget-content').appendTo(widgetWrapper);
      
      // Add logged out message
      self.elems.loggedOutMessage = $('<p class="fac-accountlist-loggedout-message">Login to view the accounts list.</p>').appendTo(self.elems.list);
      
      // Create add dialog
      self.elems.addDialog = $('<div>')
        .appendTo(widgetWrapper)
        .append('<span class="fac-label">Name</span>')
        .append(self.elems.newAccountName = $('<input>').addClass('fac-accountlist-newname'))
        .editdialog({
          'title': 'Add Account',
          'save': function() {
            return FAC.api.enduser.accountCreate(accountName).done(function(){
              self.elems.newAccountName.val('');
              self._init();
            });
          }
        });
      
      // Setup footer
      var footer = $('<div>').addClass('fac-accountlist-footer').appendTo(widgetWrapper);
      $('<button>').html('Add').addClass('fac-accountlist-addaccount').button().appendTo(footer).click(function(){
        self.elems.addDialog.editdialog('open');
      });
    },
    
    _init: function() {
      var self = this,
          o = this.options;
      
      self._destroyAccountPopopens();      
      
      if( !$.isLoggedIn() ) {
        self._loggedOut();
        return;
      }
      
      self.elems.loggedOutMessage.hide();
      
      // Get accounts list
      self.elems.list.spinner();
      FAC.api.enduser.accountList({
        'active': self.elems.activeLimit.val(), 
        'q': self.elems.filter.val()
      }).done(function(jsonReturn){
        
        // Iterate over accounts and create the popopens
        $.each(jsonReturn.data, function(i, account) {
          $('<div class="fac-accountlist-account-popopen">').appendTo(self.elems.list).popopen({
            'title': account.name,
            'open': function() {
              var accountContainer = $(this);
              accountContainer.accountinfo({ 
                'accountId': account['account-id'],
                'buttons': o.accountButtons,
                'infoChange': function(e, accountInfo) {
                  accountContainer.popopen({
                    'title': accountInfo.name
                  });
                }
              });
            }
          });
        });
        self.elems.list.spinner('destroy');
      });
    },
    
    _facLogin: function() {
      this._init();
    },
    
    _facLogout: function() {
      this._loggedOut();
    },
    
    _destroyAccountPopopens: function() {
      $('.fac-accountlist-account-popopen', this.elems.list).accountinfo('destroy').popopen('destroy').remove();
    },
    
    _loggedOut: function(){
      // Destroy account popopens
      this._destroyAccountPopopens();
      
      // Destroy spinner
      this.elems.list.spinner('destroy');
      
      // Show logged out message
      this.elems.loggedOutMessage.show();
    },
    
    _setOption: function( key, value ) {
      var self = this,
          o = self.options;
      
      switch( key ) {
        case "option":
          // do stuff
          break;
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    destroy: function() {
      this.elems.list.faclist('destroy');
      this.elems.activeLimit.multiselect('destroy');
      this.elems.addDialog.editdialog('destroy');
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));