
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { hostname: require('os').hostname() });
};
