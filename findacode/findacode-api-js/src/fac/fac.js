/***
{
  "events" : [
    {
      "name" : "login",
      "descr" : "Triggered when a user successfuly logs in."
    },
    {
      "name" : "login-fail",
      "descr" : "Triggered when a user attempts to log in but fails."
    },
    {
      "name" : "logout",
      "descr" : "Triggered when a user logs out."
    },
    {
      "name" : "key-expired",
      "descr" : "Triggered when a user's temp-key expires."
    }
  ],
  "event_methods" : [
    {
      "name" : "on",
      "descr" : "Register a handler with a global event.",
      "declaration" : "FAC.events.on( event, handler )",
      "parameters" : [
        {
          "name" : "event",
          "descr" : "The global event which the handler will be registered with."
        },
        {
          "name" : "handler",
          "descr" : [
            "A callback function which will be called when the global event is fired. The callback function may be passed data when fired. See FAC.events.trigger() for more info.",
            "<pre>FAC.events.on( 'login', function(data){\n  alert(data);\n});</pre>"
          ]
        }
      ]
    },
    {
      "name" : "off",
      "descr" : "Remove a handler from a global event.",
      "declaration" : "FAC.events.off( event, handler )",
      "parameters" : [
        {
          "name" : "event",
          "descr" : "The global event which the handler will be removed from."
        },
        {
          "name" : "handler",
          "descr" : "The callback function which will be removed from the global event."
        }
      ]
    },
    {
      "name" : "trigger",
      "descr" : "Fire a global event.",
      "declaration" : "FAC.events.trigger( event, [data] )",
      "parameters" : [
        {
          "name" : "event",
          "descr" : "The global event which will be fired."
        },
        {
          "name" : "data",
          "descr" : [
            "Optional data to be passed to all handlers which are called.",
            "<pre>FAC.events.on( 'login', function(data){\n  alert(data);\n});</pre>"
          ]
        }
      ]
    }
  ],
  "methods" : [
    {
      "name" : "loginPopup",
      "descr" : "Launch a modal dialog for logging in.",
      "declaration" : "FAC.loginPopup( [clientId] )",
      "parameters" : [
        {
          "name" : "clientId",
          "descr" : "This parameter is optional. When given, the clientId field will not show. This creates a more normal experience for your users."
        }
      ]
    },
    {
      "name" : "login",
      "descr" : "The login function launches a login form inside of a modal dialog. Fires the global 'fac-login' event after the user successfully logs in.",
      "declaration" : "FAC.login( options )",
      "parameters" : [
        {
          "name" : "options",
          "descr" : [
            "An object containing the following fields:",
            "<strong>clientId</strong> - Your client id.",
            "<strong>username</strong> - The username of the user that is being logged in.",
            "<strong>password</strong> - The password of the user that is being logged in."
          ]
        }
      ]
    },
    {
      "name" : "logout",
      "descr" : "Logs out the currently logged in user. Fires the global 'fac-logout' event.",
      "declaration" : "FAC.logout()",
      "parameters" : []
    },
    {
      "name" : "api",
      "descr" : [
        "All calls to the Find-A-Code APIs should be made through the FAC.api() method. FAC.api() returns a jQuery Deferred object. It is a wrapper around jQuery's ajax function.",
        "<pre>FAC.api({\n  'url': 'web/icd10cm/code',\n  'data': {code: 'H60.00'},\n  'success': function(jsonReturn){\n    $('#codeinfo').html(jsonReturn.data);\n  }\n});</pre>"
      ],
      "declaration" : "FAC.api( options )",
      "parameters" : [
        {
          "name" : "url",
          "descr" : "<b>REQUIRED</b> The api endpoint that will be called. The domain should not be included. The api url that is set when initializing FAC will be automatically appended."
        },
        {
          "name" : "data",
          "descr" : "Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET-requests."
        },
        {
          "name" : "noAuth",
          "descr" : "Default false. When true, the user's authentication credentials won't be passed (user-id, client-id, temp-key, etc)."
        },
        {
          "name" : "success",
          "descr" : [
            "A function to be called if the api call is a success. Only results that include a status code of 200 will be considered a success. Because FAC.api() returns a jQuery deferred, success handlers may also be attached through the deferred's done method. The following examples are equivalent:",
            "<pre>function accept(response) { }\n\nFAC.api({\n  url: 'some/endpoint'\n}).done(accept);</pre>",
            "<pre>function accept(response) { }\n\nFAC.api({\n  url: 'some/endpoint',\n  success: accept\n});</pre>"
          ]
        },
        {
          "name" : "error",
          "descr" : [
            "A function to be called if the api call fails. This will be fired if the ajax call fails for network or server reasons, or if the api endpoint responds with a status code other than 200. Because FAC.api() returns a jQuery deferred, error handlers may also be attached through the deferred's fail method. The following examples are equivalent:",
            "<pre>function epicFail(response) { }\n \nFAC.api({\n  url: 'some/endpoint'\n}).fail(epicFail);</pre>",
            "<pre>function epicFail(response) { }\n\nFAC.api({\n  url: 'some/endpoint',\n  error: epicFail\n});</pre>"
          ]
        }
      ]
    }
  ],
  "settings" : {
    "descr" : [
      "Settings are used to configure credentials for the Find-A-Code APIs and source urls. The settings can be changed one at a time:",
      "<pre>FAC.settings(\"clientId\", \"demo\");</pre>",
      "Or multiple settings can be changed at once:",
      "<pre>FAC.settings({\n  \"clientId\": \"demo\",\n  \"userId\": \"demo\"\n});</pre>"
    ],
    "settings" : [
      {
        "name" : "api",
        "descr" : "The base url for the Find-A-Code Data API endpoints.",
        "default" : "https://api2.findacode.com/v2/"
      },
      {
        "name" : "clientId",
        "descr" : "Your Client ID for the Find-A-Code Data APIs.",
        "default" : "demo"
      },
      {
        "name" : "userId",
        "descr" : "Your User ID for the Find-A-Code Data APIs. This will need to be configured separately for each authorized user of your system.",
        "default" : "demo"
      },
      {
        "name" : "tempKey",
        "descr" : "The users Temporary Key for the Find-A-Code Data APIs. The temp key is obtained from the /v2/auth/login endpoint.",
        "default" : "demo"
      }
    ]
  },
  "widgets" : { }
}
***/
/*
 * FAC widget library
 */
