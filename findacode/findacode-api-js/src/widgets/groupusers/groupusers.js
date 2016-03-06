(function($, undefined){

  $.widget("fac.groupusers", $.fac.facbase, {
    
    options: {
      'groupId': null
    },
    
    // Setup widget
    _create: function() {
      var self = this;
      
      self._facCreate(true);
      self.element.faclist({
        clearList: function() {
          $('.fac-groupusers-user', $(this)).group('destroy');
        },
        loadList: function() { 
          return FAC.api.enduser.groupUsers(self.options.groupId); 
        },
        minHeight: 0,
        loggedOutMessage: 'Please login to view the user\'s list.',
        noDataMessage: 'No users are assigned to this group.',
        popopenEntryOptions: function (userInfo) {
          return {
            'title': $.fac._formatUserListName(userInfo),
            'open': function() {
              var userContainer = $(this);
              
              // If this is the first time opening, set things up
              if( !userContainer.data('fac-groupuser-groups-loaded') ) {
                
                // Mark the data as having been loaded
                userContainer.data('fac-groupuser-groups-loaded', true)
                
                // Add the title
                $('<div>').addClass('fac-groupusers-title').html("User's Groups").appendTo(userContainer);
                
                // Get the user's groups
                $.api.enduser.userGroups({
                  'useUserId': userInfo['user-id']
                }).done(function(jsonReturn){
                  
                  // List the user's groups. We know they belong to at least
                  // one group because they're associated with this group.
                  // When this group is listed, emphasize it.
                  $.each(jsonReturn.data, function(i, userGroup) {
                    if( userGroup.assigned == 'Y' ) {
                      var groupListing = $('<div>').addClass('fac-groupusers-othergroup').html(userGroup.name).appendTo(userContainer);
                      if( userGroup['group-id'] == self.options.groupId ) {
                        groupListing.addClass('fac-groupusers-samegroup');
                      }
                    }
                  });
                });
              }
            }
          };
        }
      });
    },
    
    _init: function() {
      
    },
    
    destroy: function() {
      this.faclist('destroy')
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));