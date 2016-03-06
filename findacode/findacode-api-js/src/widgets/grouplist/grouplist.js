(function($, undefined){

  $.widget("fac.grouplist", $.fac.facbase, {
    
    options: {
      
    },
    
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
      
      var widgetWrapper = $('<div>').addClass('fac-grouplist ui-widget').appendTo(elem);
      
      self.elems.list = $('<div>')
        .addClass('fac-grouplist-list')
        .appendTo(widgetWrapper)
        .faclist({
          clearList: function() {
            $('.fac-group', $(this)).group('destroy');
          },
          loadList: function() { 
            return FAC.api.enduser.groupList(); 
          },
          loggedOutMessage: 'Please login to view the group list.',
          noDataMessage: 'No groups were found.',
          popopenEntryOptions: function (groupInfo) {
            return {
              'title': groupInfo.name,
              'open': function() {
                $(this).group({ 'groupData': groupInfo });
              }
            };
          }
        });
    },
    
    _init: function() {
      
    },
    
    _setOption: function( key, value ) {
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    destroy: function() {
      this.elems.list.faclist('destroy');
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));