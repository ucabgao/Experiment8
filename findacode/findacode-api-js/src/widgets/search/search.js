/***
{
  "descr" : "The search widget provides advanced search functionality with autocomplete and spell checking.",
  "declaration" : "FAC(selector).search([options]);",
  "events" : [
    {
      "name" : "search",
      "descr" : [
        "This event is triggered when a search is completed. The search query is passed as the second argument to the callback function.",
        "Supply a callback function to handle the search event as an init option.",
        "<pre>$( '.selector' ).search({\n   search: function(event, query) { ... }\n});</pre>",
        "Bind to the search event: searchsearch.",
        "$( '.selector' ).bind( 'searchsearch', function(event, query) { ... });"
      ]
    },
    {
      "name" : "codesetChange",
      "descr" : [
        "This event is triggered when the codeset is changed. The new codeset is passed as the second argument to the callback function",
        "Supply a callback function to handle the search event as an init option.",
        "<pre>$( '.selector' ).search({\n   codesetChange: function(event, query) { ... }\n});</pre>",
        "Bind to the search event: searchcodesetchange.",
        "<pre>$( '.selector' ).bind( 'searchcodesetchange', function(event, query) { ... });</pre>"
      ]
    }
  ],
  "methods" : [
    {
      "name" : "search",
      "descr" : "Initiates a new search.",
      "declaration" : ".search( 'search' , [searchQuery] , [limit] , [offset])",
      "parameters" : [
        {
          "name" : "searchQuery",
          "descr" : "The new search query. The value of the search box will be updated. If <b>searchQuery<b/> is null the value in the search box will be used."
        },
        {
          "name" : "limit",
          "descr" : "The number of results to return. If null, the value set when the widget was created is used."
        },
        {
          "name" : "offset",
          "descr" : "The offset for where the results should start. The results use zero-based indexing so <b>.search('search','query',10,1)</b> will skip the first result."
        }
      ]
    }
  ],
  "options" : [
    {
      "name" : "codeset",
      "descr" : "Set which codeset will be selected when the widget is initialized.",
      "type" : "String",
      "default" : "icd10cm"
    },
    {
      "name" : "codesets",
      "descr" : [
        "Restrict the codesets which are available for searching.",
        "<pre>['icd10cm','icd10pcs',...]</pre>"
      ],
      "type" : "String, Array",
      "default" : "'all'"
    },
    {
      "name" : "height",
      "descr" : "Set the height of the search widget. A scroll bar will appear if the content overflows the height of the container.",
      "type" : "Integer, String",
      "default" : "null"
    },
    {
      "name" : "modalDialogs",
      "descr" : "Set to true to make the <a target='_blank' href='http://jqueryui.com/demos/dialog/'>jQuery UI Dialogs</a> used by the search widget be modal.",
      "type" : "Boolean",
      "default" : "true"
    },
    {
      "name" : "nextLabel",
      "descr" : "Set the text of the next button in the results pager.",
      "type" : "String",
      "default" : "'Next'"
    },
    {
      "name" : "pagerSize",
      "descr" : "Set the maximum number of pages that are shown in the pager at a time.",
      "type" : "Number",
      "default" : "10"
    },
    {
      "name" : "previousLabel",
      "descr" : "Set the text of the previous button in the results pager.",
      "type" : "String",
      "default" : "'Prev'"
    },
    {
      "name" : "resultButtons",
      "descr" : [
        "Allows for buttons with click events to be added at the end of each search result. This enables interaction with other Find-A-Code widgets or tools on your page. Multiple icons may be configured.",
        "The following object values are required:<br /><blockquote>click - A callback function that is fired when the button is clicked</blockquote>",
        "The following object values are optional:<br /><blockquote>icon - A jQuery UI icon class<br />label - HTML that will appear in the button<br />src - The url for an image that will function as the button</blockquote>",
        "The callback functions are passed the <b>event</b> object. The <b>event</b> object contains info from the search query in the <b>data</b> attribute.",
        "<b>Format</b>",
        "<pre>[\n    {\n      label: 'Cross-A-Code',\n      icon: 'ui-icon-shuffle',\n      click: function(e) {\n        FAC('#crossacode').crossacode('option', 'code', e.data.code);\n      }\n    }\n    ...\n  ]</pre>",
        "<b>Example</b>",
        "<pre>FAC('#search').search({\n    'resultButtons':[\n      {\n        label: 'Cross-A-Code',\n        icon: 'ui-icon-shuffle',\n        click: function(e) {\n          FAC('#crossacode').crossacode('option', 'code', e.data.code);\n        }\n      }\n    ]\n  });</pre>"
      ],
      "type" : "Array",
      "default" : "[]"
    }
  ]
}
***/
(function($, undefined){
  
  var defaultCodeset = 'icd10cm', // The codeset which is assigned if the codeset given initially is invalid
      minWidth = 500,
      defaultSearchText = 'Enter a code or keywords...',
      helpText = '<div class="fac-search-help-text"><div class="fac-search-text-h">To Search:</div><div class="fac-search-text-p">Enter your search words or code numbers in the box above. Click the <span class="fac-search-text-mono">Search</span> button to begin the search. Enter as many specific keywords as you can.</div><div class="fac-search-text-h">Advanced Searching:</div><div class="fac-search-text-p">Use an asterisk (*) to search for partial matches.<br/>For example, <span class="fac-search-text-mono">ambu*</span> will match <span class="fac-search-text-mono">ambulance</span> and <span class="fac-search-text-mono">ambulatory</span>.</div></div>',
      noResultsText = '<div class="fac-search-noresults">No results were found for <span class="fac-search-noresults-query">%query%</span>. You may want to:<ul><li>Check your spelling.</li><li>Add additional terms to the search phrase above.</li><li>Search additional codesets/categories using the checkboxes on the left.</li></ul></div>';
  
  $.widget("fac.search", $.fac.facbase, {
  
    options: {
      codeset: 'icd10cm',
      codesets: 'all',
      height: null,
      nextLabel: 'Next',
      pagerSize: 7,
      previousLabel: 'Prev',
      resultButtons: [],
      resultClick: null,
      resultsLimit: 10,
      width: null    
    },
    
    _create: function() {
      var self = this,
          o = this.options,
          elem = this.element;
      
      self._facCreate(true);
      self.elems.spellingDetailElements = [];
      
      //
      // Process options
      //
      
      // Enforce min width
      if( o.width ) {
        o.width = Math.max(minWidth, o.width);
      }
      
      // Setup codesets
      if( o.codesets == 'all' ) {
        o.codesets = [];
        $.each(FAC.codesets, function(codeset, info) {
          o.codesets.push(codeset);
        });
      }
      
      // Validate codeset
      if( !self._isValidCodeset( o.codeset ) ) {
        o.codeset = defaultCodeset;
      }
      
      // Initialize target element
      elem.html('');
      if( o.width ) {
        elem.width(o.width);
      } else {
        elem.css('min-width', minWidth);
      }
      if( o['height'] ){
        elem.css({'height':o.height,'overflow-y':'auto'});
      }
	  
      // Create search widget container
      var widgetWrapper = $('<div>').addClass('fac-search ui-widget').appendTo(elem);
      
      // Create header search bar
      var searchBar = $('<table class="fac-search-bar">').appendTo(widgetWrapper);
      var searchBarTR = $('<tr />').appendTo(searchBar);
      
      // Create settings and code set select
      var settingsTD = $('<td class="fac-search-settings-td"/>').appendTo(searchBarTR);
      var settingsButton = $('<button class="fac-search-button-settings">Options</button>').appendTo(settingsTD).button({icons:{primary: 'ui-icon-circle-plus'}});		
      
      // Create search box
      var searchBoxTD = $('<td class="fac-search-box-td" />').appendTo(searchBarTR);
      var searchBox = $('<input type="text" class="fac-search-box ui-widget-content ui-corner-all" title="'+defaultSearchText+'"/>').appendTo(searchBoxTD).focus(function(){
        var searchBox = $(this);
        if(searchBox.val() == searchBox[0].title) {
          searchBox.removeClass('ui-state-default').addClass('ui-state-active').val('');
        }
      }).blur(function(){
        var searchBox = $(this);
        if(searchBox.val() == '') {
          searchBox.removeClass('ui-state-active').addClass('ui-state-default').val(searchBox[0].title);
        }
      }).blur().keydown( function(e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13) {
          self.search();
        }
      });
      searchBox.autocomplete({
        source: function( request, response ) {
          var postData = FAC.getAPICredentials();
          postData['term'] = request.term;
          
          FAC.api.tool.autocomplete(self.elems.codesetSelect.val(), request.term).done(function( data ) {
            response( $.map( data.data, function( item ) {
              return {
                label: item,
                value: item
              }
            }));
          });
        }
        ,select: function(event,ui) {
          self.search(ui.item.value);
        }
        ,minLength: 2
      });
      self.elems.searchBox = searchBox;
      
      // Create search button
      var searchButtonTD = $('<td class="fac-search-button-td" />').appendTo(searchBarTR);
      var searchButton = $('<button class="fac-search-button">Search</button>').appendTo(searchButtonTD).button().click(function(){self.search()});
      
      // Create results box
      var resultsWrapper = $('<div class="fac-search-results-wrapper"></div>').appendTo(widgetWrapper);
      self.elems.resultsTitle = $('<div class="ui-widget-header ui-progressbar-value fac-search-results-title">Optimize Your Results</div>').appendTo(resultsWrapper);
      var resultsContainer = $('<div class="ui-widget-content fac-search-results-container" />').appendTo(resultsWrapper);
      self.elems.resultsList = $('<div class="fac-search-results-list" />').appendTo(resultsContainer).html(helpText);
      self.elems.pager = $('<div class="fac-search-results-pager" />').appendTo(resultsContainer);
      
      // Spelling elements
      self.elems.spellingWrapper = $('<div class="fac-search-spelling-wrap" />').prependTo(resultsContainer);
      self.elems.spellingHeader = $('<div class="ui-state-highlight fac-search-spelling-header"><span class="ui-icon ui-icon-info"></span>Possible Misspellings:</div>').appendTo(self.elems.spellingWrapper);
      self.elems.spellingSummary = $('<span class="fac-search-spelling-summary" />').appendTo(self.elems.spellingHeader);
      self.elems.spellingHeaderStateIcon = $('<span class="fac-search-spelling-header-state-icon ui-icon ui-icon-circle-triangle-s"></span>').prependTo(self.elems.spellingHeader);
      self.elems.spellingDetailsWrapper = $('<div class="ui-state-highlight fac-search-spelling-details-wrapper" />').appendTo(self.elems.spellingWrapper);
      self.elems.spellingDetails = $('<span class="fac-search-spelling-details" />').appendTo(self.elems.spellingDetailsWrapper);
      self.elems.spellingHeader.click(function(){
        self.elems.spellingSummary.fadeToggle();
        self.elems.spellingDetailsWrapper.slideToggle();
        self.elems.spellingHeaderStateIcon.toggleClass('ui-icon-circle-triangle-s ui-icon-circle-triangle-n');
      });
      var spellingSearchWrap = $('<div />').appendTo(self.elems.spellingDetailsWrapper);
      $('<button class="fac-search-spelling-search">Search</button>').appendTo(spellingSearchWrap).button().click(function(){
        var newSearchQuery = '';
        $.each(self.elems.spellingDetailElements,function(i,newWord){
          if(newWord.is('select')) {
            newSearchQuery += ' ' + newWord.val();
          } else {
            newSearchQuery += ' ' + newWord.text();
          }
        });
        self.search($.trim(newSearchQuery));
        self.elems.spellingDetails.effect('transfer',{'to':self.elems.searchBox,'className':'fac-search-effects-transfer'});
      });
      self.elems.spellingDetailsWrapper.append('<div class="fac-clear" />');
      
      // Powered by FAC
      $('<div class="fac-search-powered">Powered by Find-A-Code&trade;</div>').appendTo(widgetWrapper);
      
      // Create settings dialog container
      self.elems.settingsDialog = $('<div class="fac-search-settings-dialog" title="Search Settings" />').appendTo(widgetWrapper);
      
      // Add codeset select to the settings dialog
      var codesetSelectWrapper = $('<div class="fac-search-settings-wrapper" />').appendTo(self.elems.settingsDialog);
      var codesetSelectLabel = $('<label class="fac-search-settings-label"><span class="fac-search-settings-label-text">Codeset:</span></label>').appendTo(codesetSelectWrapper);
      var codesetSelect = self.elems.codesetSelect = $('<select class="fac-search-codeset-select" />').appendTo(codesetSelectLabel);
      $.each(o.codesets, function(index, codeset) {
        $('<option value="' + codeset + '" ' + (codeset == o.codeset ? 'SELECTED' : '' ) + ' >' + FAC.codesets[codeset].text + '</option>').appendTo(codesetSelect);
      });
      codesetSelect.multiselect({
        multiple: false,
        header: false,
        height: 'auto',
        selectedList: 1,
        minWidth: '8.5em',
        close: function(event,ui) {
          var newCodeset = codesetSelect.val();
          settingsButton.button('option', 'label', FAC.codesets[newCodeset].text );
          elem.search('option', 'codeset', newCodeset); 
        }
      });
      settingsButton.button('option', 'label', FAC.codesets[codesetSelect.val()].text );
      
      // Add code only checkbox
      var codeOnlyWrapper = $('<div class="fac-search-settings-wrapper" />').appendTo(self.elems.settingsDialog);
      var codeOnlyLabel = $('<label class="fac-search-settings-label"><span class="fac-search-settings-label-text">Only Search Codes:</span></label>').appendTo(codeOnlyWrapper);
      self.elems.codeOnlyCheckBox = $('<input type="checkbox" class="fac-search-settings-codeonly-checkbox" />').appendTo(codeOnlyLabel).click(function(){
        self.search();
      });
      
      // Create settings dialog
      self.elems.settingsDialog.facdialog({
        autoOpen: false,
        buttons: [
          {
            label: 'Close', 
            click: function(){ $(this).facdialog('close'); }
          }
        ],
        modal: true,
        position: {
          my: "left top",
          at: "left bottom",
          of: settingsButton,
          offset: '0 2',
          collision: 'none'
        }
      });
      
      // Bind click event for showing the dialog
      settingsButton.click(function(){
        self.elems.settingsDialog.facdialog('open');
      });
    },
    
    _init: function() {      
      if( FAC.isDemo() ) {
        this._setupDemo();
      } else {
        this._removeDemo();
      }
    },
    
    _facLogout: function() {
      this._setupDemo();
    },
    
    _setupDemo: function() {
      this.elems.searchBox.autocomplete('option', 'disabled', true);
      this.search();
    },
    
    _facLogin: function() {
      this._removeDemo();
    },
    
    _removeDemo: function() {
      this.elems.searchBox.autocomplete('option', 'disabled', false);
      this.search();
    },
    
    search: function(userQuery, limit, offset) {
      var self = this;
      self.elems.searchBox.blur(); // hide autocomplete and prevent it from showing
      
      var limit = limit ? limit : self.options.resultsLimit;
      var offset = offset ? offset : 0;
      var codeSet = self.elems.codesetSelect.val();
      if(userQuery) {
        self.elems.searchBox.val(userQuery).focus();
      } else {
        userQuery = $.trim(self.elems.searchBox.val());
      }
      
      // Exit if the search field is blank or in its default state
      if(userQuery == '' || userQuery == defaultSearchText) {
        self.elems.pager.html('');
        self.elems.resultsList.html(self.helpText);
        self.elems.resultsTitle.html('Optimize Your Results');
        if(self.elems.spellingDetailsWrapper.is(':visible')) {
          self.elems.spellingHeader.click();
        }
        self.elems.spellingWrapper.slideUp();
        return;
      }

      // Spellcheck
      FAC.api.tool.spellchecker(userQuery).done(function(jsonReturn){
        
        var misspellings = jsonReturn.data.misspellings;
        var suggestions = jsonReturn.data.suggestions;
        var queryWords = jsonReturn.status.params['q'].split(/[, ]+/);
        
        if(misspellings.length) {					
          // Update the spelling header
          var spellingSummary = '';
          for(var i = 0; i < Math.min(3,misspellings.length); i++) {
            if(i) {
              spellingSummary += ', ';
            }
            spellingSummary += misspellings[i];
          }
          self.elems.spellingSummary.text(spellingSummary);
          
          // Properly cleanup old multiselects
          $.each(self.elems.spellingDetailElements,function(i,elem){
            if(elem.is('select')) {
              elem.multiselect('destroy');
            }
          });
          
          // Create spelling details ui
          self.elems.spellingDetailElements = [];
          self.elems.spellingDetails.html('');
          $.each(queryWords,function(i,word){
            if(suggestions[word]) {
              var spellingSelect = $('<select />').appendTo(self.elems.spellingDetails);
              $.each(suggestions[word],function(i,suggestion){
                spellingSelect.append($('<option />',{'value':suggestion}).html(suggestion.split(' ').join('&nbsp;')));
              });
              spellingSelect.multiselect({
                multiple: false,
                header: false,
                selectedList: 1,
                height: 'auto',
                minWidth: spellingSelect.getHiddenDimensions().outerWidth + 10
              });
              self.elems.spellingDetailElements.push(spellingSelect);
            } else {
              self.elems.spellingDetailElements.push($('<span class="fac-search-spelling-word" />').appendTo(self.elems.spellingDetails).text(word));
            }
          });
        
          // Show spelling section
          self.elems.spellingWrapper.slideDown();
        }
        // Hide the spelling div when there are no misspellings
        else {
          self.elems.spellingWrapper.slideUp();
        }
      });
      
      var finalQuery = userQuery;
      if(self.elems.codeOnlyCheckBox.is(":checked")) {
        finalQuery = "type:CODE AND " + userQuery;
      }
      
      self.elems.resultsTitle.html('Search Results');
      resultsList = self.elems.resultsList;
      var searchUrl = 'tool/search/'+codeSet;
      
      resultsList.spinner();
      
      FAC.api.tool.search(codeSet, finalQuery, {
        'limit': limit, 
        'offset': offset
      }).done(function(jsonReturn){
        // Remove the spinner
        resultsList.spinner('destroy').html('');
        
        // Reset the search box to the demo value if in demo mode
        if(FAC.isDemo()){
          self.elems.searchBox.val(jsonReturn['status']['params']['q']);
        }				
        
        // Create results list
        $.each(jsonReturn['data']['results'],function(index,code){
          
          var codeHeader = $('<div class="fac-search-result-header ui-state-default"><div class="fac-search-results-text">' + code['code'] + ' - ' + code['title'] + '</div></div>')
            .appendTo(resultsList).data({'fac-search-codeset':codeSet,'fac-search-code':code['code'],'fac-search-showing':false});
          
          // Bind a click event to the result if necessary
          if(self.options.resultClick) {
            codeHeader.click(code,function(event){
              self.options.resultClick(event);
            }).hover(function(){
              $(this).addClass('ui-state-hover');
            },function(){
              $(this).removeClass('ui-state-hover');
            }).addClass('fac-search-result-header-clickable');
          }
          
          // Create custom results buttons
          var resultButtonsWrapper = $('<div>').addClass('fac-search-result-buttons').prependTo(codeHeader);
          $.each(self.options.resultButtons,function(index, buttonConfig){
            
            var resultButton;
            if( buttonConfig.src ) {
              resultButton = $('<img>').attr('src', buttonConfig.src);
            } else {
              resultButton = $('<button>').button({
                label: buttonConfig.label,
                icons: { primary: buttonConfig.icon }
              })
            }
            
            resultButton.click(code, function(event){
                // call custom callback
                buttonConfig.click(event);
                event.stopPropagation();
              })
              .appendTo(resultButtonsWrapper)
              .addClass('fac-search-custom-result-button');
            
            if( resultButton.title ) {
              resultButton.attr('title', resultButton.title);
            }
          });
        });
        
        if(jsonReturn['data']['info'].available == 0) {
          resultsList.html(noResultsText.replace('%query%',userQuery));
        }
        
        // Create pager when necessary
        self.elems.pager.html('');
        if(jsonReturn['data']['info'].available > self.options.pagerSize) {
          var total = jsonReturn['data']['info']['available'];
          var currentOffset;
          var startOffest;
          var page = 1;
          var size = self.options.pagerSize;
          var currentPage = (offset / limit) + 1;
          var middlePage = Math.ceil(size / 2);
          var totalPages = Math.ceil(total / limit);
          var startPage = 1;
          var endPage = totalPages > size ? size : totalPages;
          if(middlePage < currentPage && totalPages > size) {
            // If the sliding pager has hit the last page...
            if(totalPages - currentPage < middlePage) {
              startPage = totalPages - size + 1;
            }
            // If we are somewhere in the middle...
            else {
              startPage = currentPage - middlePage + 1;
            }
            endPage = startPage + size - 1;
          }
          
          
          if(currentPage != 1) self._createPage(self.options.previousLabel,limit,(currentPage - 2) * limit,false);
          for(page = startPage, currentOffset = (startPage - 1) * limit; page <= endPage; page++, currentOffset += limit) {
            self._createPage(page,limit,currentOffset,page == currentPage);
          }
          if(currentPage != endPage) self._createPage(self.options.nextLabel,limit,currentPage * limit,false);
        }
        
        self._trigger('search', finalQuery);
      });
    },
    
    _createPage: function(page,limit,offset,currentPage) {
      var self = this;
      var pageButton = $('<div class="fac-search-page ui-state-default">'+page+'</div>').click(function(){
        self.search(null,limit,offset);
      }).hover(function(){
        $(this).addClass('ui-state-hover');
      },function(){
        $(this).removeClass('ui-state-hover');
      }).appendTo(self.elems.pager);
      if(currentPage) {
        pageButton.addClass('ui-state-highlight');
      }
    },
    
    _isValidCodeset: function( codeset ) {
      return $.inArray(codeset, this.options.codesets ) != -1;
    },
    
    _setOption: function( key, value ) {
      var self = this,
          o = self.options;
      
      switch( key ) {
        case "codeset":
          if( value != o.codeset && self._isValidCodeset( value ) ) {
            o.codeset = value;
            self.search();
            self._trigger('codesetChange', null, value);
          }
          break;
      }
      $.Widget.prototype._setOption.apply( this, arguments );
    },
 
    destroy: function() {
      this.elems.searchBox.autocomplete('destroy');
      this.elems.codesetSelect.multiselect('destroy');
      this.elems.settingsDialog.facdialog('destroy');
      this.element.html("").removeClass('fac');
      if( !this.options.width ) {
        this.element.css('min-width', '');
      }
      this._facDestroy();
      $.Widget.prototype.destroy.call( this );
    }  
  });
  
  // http://www.foliotek.com/devblog/getting-the-width-of-a-hidden-element-with-jquery-using-width/
  // Optional parameter includeMargin is used when calculating outer dimensions
  $.fn.getHiddenDimensions = function(includeMargin) {
    var $item = this,
        props = { position: 'absolute', visibility: 'hidden', display: 'block' },
        dim = { width:0, height:0, innerWidth: 0, innerHeight: 0,outerWidth: 0,outerHeight: 0 },
        $hiddenParents = $item.parents().andSelf().not(':visible'),
        includeMargin = (includeMargin == null)? false : includeMargin;
 
    var oldProps = [];
    $hiddenParents.each(function() {
        var old = {};
 
        for ( var name in props ) {
            old[ name ] = this.style[ name ];
            this.style[ name ] = props[ name ];
        }
 
        oldProps.push(old);
    });
 
    dim.width = $item.width();
    dim.outerWidth = $item.outerWidth(includeMargin);
    dim.innerWidth = $item.innerWidth();
    dim.height = $item.height();
    dim.innerHeight = $item.innerHeight();
    dim.outerHeight = $item.outerHeight(includeMargin);
 
    $hiddenParents.each(function(i) {
        var old = oldProps[i];
        for ( var name in props ) {
            this.style[ name ] = old[ name ];
        }
    });
 
    return dim;
  }
  
}(FAC));