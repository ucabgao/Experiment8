(function($, undefined){

  $.widget("fac.crossacodegems", $.fac.facbase, {
    
    options: {
      code: null,
      codeset: null,
      mapping: '',
      codeClick: null,
      codeClass: null
    },
    
    _create: function() {
      var o = this.options;
      
      // Does anything need to be created?
      this._facCreate();
      
      this.element.addClass('fac-cac-gems');
      
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
      FAC.api.tool.crossacode(o.codeset, o.code, 'gems-' + o.mapping).done(function(jsonReturn) {
        var gems = jsonReturn.data['gems-' + o.mapping];
        
        elem.html('');
        
        // No data for requested mapping
        if( !gems || (gems['scenarios'] && gems['scenarios'].length == 0) ) {
          elem.append($('<p>').html('No ' + o.mapping + ' mappings were found for ' + o.code + '.'));
        } 
        else {
          // Scenarios
          if( gems['scenarios'] ) {
            elem.append($('<p>').html('The following codes are ' + (gems.approximate == "1" ? 'generally' : '' ) + ' equivelent* to ' + o.code + ':'));
            
            if( gems['scenarios'].length == 1 ) {
              self._buildScenario( gems['scenarios'][0] ).appendTo( elem );
            } else {
              var scenTable = $('<table class="fac-cac-scen-table"><tbody /></table>').appendTo( elem );
              $.each( gems['scenarios'], function( i, scenario ) {
                var scenRow = $('<tr>').appendTo( scenTable );
                if( i != 0 ) {
                  scenRow.append('<td class="fac-cac-or">Or</td>');
                } else {
                  scenRow.append('<td>');
                }
                self._buildScenario( scenario ).appendTo( $('<td class="fac-cac-scen-td">').appendTo( scenRow ) ).popopen({
                  'title': 'Scenario ' + ( i + 1 )
                });
                scenTable.append( scenRow );
              });
              elem.append('<br>');
            }
          }
          // List
          else {
            elem.append($('<p>').html('The following codes are equivelent* to ' + o.code + ':'));
            elem.append(self._buildChoices(gems));
          }

          // Add fac warning
          $('<div>').addClass('fac-cac-warning ui-widget-content')
            .append('<p>* The codes listed here are those that reference this code (00.66) in a General Equivalence Mapping (GEM). Do not code from this list. View the individual ICD-10 codes and use your best judgement to determine which of the codes (or combinations of codes) most accurately describe the situation you are coding. Review charts if necessary.</p>')
            .append('<p>Note: GEMS often map to unspecific codes. It is extremely important to review sections (or use the page view) to ensure that a more specific code does not exist.</p>')
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
    
    _buildScenario: function(scenario) {
      var self = this;
      var scenBox = $('<div>').addClass('fac-cac-scenario');
      if( scenario['choice-lists'].length == 1 ) {
        self._buildCombination( scenario['choice-lists'][0] ).appendTo( scenBox );
      } else {
        $.each( scenario['choice-lists'], function(i, combo) {
          if( i != 0 ) {
            scenBox.append('<p class="fac-cac-and">And</p>');
          }
          scenBox.append( self._buildCombination( combo ).addClass('ui-widget-content') );
        });
      }
      return scenBox;
    },
    
    _buildCombination: function(combination) {
      return $('<div>').addClass('fac-cac-combination')
        .append('<p>Choose one of:</p>')
        .append( this._buildChoices( combination.choices ) );
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