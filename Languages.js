/*
Copyright (C) 2014 by WebCreative5 - Samuel Ronce

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**

	Languages.init(["fr", "en", "jp", "es"], "languages/", function() {
		"TEST".t();
	});
*/

var fs;
if (typeof(require) !== "undefined") {
	fs = require('fs');
}

var Languages = {
	current: "en",
	data: {},
	options: {},
	init: function(id, path, callback) {
	
		var _path, xhr, self = this, user_lang; 
	
		if (id instanceof Array) {
			user_lang = (	navigator.language || 
					navigator.userLanguage || 
					this.current
				 ).replace(/\-.+/, ""); 
			if (id.indexOf(user_lang) == -1) {
				id = id[0];
			}
			else {
				id = user_lang;
			}
		}
		
		this.current = id;
		
		if (typeof path == "function") {
			callback = path;
			path = false;
		}
		
		if (!path) path = "./languages/";
		
		_path =  path + id + ".json";
	
		function _callback(txt) {
			var json = JSON.parse(txt);
			self.data = json[0];
			self.options = json[1];
			if (callback) callback.call(self);
		}
		
		if (fs) {
			fs.readFile('./' + _path, 'ascii', function (err, ret) {
				if (err) throw err;
				_callback(ret.toString('ascii'));
			});
			return;
		}
		
		try {  xhr = new ActiveXObject('Msxml2.XMLHTTP');   }
		catch (e) {
			try {  xhr = new ActiveXObject('Microsoft.XMLHTTP');    }
				catch (e2) {
			try {  xhr = new XMLHttpRequest();     }
				catch (e3) {  xhr = false;   }
			}
		}

		xhr.onreadystatechange  = function() {
			
			 if (xhr.readyState  == 4)  {
				 if (xhr.status  == 200) {
					 _callback(xhr.responseText);
				 }
			 }
		}; 
		
	   xhr.open("GET", _path,  true); 
	   xhr.send(); 
		
	},
	get: function(id) {
		return this.data[id];
	},
	getPlurial: function(val, type) {
		val = Math.abs(val);
		if (!/^[0-9]+$/.test(val)) {
			return false;
		}
		var plurial = this.options.plurial[type];
		if (!plurial) {
			plurial = ["s"];
		}
		if (val >= 2 && plurial[val]) {
			return plurial[val];
		}
		else if (val > 1) {
			return plurial[0];
		}
		else {
			return plurial[1] || "";
		}
	}
};

String.prototype.format = function() {
    var args = arguments, i=-1, plurial, val, m;
    var match = this.match(/%[sdp]/g);
    if (!match) return this;
    for (var j=0 ; j < match.length ; j++) {
    	i++;
    	m = match[j];
    	if (m == "%d") {
      		 plurial = args[i];
      	}
		else if (m == "%p") {
			break;
		}
    }
    i = -1;
    return this.replace(/%[sdp]([0-9]+)?/g, function(match, number) { 
      i++;
      val = typeof args[i] != 'undefined' ? args[i] : match;
      if (/^%p/.test(match)) {
      	 if (plurial == undefined) {
      	 	plurial = val;
      	 }
      	 val = Languages.getPlurial(plurial, match.replace("%", ""));
      }
      return val;
    });
  };

String.prototype.t = function(arg) {
	var type, txt;
	
	if (typeof arg == "boolean") {
		type = this.split("|");
		txt = arg ? type[0] : type[1];
		arguments = Array.prototype.slice.call(arguments, 1, arguments.length);	
	}
	else {
		txt = this;
	}
	var words = txt.split(" "), w, str = "", word;
	for (var i=0 ; i < words.length ; i++) {
		w = words[i];
		word = Languages.get(w);
		if (word) {
			str += word.format.apply(word, arguments);
		}
		
	}	
	return str;
}

// test `exports` for node-webkit
if (fs && typeof(exports) !== "undefined") { 
	exports.Languages = Languages;
}