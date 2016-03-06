(function($, undefined){

  $.widget("fac.userproducts", $.fac.facbase, {
    
    options: {
      'user-id':''
    },
    
    // Setup widget
    _create: function() {
      this._facCreate(true);
      this._getProducts();
    },
    
    _init: function() {
    
    },
    
    _getProducts: function() {
      var self = this,
          elem = self.element;
      
      elem.spinner();
      
      // Destroy previous popopens
      $('.fac-userproducts-product', elem).popopen('destroy').remove();
      
      // Load products
      FAC.api.enduser.userProducts({
        'useUserId': self.options['user-id']
      }).done(function(jsonReturn){        
        // Create product popopens
        $.each(jsonReturn.data, function(i, product) {
          var assigned = product.assigned == 'Y';
          $('<div>')
            .appendTo(elem)
            .data('fac-prodloaded', false)
            .addClass('fac-userproducts-product')
            .popopen({ 
              'title': product['name'],
              'manualIconState': true,
              'icon': assigned ? 'ui-icon-circle-check' : 'ui-icon-close',
              'open': function() {
                var productContainer = $(this);
                if( !productContainer.data('fac-prodloaded') ) {
                  productContainer.data('fac-prodloaded',true);
                  
                  // Setup product description
                  var productDescription = $('<div>')
                    .addClass('fac-userproduct-description')
                    .appendTo(productContainer);
                  FAC.api.enduser.productInfo(product['product-id'], product['product-version']).done(function(productInfo){
                    productDescription.html(productInfo.data.description);
                  });
                  
                  // Add/remove product button
                  $('<button class="fac-userproducts-addremove-button">').text( assigned ? 'Remove' : 'Add').button().click(function(){
                    
                    // Confirmation dialog
                    $('<div>').appendTo(productContainer).confirmdialog({
                      'message': 'Are you sure you want to ' + ( assigned ? 'remove' : 'add' ) + ' this product?',
                      'yesHandler': function() {
                        var dialog = $(this);
                        var productPromise;
                        if( assigned ) {
                          productPromise = FAC.api.enduser.removeProduct(product['account-product-id'], {
                            'useUserId': self.options['user-id']
                          });
                        } else {
                          productPromise = FAC.api.enduser.addProduct(product['account-product-id'], {
                            'useUserId': self.options['user-id']
                          });
                        }
                        productPromise.done(function(){
                          dialog.confirmdialog('close');
                          self._getProducts();
                        });
                      }
                    });
                  }).appendTo(productContainer);
                }
              }
            });
        });
        
        elem.spinner('destroy');
        
      });
    },
    
    destroy: function() {
    
    }
  });
}(FAC));