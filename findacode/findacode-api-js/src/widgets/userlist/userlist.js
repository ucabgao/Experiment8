(function($){
  
  $.fac._formatUserListName = function(user) {
    return user['last-name'] + ', ' + user['first-name'];
  };

  /*
   * fac.userlist
   */
  $.widget("fac.userlist", $.fac.facbase, {
    
    options : {
      pager: false,
      accountId: null
    },
    
    _create : function() {
      var self = this,
          elem = this.element.html(''),
          o = this.options;
      
      self._facCreate(true);
      
      var widgetWrapper = $('<div>').addClass('fac-userlist ui-widget').appendTo(elem);
      
      // Create dummy deferred to start off the refreshList with a resolved deferred
      self.userListDefer = $.Deferred().resolve();
      
      // Create control wrapper
      self.elems.controls = $('<div class="fac-userlist-controls" />').appendTo(widgetWrapper);
      
      // Create name filter
      self.elems.controls.append($('<span class="fac-label">').html('Search'));
      self.userFilterTimer;
      self.previousUserFilter = '';
      self.elems.userFilter = $('<input class="fac-userlist-name-filter">').appendTo(self.elems.controls).keyup(function(){       
        // Ignore keypresses if the value didn't change or if it is blank
        if($(this).val() != self.previousUserFilter) {
          if(self.userFilterTimer) {
            clearTimeout(self.userFilterTimer);
          }
          self.userFilterTimer = setTimeout(function(){
            self.elems.userList.faclist('refreshList');
          }, 500);
        }
        self.previousUserFilter = $(this).val();
      });
      
      // Create group select
      self.elems.controls.append($('<span class="fac-label">').html('Group'));
      self.elems.groupSelect = $('<select class="fac-userlist-group-select">')
        .appendTo(self.elems.controls)
        .multiselect({
          multiple: false,
          header: false,
          height: 'auto',
          selectedList: 1,
          minWidth: '8em',
          close: function(event,ui) {
            self.elems.userList.faclist('refreshList');
          }
        });
      
      // Update groups
      self._refreshGroups();
      
      // Create status select
      self.elems.controls.append($('<span class="fac-label">').html('Show'));
      self.elems.statusSelect = $('<select>').appendTo(self.elems.controls)
        .append('<option value="Y">Active</option>')
        .append('<option value="N">Inactive</option>')
        .multiselect({
          multiple: false,
          header: false,
          height: 'auto',
          selectedList: 1,
          minWidth: '6em',
          close: function(event,ui) {
            self.elems.userList.faclist('refreshList');
          }
        });
      
      // Create list
      self.elems.userList = $('<div>')
        .addClass('fac-userlist-list')
        .appendTo(widgetWrapper)
        .faclist({
          clearList: function() {
            $('.fac-user', $(this)).user('destroy');
          },
          loadList: function() { 
            return FAC.api.enduser.userList({
              'active': self.elems.statusSelect.val(), 
              'q': self.elems.userFilter.val(), 
              'groupId': self.elems.groupSelect.val(), 
              'accountId': $.settings('userType') == 'client' ? o.accountId : null
            });         
          },
          loggedOutMessage: 'Please login to view the user list.',
          noDataMessage: 'No users were found.',
          popopenEntryOptions: function (userInfo) {
            return {
              'title': $.fac._formatUserListName(userInfo),
              'open': function() {
                $(this).user({ 
                  'userData': userInfo,
                  'statusChange': function(e, userData) {
                    self.elems.userList.faclist('refreshList');
                  }
                });
              }
            };
          }
        });
      
      // Create footer
      self.elems.footer = $('<div class="fac-userlist-footer" />').appendTo(widgetWrapper);
      
      // Create pager
      if( o.pager ) {
        self.elems.pager = $('<div class="fac-userlist-pager" />').appendTo(self.elems.footer);
      }
      
      // Add user button
      self.elems.addUserButton = $('<button class="fac-userlist-adduser-button">Add User</button>').button()
        .appendTo(self.elems.footer).click(function(e){
          if( $.isLoggedIn() ) {
            self.elems.addUserDialog.editdialog('open');
          }
        });
        
      // Add user dialog
      var userDialog = self.elems.addUserDialog = $('<div class="fac-userlist-adduser-dialog" />')
        .append($('<div class="fac-userlist-adduser-dialog-col1" />').html('First Name:'))
        .append($('<div class="fac-userlist-adduser-dialog-col2" />').append('<input class="fac-userlist-adduser-firstname" />'))
        .append($('<div class="fac-userlist-adduser-dialog-col1" />').html('Last Name:'))
        .append($('<div class="fac-userlist-adduser-dialog-col2" />').append('<input class="fac-userlist-adduser-lastname" />'))
        .append($('<div class="fac-userlist-adduser-dialog-col1" />').html('Email:'))
        .append($('<div class="fac-userlist-adduser-dialog-col2" />').append('<input class="fac-userlist-adduser-email" />'))
        .append($('<div class="fac-userlist-adduser-dialog-col1" />').html('Username:'))
        .append($('<div class="fac-userlist-adduser-dialog-col2" />').append('<input class="fac-userlist-adduser-username" />'))
        .append($('<div class="fac-userlist-adduser-dialog-col1" />').html('Password:'))
        .append($('<div class="fac-userlist-adduser-dialog-col2" />').append('<input type="password" class="fac-userlist-adduser-password" />'))
        .appendTo(widgetWrapper)
        .editdialog({
          modal: true,
          title: 'Add User',
          modifyOnce: true,
          position: {
            my: "center",
            at: "center",
            of: elem
          },
          aftersave: function() {
            self.elems.userList.faclist('refreshList');
          },
          save: function() {
            return FAC.api.enduser.userCreate({
              'firstName': $('.fac-userlist-adduser-firstname', userDialog).val(),
              'lastName': $('.fac-userlist-adduser-lastname', userDialog).val(),
              'email': $('.fac-userlist-adduser-email', userDialog).val(),
              'username': $('.fac-userlist-adduser-username', userDialog).val(),
              'password': $('.fac-userlist-adduser-password', userDialog).val(),
              'accountId': $.settings('userType') == 'client' ? o.accountId : null
            });
          },
          close: function() {
            $('input',$(this)).val('');
          }
        });
      $('input', self.elems.addUserDialog).keydown( function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13) {
          self.elems.addUserDialog.editdialog('save');
        }
      });
    },
    
    _init: function() {

    },
    
    _refreshGroups: function() {
      var self = this;
      
      // Remove current groups
      self.elems.groupSelect.html('').multiselect('refresh');
      
      // Get group list
      FAC.api.enduser.groupList({
        'active': 'Y', 
        'accountId': $.settings('userType') == 'client' ? this.options.accountId : null
      }).done(function(jsonReturn){  
        
        // Add new groups
        self.elems.groupSelect.append($('<option>',{'value':'','text':' - None - '}));
        $.each(jsonReturn.data,function(i,group) {
          self.elems.groupSelect.append($('<option>',{'value':group['group-id'],'text':group['name']}));
        });
        
        // Refresh multiselect widget
        self.elems.groupSelect.multiselect('refresh');
        
      });
    },
    
    _facLogin: function() {
      // Refresh groups select
      this._refreshGroups();
    },
    
    _facLogout: function() {
      // Refresh groups select
      this._refreshGroups();
    },
    
    _destroyUserWidgets: function() {
      $('.fac-userlist-user-popopen', this.elems.userList).user('destroy').popopen('destroy').remove();
    },
    
    destroy: function() {
      this.elems.userList.faclist('destroy');
      this.elems.groupSelect.multiselect('destroy');
      this.elems.statusSelect.multiselect('destroy');
      this.elems.addUserDialog.editdialog('destroy');
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));