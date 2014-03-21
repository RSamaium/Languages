// node server [lang] [nb_message]
// ex: node server en 1

var Languages = require("../../Languages").Languages;

var lang = process.argv[2];
var nb_msg = process.argv[3] || +"0";

Languages.init(lang, "../languages/", function() {
	console.log("NB_MSG|EMPTY".t(nb_msg > 0, nb_msg));
});