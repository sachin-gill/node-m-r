'use strict';

var either = require('either.js'),
	_ = require('lodash'),
	InvalidDataAreaError = require('./errors').InvalidDataAreaError;

var reportDatabase = (function() {
	var _this = {};

	var _dataAreas = {
		InventoryReports: [],
		InventoryDetailsReports: []
	};

	_this.createDump = function() {
		return _dataAreas;
	};

	_this.getReport = function(dataArea, id, callback) {
		simulateAsynchronousIO(function() {
			getReportsCollectionFor(dataArea).fold(
				function left(error) {
					callback(error);
				},
				function right(reportsCollection) {
					var requestedReport = _.find(reportsCollection, function(report) {
						return report.id === id;
					});

					callback(null, requestedReport);
				}
			);
		});
	};

	_this.insertReport = function(dataArea, inventoryReport, callback) {
		simulateAsynchronousIO(function() {
			getReportsCollectionFor(dataArea).fold(
				function left(error) { 
					callback(error); 
				},
				function right(reportsCollection) {
					reportsCollection.push(inventoryReport);
					callback();		
				}
			);
		});
	};

	_this.removeReport = function(dataArea, id, callback) {
		simulateAsynchronousIO(function() {
			getReportsCollectionFor(dataArea).fold(
				function left(error) {
					callback(error);
				},
				function right(reportsCollection) {
					_.remove(reportsCollection, function(report) {
						return report.id === id;
					});

					callback();
				}
			);
		});
	};

	function simulateAsynchronousIO(asynchronousAction) {
		process.nextTick(asynchronousAction);
	}

	function getReportsCollectionFor(dataArea) {
		var reportsCollection = _dataAreas[dataArea];

		if(reportsCollection)
			return either.right(reportsCollection);
		else
			return either.left(new InvalidDataAreaError('The specified data area is unknown.'));
	}

	return _this;
})();

module.exports = reportDatabase;