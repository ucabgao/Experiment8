/*
 * FAC JavaScript API
 */
(function($){

  FAC.api.login = function(clientId, userType, username, password) {
    return FAC.api({
      url: 'auth/login',
      noAuth: true,
      data:{
        'client-id': clientId,
        'username': username,
        'password': password,
        'user-type': userType
      }
    });
  };

  //
  // Tools
  //

  FAC.api.tool = {};
  
  FAC.api.tool.autocomplete = function(codeset, term) {
    return FAC.api({
      'url': 'tool/autocomplete/' + codeset,
      'data': { 
        term: term 
      }
    });
  };
  
  FAC.api.tool.search = function(codeset, query, limit, offset) {
    return FAC.api({
      'url': 'tool/search/' + codeset,
      'data': {
        q: query, 
        limit: limit, 
        offset: offset
      }
    });
  };
  
  FAC.api.tool.spellcheck = function(query) {
    return FAC.api({
      'url': 'tool/spellchecker/all',
      'data': { 
        q: query 
      }
    });
  };
  
  FAC.api.tool.crossacode = function(codeset, code, mappings) {
    var postData = { 'code': code };
    
    // If a string was given for the mappings, wrap it in an array
    if( FAC.type(mappings) === 'string' ) {
      mappings = [mappings];
    }
    
    // If the mappings parameter is an array, turn it into a 
    // comma delimited string and add to the post data
    if( FAC.isArray(mappings) ) {
      postData.data = mappings.join(',');
    }
    
    return FAC.api({
      'url': 'tool/crossacode/' + codeset,
      'data': postData
    });
  };
  
  //
  // end-user
  //
  
  FAC.api.enduser = {};
  
  //
  // end-user/account
  //
  
  FAC.api.enduser.accountList = function(active, filter) {
    return FAC.api({
      'url': 'end-user/account/list',
      'data': {
        'q': filter,
        'active': active
      }
    });
  };
  
  FAC.api.enduser.accountInfo = function(accountId) {
    return FAC.api({
      'url': 'end-user/account/info',
      'data': {
        'account-id': accountId
      }
    });
  };
  
  FAC.api.enduser.accountCreate = function(accountName) {
    return FAC.api({
      'url': 'end-user/account/create',
      'data': {
        'name': accountName
      }
    });
  };
  
  FAC.api.enduser.accountUpdate = function(accountId, accountName) {
    return FAC.api({
      'url': 'end-user/account/update',
      'data': {
        'account-id': accountId,
        'name': accountName
      }
    });
  };
  
  //
  // end-user/user
  //
  
  FAC.api.enduser.userList = function(userStatus, filter, groupId, accountId) {
    var postData = {
      'active': userStatus,
      'q': filter
    };
    if( groupId ) {
      postData['group-id'] = groupId;
    }
    if( accountId ) {
      postData['account-id'] = accountId;
    }
    return FAC.api({
      'url': 'end-user/user/list',
      'data': postData
    });
  };
  
  FAC.api.enduser.userUpdate = function(userId, firstName, lastName, email, username) {
    return FAC.api({
      'url': 'end-user/user/update',
      'data': {
        'first-name': firstName,
        'last-name': lastName,
        'email': email,
        'username': username,
        'use-user-id': userId
      }
    });
  };
  
  FAC.api.enduser.userInfo = function(userId) {
    return FAC.api({
      'url': 'end-user/user/info',
      'data': {
        'use-user-id': userId
      }
    });
  };
  
  FAC.api.enduser.userGroups = function(userId) {
    return FAC.api({
      'url': 'end-user/user/groups',
      'data': { 
        'use-user-id': userId
      }
    });
  };
  
  FAC.api.enduser.addGroup = function(userId, groupId) {
    return FAC.api({
      'url': 'end-user/user/add-group',
      'data': {
        'use-user-id': userId,
        'group-id': groupId
      }
    });
  };
  
  FAC.api.enduser.removeGroup = function(userId, groupId) {
    return FAC.api({
      'url': 'end-user/user/remove-group',
      'data': {
        'use-user-id': userId,
        'group-id': groupId
      }
    });
  };
  
  FAC.api.enduser.userProducts = function(userId) {
    return FAC.api({
      'url': 'end-user/user/products',
      'data': {
        'use-user-id': userId
      }
    });
  };
  
  FAC.api.enduser.removeProduct = function(userId, accountProductId) {
    return FAC.api({
      'url': 'end-user/user/remove-product',
      'data': {
        'use-user-id': userId,
        'account-product-id': accountProductId
      }
    });
  };
  
  FAC.api.enduser.addProduct = function(userId, accountProductId) {
    return FAC.api({
      'url': 'end-user/user/add-product',
      'data': {
        'use-user-id': userId,
        'account-product-id': accountProductId
      }
    });
  };
  
  FAC.api.enduser.userRoles = function(userId) {
    return FAC.api({
      'url': 'end-user/user/roles',
      'data': {
        'use-user-id': userId
      }
    });
  };
  
  FAC.api.enduser.removeRole = function(userId, roleId) {
    return FAC.api({
      'url': 'end-user/user/remove-role',
      'data': {
        'use-user-id': userId,
        'role-id': roleId
      }
    });
  };
  
  FAC.api.enduser.addRole = function(userId, roleId) {
    return FAC.api({
      'url': 'end-user/user/add-role',
      'data': {
        'use-user-id': userId,
        'role-id': roleId
      }
    });
  };
  
  //
  // end-user/group
  //
  
  FAC.api.enduser.groupList = function(active, accountId) {
    postData = { 'active': active };
    if( accountId ) {
      postData['account-id'] = accountId;
    }
    return FAC.api({
      'url': 'end-user/group/list',
      'data': postData
    });
  };
  
  //
  // end-user/product
  //

  FAC.api.enduser.productInfo = function(productId, productVersion) {
    return FAC.api({
      'url': 'end-user/product/info',
      'data': {
        'product-id': productId,
        'product-version': productVersion
      }
    });
  };
  
  //
  // web
  //
  
  FAC.api.web = {};
  
  FAC.api.web.getCode = function(codeset, code) {
    return FAC.api({
      'url': 'web/' + codeset + '/code',
      'data': {
        code: code
      }
    });
  };
  
}(FAC));