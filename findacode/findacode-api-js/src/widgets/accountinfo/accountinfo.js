(function($, undefined){

  $.widget("fac.accountinfo", $.fac.facbase, {
    
    options: {
      accountId: 0,
      accountInfo: {},
      buttons: []
    },
    
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
      
      elem.html('');
      var buttonBar = $('<div>').addClass('fac-accountinfo-buttonbar').appendTo(elem);
      
      // Create edit dialog
      self.elems.editDialog = $('<div>')
        .addClass('fac-accountinfo-edit')
        .append($('<span>').addClass('fac-label').html('Name'))
        .append(self.elems.editName = $('<input>').addClass('fac-accountinfo-edit-name'))
        .appendTo(elem)
        .editdialog({
          'title': 'Edit Account',
          'save': function() {
            return FAC.api.enduser.accountUpdate(o.accountId, {
              'name': self.elems.editName.val()
            }).done(function(jsonReturn){
              o.accountInfo = jsonReturn.data;
              self._trigger('infoChange', null, o.accountInfo);
            });
          },
          'open': function() {
            self.elems.editName.val(o.accountInfo.name);
          }
        });
      
      // Add edit button
      $('<button>')
        .html('Edit')
        .button()
        .appendTo(buttonBar)
        .click(function(){
          self.elems.editDialog.editdialog('open');
        });
      
      // Add custom button wrapper
      self.elems.customButtons = $('<div>')
        .addClass('fac-accountinfo-custombuttons')
        .appendTo(buttonBar);
    },
    
    _init: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      // Get account info
      FAC.api.enduser.accountInfo(o.accountId).done(function(jsonReturn){
        o.accountInfo = jsonReturn.data;
      });
      
      // Destroy old buttons
      $('.ui-button', self.elems.customButtons).button('destroy').remove();
      
      // Setup new buttons
      $.each(o.buttons, function(i, buttonConfig) {
        $('<button>')
          .button(buttonConfig)
          .appendTo(self.elems.customButtons)
          .click(function(){
            buttonConfig.click.call(elem, o.accountInfo);
          });
      });
    },
    
    _setOption: function( key, value ) {
      var self = this,
          o = self.options;
      
      switch( key ) {
        case 'accountId':
          if( o.accountId != value ) {
            o.accountId = value;
            self._init();
          }
          break;
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    destroy: function() {
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
    
  });
}(FAC));