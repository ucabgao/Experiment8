(function($, undefined){

  $.widget("fac.userinfo", $.fac.facbase, {
    
    options: {
      'userData': {},
      'userId': null
    },
    
    // Setup widget
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
      self._getUserInfo();
      
      elem.addClass('fac-userinfo');
      
      // Create info wrapper
      self.elems.userInfo = $('<div>').appendTo(elem).addClass('fac-userinfo-info');
      
      // Add edit button
      elem.append($('<button class="fac-userinfo-edit-button">Edit</button>').button().click(function(){
        self.elems.editDialog.editdialog('open');
      }));
      
      // Create dialog
      var editDialog = self.elems.editDialog = $('<div class="fac-userinfo-edit-dialog" />').appendTo(elem)
        .append($('<div class="fac-userinfo-edituser-dialog-col1" />').html('First Name:'))
        .append($('<div class="fac-userinfo-edituser-dialog-col2" />').append('<input class="fac-userinfo-edituser-firstname" />'))
        .append($('<div class="fac-userinfo-edituser-dialog-col1" />').html('Last Name:'))
        .append($('<div class="fac-userinfo-edituser-dialog-col2" />').append('<input class="fac-userinfo-edituser-lastname" />'))
        .append($('<div class="fac-userinfo-edituser-dialog-col1" />').html('Email:'))
        .append($('<div class="fac-userinfo-edituser-dialog-col2" />').append('<input class="fac-userinfo-edituser-email" />'))
        .append($('<div class="fac-userinfo-edituser-dialog-col1" />').html('Username:'))
        .append($('<div class="fac-userinfo-edituser-dialog-col2" />').append('<input class="fac-userinfo-edituser-username" />'))
        .editdialog({
          modal: true,
          title: 'Edit User Information',
          position: {
            my: "center",
            at: "center",
            of: elem
          },
          save: function() {
            return FAC.api.enduser.userUpdate({
              'useUserId': o.userData['user-id'], 
              'firstName': $('.fac-userinfo-edituser-firstname', editDialog).val(),
              'lastName': $('.fac-userinfo-edituser-lastname', editDialog).val(), 
              'email': $('.fac-userinfo-edituser-email', editDialog).val(), 
              'username': $('.fac-userinfo-edituser-username', editDialog).val()
            })
            .done(function(jsonReturn){
              o.userData = jsonReturn.data;
              self._updateUserInfo();
            });
          },
          aftersave: function(e) {
            self._trigger('afterEdit', e, o.userData);
          }
        });
      // Save when enter is pressed in any field
      $('input', editDialog).keydown( function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13) {
          editDialog.editdialog('save');
        }
      });
    },
    
    _init: function() {
      
    },
    
    _getUserInfo: function() {
      var self = this;
      
      // Get user info
      self.element.spinner();
      FAC.api.enduser.userInfo({
        'useUserId': this.options.userId
      }).done(function(jsonReturn){          
        // Save user info
        self.options.userData = jsonReturn.data;
        self._updateUserInfo();
      });
    },
    
    _updateUserInfo: function() {
      var self = this,
          o = self.options;
      
      // Add content
      self.elems.userInfo.html('')
        .append($('<div class="fac-userinfo-col1" />').append('<div class="fac-userinfo-label">First Name</div>').append($('<div class="fac-userinfo-text fac-userinfo-firstname-text" />').html(o.userData['first-name'])))
        .append($('<div class="fac-userinfo-col2" />').append('<div class="fac-userinfo-label">Last Name</div>').append($('<div class="fac-userinfo-text fac-userinfo-lastname-text" />').html(o.userData['last-name'])))
        .append($('<div class="fac-userinfo-col1" />').append('<div class="fac-userinfo-label">Email</div>').append($('<div class="fac-userinfo-text fac-userinfo-email-text" />').html(o.userData['email'])))
        .append($('<div class="fac-userinfo-col2" />').append('<div class="fac-userinfo-label">Username</div>').append($('<div class="fac-userinfo-text fac-userinfo-username-text" />').html(o.userData['username'])))
        ;
        
      self.element.spinner('destroy');
        
      // Set values of edit dialog inputs
      $('.fac-userinfo-edituser-firstname', self.elems.editDialog).val(o.userData['first-name']);
      $('.fac-userinfo-edituser-lastname', self.elems.editDialog).val(o.userData['last-name']);
      $('.fac-userinfo-edituser-email', self.elems.editDialog).val(o.userData['email']);
      $('.fac-userinfo-edituser-username', self.elems.editDialog).val(o.userData['username']);
    },
    
    _setOption: function( key, value ) {
      if( key == 'userId' ) {
        this.options[key] = value;
        this._getUserInfo();
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    destroy: function() {
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));