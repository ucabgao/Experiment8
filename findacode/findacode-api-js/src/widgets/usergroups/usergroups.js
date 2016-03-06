(function($, undefined){

  $.widget("fac.usergroups", $.fac.facbase, {
    
    options: {
      'user-id': null
    },
    
    _create: function() {
      this._facCreate(true);
      this._getGroups();
    },
    
    _init: function() {
    
    },
    
    _getGroups: function() {
      var self = this,
          elem = self.element;
      
      elem.spinner();
      
      // Destroy previous popopens
      $('.fac-usergroups-group', elem).popopen('destroy').remove();
      
      // Load groups
      FAC.api.enduser.userGroups({
        'useUserId': self.options['user-id']
      }).done(function(jsonReturn){        
        // Create group popopens
        $.each(jsonReturn.data, function(i, group) {
          var assigned = group.assigned == 'Y';
          $('<div>')
            .appendTo(elem)
            .data('fac-groupassigned', false)
            .addClass('fac-usergroups-group')
            .popopen({ 
              'title': group['name'],
              'manualIconState': true,
              'icon': assigned ? 'ui-icon-circle-check' : 'ui-icon-close',
              'open': function() {
                var groupContainer = $(this);
                if( !groupContainer.data('fac-groupassigned') ) {
                  groupContainer.data('fac-groupassigned',true);
                  
                  // Add/remove group button
                  $('<button class="fac-usergroups-addremove-button">').text( assigned ? 'Remove' : 'Add').button().click(function(){
                    
                    // Confirmation dialog
                    $('<div>').appendTo(groupContainer).confirmdialog({
                      'message': 'Are you sure you want to ' + ( assigned ? 'remove' : 'add' ) + ' this group?',
                      'yesHandler': function() {
                        var dialog = $(this);
                        var groupPromise;
                        if( assigned ) {
                          groupPromise = FAC.api.enduser.userRemoveGroup( group['group-id'], {
                            'useUserId': self.options['user-id']
                          });
                        } else {
                          groupPromise = FAC.api.enduser.userAddGroup( group['group-id'], {
                            'useUserId': self.options['user-id']
                          });
                        }
                        groupPromise.done(function(){
                          dialog.confirmdialog('close');
                          self._getGroups();
                        });
                      }
                    });
                  }).appendTo(groupContainer);
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