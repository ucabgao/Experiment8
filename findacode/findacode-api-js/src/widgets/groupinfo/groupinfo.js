(function($, undefined){

  $.widget("fac.groupinfo", $.fac.facbase, {
    
    options: {
      'groupData': {},
      'groupId':''
    },
    
    // Setup widget
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(true);
      
      elem.addClass('fac-groupinfo');
      
      // Create info wrapper
      self.elems.groupInfo = $('<div>').appendTo(elem).addClass('fac-groupinfo-info');
      
      // Add edit button
      elem.append($('<button class="fac-groupinfo-edit-button">Edit</button>').button().click(function(){
        self.elems.editDialog.editdialog('open');
      }));
      
      // Create dialog
      var editDialog = self.elems.editDialog = $('<div class="fac-groupinfo-edit-dialog" />').appendTo(elem)
        .append($('<div class="fac-groupinfo-editgroup-dialog-col1" />').html('Name:'))
        .append($('<div class="fac-groupinfo-editgroup-dialog-col2" />').append('<input class="fac-groupinfo-editgroup-name" />'))
        .editdialog({
          modal: true,
          title: 'Edit Group Information',
          position: {
            my: "center",
            at: "center",
            of: elem
          },
          save: function() {
            return FAC.api.enduser.groupUpdate(o['groupId'], {
              'name': $('.fac-groupinfo-editgroup-name', editDialog).val()
            })
            .done(function(jsonReturn){
              o.groupData = jsonReturn.data;
              self._updateGroupInfo();
            });
          },
          aftersave: function(e) {
            self._trigger('afterEdit', e, o.groupData);
          }
        });
      // Save when enter is pressed in any field
      $('input', editDialog).keydown( function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13) {
          editDialog.editdialog('save');
        }
      });
    },
    
    _init: function() {
      this._getGroupInfo();
    },
    
    _getGroupInfo: function() {
      var self = this;
      
      // Get group info
      self.element.spinner();
      FAC.api.enduser.groupInfo(this.options['groupId']).done(function(jsonReturn){          
        // Save group info
        self.options.groupData = jsonReturn.data;
        self._updateGroupInfo();
      });
    },
    
    _updateGroupInfo: function() {
      var self = this,
          o = self.options;
      
      // Add content
      self.elems.groupInfo.html('')
        .append($('<div class="fac-groupinfo-col1" />').append('<div class="fac-groupinfo-label">Name</div>').append($('<div class="fac-groupinfo-text fac-groupinfo-name-text" />').html(o.groupData['name'])));
        
      self.element.spinner('destroy');
        
      // Set values of edit dialog inputs
      $('.fac-groupinfo-editgroup-name', self.elems.editDialog).val(o.groupData['name']);
    },
    
    _setOption: function( key, value ) {
      if( key === "groupId" ) {
        this.options[key] = value;
        this._getGroupInfo();
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    
    destroy: function() {
      this.element.html('');
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));