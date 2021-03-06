/**
 * 获取本机IP
 * 默认取127.0.0.1之外的第一个IP地址
 *
 * @return {string}
 */
module.exports = (function() {
    var ifaces = require( 'os' ).networkInterfaces();
    var defultAddress = '127.0.0.1';
    var ip = defultAddress;

    function x( details ) {
        if (ip === defultAddress && details.family === 'IPv4') {
            ip = details.address;
        }
    }

    for ( var dev in ifaces ) {
        ifaces[ dev ].forEach( x );
    }

    return ip;
})();
