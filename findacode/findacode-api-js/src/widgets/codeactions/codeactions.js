/***
{
  "descr" : "Attach a set of buttons or a configurable menu to codes on the page.",
  "declaration" : "FAC(selector).codeinfo([options]);",
  "events" : [ ],
  "methods" : [ ],
  "options" : [
    {
      "name" : "actions",
      "descr" : [
        "An array of actions that configure buttons or menu items.",
        "<table><tr><td>title</td><td>Text of a menu entry or title of a button.</td></tr>",
        "<tr><td>uiIcon</td><td>The jQuery UI ui-icon class which determines the image. This is optional for menus. A list of all possible values is given at the bottom of the <a href=\"http://jqueryui.com/themeroller/\">jQuery UI ThemeRoller</a> page.</td></tr>",
        "<tr><td>click</td><td>The callback function that is called when the button or menu item is clicked. Four parameters are passed to it: event, element, code, codeset.</td></tr></table>",
        "<pre>actions: [\n  {\n    'title': 'Code Info',\n    'uiIcon': 'ui-icon-comment',\n    'click': function(event, elem, code, codeset) {\n      codeInfoWidget.loadCode(code, codeset);\n    }\n  },\n  {\n    'title': 'View on Find-A-Code',\n    'uiIcon': 'ui-icon-extlink',\n    'click': function(event, elem, code, codeset) {\n      window.open('http://www.findacode.com/code.php?set=ICD10CM&c='+code);\n    }\n  }\n]</pre>"
      ],
      "type" : "Array",
      "default" : "[]"
    },
    {
      "name" : "addClass",
      "descr" : "Add a class to the codes for custom styling.",
      "type" : "String",
      "default" : "null"
    },
    {
      "name" : "codeset",
      "descr" : "Set the codeset which will be used when regexFind is true.",
      "type" : "String",
      "default" : "null"
    },
    {
      "name" : "menu",
      "descr" : "When true, the codes show a menu when clicked. The menu is populated according to the actions array.",
      "type" : "Boolean",
      "default" : "true"
    },
    {
      "name" : "menuWidth",
      "descr" : "Set the width of the menus.",
      "type" : "Integer, String",
      "default" : "150"
    },
    {
      "name" : "regexFind",
      "descr" : "Set to true to automatically search text, within elements matched by selector, for codes that belong to the codeset. A codeset must be set for this to work.",
      "type" : "Boolean",
      "default" : "false"
    }
  ]
}
***/
(function($, undefined){

  var whitePunctSplit = /[^\w^\.]|(?:\.(?:[\s]|$))|(?:&[\w]+;)/;

  $.widget("fac.codeactions", $.fac.facbase, {
    
    options : {
      actions: [],
      addClass: null,
      codeset: null,
      menu: true,
      menuWidth: 150,
      regexFind: false
    },
    
    _create : function(selector, params) {
      var self = this,
          elem = this.element,
          o = this.options;
      
      self._facCreate(false);
      
      // If using regexFind, iterate over all the codes found
      // Otherwise, iterate over the elements that match the selector
      var codeElems = [];
      if ( o.regexFind && o.codeset ) {      
        var codePattern = FAC.codesets[o.codeset].regex;
        
        // Get text nodes
        var textNodes = self._getMatchingTextNodes(elem, codePattern);

        // Replace codes with spans
        $.each(textNodes, function(i, tNode){
          var text = tNode.nodeValue;
          var words = text.split(whitePunctSplit);
          var matches = [];
          
          // Find all codes
          $.each(words,function(i,w){
            if(codePattern.test(w)) {
              matches.push(w);
            }
          });
          
          if(matches.length == 0) {
            console.log('no matches found');
            return;
          }
          
          // Dynamically build regex split
          var codeSplit = '';
          $.each(matches,function(i,m){
            if(m){
              if(codeSplit) {
                codeSplit += '|';
              }
              codeSplit += '(?:'+m.replace('.','\\.')+')';
            }
          });
          codeSplit = RegExp(codeSplit);
          
          // Split text on codes
          var phrases = text.split(codeSplit);
          
          // Wrap codes in spans and add to element list
          var container = $('<span>');
          $.each(phrases,function(i,w){
            if ( i != 0 ) {
              var newSpan = $('<span class="fac-codeactions-code">'+matches[i-1]+'</span>');
              codeElems.push(newSpan);
              container.append(newSpan);
            }
            if ( w ) {
              container.append(document.createTextNode(w));
            }
          });
          
          // If all of the matches weren't added
          
          // Add new elements
          $(tNode).replaceWith(container.contents());
        });
      } else {
        codeElems = elem;
      }
      
      // Store references to menus so that they can be destroyed
      if ( o.menu ) {
        self.menus = [];
      }
      
      // Iterate over matching elements to bind actions
      $.each(codeElems,function(i, elem){
        elem = $(elem);
        var code = elem.attr('code') ? elem.attr('code') : elem.text();
        var codeset = elem.attr('codeset') ? elem.attr('codeset') : o.codeset;
        
        // Apply custom style
        if ( o.addClass ) {
          elem.addClass( o.addClass );
        }
        
        // Create a menu
        if ( o.menu ) {        
          var codeMenu = $('<div class="fac-codeactions-menu ui-corner-all ui-widget-content" />');
          
          // Create menu items
          $.each(o.actions,function(i,action){
            var menuItem = $('<div class="ui-state-default ui-corner-all fac-codeactions-menu-item" />');
            
            // Add text
            if ( action.title ) {
              menuItem.text(action.title);
            }
            
            // Add icon
            if ( action.uiIcon ) {
              menuItem.prepend(
                $('<div class="ui-state-default ui-corner-all fac-codeactions-icon-wrap" />').append(
                  $('<span class="ui-icon ' + action.uiIcon + '" />')
                )
              );
            } else if ( action.image ) {
              menuItem.prepend(image);
            }
            
            // Bind events
            menuItem.click(function(event){
              action.click(event, elem, code, codeset);
            }).hover(function(){
              $(this).addClass('ui-state-hover');
            },function(){
              $(this).removeClass('ui-state-hover');
            }).appendTo(codeMenu);
          });
          
          // Wrap in .fac div and append to the elements parent
          var menuWrap = codeMenu.wrap('<div class="fac fac-codeactions-menu-wrap" />').parent();
          menuWrap.appendTo(document.body);
          
          // Positioning - left aligned and directly below the original element
          var elemPosition = elem.position();
          var menuTop = elemPosition.top + elem.outerHeight(true);
          menuWrap.css({left: elemPosition.left, top: menuTop}).width(o.menuWidth);
          
          // Add click event to the original element
          elem.click(function(e){
            menuWrap.slideToggle();
            
            // Hide all other codeaction widget menus
            $('.fac-codeactions-menu-wrap').not(menuWrap).hide();
            
            // Don't fire menu and document hide functions
            e.stopPropagation();
          });
          
          // Hide the menu after any click
          $(document).click(function(e){
            menuWrap.slideUp('fast');
          });
          
          // Keep a reference to the menu so that it can be destroyed later
          self.menus.push( menuWrap );
        }
        
        // Create buttons
        else {
          var buttonWrapper = $('<div class="fac fac-codeactions-button-wrap" />');
        
          // Create buttons
          $.each(o.actions,function(i,action){
              buttonWrapper.append(
                $('<div class="ui-state-default ui-corner-all fac-codeactions-icon-wrap" />').append(
                  $('<span class="ui-icon ' + action.uiIcon + '" />')
                ).click(function(event){
                  action.click(event, elem, code, codeset);
                }).attr('title', action.title)
              );
          });
          
          buttonWrapper.insertAfter(elem);
        }
      });
    },
    
    destroy : function() {
      // Destroy menus
      if( this.options.menu ) {
        $.each( this.menus, function(i, m) {
          m.remove();
        });
      } 
      // Destroy buttons
      else {
        $('.fac-codeactions-button-wrap', this.element).remove();
      }
      // Remove code spans
      $('.fac-codeactions-code', this.element).each(function(){
        $(this).replaceWith( $(this).text() );
      });
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    },
    
    // Return a list of all matching descendant text nodes
    _getMatchingTextNodes: function(node, codePattern){
      var self = this;
      var textNodes = [];
      $(node).contents().each(function(){
        var child = this;
        if(self._isTextNode(child)){
          var words = child.nodeValue.split(whitePunctSplit);
          $.each(words,function(i,w){
            if(codePattern.test(w)) {
              textNodes.push(child);
              // Break execution of the .each to prevent duplicates
              return false;
            }
          });
        } else {
          $.merge(textNodes, self._getMatchingTextNodes(child, codePattern));
        }
      });
      return textNodes;
    },
    
    // Function used to filter text nodes
    _isTextNode: function(node){
      return ( node.nodeType === 3 );
    }
  });
}(FAC));