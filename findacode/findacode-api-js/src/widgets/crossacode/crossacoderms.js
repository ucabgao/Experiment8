(function($, undefined){

  $.widget("fac.crossacoderms", $.fac.facbase, {
    
    options: {
      code: '',
      codeset: '',
      codeClick: null,
      codeClass: null
    },
    
    _create: function() {
      var o = this.options;
      
      // Does anything need to be created?
      this._facCreate();
      
      this.element.addClass('fac-cac-rms');
      
      // Validate codeset and code
      if( !FAC.validateCodeset( o['codeset'] ) ) {
        o['codeset'] = null;
      }
      if( !FAC.validateCode( o['codeset'], o['code'] ) ) {
        o['code'] = null;
      }

      this._setupCode();
    },
    
    _init: function() {
      
    },
    
    _setupCode: function() {
      var self = this,
          elem = self.element,
          o = self.options;
      
       elem.html('');
      
      // Validate the codeset and code
      if( o.codeset && !o.code ) {
        return;
      }
      
      // Get the data
      elem.spinner();
      FAC.api.tool.crossacode(o.codeset, o.code, 'rms').done(function(jsonReturn) {
        var rms = jsonReturn.data['rms'];
        
        elem.html('');
        
        // No data for requested mapping
        if( !rms ) {
          elem.append($('<p>').html('No reimbursement mappings were found for ' + o.code + '.'));
        } 
        else {
          elem.append($('<p>').html('The following codes, when used for reimbursement, will map to ' + o.code + ':'));
          elem.append(self._buildChoices(rms));

          // Add fac warning
          $('<div>').addClass('fac-cac-warning ui-widget-content')
            .append('<p>General Equivalence Mappings (GEMs) designate all mappings from ICD-9 to ICD-10 and back - all codes from one code set that could be construed to mean the same diagnosis/procedure in the other code set.</p>')
            .append('<p>Reimbursement Mappings (RMs) will be used for reimbursement purposes. RMs designate which ICD-9 code (or cluster of codes) from the GEMs will be the basis for getting paid. Because the mapping of RMs is from ICD-10 to ICD-9, not all ICD-9 codes will have RMs.</p>')
            .appendTo(elem);
        }
        
        // Remove spinner
        elem.spinner('destroy');
      }).fail(function(jsonReturn){
        if( FAC.hasStatus( jsonReturn, 'code', 'S13' ) ) {
          FAC.displayMessage( 'error', '<b>' + jsonReturn['status']['params']['code'] + '</b> is not a valid ' + o.codeset + ' code.', 2000 );
        } else {
          FAC.displayMessage( 'error', 'An unexpected error occurred.', 2000 );
        }
        
        // Remove spinner
        elem.spinner('destroy');
      });
    },
    
    _buildChoices: function(choices) {
      var self = this,
          o = self.options;
      var codeTable = $('<table>').append('<tbody>');
      $.each(choices, function(i, gem) {
        var row = $('<tr class="fac-cac-code-entry">').appendTo(codeTable);
        var code = $('<td class="fac-cac-code">').html(gem.code).appendTo(row);
        if( o.codeClass ) {
          code.addClass( o.codeClass );
        }
        if( o.codeClick ) {
          code.click( function() {
            o.codeClick.call(self, gem);
          }).addClass( 'fac-cac-code-click' );
        }
        $('<td>').html(gem.descr).appendTo(row);
      });
      return codeTable;
    },
    
    _setOption: function( key, value ) {
      
      // Process new code
      if( key == 'code' && value != '' && this.options['code'] != value ) {
        if( FAC.validateCode( this.options.codeset, value ) ) {  
          this.options['code'] = value;
          this._setupCode();
        } else {
          FAC.displayMessage( 'error', '<b>' + value + '</b> is not a valid ' + FAC.codesets[this.options.codeset]['text'] + ' code.', 2000 );
        }
      }
      
      // Process new codeset
      if( key == 'codeset' && value != '' && this.options['codeset'] != value ) {
        if( FAC.validateCodeset( value ) ) {
          if( !FAC.validateCode( value, this.options['code'] ) ) {
            this.options['code'] = null;
          }
          this._setupCode();
        } else {
          FAC.displayMessage( 'error', '<b>' + value + '</b> is not a valid codeset.' );
        }
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