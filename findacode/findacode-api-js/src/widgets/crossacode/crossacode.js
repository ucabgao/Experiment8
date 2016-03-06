(function($, undefined){

  $.widget("fac.crossacode", $.fac.facbase, {
    
    options: {
      autoOpen: false,
      code: null,
      codeset: null,
      codeClick: null,
      codeClass: null
    },
    
    _create: function() {
      var self = this,
          elem = self.element.html(''),
          o = self.options;
      
      self._facCreate(true);
      
      // Validate the codeset
      if( !FAC.codesets[o.codeset] ) {
        // TODO: what should we do?
        o.codeset = '';
      }
      
      // Expand autoOpen option
      if( $.type(o.autoOpen) == 'boolean' ) {
        var newAutoOpen = {};
        $.each(['gems-forward','gems-backward','rms'],function(i,e){
          newAutoOpen[e] = o.autoOpen;
        });
        o.autoOpen = newAutoOpen;
      }
      
      var widgetWrapper = $('<div>').addClass('fac-crossacode').appendTo(elem);
      
      // Add title
      //self.elems.title = $('<div>').addClass('fac-crossacode-title').appendTo(elem);
      
      // GEMs forward popopen
      self.elems.gemsForward = $('<div>').appendTo(widgetWrapper).popopen({
        'autoOpen': o.autoOpen['gems-forward'],
        'title': 'GEMs Forward',
        'open': function() {
          $(this).crossacodegems({
            code: o.code,
            codeset: o.codeset,
            codeClick: o.codeClick,
            codeClass: o.codeClass,
            mapping: 'forward'
          });
        }
      });
      
      // GEMs backward popopen
      self.elems.gemsBackward = $('<div>').appendTo(widgetWrapper).popopen({
        'autoOpen': o.autoOpen['gems-backward'],
        'title': 'GEMs Backward',
        'open': function() {
          $(this).crossacodegems({
            code: o.code,
            codeset: o.codeset,
            codeClick: o.codeClick,
            codeClass: o.codeClass,
            mapping: 'backward'
          });
        }
      });
      
      // RMs popopen
      self.elems.rms = $('<div>').appendTo(widgetWrapper).popopen({
        'autoOpen': o.autoOpen['rms'],
        'title': 'Reimbursement Mappings',
        'open': function() {
          $(this).crossacoderms({
            code: o.code,
            codeset: o.codeset,
            codeClick: o.codeClick,
            codeClass: o.codeClass,
          });
        }
      });
    },
    
    _init: function() {
      
    },
    
    _setOption: function( key, value ) {
      // Update the code
      if( key == 'code' ) {
        // Validate the new code according to the codeset
        if( FAC.validateCode( this.options.codeset, value ) ) {
          this._setCode( value );
        } else {
          FAC.displayMessage( 'error', '<b>' + value + '</b> is not a valid ' + FAC.codesets[this.options.codeset]['text'] + ' code.', 2000 );
        }
      }
      
      // Update the codeset
      if( key == 'codeset' ) {
        // If the current code does not match the codeset, remove it
        if( !FAC.validateCode( value, this.options.code ) ) {
          this.options['code'] = '';
        }
        this.elems.gemsForward.crossacodegems('option', 'codeset', value);
        this.elems.gemsBackward.crossacodegems('option', 'codeset', value);
        this.elems.rms.crossacoderms('option', 'codeset', value);
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    _setCode: function( code ) {
      this.elems.gemsForward.crossacodegems('option', 'code', code);
      this.elems.gemsBackward.crossacodegems('option', 'code', code);
      this.elems.rms.crossacoderms('option', 'code', code);
    },
    
    destroy: function() {
      this.elems.gemsForward.popopen('destroy').crossacodegems('destroy').remove();
      this.elems.gemsBackward.popopen('destroy').crossacodegems('destroy').remove();
      this.elems.rms.popopen('destroy').crossacoderms('destroy').remove();
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));