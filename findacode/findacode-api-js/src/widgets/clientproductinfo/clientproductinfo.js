(function($, undefined){

  $.widget("fac.clientproductinfo", $.fac.popopen, {
    
    options: {
      'title': 'Information',
      'productData': {}
    },
    
    // Setup widget
    _create: function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      o.content = function(container) {
        self._getProductInfo(container);
      };
      
      // Create the popopen
      $.fac.popopen.prototype._create.call(this);
      
      self.infoLoaded = false;
      
      // Create dialog
      var editDialog = self.elems.editDialog = $('<div class="fac-clientproductinfo-edit-dialog" />').appendTo(elem);
      
      self.elems.editDialog.append($('<div class="fac-clientproductinfo-editproduct-dialog-col1" />').html('Name:'))
      .append($('<div class="fac-clientproductinfo-editproduct-dialog-col2" />').append('<input class="fac-clientproductinfo-editproduct-name" />'));
      
      self.elems.editDialog.append($('<div class="fac-clientproductinfo-editproduct-dialog-col1" />').html('Description:'))
      .append($('<div class="fac-clientproductinfo-editproduct-dialog-col2" />').append('<input class="fac-clientproductinfo-editproduct-descr" />'));
      
      self.elems.editDialog.append($('<div class="fac-clientproductinfo-editproduct-dialog-col1" />').html('Scope:'))
      .append($('<div class="fac-clientproductinfo-editproduct-dialog-col2" />').append('<input class="fac-clientproductinfo-editproduct-scope" />'));
      
      var ms = $('<select class="fac-clientproductinfo-editproduct-public">').append('<option value="Y">Yes</option>').append('<option value="N">No</option>');
      self.elems.editDialog.append($('<div class="fac-clientproductinfo-editproduct-dialog-col1" />').html('Public:')).append($('<div class="fac-clientproductinfo-editproduct-dialog-col2" />').append(ms));
      ms.multiselect({
        multiple: false,
        header: false,
        height: 'auto',
        selectedList: 1,
        minWidth: '6em'
      });
      
      var ms = $('<select class="fac-clientproductinfo-editproduct-purchasable">').append('<option value="Y">Yes</option>').append('<option value="N">No</option>');
      self.elems.editDialog.append($('<div class="fac-clientproductinfo-editproduct-dialog-col1" />').html('Purchasable:')).append($('<div class="fac-clientproductinfo-editproduct-dialog-col2" />').append(ms));
      ms.multiselect({
        multiple: false,
        header: false,
        height: 'auto',
        selectedList: 1,
        minWidth: '6em'
      });
      
      var editDialog = self.elems.editDialog;
      self.elems.editDialog.editdialog({
        modal: true,
        title: 'Edit Product Information',
        position: {
          my: "center",
          at: "center",
          of: elem
        },
        save: function() {
          return FAC.api({
            'url': 'end-user/product/update',
            'data': {
              'product-id': o.productData['product-id'],
              'product-version': o.productData['product-version'],
              'name': $('.fac-clientproductinfo-editproduct-name', editDialog).val(),
              'description': $('.fac-clientproductinfo-editproduct-descr', editDialog).val(),
              'scope': $('.fac-clientproductinfo-editproduct-scope', editDialog).val(),
              'public': $('.fac-clientproductinfo-editproduct-public', editDialog).val(),
              'purchasable': $('.fac-clientproductinfo-editproduct-purchasable', editDialog).val()
            }
          }).done(function(jsonReturn){
            o.productData = jsonReturn.data;
            self._updateProductInfo();
          });
        },
        aftersave: function(e) {
          self._trigger('afteredit', e, o.productData);
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
      
    },
    
    _getProductInfo: function() {
      if( !this.options.infoLoaded ) {
        var self = this;
        
        // Get product info
        FAC.api({
          'url': 'end-user/product/info',
          'data': {
            'product-id': this.options['product-id'],
            'product-version': this.options['product-version']
          }
        }).done(function(jsonReturn){          
          // Save user info
          self.options.productData = jsonReturn.data;
          self.infoLoaded = true;
          self._updateProductInfo();
        });
      }
    },
    
    _updateProductInfo: function() {
      var self = this,
          o = self.options;
      
      // Add content
      self.elems.contentContainer.html('')
        .append($('<div class="fac-clientproductinfo-col1" />').append('<div class="fac-clientproductinfo-label">Name</div>').append($('<div class="fac-clientproductinfo-text fac-clientproductinfo-name-text" />').html(o.productData['name'])))
        .append($('<div class="fac-clientproductinfo-col2" />').append('<div class="fac-clientproductinfo-label">Scope</div>').append($('<div class="fac-clientproductinfo-text fac-clientproductinfo-scope-text" />').html(o.productData['scope'])))
        .append($('<div class="fac-clientproductinfo-col1" />').append('<div class="fac-clientproductinfo-label">Description</div>').append($('<div class="fac-clientproductinfo-text fac-clientproductinfo-descr-text" />').html(o.productData['description'])))
        .append($('<div class="fac-clientproductinfo-col2" />').append('<div class="fac-clientproductinfo-label">Public</div>').append($('<div class="fac-clientproductinfo-text fac-clientproductinfo-public-text" />').html(o.productData['public'])))
        .append($('<div class="fac-clientproductinfo-col2" />').append('<div class="fac-clientproductinfo-label">Purchasable</div>').append($('<div class="fac-clientproductinfo-text fac-clientproductinfo-purchasable-text" />').html(o.productData['purchasable'])))
        .append($('<div class="fac-clientproductinfo-col2" />').append('<div class="fac-clientproductinfo-label">Bundleable</div>').append($('<div class="fac-clientproductinfo-text fac-clientproductinfo-bundleable-text" />').html(o.productData['bundleable'])))
        .append($('<button class="fac-clientproductinfo-edit-button">Edit</button>').button().click(function(){
          self.elems.editDialog.editdialog('open');
        }))
        .append($('<div class="fac-clear" />'));
        
      // Set values of edit dialog inputs
      $('.fac-clientproductinfo-editproduct-name', self.elems.editDialog).val(o.productData['name']);
      $('.fac-clientproductinfo-editproduct-description', self.elems.editDialog).val(o.productData['description']);
      $('.fac-clientproductinfo-editproduct-scope', self.elems.editDialog).val(o.productData['scope']);
      $('.fac-clientproductinfo-editproduct-public', self.elems.editDialog).val(o.productData['public']);
      $('.fac-clientproductinfo-editproduct-public', self.elems.editDialog).multiselect("refresh");
      $('.fac-clientproductinfo-editproduct-purchasable', self.elems.editDialog).val(o.productData['purchasable']);
      $('.fac-clientproductinfo-editproduct-purchasable', self.elems.editDialog).multiselect("refresh");
    },
    
    _setOption: function( key, value ) {
      switch( key ) {
        case "product-id":
        case "product-version":
          this.options[key] = value;
          this._getContent();
          break;
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