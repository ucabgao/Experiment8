(function($, undefined){

  $.widget("fac.facdialog", $.fac.facbase, {
    
    options : {
      autoOpen: false,
      buttons: [],
      global: false,
      modal: true,
      position: {
        my: "center",
        at: "center",
        of: window,
        collision: 'fit'
      },
      title: '',
      width: 300
    },
    
    _create: function() {    
      var self = this,
          elem = this.element,
          o = this.options;

      // Check to see if the element is in the dom
      if( elem.closest('html').length == 0 ) {
        $(document.body).append(elem);
      }   
      
      self._facCreate(true);
      
      // Make sure buttons are the correct format
      o.buttons = self._convertButtons(o.buttons);
      
      // Create dialog
      self.elems.dialog = elem.wrap('<div>').wrap('<div class="fac-dialog ui-widget ui-widget-content ui-corner-all" />')
        .addClass('fac-dialog-content').parent().width(o.width);
        
      // If the targeted element has the .fac class, remove it 
      // from the targeted element and add it to the dialog
      if( elem.hasClass('fac') ) {
        elem.removeClass('fac');
        self.elems.dialog.parent().addClass('fac');
      }
      
      // Create title
      var title = elem.attr('title') ? elem.attr('title') : o.title;
      title = title ? title : '&nbsp;';
      var titleBar = $('<div class="fac-dialog-header ui-widget-header ui-corner-all">').prependTo(self.elems.dialog);
      self.elems.title = $('<span>').addClass('fac-dialog-title').html(title).appendTo(titleBar);
      
      // Title close button
      $( '<div />' )
        .addClass( "fac-dialog-closeicon-wrap ui-dialog-titlebar-close ui-corner-all" )
        .attr( "role", "button" )
        .click(function( event ) {
          event.preventDefault();
          self.close( event );
        })
        .hover(function(){
          $(this).addClass('ui-state-hover');
        },function(){
          $(this).removeClass('ui-state-hover');
        })
        .appendTo( titleBar )
        .append(
          $( "<span>" )
          .addClass( "ui-icon ui-icon-closethick" )
        );

      // Add overlay
      if( o.modal ) {
        if( o.global ) {
          self.elems.overlay = $($('<div>').addClass('ui-widget').appendTo(document.body)).overlay();
        } else {
          self.elems.overlay = elem.closest('.fac').overlay();
        }
      }
      
      // Set fac parent to position relative
      self.elems.dialog.parents('.fac').css('position','relative');
    },
    
    _init: function() {
      // Create buttons
      this._createButtons();
      
      // Show dialog
      if( this.options.autoOpen ) {
        this.open();
      }
    },
    
    _setOption: function( key, value ) {
      switch( key ) {
        case "buttons":
          this.options[key] = this._convertButtons(value);
          this._createButtons();
          break;
        case "position":
          this.options[key] = value;
          this._updatePosition();
          break;
        case "title":
          this.options[key] = value;
          this.elems.title.html(value);
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    // Convert shortcut format to normal format
    _convertButtons: function(buttons) {
      if( $.type(buttons) === 'object' ) {
        var newButtons = [];
        $.each(buttons, function(text, func) {
          newButtons.push({ 'label': text, 'click': func });
        });
        buttons = newButtons;
      }
      return buttons;
    },
    
    _createButtons: function() {
      var self = this;
      
      // Clear out the button bar if it does exist
      if( self.elems.buttonBar ) {
        self.elems.buttonBar.html(''); 
      }
      // Create the button bar if it doesn't exist
      else {
        self.elems.buttonBar = $('<div class="fac-dialog-buttons" />').appendTo(self.elems.dialog);
      }
      
      // Create buttons
      if( this.options.buttons.length ) {
        $.each(this.options.buttons, function(i, b) {
          var button = $('<button />').button(b);
          if( !b.disabled ) {
            button.click(function() {
              b.click.apply( self.element );
            });
          }
          button.appendTo(self.elems.buttonBar);
        });
      }
    },
    
    open: function() {
      this.elems.dialog.show();
      if(this.elems.overlay) {
        this.elems.overlay.overlay('show');
      }
      this._updatePosition();
      this._trigger('open');
    },
    
    close: function() {
      this.elems.dialog.hide();
      if(this.elems.overlay) {
        this.elems.overlay.overlay('hide');
      }
      this._trigger('close');
    },
    
    _updatePosition: function() {
      this.elems.dialog.position(this.options.position);
    },
    
    destroy : function() {
      this.elems.dialog.children(':not(.fac-dialog-content)').remove();
      this.element.unwrap().removeClass('fac-dialog-content');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });

}(FAC));