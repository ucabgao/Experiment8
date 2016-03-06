//@formatter:off
var Joi         = require('joi'),
    convert     = require('../src/index'),
    assert      = require('assert'),
    jsonSchema  = require('json-schema');
//@formatter:on

/* jshint mocha:true */
/* global suite, test */

/**
 * Throws if schema !== expected or if schema fails to jsonSchema.validate()
 * @param {object} schema
 * @param {object} expected
 */
assert.validate = function (schema, expected) {
  var result = jsonSchema.validate(schema);
  assert.deepEqual(schema, expected);
  if ('object' === typeof result && Array.isArray(result.errors) && 0 === result.errors.length) {
    return;
  }
  throw new Error('json-schema validation failed: %s', result.errors.join(','));
};

suite('convert', function () {

  test('object defaults', function () {
    var joi = Joi.object(),
        schema = convert(joi),
        expected = {
          type: 'object',
          properties: {},
          additionalProperties: false
        };
    assert.validate(schema, expected);
  });

  test('object description', function () {
    var joi = Joi.object().description('woot'),
        schema = convert(joi),
        expected = {
          type: 'object',
          properties: {},
          additionalProperties: false,
          description: 'woot'
        };
    assert.validate(schema, expected);
  });

  test('object allow unknown', function () {
    var joi = Joi.object().unknown(true),
        schema = convert(joi),
        expected = {
          type: 'object',
          properties: {},
          additionalProperties: true
        };
    assert.validate(schema, expected);
  });

  test('object', function () {
    let joi = Joi.object().keys({
          string: Joi.string(),
          'string default': Joi.string().default('bar').description('bar desc'),
          'number': Joi.number(),
          'boolean required': Joi.boolean().required()
        }),
        schema = convert(joi),
        expected = {
          type: 'object',
          required: ['boolean required'],
          properties: {
            'string': {
              type: 'string'
            },
            'string default': {
              type: 'string',
              'default': 'bar',
              description: 'bar desc'
            },
            'number': {
              type: 'number'
            },
            'boolean required': {
              type: 'boolean'
            }
          },
          additionalProperties: false
        };
    assert.validate(schema, expected);
  });

  test('type: array', function () {
    var joi = Joi.array(),
        schema = convert(joi),
        expected = {
          type: 'array'
        };
    assert.validate(schema, expected);
  });

  test('enum', function () {
    var joi = Joi.string().valid(['a', 'b']),
        schema = convert(joi),
        expected = {
          'type': 'string',
          'enum': ['a', 'b']
        };
    //console.log('.enum: %s', util.inspect({type: joi._type, schema: schema}, {depth: 10}));
    assert.validate(schema, expected);
  });

  test('alternatives -> oneOf', function () {

    let joi = Joi.object().keys({
          value: Joi.alternatives().try(
              Joi.string().valid('a'),
              Joi.number().valid(100)
          )
        }),
        schema = convert(joi),
        expected = {
          type: 'object',
          additionalProperties: false,
          properties: {
            value: {
              oneOf: [
                {
                  type: 'string',
                  'enum': ['a']
                },
                {
                  type: 'number',
                  'enum': [100]
                }
              ]
            }
          }
        };

    //console.log('alt -> oneOf: %s', util.inspect({type: joi._type, schema: schema}, {depth: 10}));
    assert.validate(schema, expected);
  });

  test('string min/max', function () {
    var joi = Joi.string().min(5).max(100),
        schema = convert(joi),
        expected = {
          type: 'string',
          minLength: 5,
          maxLength: 100
        };
    assert.validate(schema, expected);
  });

  test('string -> maxLength', function () {
    var joi = Joi.string().length(5),
        schema = convert(joi),
        expected = {
          type: 'string',
          maxLength: 5,
          minLength: 5
        };
    assert.validate(schema, expected);
  });

  test('string email', function () {
    var joi = Joi.string().email(),
        schema = convert(joi),
        expected = {
          type: 'string',
          format: 'email'
        };
    assert.validate(schema, expected);
  });

  test('date', function () {
    var joi = Joi.date(),
        schema = convert(joi),
        expected = {
          type: 'string',
          format: 'date-time'
        };
    assert.validate(schema, expected);
  });

  test('string regex -> pattern', function () {
    let joi = Joi.string().regex(/^[a-z]$/),
        schema = convert(joi),
        expected = {
          type: 'string',
          pattern: '^[a-z]$'
        };
    assert.validate(schema, expected);
  });

  test('string allow', function () {
    let joi = Joi.string().allow(['a', 'b', '', null]),
        schema = convert(joi),
        expected = {
          type: 'string',
          'enum': ['a', 'b', '', null]
        };
    //console.log('string allow: %s', util.inspect({type: joi._type, joi:joi, schema: schema}, {depth: 10}));
    assert.validate(schema, expected);
  });

  test('number min/max', function () {
    let joi = Joi.number().min(0).max(100),
        schema = convert(joi),
        expected = {
          type: 'number',
          minimum: 0,
          maximum: 100
        };
    assert.validate(schema, expected);
  });

  test('number greater/less', function () {
    let joi = Joi.number().greater(0).less(100),
        schema = convert(joi),
        expected = {
          type: 'number',
          minimum: 0,
          exclusiveMinimum: true,
          maximum: 100,
          exclusiveMaximum: true
        };
    assert.validate(schema, expected);
  });

  test('integer', function () {
    var joi = Joi.number().integer(),
        schema = convert(joi),
        expected = {
          type: 'integer'
        };
    assert.validate(schema, expected);
  });

  test('array min/max', function () {
    let joi = Joi.array().min(5).max(100),
        schema = convert(joi),
        expected = {
          type: 'array',
          minItems: 5,
          maxItems: 100
        };
    assert.validate(schema, expected);
  });

  test('array length', function () {
    let joi = Joi.array().length(100),
        schema = convert(joi),
        expected = {
          type: 'array',
          minItems: 100,
          maxItems: 100
        };
    assert.validate(schema, expected);
  });

  test('array unique', function () {
    let joi = Joi.array().unique(),
        schema = convert(joi),
        expected = {
          type: 'array',
          uniqueItems: true
        };
    assert.validate(schema, expected);
  });

  test('array inclusions', function () {
    let joi = Joi.array().includes(Joi.string()),
        schema = convert(joi),
        expected = {
          type: 'array',
          items: [{type: 'string'}]
        };
    assert.validate(schema, expected);
  });

  test('joi any', function () {
    let joi = Joi.any(),
        schema = convert(joi),
        expected = {
          type: ['array', 'boolean', 'number', 'object', 'string', 'null']
        };
    assert.validate(schema, expected);
  });

  test('big and complicated', function () {
    let joi = Joi.object({
          aFormattedString: Joi.string().regex(/^[ABC]_\w+$/),
          aFloat: Joi.number().default(0.8).min(0.0).max(1.0),
          anInt: Joi.number().required().precision(0).greater(0),
          anArrayOfFloats: Joi.array().includes(Joi.number().default(0.8).min(0.0).max(1.0)),
          anArrayOfNumbersOrStrings: Joi.array().includes(Joi.alternatives(Joi.number(), Joi.string()))
        }),
        schema = convert(joi),
        expected = {
          type: 'object',
          properties: {
            aFormattedString: {
              type: 'string',
              pattern: '^[ABC]_\\w+$'
            },
            aFloat: {
              'default': 0.8,
              type: 'number',
              minimum: 0,
              maximum: 1
            },
            anInt: {
              type: 'number',
              exclusiveMinimum: true,
              minimum: 0
            },
            anArrayOfFloats: {
              type: 'array',
              items: [
                {
                  'default': 0.8,
                  type: 'number',
                  minimum: 0,
                  maximum: 1
                }
              ]
            },
            anArrayOfNumbersOrStrings: {
              type: 'array',
              items: [{oneOf: [{type: 'number'}, {type: 'string'}]}]
            }
          },
          additionalProperties: false,
          required: ['anInt']
        };
    assert.validate(schema, expected);
  });

  test('joi.when', function () {
    let joi = Joi.object({
          'a': Joi.boolean().required().default(false),
          'b': Joi.alternatives().when('a', {
            is: true,
            then: Joi.string().default('a is true'),
            otherwise: Joi.number().default(0)
          })
        }),
        schema = convert(joi),
        expected = {
          type: 'object',
          properties: {
            a: {type: 'boolean'},
            b: {
              oneOf: [
                {
                  'default': 'a is true',
                  type: 'string'
                }, {
                  type: 'number'
                }
              ]
            }
          },
          additionalProperties: false,
          required: ['a']
        };
    //console.log('when: %s', util.inspect({type:joi._type,schema:schema}, {depth: 10}));
    assert.validate(schema, expected);
  });

});

