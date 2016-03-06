/*
 * FAC JavaScript API
 */
(function($){

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

  /*
   * Auth
   */

  FAC.api.auth = {};

  FAC.api.auth.login = function(clientId, optionalParams) {
    var postData = {
      'client-id': clientId
    };

    var validOptions = {
      'username': 'username',
      'user-id': 'userId',
      'password': 'password',
      'client-key': 'clientKey'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'auth/login',
      'data': postData
    });
  };

  /*
   * Data
   */

  FAC.api.data = {};

  //
  // cpt
  //

  FAC.api.data.cptCode = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'data/cpt/code',
      'data': postData
    });
  };

  //
  // hcpcs
  //

  FAC.api.data.hcpcsCode = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'data/hcpcs/code',
      'data': postData
    });
  };

  //
  // icd10cm
  //

  FAC.api.data.icd10cmCode = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'data/icd10cm/code',
      'data': postData
    });
  };

  //
  // icd10pcs
  //

  FAC.api.data.icd10pcsCode = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'data/icd10pcs/code',
      'data': postData
    });
  };

  //
  // icd9v1
  //

  FAC.api.data.icd9v1Code = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'data/icd9v1/code',
      'data': postData
    });
  };

  //
  // icd9v3
  //

  FAC.api.data.icd9v3Code = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'data/icd9v3/code',
      'data': postData
    });
  };

  /*
   * Enduser
   */

  FAC.api.enduser = {};

  //
  // account
  //

  FAC.api.enduser.accountCreate = function(name) {
    var postData = {
      'name': name
    };

    return FAC.api({
      'url': 'end-user/account/create',
      'data': postData
    });
  };

  FAC.api.enduser.accountInfo = function(accountId) {
    var postData = {
      'account-id': accountId
    };

    return FAC.api({
      'url': 'end-user/account/info',
      'data': postData
    });
  };

  FAC.api.enduser.accountList = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'active': 'active',
      'q': 'q'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/account/list',
      'data': postData
    });
  };

  FAC.api.enduser.accountUpdate = function(accountId, optionalParams) {
    var postData = {
      'account-id': accountId
    };

    var validOptions = {
      'active': 'active',
      'name': 'name'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/account/update',
      'data': postData
    });
  };

  //
  // group
  //

  FAC.api.enduser.groupCreate = function(name, optionalParams) {
    var postData = {
      'name': name
    };

    var validOptions = {
      'active': 'active',
      'scope': 'scope'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/group/create',
      'data': postData
    });
  };

  FAC.api.enduser.groupInfo = function(groupId) {
    var postData = {
      'group-id': groupId
    };

    return FAC.api({
      'url': 'end-user/group/info',
      'data': postData
    });
  };

  FAC.api.enduser.groupList = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'active': 'active',
      'q': 'q',
      'account-id': 'accountId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/group/list',
      'data': postData
    });
  };

  FAC.api.enduser.groupUpdate = function(groupId, optionalParams) {
    var postData = {
      'group-id': groupId
    };

    var validOptions = {
      'active': 'active',
      'scope': 'scope',
      'name': 'name'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/group/update',
      'data': postData
    });
  };

  FAC.api.enduser.groupUsers = function(groupId) {
    var postData = {
      'group-id': groupId
    };

    return FAC.api({
      'url': 'end-user/group/users',
      'data': postData
    });
  };

  //
  // role
  //

  FAC.api.enduser.roleCreate = function(name, optionalParams) {
    var postData = {
      'name': name
    };

    var validOptions = {
      'scope': 'scope',
      'group-assignable': 'groupAssignable'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/role/create',
      'data': postData
    });
  };

  FAC.api.enduser.roleInfo = function(roleId) {
    var postData = {
      'role-id': roleId
    };

    return FAC.api({
      'url': 'end-user/role/info',
      'data': postData
    });
  };

  FAC.api.enduser.roleList = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'account-id': 'accountId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/role/list',
      'data': postData
    });
  };

  FAC.api.enduser.roleUpdate = function(roleId, optionalParams) {
    var postData = {
      'role-id': roleId
    };

    var validOptions = {
      'scope': 'scope',
      'name': 'name'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/role/update',
      'data': postData
    });
  };

  FAC.api.enduser.roleAddPermission = function(roleId, permission) {
    var postData = {
      'role-id': roleId,
      'permission': permission
    };

    return FAC.api({
      'url': 'end-user/role/add-permission',
      'data': postData
    });
  };

  FAC.api.enduser.roleRemovePermission = function(roleId, rolePermissionId) {
    var postData = {
      'role-id': roleId,
      'role-permission-id': rolePermissionId
    };

    return FAC.api({
      'url': 'end-user/role/remove-permission',
      'data': postData
    });
  };

  //
  // user
  //

  FAC.api.enduser.userAddGroup = function(groupId, optionalParams) {
    var postData = {
      'group-id': groupId
    };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/add-group',
      'data': postData
    });
  };

  FAC.api.enduser.userAddProduct = function(accountProductId, optionalParams) {
    var postData = {
      'account-product-id': accountProductId
    };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/add-product',
      'data': postData
    });
  };

  FAC.api.enduser.userAddRole = function(roleId, useUserId, optionalParams) {
    var postData = {
      'role-id': roleId,
      'use-user-id': useUserId
    };

    var validOptions = {
      'group-id': 'groupId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/add-role',
      'data': postData
    });
  };

  FAC.api.enduser.userCreate = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'username': 'username',
      'account-id': 'accountId',
      'last-name': 'lastName',
      'active': 'active',
      'password': 'password',
      'first-name': 'firstName',
      'email': 'email'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/create',
      'data': postData
    });
  };

  FAC.api.enduser.userFeatures = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'filter': 'filter',
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/features',
      'data': postData
    });
  };

  FAC.api.enduser.userGroups = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/groups',
      'data': postData
    });
  };

  FAC.api.enduser.userInfo = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/info',
      'data': postData
    });
  };

  FAC.api.enduser.userList = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'active': 'active',
      'q': 'q',
      'account-id': 'accountId',
      'order': 'order',
      'group-id': 'groupId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/list',
      'data': postData
    });
  };

  FAC.api.enduser.userProducts = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/products',
      'data': postData
    });
  };

  FAC.api.enduser.userRemoveGroup = function(groupId, optionalParams) {
    var postData = {
      'group-id': groupId
    };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/remove-group',
      'data': postData
    });
  };

  FAC.api.enduser.userRemoveProduct = function(accountProductId, optionalParams) {
    var postData = {
      'account-product-id': accountProductId
    };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/remove-product',
      'data': postData
    });
  };

  FAC.api.enduser.userRemoveRole = function(roleId, useUserId, optionalParams) {
    var postData = {
      'role-id': roleId,
      'use-user-id': useUserId
    };

    var validOptions = {
      'group-id': 'groupId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/remove-role',
      'data': postData
    });
  };

  FAC.api.enduser.userRoles = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'use-user-id': 'useUserId'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/roles',
      'data': postData
    });
  };

  FAC.api.enduser.userUpdate = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'username': 'username',
      'use-user-id': 'useUserId',
      'last-name': 'lastName',
      'active': 'active',
      'password': 'password',
      'first-name': 'firstName',
      'email': 'email'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'end-user/user/update',
      'data': postData
    });
  };

  /*
   * Tool
   */

  FAC.api.tool = {};

  //
  // autocomplete
  //

  FAC.api.tool.autocompleteCpt = function(term, optionalParams) {
    var postData = {
      'term': term
    };

    var validOptions = {
      'limit': 'limit',
      'codes-only': 'codesOnly'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/autocomplete/cpt',
      'data': postData
    });
  };

  FAC.api.tool.autocompleteHcpcs = function(term, optionalParams) {
    var postData = {
      'term': term
    };

    var validOptions = {
      'limit': 'limit',
      'codes-only': 'codesOnly'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/autocomplete/hcpcs',
      'data': postData
    });
  };

  FAC.api.tool.autocompleteIcd9v1 = function(term, optionalParams) {
    var postData = {
      'term': term
    };

    var validOptions = {
      'limit': 'limit',
      'codes-only': 'codesOnly'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/autocomplete/icd9v1',
      'data': postData
    });
  };

  FAC.api.tool.autocompleteIcd9v3 = function(term, optionalParams) {
    var postData = {
      'term': term
    };

    var validOptions = {
      'limit': 'limit',
      'codes-only': 'codesOnly'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/autocomplete/icd9v3',
      'data': postData
    });
  };

  FAC.api.tool.autocompleteIcd10cm = function(term, optionalParams) {
    var postData = {
      'term': term
    };

    var validOptions = {
      'limit': 'limit',
      'codes-only': 'codesOnly'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/autocomplete/icd10cm',
      'data': postData
    });
  };

  FAC.api.tool.autocompleteIcd10pcs = function(term, optionalParams) {
    var postData = {
      'term': term
    };

    var validOptions = {
      'limit': 'limit',
      'codes-only': 'codesOnly'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/autocomplete/icd10pcs',
      'data': postData
    });
  };

  FAC.api.tool.autocomplete = function(codeset, term, options) {
    return FAC.api.tool['autocomplete' + capitalize(codeset)](term, options);
  };

  //
  // crossacode
  //

  FAC.api.tool.crossacodeIcd9v1 = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/crossacode/icd9v1',
      'data': postData
    });
  };

  FAC.api.tool.crossacodeIcd9v3 = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/crossacode/icd9v3',
      'data': postData
    });
  };

  FAC.api.tool.crossacodeIcd10cm = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/crossacode/icd10cm',
      'data': postData
    });
  };

  FAC.api.tool.crossacodeIcd10pcs = function(code, optionalParams) {
    var postData = {
      'code': code
    };

    var validOptions = {
      'date': 'date',
      'data': 'data'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/crossacode/icd10pcs',
      'data': postData
    });
  };

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

  //
  // search
  //

  FAC.api.tool.searchCpt = function(q, optionalParams) {
    var postData = {
      'q': q
    };

    var validOptions = {
      'date': 'date',
      'limit': 'limit',
      'offset': 'offset'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/search/cpt',
      'data': postData
    });
  };

  FAC.api.tool.searchHcpcs = function(q, optionalParams) {
    var postData = {
      'q': q
    };

    var validOptions = {
      'date': 'date',
      'limit': 'limit',
      'offset': 'offset'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/search/hcpcs',
      'data': postData
    });
  };

  FAC.api.tool.searchIcd9v1 = function(q, optionalParams) {
    var postData = {
      'q': q
    };

    var validOptions = {
      'date': 'date',
      'limit': 'limit',
      'offset': 'offset'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/search/icd9v1',
      'data': postData
    });
  };

  FAC.api.tool.searchIcd9v3 = function(q, optionalParams) {
    var postData = {
      'q': q
    };

    var validOptions = {
      'date': 'date',
      'limit': 'limit',
      'offset': 'offset'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/search/icd9v3',
      'data': postData
    });
  };

  FAC.api.tool.searchIcd10cm = function(q, optionalParams) {
    var postData = {
      'q': q
    };

    var validOptions = {
      'date': 'date',
      'limit': 'limit',
      'offset': 'offset'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/search/icd10cm',
      'data': postData
    });
  };

  FAC.api.tool.searchIcd10pcs = function(q, optionalParams) {
    var postData = {
      'q': q
    };

    var validOptions = {
      'date': 'date',
      'limit': 'limit',
      'offset': 'offset'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/search/icd10pcs',
      'data': postData
    });
  };

  FAC.api.tool.search = function(codeset, query, options) {
    return FAC.api.tool['search' + capitalize(codeset)](query, options);
  };

  //
  // spellchecker
  //

  FAC.api.tool.spellcheckerAll = function(q, optionalParams) {
    var postData = {
      'q': q
    };

    var validOptions = {
      'limit': 'limit'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'tool/spellchecker/all',
      'data': postData
    });
  };

  FAC.api.tool.spellchecker = function(q, options) {
    return FAC.api.tool.spellcheckerAll(q, options);
  };

  /*
   * Web
   */

  FAC.api.web = {};

  //
  // cpt
  //

  FAC.api.web.cptCode = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'date': 'date',
      'data-format': 'dataFormat',
      'data': 'data',
      'id': 'id',
      'code': 'code'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'web/cpt/code',
      'data': postData
    });
  };

  //
  // hcpcs
  //

  FAC.api.web.hcpcsCode = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'date': 'date',
      'data-format': 'dataFormat',
      'data': 'data',
      'id': 'id',
      'code': 'code'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'web/hcpcs/code',
      'data': postData
    });
  };

  //
  // icd10cm
  //

  FAC.api.web.icd10cmCode = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'date': 'date',
      'data-format': 'dataFormat',
      'data': 'data',
      'id': 'id',
      'code': 'code'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'web/icd10cm/code',
      'data': postData
    });
  };

  //
  // icd10pcs
  //

  FAC.api.web.icd10pcsCode = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'date': 'date',
      'data-format': 'dataFormat',
      'data': 'data',
      'id': 'id',
      'code': 'code'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'web/icd10pcs/code',
      'data': postData
    });
  };

  //
  // icd9v1
  //

  FAC.api.web.icd9v1Code = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'date': 'date',
      'data-format': 'dataFormat',
      'data': 'data',
      'id': 'id',
      'code': 'code'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'web/icd9v1/code',
      'data': postData
    });
  };

  //
  // icd9v3
  //

  FAC.api.web.icd9v3Code = function(optionalParams) {
    var postData = { };

    var validOptions = {
      'date': 'date',
      'data-format': 'dataFormat',
      'data': 'data',
      'id': 'id',
      'code': 'code'
    };

    checkOptionalParams(postData, validOptions, optionalParams);

    return FAC.api({
      'url': 'web/icd9v3/code',
      'data': postData
    });
  };

  FAC.api.web.getCode = function(codeset, code) {
    return FAC.api.web[codeset + 'Code']({ 'code': code });
  }

}(FAC));