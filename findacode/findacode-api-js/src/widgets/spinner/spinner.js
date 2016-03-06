(function($, undefined){

  $.widget("fac.spinner", $.fac.facbase, {
    
    options: {
      modal: false
    },
    
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
      
      // Set a min-height on the element so that the spinner is gauranteed to be inside the element and doesn't overlap any borders
      self.prevMinHeight = elem.css('min-height');
      if( elem.height() < 100 ) {
        elem.css('min-height', '100px');
      }
      
      // Add the overlay first because it will affect position by making the .fac ancestor position relative
      if( o.modal ) {
        self.overlay = elem.overlay({ autoOpen: true });
      }
      
      self.spinner = $('<div class="fac-ajax-spinner ui-corner-all" />').appendTo(elem);
      self._updatePosition();
    },
    
    _updatePosition: function() {
      this.spinner.position({
        my: 'center',
        at: 'center',
        of: this.element
      });
    },
    
    destroy: function() {
      this.spinner.remove();
      if( this.element.css('min-height') == '100px' ) {
        this.element.css('min-height', this.prevMinHeight);
      }
      if( this.options.modal ) {
        this.overlay.overlay('destroy');
      }
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
  
}(FAC));