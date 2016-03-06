(function($, undefined){
  
  var cellTypes = {
    sales : function(self, cell) {
      //add content to cell
        
      //create header
      $('<div class="fac-clientdashboard-cellheader ui-state-default" />')
        .append($('<span class="fac-clientdashboard-cellheader-name">').text('Sales'))
        .appendTo(cell);
      //create body
      $('<div class="fac-clientdashboard-cellbody" />')
        .append('Sales Content')
        .appendTo(cell);
      return cell;
    },
    users: function(self, cell) {

    }
  };
  
  $.widget("fac.clientdashboard", $.fac.facbase, {
    
    options: {
      width : 200,
      height: 150,
      margin: 20,
      cells : [] 
    },
    
    cells: [],
    
    _create: function() {
      var self = this,
          elem = this.element.html(''),
          o = this.options;
      
      //if in demo mode, show nothing
      if(FAC.isDemo()) return;
      
      self._facCreate(true);
      
      var widgetWrap = self.elems.widgetWrapper = $('<div class="ui-widget" />').appendTo(elem);
      self.elems.cellContainer = $('<div class="fac-clientdashboard-cells" />').appendTo(widgetWrap);
    },
    
    _init: function() {
      var self = this;
     
      $.each(this.options.cells, function(i, cell){
        var x = cell.position.x;
        var y = cell.position.y;
        var name = cell.type;
        var href = cell.href;
        
        //make sure type exists
        if (typeof cellTypes[cell.type] === 'undefined') return;
        
        if (typeof self.cells[x] === 'undefined') {
          self.cells[x] = [];
        }
        
        //call type to create cell
        self.cells[x][y] = cellTypes[cell.type](self, self._createCell(self, cell));
      });
    },
    
    _createCell: function(self, cell) {
      var o = this.options;     
      var x = cell.position.x;
      var y = cell.position.y;
      return $('<div class="fac-clientdashboard-cell ui-widget-content" />')
        .appendTo(self.elems.cellContainer)
        .css({
          'top':(y*(o.height+o.margin*2))+'px',
          'left':(x*(o.width+o.margin*2))+'px',
          'width':o.width+'px',
          'height':o.height+'px'
        })
        .click(function(e){
          console.log(cell.href);
        });
    },
    
    _setOption: function( key, value ) {
      /*
      switch( key ) {
        case "clear":
          // handle changes to clear option
          break;
      }
      */
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    _facLogin: function() {
      self._init();
    },
      
    _facLogout: function() {
      self.destroy();
    },
    
    destroy: function() {
      this.element.html('').removeClass('fac');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));