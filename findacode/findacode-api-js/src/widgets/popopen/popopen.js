(function($, undefined){

  $.widget("fac.popopen", $.fac.facbase, {
    
    options: {
      'title': '',
      'iconClosed': 'ui-icon-circle-plus',
      'iconOpen': 'ui-icon-circle-minus',
      'stateIcon': true,
      'manualIconState': false,
      'icon': '',
      'open': $.noop,
      'close': $.noop,
      'autoOpen': false,
      'duration': 400
    },
    
    // Setup widget
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
           
      self._facCreate(true);
      
      var popopen = elem.wrap('<div>').parent().addClass('fac-popopen ui-widget').wrap( $('<div>') );
      
      // If the targeted element has the .fac class, remove it 
      // from the targeted element and add it to the popopen
      if( elem.hasClass('fac') ) {
        popopen.parent().addClass('fac');
      }
      
      // Create header bar
      self.elems.header = $('<div class="fac-popopen-header ui-state-default" />').prependTo(popopen);
      if( o.stateIcon ) {
        self.elems.icon = $('<span class="fac-popopen-details-toggle ui-icon" />').appendTo(self.elems.header);
      }
      if( o.manualIconState ) {
        self._updateIcon(o.icon);
      } else {
        self._updateIcon(o.iconClosed);
      }
      self.elems.headerText = $('<span class="fac-popopen-header-text">').appendTo(self.elems.header);
      self._updateHeaderText();
      
      // Create content area
      elem.addClass('fac-popopen-details ui-widget-content');
      
      // Show user detail section when the header bar is clicked
      self.elems.header.click(function(){
        var opening = elem.is(':hidden');
        elem.slideToggle(o.duration, function(){
          if( opening ) {
            self._trigger('open');
          } else {
            self._trigger('close');
          }
        });
        $(this).toggleClass('ui-state-active');
        if( o.stateIcon && !o.manualIconState ) {
          self.elems.icon.toggleClass(o.iconClosed + ' ' + o.iconOpen);
        }
      }).hover(function(){
        $(this).addClass('ui-state-hover');
      },function(){
        $(this).removeClass('ui-state-hover');
      });
      
      if( o.autoOpen ) {
        self.elems.header.click();
      }
    },
    
    _init: function() {
    
    },
    
    _updateHeaderText: function() {
      this.elems.headerText.html(this.options.title);
    },
    
    _setOption: function( key, value ) {
      
      switch( key ) {
        case "icon":
          this._updateIcon(value);
          break;
        case "title":
          this.options.title = value;
          this._updateHeaderText();
          break;
      }
      
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    _updateIcon: function(newIcon) {
      var self = this,
          o = self.options;
      
      self.elems.icon.removeClass(o.icon).addClass(newIcon);
      o.icon = newIcon;
    },
    
    destroy: function() {      
      this.elems.header.remove();
      this.element.removeClass('fac-popopen-details ui-widget-content').show().css('display','').unwrap().unwrap();
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));