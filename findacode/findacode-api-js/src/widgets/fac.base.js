//
// Base fac ui widget
//
(function($, undefined){

  $.widget("fac.facbase", {
    
    _facCreate: function(addFACClass) {
      var self = this,
          elem = self.element;
      
      // Add the "fac" class when necessary
      if( addFACClass && elem.closest('.fac').length == 0 ) {
        elem.addClass('fac');
      }
      
      // Create commonly used elems object
      self.elems = {};
      
      // Setup demo when logged out; remove demo when logged in
      FAC.events.on('login', function(data){
        self._facLogin.call(self, data);
      });
      FAC.events.on('logout', function(data){
        self._facLogout.call(self, data);
      });
    },
    
    _facDestroy: function() {
      // When do you know that we can cleanup the fac class?
    },
    
    _facLogin: $.noop,
    
    _facLogout: $.noop
    
  });
  
}(FAC));