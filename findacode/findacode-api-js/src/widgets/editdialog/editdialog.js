(function($, undefined){

  $.widget("fac.editdialog", $.fac.facdialog, {
    
    options: {
      modifyOnce: false,
      saveButton: {
        label: 'Save',
        click: function() {
          var self = $(this).data('editdialog'),
              o = self.options;
          
          // Disable save button
          o.buttons = [ o.savingButton, o.closeButton ];
          self._createButtons();
          
          // Call save handler and respond when ajax is finished
          $.when(o.save.call(self.element)).done(function(){
            if( o.modifyOnce ) {
              o.buttons = [ o.savedButton, o.closeButton ];
            } else {
              o.buttons = [ o.saveButton, o.closeButton ];
            }
            self._createButtons();
            self._trigger('aftersave');
          }).fail(function(){
            // Todo: respond with error message
            o.buttons = [ o.saveButton, o.closeButton ];
            self._createButtons();
            self._trigger('aftersave');
          });
        }
      },
      savedButton: {
        label: 'Saved',
        disabled: true
      },
      savingButton: {
        label: 'Saving...',
        disabled: true
      },
      closeButton: {
        label: 'Close',
        click: function() {
          $(this).editdialog('close');
        }
      },
      // The save handler must return a deferred object
      save: $.noop
    },
    
    _create: function() {
      var o = this.options;
      
      // Initial buttons
      o.buttons = [ o.saveButton, o.closeButton ];
      
      // Call facdialog constructor
      $.fac.facdialog.prototype._create.call(this);
    },
    
    save: function() {
      this.options.saveButton.click.apply( this.element );
    },
    
    close: function() {
      // Re-enable save button
      var o = this.options;
      o.buttons = [ o.saveButton, o.closeButton ];
      this._createButtons();
      $.fac.facdialog.prototype.close.call(this);
    }
  });
  
}(FAC));