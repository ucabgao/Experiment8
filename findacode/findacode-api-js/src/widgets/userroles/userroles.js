(function($, undefined){

  $.widget("fac.userroles", $.fac.facbase, {
    
    options: {
      'user-id': null
    },
    
    _create: function() {
      this._facCreate(true);
      this._getRoles();
    },
    
    _init: function() {
    
    },
    
    _getRoles: function() {
      var self = this,
          elem = self.element;
      
      elem.spinner();
      
      // Destroy previous popopens
      $('.fac-userroles-role', elem).popopen('destroy').remove();
      
      // Load roles
      FAC.api.enduser.userRoles({
        'useUserId': this.options['user-id']
      }).done(function(jsonReturn) {
        // Create role popopens
        $.each(jsonReturn.data, function(i, role) {
          var assigned = role.assigned == 'Y';
          $('<div>')
            .appendTo(elem)
            .data('fac-roleassigned', false)
            .addClass('fac-userroles-role')
            .popopen({ 
              'title': role['name'],
              'manualIconState': true,
              'icon': assigned ? 'ui-icon-circle-check' : 'ui-icon-close',
              'open': function() {
                var roleContainer = $(this);
                if( !roleContainer.data('fac-roleassigned') ) {
                  roleContainer.data('fac-roleassigned',true);
                  
                  // Add/remove role button
                  $('<button class="fac-userroles-addremove-button">').text( assigned ? 'Remove' : 'Add').button().click(function(){
                    
                    // Confirmation dialog
                    $('<div>').appendTo(roleContainer).confirmdialog({
                      'message': 'Are you sure you want to ' + ( assigned ? 'remove' : 'add' ) + ' this role?',
                      'yesHandler': function() {
                        var dialog = $(this);
                        var rolePromise;
                        if( assigned ) {
                          rolePromise = FAC.api.enduser.removeRole(role['role-id'], self.options['user-id']);
                        } else {
                          rolePromise = FAC.api.enduser.addRole(role['role-id'], self.options['user-id']);
                        }
                        rolePromise.done(function(){
                          dialog.confirmdialog('close');
                          self._getRoles();
                        });
                      }
                    });
                  }).appendTo(roleContainer);
                }
              }
            });
        });
        
        elem.spinner('destroy');
        
      });
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
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));