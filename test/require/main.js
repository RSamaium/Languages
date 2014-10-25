require.config({
	paths: {
		Languages: "../../Languages",
		jquery: "http://code.jquery.com/jquery-1.11.0.min"
	},
	shim: {
		Languages: {exports: "Languages"}
	}
});

define([
	'jquery',
	'Languages'
], function ($, Languages) {

	Languages.init(["en", "fr"], "../languages/", function() {
		$('#text').text("TEXT".t());
	});

});