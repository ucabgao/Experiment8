(function($, undefined){

  $.widget("fac.group", $.fac.facbase, {
    
    options: {
      groupData: {}
    },
    
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options,
          group = o.groupData;
      
      self._facCreate(true);
      
      var widgetWrapper = $('<div>').addClass('fac-group ui-widget').appendTo(elem);
      
      // Add deactivate button
      widgetWrapper.append(
        $('<div class="fac-group-activate-wrap" />').append($('<button>').button({'label':group['active'] == 'Y' ? 'Inactivate' : 'Activate'}).click(function() {
          var activateButton = $(this);
          FAC.api.enduser.groupUpdate(group['group-id'], {
            'active': group['active'] == 'Y' ? 'N' : 'Y'
          }).done(function(jsonReturn){
            // Check to see if the statusChange event should be fired
            if(jsonReturn.data.active != o.groupData.active) {
              // Save new group data  
              o.groupData = jsonReturn.data;
              
              // Update the text of the button
              activateButton.button('option', 'label', o.groupData.active == 'Y' ? 'Inactivate' : 'Activate');
              
              // Trigger statusChange event if necessary
              self._trigger('statusChange', null, o.groupData);
            }
          });
        }))
      );
      
      //
      // Add group widgets to the detail section
      //
      
      // Group info widget
      self.elems.info = $('<div>').appendTo(widgetWrapper).popopen({
        'title': 'Information',
        'open': function() {
          $(this).groupinfo({
            // Update the title of the popopen when the group info changes
            'afterEdit': function(e, newData) {
              elem.popopen('option', 'title', newData.name);
            },
            'groupId': group['group-id']
          });
        }
      });
      
      // Group users widget
      self.elems.info = $('<div>').appendTo(widgetWrapper).popopen({
        'title': 'Users',
        'open': function() {
          $(this).groupusers({
            'groupId': group['group-id']
          });
        }
      });
    },
    
    _init: function() {

    },
    
    _setOption: function( key, value ) {
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    destroy: function() {
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));