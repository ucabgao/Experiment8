/***
{
  "descr" : "Handles the user's login status. If the user is logged out, a login button is shown. If the user is logged in, the username and a logout button is shown.",
  "declaration" : "FAC(selector).loginstatus();",
  "events" : [ ],
  "methods" : [ ],
  "options" : [ ]
}
***/
(function($, undefined){

  $.widget("fac.loginstatus", $.fac.facbase, {
    
    options: { },
    
    _create: function() {
      var self = this,
          elem = this.element.addClass('fac-loginstatus-wrapper'),
          o = this.options;
      
      self._facCreate(true);
      
      // Setup demo header div
      self.elems.userDiv = FAC('<span>').addClass('fac-loginstatus-user').appendTo( elem );
      self.elems.loginButton = FAC('<button>').addClass('fac-loginstatus-login').html('Login').button().appendTo( elem ).click(function(){ FAC.loginPopup(); });
      self.elems.logoutButton = FAC('<button>').addClass('fac-loginstatus-logout').html('Logout').button().appendTo( elem ).click(function(){ FAC.logout(); });
    },
    
    _init: function() {
      // Check user status
      if( FAC.isLoggedIn() ) {
        this._facLogin();
      } else {
        this._facLogout();
      }
    },
    
    _facLogin: function() {
      // Set username
      this.elems.userDiv.html( FAC.settings('userId') ).show();
      
      // Show logout button
      this.elems.logoutButton.show();
      
      // Hide login button
      this.elems.loginButton.hide();
    },
    
    _facLogout: function() {
      // Set username
      this.elems.userDiv.hide();
      
      // Hide logout button
      this.elems.logoutButton.hide();
      
      // Show login button
      this.elems.loginButton.show();
    },
    
    destroy: function() {
      this.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));