( function( vp, dv, $, util ) {
	'use strict';

var PARENT = vp.ValueParser;

/**
 * Constructor for string parsers.
 * @class valueParsers.StringParser
 * @extends valueParsers.ValueParser
 * @since 0.1
 * @licence GNU GPL v2+
 * @author Daniel Werner < danweetz@web.de >
 *
 * @constructor
 */
vp.StringParser = util.inherit( PARENT, {
	/**
	 * @inheritdoc
	 *
	 * @param {string} rawValue
	 */
	parse: function( rawValue ) {
		return $.Deferred().resolve( new dv.StringValue( rawValue ) ).promise();
	}
} );

}( valueParsers, dataValues, jQuery, util ) );
