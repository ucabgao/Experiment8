/***
{
  "descr" : "Sets up an area for displaying simple code information.",
  "declaration" : "FAC(selector).codeinfo([options]);",
  "events" : [ 
    {
      "name" : "afterLoad",
      "descr" : [
        "This event is triggered after a code and its info is loaded. The new codeset, code, and the code's data are passed in object as the second argument to the callback function",
        "<pre>{\n  \"codeset\": codeset,\n  \"code\": code,\n  \"data\": data\n}</pre>",
        "Supply a callback function to handle the afterLoad event as an init option.",
        "<pre>$( '.selector' ).codeinfo({\n   afterLoad: function(event, query) { ... }\n});</pre>",
        "Bind to the afterLoad event: codeinfoafterload.",
        "<pre>$( '.selector' ).bind( 'codeinfoafterload', function(event, query) { ... });</pre>"
      ]
    }
  ],
  "methods" : [ ],
  "options" : [
    {
      "name" : "codeset",
      "descr" : "Set the codeset of the code.",
      "type" : "String",
      "default" : ""
    },
    {
      "name" : "code",
      "descr" : "Set the code that will be shown.",
      "type" : "Integer, String",
      "default" : ""
    },
    {
      "name" : "spinnerOverlay",
      "descr" : "Turn the overlay behind the loading spinner on or off.",
      "type" : "Boolean",
      "default" : true
    }
  ]
}
***/
(function($, undefined){

  $.widget("fac.codeinfo", $.fac.facbase, {
    options : {
      codeset: '',
      code: '',
      spinnerOverlay: true
    },
    
    _create: function() {
      this._facCreate(true);
      
      var widgetWrap = $('<div>').addClass('ui-widget').appendTo(this.element);
      this.elems.title = $('<div>').addClass('fac-codeinfo-title').appendTo(widgetWrap);
      this.elems.info = $('<p>').addClass('fac-codeinfo-codeinfo').appendTo(widgetWrap);
    },
    
    _init: function() {
      this._loadCode()
    },
    
    _loadCode: function() {
      var self = this,
          o = this.options;
      
      if( o.codeset && o.code ) {
        self.element.spinner({ modal: o.spinnerOverlay });
        
        // Get the code info
        FAC.api.web.getCode(o.codeset, o.code).done(function(jsonReturn){
          self.element.spinner('destroy');
          self.elems.info.html(jsonReturn.data);
          self.elems.title.html(o.code);
          self._trigger('afterLoad', null, {
            'codeset': o.codeset, 
            'code': o.code, 
            'data': jsonReturn.data
          });
        });
      }
    },
    
    /**
     * This will be deprecated; still there for backwards compatibility
     */
    loadCode: function(code, codeset) {
      this._setOption('code', code);
      this._setOption('codeset', codeset);
      this._loadCode();
    },
    
    _setOption: function( key, value ) {
      var self = this,
          o = self.options;
      
      switch( key ) {
        case "code":
          o.code = value;
          break;
        case "codeset":
          o.codeset = value;
          break;
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    destroy: function() {
      this.element.html("");
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));