(function($, undefined){

  $.widget("fac.clientcreation", $.fac.facbase, {
    
    userFieldTitles: ['First Name', 'Last Name', 'Username', 'Password'],
    userFieldClasses: ['first-name', 'last-name', 'username', 'password'],
    
    options: { },
    
    _create: function() {
      var self = this,
          elem = this.element.html(''),
          o = this.options;
      
      self._facCreate(true);
      
      self.details = {};
      
      var widgetWrapper = $('<div>').addClass('fac-clientcreation ui-widget').appendTo(elem);
      
      // Create dev user authentication box
      $('<div>').html('FAC Authentication').addClass('section-header ui-widget-header').appendTo(widgetWrapper);
      var authWrap = $('<div>').addClass('ui-widget-content').appendTo(widgetWrapper);
      self.elems.devUserId = $('<input>');
      self.elems.devKey = $('<input type="password">');
      authWrap.append( $('<label>').append( $('<span>').addClass('label').html('User ID:') ).append(self.elems.devUserId) );
      authWrap.append( $('<label>').append( $('<span>').addClass('label').html('Password:') ).append(self.elems.devKey) );
      
      // Create client info wrap
      $('<div>').html("Setup Client's Admin Account <small>(client.findacode.com)</small>").addClass('section-header ui-widget-header').appendTo(widgetWrapper);
      var clientWrap = $('<div>').addClass('ui-widget-content').appendTo(widgetWrapper);
      self.elems.clientId = $('<input>');
      clientWrap.append( $('<label>').append( $('<span>').addClass('label').html('Client ID:') ).append(self.elems.clientId) )
        .append('<small>Client IDs must be between 1 and 32 characters long and may contain alpha-numeric characters, an underscore (_), and a dash (-).</small>');
      
      // Setup client user info area
      var clientUserWrap = $('<div>').addClass('user-wrap').appendTo(clientWrap);
      $('<div>').html('Client User Info').appendTo(clientUserWrap);
      $('<div>').html('<small>This is the user that logs into client.findacode.com.</small>').appendTo(clientUserWrap);
      var clientUserHeader = $('<div>').addClass('user-header user-row').appendTo(clientUserWrap);
      $.each(self.userFieldTitles, function(i, title) {
        $('<div>').addClass('user-th ui-state-active').html(title).appendTo(clientUserHeader);
      });
      var newRow = self.elems.clientUserRow = $('<div>').addClass('user-row').appendTo(clientUserWrap);
      $.each(self.userFieldClasses, function(i, field) {
        $('<div>').addClass('user-td ui-widget-content').append( $('<input>').addClass('user-info ' + field) ).appendTo(newRow);
      });
      
      // Account info
      $('<div>').html("Setup Client's Demo Account Users <small>(for use in APIs and widgets)</small>").addClass('section-header ui-widget-header').appendTo(widgetWrapper);
      var accountWrap = $('<div>').addClass('ui-widget-content').appendTo(widgetWrapper);
      
      // Default account user info
      var accountUserWrap = $('<div>').addClass('user-wrap').appendTo(accountWrap);
      $('<div>').html('Demo Account Users').appendTo(accountUserWrap);
      $('<div>').html('<small>At least one user is required to be setup; additional users are optional.</small>').appendTo(accountUserWrap);
      var accountUserHeader = $('<div>').addClass('user-header user-row').appendTo(accountUserWrap);
      $.each(self.userFieldTitles, function(i, title) {
        $('<div>').addClass('user-th ui-state-active').html(title).appendTo(accountUserHeader);
      });
      var newRow = self.elems.accountUserRow = $('<div>').addClass('user-row').appendTo(accountUserWrap);
      $.each(self.userFieldClasses, function(i, field) {
        $('<div>').addClass('user-td ui-widget-content').append( $('<input>').addClass('user-info ' + field) ).appendTo(newRow);
      });
      
      // Setup account users area
      self.elems.accountUserInfoWrap = $('<div>').addClass('account-user-info-wrap').appendTo(accountUserWrap);
      $('<button>').html('Add User').button({ icons: { primary: 'ui-icon-plus' } }).appendTo(accountUserWrap).click(function(){
        self._addAccountUser();
      });
      
      // "Create" button
      $('<button>').addClass('create-button').html('Create').button({ icons: { primary: 'ui-icon-check' } }).appendTo(accountWrap).click(function(){
        if( self._validateInformation() ) {
          $(this).button('disable').off('click');
          self._createClient();
        }
      });
      
      // Setup message area
      self.elems.messages = $('<div>').addClass('fac-clientcreation-messages ui-widget-content').appendTo(widgetWrapper).hide();
    },
    
    _addAccountUser: function() {
      var newRow = $('<div>').addClass('user-row').appendTo(this.elems.accountUserInfoWrap);
      $.each(this.userFieldClasses, function(i, field) {
        $('<div>').addClass('user-td ui-widget-content').append( $('<input>').addClass('user-info ' + field) ).appendTo(newRow);
      });
    },
    
    _validateInformation: function(){
      var self = this, valid = true;
      
      // Validate auth creds
      if( self.elems.devUserId.val() == '' || self.elems.devKey.val() == '' ) {
        FAC.displayMessage('error', 'You forgot to enter your FAC username or password.');
        valid = false;
      }
      
      // Validate client id
      if( self.elems.clientId.val() == '' ) {
        FAC.displayMessage('error', '<b>Client ID</b> is required.');
        valid = false;
      }
      if( !self.elems.clientId.val().match(/^[A-z0-9_-]{1,32}$/) ) {
        FAC.displayMessage('error', 'Invalid <b>Client ID</b>.');
        valid = false;
      }
      
      // Validate client user
      $('input', self.elems.clientUserRow).each(function(){
        if( $(this).val() == '' ) {
          FAC.displayMessage('error', 'All <b>Client User</b> fields are required.');
          return valid = false;
        }
      });
      
      // Validate client user
      $('input', self.elems.accountUserRow).each(function(){
        if( $(this).val() == '' ) {
          FAC.displayMessage('error', 'All <b>Demo Account User</b> fields are required.');
          return valid = false;
        }
      });
      
      return valid;
    },
    
    _createClient: function() {
      var self = this;
     
      // Get auth credentials
      var authCreds = { 
        'userId': self.elems.devUserId.val(), 
        'clientKey': self.elems.devKey.val(),
      };
      FAC.settings( authCreds );
      
      // Create client
      var clientId = self.elems.clientId.val();
      FAC.api({
        'url': 'system/client/create', 
        'data': { 'client-id': clientId }
      }).done(function(clientInfo){     
        // Set client id
        FAC.settings('clientId', clientId);
        
        // Save client id and client key
        self.details['client-id'] = clientId;
        self.details['client-key'] = clientInfo['data']['client-key'];
        
        self._message('info', 'Client ' + clientId + ' created.');
        self._updateClientUser();
      }).fail(function(returnData){
        self._message('error', 'Client creation failed:', returnData['status']['msgs']);
      });
    },
    
    _updateClientUser: function() {
      var self = this;
      
      // Get client user info
      var clientUserRow = self.elems.clientUserRow;
      var clientUserData = {
        'first-name': $('.first-name', clientUserRow).val(),
        'last-name': $('.last-name', clientUserRow).val(),
        'username': $('.username', clientUserRow).val(),
        'password': $('.password', clientUserRow).val(),
        'use-user-id': 1
      };
      clientUserData['name'] = clientUserData['first-name'] + ' ' + clientUserData['last-name']
      console.log( clientUserData );
      
      // Update client user
      FAC.api({
        'url': 'client/user/update',
        'data': clientUserData
      }).done(function(){
        // Save client user username and password
        self.details['client-username'] = clientUserData['username'];
        self.details['client-password'] = clientUserData['password'];
        
        self._message('info', 'Client user updated.');
        self._updateAccountUser();
      }).fail(function(returnData){
        self._message('error', 'Client user update failed:', returnData['status']['msgs']);
      });
    },
    
    _updateAccountUser: function() {
      var self = this;
      
      // Get first account user info
      var accountUserRow = self.elems.accountUserRow;
      var accountUserData = {
        'first-name': $('.first-name', accountUserRow).val(),
        'last-name': $('.last-name', accountUserRow).val(),
        'username': $('.username', accountUserRow).val(),
        'password': $('.password', accountUserRow).val(),
        'use-user-id': 1
      };
      console.log( accountUserData );
      
      // Update first account user
      FAC.api({
        'url': 'end-user/user/update',
        'data': accountUserData
      }).done(function(){
        // Save account user username and password
        self.details['account-username'] = accountUserData['username'];
        self.details['account-password'] = accountUserData['password'];
        
        self._message('info', 'Demo Account user updated.');
        self._createAccountUsers();
      }).fail(function(returnData){
        self._message('error', 'Demo Account user update failed:', returnData['status']['msgs']);
      });
    },
    
    _createAccountUsers: function() {
      var self = this;
      
      // Get account users
      var accountUsers = [];
      $('.user-row', self.elems.accountUserInfoWrap).each(function(i, e) {
        var row = $(this),
            user = {},
            valid = false;
        $.each(self.userFieldClasses, function(i, field) {
          if( $('.' + field, row).val() ) {
            user[field] = $('.' + field, row).val();
            valid = true;
          }
        });
        if( valid ) {
          accountUsers.push(user);
        }
      });
      console.log( accountUsers );
      
      // Create account users. Promises are collected for each user
      // that are resolved after the user has been created and the
      // appropriate permissions and products have been added.
      var accountUserPromises = [];
      $.each(accountUsers, function(i, user) {
        //var fullName = user['first-name'] + ' ' + user['last-name'];
        var fullName = i + 2; // i is zero based index (+1) and the first user is handled separately before this (+1)
        accountUserPromises.push( 
          FAC.api({
            'url': 'end-user/user/create',
            'data': user
          }).pipe(function(userInfo){
            // Update permission and products after the user has been created
            var permissionsPromise = FAC.api({
                'url': 'end-user/user/add-role',
                'data': { 'use-user-id': userInfo['data']['user-id'], 'role-id': 1 }
              }).fail(function(returnData){
                self._message('error', 'Updating permissions for user <b>' + fullName + '</b> failed:', returnData['status']['msgs']);
              }), 
              productsPromise = FAC.api({
                'url': 'end-user/user/add-product',
                'data': { 'use-user-id': userInfo['data']['user-id'], 'account-product-id': 1 }
              }).fail(function(returnData){
                self._message('error', 'Updating products for user <b>' + fullName + '</b> failed:', returnData['status']['msgs']);
              });
            
            // Return a promise that resolves when both the permission and products have been added
            return $.when(permissionsPromise, productsPromise).done(function(){
              self._message('info', 'Demo Account User <b>' + fullName + '</b> created.');
            });
          }).fail(function(returnData){
            self._message('error', 'Demo Account User  <b>' + fullName + '</b> failed to create:', returnData['status']['msgs']);
          })
        );
      });
      
      // We are done when all of the account users have been created
      $.when.apply(null, accountUserPromises).done(function(){
        self._finished();
      }).fail(function(){
        self._finished();
      });
    },
    
    _finished: function() {
      var self = this;
      
      self._message('info', 'Client setup finished.');
        
      // Reset settings
      FAC.settings({
        'userId': 'demo',
        'clientKey': 'demo',
        'clientId': 'demo'
      });
      
      // Display important details
      $('<div>')
        .append('<br>')
        .append( $('<div>').html('Client ID: ' + self.details['client-id']) )
        .append( $('<div>').html('Client Key: ' + self.details['client-key']) )
        .append( $('<div>').html('Client User ID: ' + 1) )
        .append( $('<div>').html('Client User Username: ' + self.details['client-username']) )
        .append( $('<div>').html('Client User Password: ' + self.details['client-password']) )
        .append( $('<div>').html('Account User ID: ' + 1) )
        .append( $('<div>').html('Account User Username: ' + self.details['account-username']) )
        .append( $('<div>').html('Account User Password: ' + self.details['account-password']) )
        .append('<br>')
        .dialog({ modal: true, autoOpen: true, title: 'Important Info', width: 600 });
    },
    
    _message: function(type, message, additional) {
      var m = $('<div>').addClass('clientcreation-message ui-state-' + ( type == 'error' ? 'error' : 'highlight') ).html(message).appendTo(this.elems.messages.show());
      if( additional ) {
        var list = $('<ul>').appendTo(m);
        $.each(additional, function(i, e) {
          $('<li>').html(e.msg).appendTo(list);
        });
      }
      $('html, body').animate({scrollTop: $(document).height()-$(window).height()}, 'fast', "linear" );
    },
    
    destroy: function() {
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));