(function(FAC) {

  FAC.codesets = {
    'icd10cm': {
      text: 'ICD-10-CM',
      regex: /^[A-Z][0-9][A-Z0-9](\.[A-z0-9]{1,4})?$/
    },
    'icd10pcs': {
      text: 'ICD-10-PCS',
      regex: /^[A-Z0-9]{7}$/
    },
    'icd9v1': {
      text: 'ICD-9-CM V1',
      regex: /^[0-9V][0-9]{2}(\.[0-9]{1,2})?|E[0-9]{3}(\.[0-9])?$/
    },
    'icd9v3': {
      text: 'ICD-9-CM V3',
      regex: /^[0-9]{2}(\.[0-9]{1,2})?$/
    },
    'cpt': {
      text: 'CPT',
      regex: /^[0-9]{5}$/
    },
    'hcpcs': {
      text: 'HCPCS',
      regex: /^[A-z][0-9]{4}$/
    }
  };
  
  FAC._defaultSettings = {
    clientId: 'demo',
    userId: 'demo',
    tempKey: 'demo',
    userType: 'user',
    clientKey: null,
    api: 'https://api2.findacode.com/v2/',
    debug: false,
    debugMsgTimeout: 1000
  };
  
  // User a map on persistentSettings for quick lookup
  // This object is referenced every time a setting changes
  FAC._persistentSettings = {
    //'clientId': 1,
    //'userId': 1,
    'userType': 1,
    'api': 1
  };
  
  FAC._facStore = null;
  
  FAC._settings = {};
  
  FAC._events = {};

  // init shouldn't be used for settings anymore
  // this functionality is deprecated
  // use FAC.settings instead
  FAC.init = function(settings) {
    //get the stored settings
    FAC._facStore = new FAC.persist.Store('FAC-END-USER');
    var storeSettings = JSON.parse(FAC._facStore.get('_settings'));
    
    // Process the default settings
    FAC.settings(FAC._defaultSettings);
    
    // Process the stored settings
    if( storeSettings ) {
      //FAC._settings = storeSettings;
      var overrideSettings = {};
      FAC.each(storeSettings,function(key,val){
        overrideSettings[key] = {'value': val[0], 'persistent': (val[1] == 1) ? true : false};
      });
      FAC.settings(overrideSettings);
    }
    
    // Process the new settings
    if(settings) {
      FAC.settings(settings);
    }
  };
  
  FAC.settings = function() {
    // Get setting :: settings('key')
    if(arguments.length == 1 && FAC.type(arguments[0]) === 'string') {
      if( FAC._settings[arguments[0]] ) {
        return FAC._settings[arguments[0]][0];
      } else {
        return undefined;
      }
    }
    
    // Changing settings...
    else {
    
      // Set multiple settings :: settings(map)
      if(arguments.length == 1 && FAC.type(arguments[0]) === 'object') {
        FAC.each(arguments[0], function(key, val) {
          var valToSet = null;
          var persistent = false;
          
          // A function was passed for processing the old val
          if(FAC.type(val) === 'function') {
            valToSet = val(FAC.settings(key));
          } 
          // Otherwise, the new value was given
          else {
            // If a valid config object was passed... {'value': 500, 'persistent': true}
            if( FAC.type(val) === 'object' && FAC.type(val.value) !== 'undefined' && FAC.type(val.persistent) !== 'undefined') {
              valToSet = val.value;
              persistent = val.persistent ? 1 : 0;
            } 
            // Otherwise, just store it
            else {
              valToSet = val;
            }
          }
          
          FAC._saveSetting(key, valToSet, persistent);
        });
      }
      
      // Set one setting :: settings('key','val',[persistent])
      else if(arguments.length >= 2 && FAC.type(arguments[0]) === 'string') {
        var valToSet = null;
        var persistent = false;
        
        // A function was passed for processing the old val
        if(FAC.type(arguments[1]) === 'function') {
          valToSet = arguments[1](FAC.settings(arguments[0]));
        } 
        // Otherwise, the new value was given
        else {
          valToSet = arguments[1];
        }
        
        // Process persistent flag
        if( arguments.length == 3 && FAC.type(arguments[2]) === 'boolean') {
          persistent = arguments[2];
        }
        
        FAC._saveSetting(arguments[0], valToSet, persistent);
      }
      
      // Save settings
      FAC._facStore.set('_settings', JSON.stringify(FAC._settings));
    }
  };
  
  FAC._saveSetting = function(setting, value, persistent) {
    // Check if the setting is a fac-defined persistent setting
    // Don't allow it to become non-persistent, even internally
    if( FAC._persistentSettings[setting] == 1 ){
      persistent = true;
    } else if( FAC.type(persistent) != 'boolean' ) {
      persistent = false;
    }
    
    FAC._settings[setting] = [value, persistent ? 1 : 0 ]
  }
  
  FAC.isDemo = function() {
    return FAC.settings('clientId') == 'demo';
  };
  
  FAC.isLoggedIn = function() {
    if(FAC.settings('clientId') == 'demo') return false;
    if(typeof FAC.settings('timeout') == 'undefined' || Date.parse(FAC.settings('timeout')) <= Date.now()) return false;
    return true;
  };
  
  FAC.error = function(msg) {
    if(FAC.type(msg) === 'undefined') return;
    
    if(FAC.settings('debug') === true) {
      if(FAC.type(msg) !== 'string') {
        FAC.displayMessage('error', JSON.stringify(msg), FAC.settings('debugMsgTimeout'));
      } else {
        FAC.displayMessage('error', msg, FAC.settings('debugMsgTimeout'));
      }
    }
    console.log(msg);
    FAC.event.trigger('fac-error',msg);
  }
  
  FAC.api = function(options) {
    var url = FAC.settings('api') + options.url;
    var deferred = FAC.Deferred(function(){
      this.done(options.success);
      this.fail(options.error);
    });
    FAC.ajax({
      'url': url,
      'dataType':'jsonp',
      'data': (options.noAuth == true) ? options.data : FAC.extend(true, FAC.getAPICredentials(), options.data)
    }).success(function(jsonReturn){
      // Success
      if(FAC.hasStatus(jsonReturn, 'code', 200)) {
        deferred.resolveWith(this, [jsonReturn]);
      } 
      // Failure
      else {
        // Log the user out if they were logged in but failed to authenticate
        if(FAC.hasStatus(jsonReturn, 'id', ['S9','S11']) && FAC.isLoggedIn()) {
          FAC.logout();
        } 
        deferred.rejectWith(this, [jsonReturn]);
      }
    });
    return deferred;
  };
  
  FAC.getAPICredentials = function() {
    var credentials = FAC.getAPIKey();
    credentials['client-id'] = FAC.settings('clientId');
    credentials['user-id'] = FAC.settings('userId');
    if(FAC.settings('userType') != 'user') {
      credentials['user-type'] = FAC.settings('userType');
    }
    return credentials;
  };
  
  FAC.getAPIKey = function() {
    if(FAC.settings('clientKey')) {
      return {'client-key': FAC.settings('clientKey')};
    } else {
      return {'temp-key': FAC.settings('tempKey')};
    }
  };
  
  FAC.hasStatus = function(data,flavor,matches) {
    if(typeof matches !== 'object') {
      var matches = [matches];
    }
    if(flavor == 'code') {
      for(match in matches) {
        if(data.status['code'] == matches[match]) {
          return true;
        }
      }
    } else {
      return (FAC.getStatusMsg(data, flavor, matches).length == 0) ? false : true;
    }
    return false;
  };
  
  FAC.getStatusMsg = function(data, flavor, matches) {
    if(typeof matches !== 'object') {
      var matches = [matches];
    }
    var ret = [];
    if(flavor == 'id' || flavor == 'type') {
      for(msg in data.status.msgs) {
        for(match in matches) {
          if(data.status.msgs[msg][flavor] == matches[match]) {
            ret.push(data.status.msgs[msg]);
          }
        }
      }
    }
    return ret;
  };
  
  /**
   * Show a dialog for loggin in
   */
  FAC.loginPopup = function(clientId) {
    
    // Create login dialog DOM elements
    var loginDialog = FAC('<div id="FAClogin" />');
    // Hide the clientID field if the clientID was passed in
    if(clientId) {
      loginDialog.append('<input name="clientId" class="" type="hidden" value="' + clientId + '" />');
    } else {
      loginDialog.append('Client ID:<br /><input class="ui-state-default ui-corner-all" name="clientId" class="" type="text" title="Client ID" />');
      loginDialog.append('<div style="height:.7em" />');
    }
    loginDialog.append('Username:<br /><input class="ui-state-default ui-corner-all" name="username" class="" type="text" />');
    loginDialog.append('<div style="height:.7em" />');
    loginDialog.append('Password:<br /><input class="ui-state-default ui-corner-all" name="password" type="password" />');
    loginDialog.append('<div id="FAClogin-msgs" />');
    
    // Setup login function
    function _dialogLogin() {            
      
      // Collect up form values
      var formData = FAC('#FAClogin :input').serializeArray();
      var data = {};
      for(x in formData) {
        data[formData[x]['name']] = formData[x]['value'];
      }
      
      // Setup success and error functions
      data.success = function(data) {
        loginDialog.facdialog('close');
      };
      data.error = function(data) {
        FAC('#FAClogin-msgs').html('Incorrect Login');
      };
      
      FAC.login(data);
    };
    
    // Fire login when enter key is pressed
    FAC('input', loginDialog).keydown( function(e) {
      var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
      if(key == 13) {
        _dialogLogin();
      }
    });
    
    // Instantiate dialog widget
    loginDialog.facdialog({
      modal: true,
      title: 'Login to Find-A-Code',
      global: true,
      autoOpen: true,
      buttons: {'Login' : _dialogLogin },
      close: function(event){
        FAC(this).facdialog('destroy').remove();
      }
    });
    
    return FAC;
  };
  
  /**
   * Login without dialog
   */
  FAC.login = function(options) {
    if(options) {
      // Leave this check in for backwards compatibility
      if(options.popup === true) { 
        this.loginPopup(options.clientId);        
      }
      // Login with username and password
      else if(typeof options.clientId != 'undefined' && typeof options.username != 'undefined' && typeof options.password != 'undefined') {
        FAC.api.auth.login(options.clientId, {
          'user-type': FAC.settings('userType'), 
          'username': options.username, 
          'password': options.password
        })
        // On success, store the new settings and trigger the login event
        .done(function(data) {              
          FAC.settings({
            clientId: data.data['client-id'],
            userId: data.data['user-id'],
            tempKey: data.data['temp-key'],
            timeout: data.data['timeout']
          });
          
          FAC.events.trigger('login');
          
          if(options.success) {
            options.success(data);
          }
        })
        .fail(function(data) {
          FAC.events.trigger('login-fail');
          
          if(options.error) {
            options.error(data);
          }
        });
      }
    }
    return FAC;
  };
  
  FAC.logout = function() {
    // Get a list of persistent settings
    var newSettings = {};
    FAC.each(FAC._settings, function(key, val) {
      // If persistent, keep it
      if( val[1] == 1 ) {
        newSettings[key] = {'value': val[0], 'persistent': val[1]};
      }
    });
    
    // Delete all settings
    FAC._settings = {};
    
    // Restore the default settings
    FAC.settings(FAC._defaultSettings);
    
    // Reset the persistent settings
    FAC.settings(newSettings);

    FAC.events.trigger('logout');
    return FAC;
  };
  
  FAC.displayMessages = function(messageList) {
    var $ = FAC;
    
    var messageWrap = $("#fac-messages");
    
    // Add an .fac wrapper div if its not alread on the page
    if( messageWrap.length == 0 ) {
      messageWrap = $('<div id="fac-messages" class="ui-state-widget" />').appendTo(document.body).wrap('<div class="fac" />');
    }
    
    // Add messages
    $.each(messageList, function(i, m) {     
      var message = $('<div>',{ 'html': m.message }).addClass('fac-message ui-corner-all').appendTo(messageWrap);
      if( m.type == 'error' ) {
        message.addClass('ui-state-error').prepend($('<span />').addClass('ui-icon ui-icon-alert'));
      } else {
        message.addClass('ui-state-highlight').prepend($('<span />').addClass('ui-icon ui-icon-info'));
      }
      message.prepend($('<span />').addClass('ui-icon ui-icon-close').click(function(){
        message.remove();
      }).hover(function(){
        $(this).toggleClass('ui-icon-close ui-icon-circle-close');
      }));
      
      // Automatically hide the message if a timeout is set
      if( m.timeout ) {
        setTimeout(function() {
          message.fadeOut(function(){
            $(this).remove();
          });
        }, m.timeout);
      }
    });
  };
  
  FAC.displayMessage = function(type, message, timeout) {
    FAC.displayMessages([{'type': type, 'message': message, 'timeout': timeout}]);
  };
  
  FAC.getParam = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  };
  
  FAC.validateCode = function( codeset, code ) {
    return FAC.codesets[codeset]['regex'].test(code);
  };
  
  FAC.validateCodeset = function( codeset ) {
    return typeof FAC.codesets[codeset] != 'undefined';
  };
  
  //
  // Events
  //
  
  FAC.events = {};
  
  FAC.events.on = function(event, handler) {
    
    // If the event doesn't exist, create it
    if( !FAC._events[event] ) {
      FAC._events[event] = [];
    }
    
    // Add a guid to the handler if one doesn't exist
    // The guid is used for removing
    if( !handler.guid ) {
      handler.guid = FAC.guid++;
    }
    
    // Add the event to the list
    FAC._events[event].push( handler );
  };
  
  FAC.events.off = function(event, handler) {
    if( FAC._events[event] ) {
      for( var j = 0; j < FAC._events[event].length; j++ ) {
        if( FAC._events[event][j].guid === handler.guid ) {
          FAC._events[event].splice(j, 1);
          break;
        }
      }
    }
  };
  
  FAC.events.trigger = function(event, data) {
    if( FAC._events[event] ) {
      for( var j = 0; j < FAC._events[event].length; j++ ) {
        FAC._events[event][j](data);
      }
    }
  };
  
  // End
  
  FAC.init();
  
})(FAC);