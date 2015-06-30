'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// questionType Validation
function validateFormFieldType(value) {
  if (!value || typeof myVar !== 'string' ) { return false; }

  var validTypes = [
        'textfield',
        'email',
        'url',
        'textarea',
        'checkbox',
        'date',
        'dropdown',
        'hidden',
        'password',
        'radio'
    ];
  if (validTypes.indexOf(value) > -1) { 
    return true;
  }
  return false;
}


/**
 * Question Schema
 */
var FormFieldSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	description: {
		type: String,
		default: '',
	},
	required: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	fieldType: {
		type: String,
		required: 'Field type cannot be blank',
		validate: [validateFormFieldType, 'Invalid field type']
	},
	fieldValue: Schema.Types.Mixed

});

module.exports = FormFieldSchema;

// mongoose.model('Field', FormFieldSchema);