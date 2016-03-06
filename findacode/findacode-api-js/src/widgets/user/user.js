(function($){
  
  /*
   * fac.user
   */
  $.widget("fac.user", $.fac.facbase, {
    
    options: {
      userData: null
    },
    
    _create: function() {
      var self = this,
          elem = this.element.html(''),
          o = this.options,
          user = o.userData;
      
      self._facCreate(true);
      
      var widgetWrapper = $('<div>').addClass('fac-user ui-widget').appendTo(elem);
      
      // Add deactivate button
      widgetWrapper.append(
        $('<div class="fac-user-activate-wrap" />').append($('<button>').button({'label':user['active'] == 'Y' ? 'Inactivate' : 'Activate'}).click(function() {
          var activateButton = $(this);
          FAC.api.enduser.userUpdate({
            'useUserId': user['user-id'],
            'active': user['active'] == 'Y' ? 'N' : 'Y'
          }).done(function(jsonReturn){
            // Check to see if the statusChange event should be fired
            if(jsonReturn.data.active != o.userData.active) {
              // Save new group data  
              o.userData = jsonReturn.data;
              
              // Update the text of the button
              activateButton.button('option', 'label', o.userData.active == 'Y' ? 'Inactivate' : 'Activate');
              
              // Trigger statusChange event if necessary
              self._trigger('statusChange', null, o.userData);
            }
          });
        }))
      );
      
      //
      // Add user widgets to the detail section
      //
      
      // User info widget
      self.elems.info = $('<div>').appendTo(widgetWrapper).popopen({
        'title': 'Information',
        'open': function() {
          $(this).userinfo({ 
            'userId': user['user-id'],
            'afterEdit': function(event, userInfo) {
              elem.popopen('option', 'title', $.fac._formatUserListName(userInfo));
            }
          });
        }
      });
      
      /*
       * Commented out until the product stuff is live
       *
      // User product widget
      self.elems.products = $('<div>').appendTo(widgetWrapper).popopen({
        'title': 'Products',
        'open': function() {
          $(this).userproducts({ 'user-id': user['user-id'] });
        }
      });
      */
      
      // User groups widget
      self.elems.groups = $('<div>').appendTo(widgetWrapper).popopen({
        'title': 'Groups',
        'open': function() {
          $(this).usergroups({ 'user-id': user['user-id'] });
        }
      });
      
      // User groups widget
      self.elems.roles = $('<div>').appendTo(widgetWrapper).popopen({
        'title': 'Roles',
        'open': function() {
          $(this).userroles({ 'user-id': user['user-id'] });
        }
      });
    },
    
    destroy: function() {
      this.elems.info.userinfo('destroy');  
      //this.elems.products.userproducts('destroy');
      this.elems.groups.usergroups('destroy');
      this.elems.roles.userroles('destroy');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
  
}(FAC));