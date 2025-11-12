/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["calculatorproject/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
