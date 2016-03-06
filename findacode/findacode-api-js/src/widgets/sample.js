/***
{
  "descr" : "<widget descr>",
  "declaration" : "FAC(selector).sample([options]);",
  "events" : [
    {
      "name" : "<event name>",
      "descr" : [
        "This event is triggered when the codeset is changed. The new codeset is passed as the second argument to the callback function",
        "Supply a callback function to handle the search event as an init option.",
        "<pre>$( '.selector' ).search({\n   codesetChange: function(event, query) { ... }\n});</pre>",
        "Bind to the search event: searchcodesetchange.",
        "<pre>$( '.selector' ).bind( 'searchcodesetchange', function(event, query) { ... });</pre>"
      ]
    }
  ],
  "methods" : [
    {
      "name" : "<name>",
      "descr" : "<descr>",
      "declaration" : "<function declaration>",
      "parameters" : [
        {
          "name" : "<name>",
          "descr" : "<descr>"
        }
      ]
    }
  ],
  "options" : [
    {
      "name" : "<name>",
      "descr" : "<descr>",
      "type" : "<type>",
      "default" : "<default>"
    }
  ]
}
***/
(function($, undefined){

  $.widget("fac.sample", $.fac.facbase, {
    
    options: {
      
    },
    
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
    },
    
    _init: function() {
    
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