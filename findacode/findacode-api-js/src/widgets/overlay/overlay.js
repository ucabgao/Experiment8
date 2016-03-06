(function($, undefined){

  $.widget("fac.overlay", $.fac.facbase, {
    
    options: {
      autoOpen: false
    },
    
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
      
      // Make .fac ancestor position: relative
      this.element.closest('.fac').css('position', 'relative');
      
      // Add overlay
      self.overlay = $('<div class="fac-overlay ui-widget-overlay" />').appendTo(elem);
      
      if( o.autoOpen ) {
        self.show();
      }
    },
    
    show: function() {
      this.overlay.show();
    },
    
    hide: function() {
      this.overlay.hide();
    },
    
    destroy: function() {
      this.overlay.remove();
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }    
    
  });
  
}(FAC));