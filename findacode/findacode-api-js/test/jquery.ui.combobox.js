(function( $ ) {
  $.widget( "ui.combobox", {
    
    options: {
      options: []
    },
    
    _create: function() {
      var self = this,
        input = this.element; 
          
      input
        .wrap( $( "<span>" ).addClass( "ui-combobox" ) )
        .css( { 'outline': 'none'} )
        .autocomplete({
          delay: 0,
          minLength: 0,
          //source: self.options.options,
          source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            response( $.map(self.options.options, function(text, i) {
              if ( text && ( !request.term || matcher.test(text) ) )
                return {
                  label: text.replace(
                    new RegExp(
                      "(?![^&;]+;)(?!<[^<>]*)(" +
                      $.ui.autocomplete.escapeRegex(request.term) +
                      ")(?![^<>]*>)(?![^&;]+;)", "gi"
                    ), "<strong>$1</strong>" ),
                  value: text
                };
            }) );
          },
          select: function( event, ui ) {
            self._trigger( "selected", event, {
              item: ui.item.option
            });
          },
          change: function( event, ui ) {
            self._trigger( "change", event, ui );
          }
          /*
          ,
          change: function( event, ui ) {
            if ( !ui.item ) {
              var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                valid = false;
              $.each(self.options.options, function() {
                if ( this.match( matcher ) ) {
                  this.selected = valid = true;
                  return false;
                }
              });
              
              if ( !valid ) {
                // remove invalid value, as it didn't match anything
                $( this ).val( "" );
                select.val( "" );
                input.data( "autocomplete" ).term = "";
                return false;
              }
              
            }
          }
          */
        })
        .addClass( "ui-widget ui-widget-content ui-corner-left" );

      input.data( "autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li></li>" )
          .data( "item.autocomplete", item )
          .append( "<a>" + item.label + "</a>" )
          .appendTo( ul );
      };

      wrapper = input.parent();
      
      $( "<a>" )
        .attr( "tabIndex", -1 )
        .attr( "title", "Show All Items" )
        .appendTo( wrapper )
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s"
          },
          text: false
        })
        .removeClass( "ui-corner-all" )
        .addClass( "ui-corner-right ui-button-icon" )
        .click(function() {
          // close if already visible
          if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
            input.autocomplete( "close" );
            return;
          }

          // work around a bug (likely same cause as #5265)
          $( this ).blur();

          // pass empty string as value to search for, displaying all results
          input.autocomplete( "search", "" );
          input.focus();
        });
    },

    destroy: function() {
      this.wrapper.remove();
      this.element.show();
      $.Widget.prototype.destroy.call( this );
    }
  });
})( FAC );