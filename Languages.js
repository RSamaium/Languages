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
if (typeof(exports) !== "undefined") {
	fs = require('fs');
}

var Languages = {
	current: "en",
	data: {},
	options: {},
	_path: null,
	_cache: {},

	set: function(id, callback) {
		if (!this._path) {
			throw "Initialize with `Languages.init()` before";
		}
		this.init(id, this._path, callback);
		return this;
	},
	
	add: function(id, path, namespace, callback) {
		this.init(id, path, callback, {
			namespace: namespace
		});
	},

	init: function(id, path, callback, options) {
	
		var _path, xhr, self = this, user_lang, namespace; 

		options = options || {};
		namespace = options.namespace || "self";

		this._cache[namespace] = {};
	
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

		
		this._path = path;
		
		
		_path =  path + id + ".json";

		function _callback(txt) {
			var json = JSON.parse(txt),
				data = json[0],
				_options = json[1];


			self.data[namespace] = json[0];
			self.options[namespace] = json[1];
			
			self._cache[namespace][id] = txt;
			if (callback) callback.call(self);
		}

		if (this._cache[namespace][id]) {
			_callback(this._cache[namespace][id]);
			return this;
		}
		
		if (fs) {
			fs.readFile('./' + _path, 'ascii', function (err, ret) {
				if (err) throw err;
				_callback(ret.toString('ascii'));
			});
			return this;
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

	   return this;
		
	},
	get: function(id, namespace) {
		namespace = namespace || "self";
		if (!this.data[namespace]) {
			return "";
		}
		return this.data[namespace][id];
	},
	getPlurial: function(val, type, namespace) {
		namespace = namespace || "self";
		val = Math.abs(val);
		if (!/^[0-9]+$/.test(val)) {
			return false;
		}
		var plurial = this.options[namespace].plurial[type];
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
    var args = arguments, i=-1, plurial, val, m, namespace = args[args.length-1];
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
      	 val = Languages.getPlurial(plurial, match.replace("%", ""), namespace);
      }
      return val;
    });
  };

String.prototype.t = function(arg) {
	var type, txt, namespace = "self", match;

	arguments = Array.prototype.slice.call(arguments, 1, arguments.length);	
	
	if (typeof arg == "boolean") {
		type = this.split("|");
		txt = arg ? type[0] : type[1];
	}
	else {
		txt = this;
	}
	var words = txt.split(" "), w, str = "", word;
	for (var i=0 ; i < words.length ; i++) {
		w = words[i];
		if (match = /(.+)\.(.+)/.exec(w)) {
			namespace = match[1];
			w = match[2];
		}
		word = Languages.get(w, namespace);
		if (word) {
			arguments.push(namespace);
			str += word.format.apply(word, arguments);
		}
		
	}	
	return str;
}

// test `exports` for node-webkit
if (fs && typeof(exports) !== "undefined") { 
	exports.Languages = Languages;
}