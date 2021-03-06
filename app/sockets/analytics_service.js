'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	config = require('../../config/config'),
	errorHandler = require('../controllers/errors.server.controller'),
	Form = mongoose.model('Form');

// Create the chat configuration
module.exports = function (io, socket) {
	var visitorsData = {};

	var saveVisitorData = function (data, cb){

		Form.findById(data.formId, function(err, form) {
			if (err) {
				console.log(err);
				throw new Error(errorHandler.getErrorMessage(err));
			}

			var newVisitor = {
				referrer: data.referrer,
				lastActiveField: data.lastActiveField,
				timeElapsed: data.timeElapsed,
				isSubmitted: data.isSubmitted,
				language: data.language,
				ipAddr: data.ipAddr,
				deviceType: data.deviceType
			};

			form.analytics.visitors.push(newVisitor);

			form.save(function (err) {
				if (err) {
					console.log(err);
					throw new Error(errorHandler.getErrorMessage(err));
				}
				console.log('\n\nVisitor data successfully added!');
				console.log(newVisitor);

				delete visitorsData[socket.id];

				if(cb) cb();
			});
		});

		socket.disconnect(0);
	};

	io.on('connection', function(socket) {

		console.log('\n\n\n\n\n CONNECTED SOCKET');
		// a user has visited our page - add them to the visitorsData object
		socket.on('form-visitor-data', function(data) {
				socket.id = data.formId;
				visitorsData[socket.id] = data;
				visitorsData[socket.id].isSaved = false;

				if (data.isSubmitted) {
					saveVisitorData(data, function () {
						console.log('\n\n user submitted form');
					});
					visitorsData[socket.id].isSaved = true;
					socket.disconnect(0);
				}
		});

		socket.on('disconnect', function() {
			console.log('\n\n\n\n\n DISCONNECTED SOCKET');
			var data = visitorsData[socket.id];

			if(data){
				if(!data.isSubmitted && !data.isSaved) {
					data.isSaved = true;
					saveVisitorData(data);
				}
			}
		});
	});
};
