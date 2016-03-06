  /*
   * This a list of functions which will be added to the automatically built set of functions.
   * The comments marked with a / and 3 * dilineate the groups where the additional functions should be placed.
   *
   * The /v2 list is used for utility functions and other global api functions
   */
   
  /*** /v2 ***/
  
  function checkOptionalParams( data, params, values ) {
    if( $.isPlainObject(values) ) {
      $.each( params, function( apiName, jsName ) {
        if( values[jsName] ) {
          data[apiName] = values[jsName];
        }
      });
    }
  }
  
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
    
  /*** /v2/tool/autocomplete ***/

  FAC.api.tool.autocomplete = function(codeset, term, options) {
    return FAC.api.tool['autocomplete' + capitalize(codeset)](term, options);
  };

  /*** /v2/tool/search ***/
  
  FAC.api.tool.search = function(codeset, query, options) {
    return FAC.api.tool['search' + capitalize(codeset)](query, options);
  };

  /*** /v2/tool/crossacode ***/
  
  FAC.api.tool.crossacode = function(codeset, code, mappings) {
    
    var data = {};
    
    // If a string was given for the mappings, wrap it in an array
    if( FAC.type(mappings) === 'string' ) {
      mappings = [mappings];
    }
    
    // If the mappings parameter is an array, turn it into a 
    // comma delimited string and add to the post data
    if( FAC.isArray(mappings) ) {
      data.data = mappings.join(',');
    }
    
    return FAC.api.tool['crossacode' + capitalize(codeset)](code, data);
  };
  
  /*** /v2/tool/spellchecker ***/
  
  FAC.api.tool.spellchecker = function(q, options) {
    return FAC.api.tool.spellcheckerAll(q, options);
  };

  /*** /v2/web ***/

  FAC.api.web.getCode = function(codeset, code) {
    return FAC.api.web[codeset + 'Code']({ 'code': code });
  };