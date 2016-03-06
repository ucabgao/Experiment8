(function($, undefined){

  $.widget("fac.clientproductlist", $.fac.facbase, {
    
    options : {
      pager: false
    },
    
    _create : function() {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate();
      
      // Create dummy deferred to start off the refreshList with a resolved deferred
      self.productListDefer = $.Deferred().resolve();
      
      // TODO: Why is this widgetwrap element needed?
      var widgetWrap = self.elems.widgetWrapper = $('<div class="ui-widget" />').appendTo(elem);
      
      // Create control wrapper
      self.elems.controls = $('<div class="fac-clientproductlist-controls" />').appendTo(widgetWrap);
      
      // Create name filter
      
      self.elems.controls.append($('<span class="fac-clientproductlist-control-label">').html('Search'));
      self.productFilterTimer;
      self.previousProductFilter = '';
      self.elems.productFilter = $('<input class="fac-clientproductlist-name-filter">').appendTo(self.elems.controls).keyup(function(){       
        // Ignore keypresses if the value didn't change or if it is blank
        if($(this).val() != self.previousProductFilter) {
          if(self.productFilterTimer) {
            clearTimeout(self.productFilterTimer);
          }
          self.userFilterTimer = setTimeout(function(){
            self._refreshProductList();
          }, 500);
        }
        self.previousProductFilter = $(this).val();
      });
      
      
      // Create public select
      self.elems.controls.append($('<span class="fac-clientproductlist-control-label">').html('Public'));
      self.elems.publicSelect = $('<select>').appendTo(self.elems.controls)
        .append('<option value="">Both</option>')
        .append('<option value="Y">Yes</option>')
        .append('<option value="N">No</option>')
        .multiselect({
          multiple: false,
          header: false,
          height: 'auto',
          selectedList: 1,
          minWidth: '6em',
          close: function(event,ui) {
            self._refreshProductList();
          }
        });
      //create purchasable select
      self.elems.controls.append($('<span class="fac-clientproductlist-control-label">').html('Purchasable'));
      self.elems.purchasableSelect = $('<select>').appendTo(self.elems.controls)
        .append('<option value="">Both</option>')
        .append('<option value="Y">Yes</option>')
        .append('<option value="N">No</option>')
        .multiselect({
          multiple: false,
          header: false,
          height: 'auto',
          selectedList: 1,
          minWidth: '6em',
          close: function(event,ui) {
            self._refreshProductList();
          }
        });
      
      // Create Product entries
      self.elems.productlist = $('<div class="fac-clientproductlist-productlist" />').appendTo(widgetWrap);
      
      // Create footer
      self.elems.footer = $('<div class="fac-clientproductlist-footer" />').appendTo(widgetWrap);
      
      // Create pager
      if( o.pager ) {
        self.elems.pager = $('<div class="fac-clientproductlist-pager" />').appendTo(self.elems.footer);
      }
      
      // Add product button only if dev
      if(FAC.settings('userType') == 'dev') {
        self.elems.addProductButton = $('<button class="fac-clientproductlist-addproduct-button">Add Product</button>').button()
          .appendTo(self.elems.footer).click(function(e){
            self.elems.addProductDialog.editdialog('open');
          });
      }
      // Add product dialog
      var productDialog = self.elems.addProductDialog = $('<div class="fac-clientproductlist-addproduct-dialog" />')
        .append($('<div class="fac-clientproductlist-addproduct-dialog-col1" />').html('Name:'))
        .append($('<div class="fac-clientproductlist-addproduct-dialog-col2" />').append('<input class="fac-clientproductlist-addproduct-name" />'))
        .appendTo(widgetWrap)
        .editdialog({
          modal: true,
          title: 'Add Product',
          modifyOnce: true,
          position: {
            my: "center",
            at: "center",
            of: elem
          },
          aftersave: function() {
            self._refreshProductList();
          },
          save: function() {
            return FAC.api({
              'url': 'end-user/product/create',
              'data': {
                'name': $('.fac-clientproductlist-addproduct-name', productDialog).val()
              }
            });
          },
          close: function() {
            $('input',$(this)).val('');
          }
        });
      $('input', self.elems.addProductDialog).keydown( function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13) {
          self.elems.addProductDialog.editdialog('save');
        }
      });
      
      // Add bundle button only if dev
      if(FAC.settings('userType') == 'dev') {
        self.elems.bundleProductButton = $('<button class="fac-clientproductlist-bundleproduct-button">Bundle Products</button>').button()
          .appendTo(self.elems.footer).click(function(e){
            self.elems.addBundleDialog.editdialog('open');
          });
      }
      
      // Bundle product dialog
      var bundleDialog = self.elems.addBundleDialog = $('<div class="fac-clientproductlist-bundleproduct-dialog" />')
        .append($('<div class="fac-clientproductlist-bundleproduct-dialog-col1" />').html('Name:'))
        .append($('<div class="fac-clientproductlist-bundleproduct-dialog-col2" />').append('<input class="fac-clientproductlist-bundleproduct-name" />'))
        .appendTo(widgetWrap)
        .editdialog({
          modal: true,
          title: 'Bundle Products',
          modifyOnce: true,
          position: {
            my: "center",
            at: "center",
            of: elem
          },
          aftersave: function() {
            self._refreshProductList();
          },
          save: function() {
            return FAC.api({
              'url': 'end-user/product/bundle',
              'data': {
                'name': $('.fac-clientproductlist-bundleproduct-name', bundleDialog).val()
              }
            });
          },
          close: function() {
            $('input',$(this)).val('');
          }
        });
      $('input', self.elems.bundleProductDialog).keydown( function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13) {
          self.elems.bundleProductDialog.editdialog('save');
        }
      });
      
    },
    
    _init: function() {
      this._refreshProductList();
    },
    
    _refreshProductList: function() {
      var productList = this.elems.productlist,
          self = this;
      
      // Get filter vars
      var productStatus = self.elems.publicSelect.val();
      var purchasableStatus = self.elems.purchasableSelect.val();
      var productFilter = self.elems.productFilter.val();
      
      self.productListDefer.reject();
      self.productListDefer = FAC.api({
        'url': 'end-user/product/list',
        'data': {
          'public': productStatus,
          'purchasable':purchasableStatus,
          'q': productFilter
        }
      }).done(function(jsonReturn){
        // TODO: destroy product widgets, don't just delete the elements
        //       this is currently a memory leak
        
        productList.html('');
        $.each(jsonReturn.data,function(i,product){
          // Create product header bar
          var productHeader = $('<div class="fac-clientproductlist-productheader ui-state-default" />').append($('<span class="fac-clientproductlist-productheader-name">').text(product['name'])).appendTo(productList);
          var detailToggle = $('<span class="fac-clientproductlist-productdetails-toggle ui-icon ui-icon-circle-plus" />').prependTo(productHeader);
          
          // Create product detail section
          var productDetails = $('<div class="fac-clientproductlist-productdetails ui-widget-content" />').appendTo(productList);
          
          // Show product detail section when the header bar is clicked
          productHeader.click(function(){
            productDetails.slideToggle();
            $(this).toggleClass('ui-state-active');
            detailToggle.toggleClass('ui-icon-circle-plus ui-icon-circle-minus');
          }).hover(function(){
            $(this).addClass('ui-state-hover');
          },function(){
            $(this).removeClass('ui-state-hover');
          });
          /*
          // Add deactivate button
          productDetails.append(
            $('<div class="fac-clientproductlist-activate-wrap" />').append($('<a href="#">').html(product['status'] == 'A' ? 'Inactivate' : 'Activate').click(function() {
              FAC.api({
                'url': 'end-user/product/update',
                'data': {
                  //'use-user-id': user['user-id'],
                  //'status': user['status'] == 'A' ? 'I' : 'A'
                }
              }).done(function(){ 
                self._refreshProductList(); 
              });
            }))
          );
          */
          //
          // Add product widgets to the detail section
          //
          
          // product info widget
          $('<div>').appendTo(productDetails).clientproductinfo({ 
            'product-id': product['product-id'],
            'product-version': product['product-version'],
            'afteredit': function(event, productInfo) {
              $('.fac-clientproductlist-userheader-name', productHeader).text(productInfo['name']);
            }
          });
          /*
          // User product widget
          $('<div>').appendTo(productDetails).userproducts({ 'user-id': user['user-id'] });
          */
        });
        
      });
    },
    
    destroy: function() {
      $(this.selector).html('').removeClass('fac');
      this._facCreate();
      $.Widget.prototype.destroy.call( this );
    }
  });
}(FAC));