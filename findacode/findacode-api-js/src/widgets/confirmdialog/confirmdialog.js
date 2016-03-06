(function($, undefined){

  $.widget("fac.confirmdialog", $.fac.facdialog, {
    
    options: {
      'autoOpen': true,
      'title': 'Are you sure?',
      'message': 'Are you sure?',
      'yesLabel': 'Yes',
      'noLabel': 'No',
      'yesHandler': function() {
        $(this).confirmdialog('close');
      },
      'noHandler': function() {
        $(this).confirmdialog('close');
      }
    },
    
    _create: function() {
      var o = this.options;
      
      o.buttons = [{
        'label': o.yesLabel,
        'click': o.yesHandler
      },{
        'label': o.noLabel,
        'click': o.noHandler
      }];
      
      this.element.html(o.message);
    
      $.fac.facdialog.prototype._create.call(this);
    }
    
  });
  
}(FAC));