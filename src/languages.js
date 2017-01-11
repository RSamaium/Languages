/*
Copyright (C) 2017 by WebCreative5 - Samuel Ronce

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

var Languages = (function() {

	let fs, instance, isServerSide = false;

	if (typeof(exports) !== "undefined" && typeof(window) === "undefined") {
		fs = require('fs');
		isServerSide = true;
	}

	class Languages  {

		constructor() {
			this.current = "en";
			this.data = {};
			this.options = {};
			this._path = null;
			this._cache = {};
			this._list = [];
		}

		instance() {
			return instance = new Languages();
		}

		set(id, callback) {
			this.init(id, this._path, callback);
			return this;
		}

		add(id, path, namespace, callback) {
			this.init(id, path, callback, { namespace });
		}

		packages(languages, options={}) {
			const namespace = options.namespace || "self";
			if (!this._cache[namespace]) {
				this._cache[namespace] = {};
			}
			for (let key in languages) {
				this._cache[namespace][key] = languages[key];
			}
			return this;
		}

		default(id, options={}) {
			const namespace = options.namespace || "self"
			let ids = []
			ids.push(id)
			for (let key in this._cache[namespace]) {
				if (key == id) continue;
				ids.push(key)
			}
			return this.init(ids, false, false, options)
		}

		init(id, path, callback, options={}) {

			let _path, xhr;

			const namespace = options.namespace || "self";

			if (typeof path == "function") {
				callback = path;
				path = false;
			}

			this._path = path;

			if (!this._cache[namespace]) {
				this._cache[namespace] = {};
			}

			if (!(id instanceof Array)) {
				id = [id];
			}

			this._list = id;

			let getCountryCode = lang => lang += '_' + lang.toUpperCase();
			let userLang = getCountryCode((this.getUserLanguage()).replace(/\-.+/, ""));
      if (this._list.indexOf(userLang) == -1) {
				this.current = this._list[0];
			}
			else {
				this.current = userLang;
			}

			if (path) {
				_path =  path + this.current + ".json";
			}

			let _callback = (txt, id, notCall) => {

				let json;

				if (!id) {
					id = this.current;
				}

				if (path) {
					txt = txt.toString('utf8');
					json = JSON.parse(txt);
				}
				else {
					json = txt;
				}

				let [data, options] = json;
				this.data[id] = {};
				this.options[id] = {};
				this.data[id][namespace] = this._initMultiple(data);
				this.options[id][namespace] = options;
				this._cache[namespace][id] = txt;
				if (callback && !notCall) callback.call(self);
			}

			if (this._cache[namespace][this.current]) {
				_callback(this._cache[namespace][this.current]);
				return this;
			}

			if (fs) {
          if (!callback) {
              _callback(fs.readFileSync(_path));
          }
          else {
							let index=0;
							for (let lang of this._list) {
								fs.readFile(path + lang + ".json",  (err, ret) => {
                    if (err) throw err;
                    _callback(ret, lang, true);
										index++;
										if (callback && index == this._list.length) {
											callback.call(this);
										}
                })
							}
          }
				return this;
			}

			try {
				xhr = new XMLHttpRequest();
			}
			catch (e) {
				xhr = false;
			}

			xhr.onreadystatechange  = () => {
				 if (xhr.readyState  == 4 && xhr.status  == 200)  {
						_callback(xhr.responseText);
				 }
			};

		  xhr.open("GET", _path,  true);
		  xhr.send();

		  return this;
		}

		getUserLanguage() {
			if (isServerSide) {
				return this.current;
			}
			else {
				return navigator.language || navigator.userLanguage || this.current;
			}
		}

		_initMultiple(obj) {
			let ids, regex = /\[(.+)\]/,
					specialId,
					isGroup,
					group = /^\$[^ ]+$/,
					special = /\$[^ ]+/g,
					tmpObj = {}, finalObj = {};

			function replaceManyGroup(specialId, obj, key, originalObj) {

					let tmp = {};
					let groupObj = originalObj ? originalObj[specialId] : obj[specialId];
					let words = key.split(' ')

					for (let specialKey in groupObj) {
						let id = key.replace(specialId, specialKey);
						if (obj[key].text) {
							tmp[id] = {
								text: obj[key].text,
								replacePattern: obj[key].replacePattern.map(w => specialId == w ? specialKey : w)
							}
						}
						else {
							tmp[id] = {
								text: obj[key],
								replacePattern: words.map(w => specialId == w ? specialKey : w)
							};
						}

					}
					return tmp;
			}

			function mergeWithOriginal(obj, finalObj) {
				for (let finalKey in finalObj) {
					obj[finalKey] = finalObj[finalKey];
				}
				return obj;
			}

			for (let key in obj) {
				isGroup = group.test(key);
				if (regex.test(key)) {
					ids = regex.exec(key)[1].split(',');
					for (let id of ids) {
						obj[key.replace(regex, id)] = obj[key];
					}
				}
				if (special.test(key) && !isGroup) {
					tmpObj = {};
					finalObj = {};
					specialId = key.match(special);
					tmpObj = replaceManyGroup(specialId[0], obj, key);
					if (specialId.length > 1) {
						for (let tmpKey in tmpObj) {
							finalObj = replaceManyGroup(specialId[1], tmpObj, tmpKey, obj);
							mergeWithOriginal(obj, finalObj);
						}
					}
					else {
						mergeWithOriginal(obj, tmpObj);
					}
				}
				if (isGroup) {
					for (let groupKey in obj[key]) {
						obj[groupKey] = obj[key][groupKey];
					}
				}
			}
			return obj;
		}

		get(id, namespace, lang) {
			lang = lang || this.current;
			namespace = namespace || 'self';
			if (!this.data[lang][namespace]) {
				return '';
			}
			return this.replaceWorlds(this.data[lang][namespace][id], id, namespace);
		}

		capitalizeFirstLetter(str) {
	    return str.charAt(0).toUpperCase() + str.slice(1);
		}

		replaceWorlds(str, id, namespace) {
				let params = {}
				if (!str) {
					return str;
				}
				if (str.text) {
					params = str;
					str = str.text;
				}
				return str.replace(/\{([0-9]+)\}/g, (match, number) => {
						let ids = params.replacePattern || id.split(' ');
						return this.get(ids[number-1], namespace);
				});
		}

		getPlurial(val, type, namespace, lang) {
			namespace = namespace || 'self';
			lang = lang || this.current;
			val = Math.abs(val);

			if (!/^[0-9]+$/.test(val)) {
				return false;
			}

			let plurial = this.options[lang][namespace].plurial[type];
			if (!plurial) {
				plurial = ["s"];
			}
			if (val > 2 && plurial[val-1]) {
				return plurial[val-1];
			}
			else if (val > 1) {
				return plurial[0];
			}
			else {
				return plurial[1] || '';
			}
		}

    format(word, namespace, localCurrent, ...args) {
        let i=-1, plurial, val;
        let match = word.match(/%[sdp]/g);
        if (!match) return word;
        for (let m of match) {
            i++;
            if (m == "%d") {
                plurial = args[i];
            }
            else if (m == "%p") {
                break;
            }
        }
        i = -1;
        return word.replace(/%[sdp]([0-9]+)?/g, (match, number) => {
          i++;
          val = typeof args[i] != 'undefined' ? args[i] : match;
          if (/^%p/.test(match)) {
             if (plurial == undefined) {
                plurial = val;
             }
						 if (typeof plurial != "number") {
							  plurial = 0;
						 }
             val = this.getPlurial(plurial, match.replace("%", ""), namespace, localCurrent);
          }
          return val;
        });
	    }
	  	get load() {
				let self = this
				return {
		        Handlebars(Handlebars) {

		            Handlebars.registerHelper('t', function(text, options) {
		                 var nb = options.hash.nb,
		                     _if = options.hash.if;
		                 if (nb === undefined) {
		                      return text.t();
		                 }
		                 else {
		                     if (_if === undefined) {
		                         return text.t(+nb);
		                     }
		                     else {
		                         return text.t(_if, +nb);
		                     }
		                 }

		            });

		            return Handlebars;

		        },
		        Angular(angular) {
		            angular .module("Languages", [])
		                    .provider("Languages", function() {

		                        this.init = self.init.bind(Languages);

		                        this.$get = function() {
		                            return self;
		                        }

		                    }).filter('t', function() {

												  return function(str, ...expression) {
												     return str.t(...expression);
												  };

												})
		        },
						get Vue() {
							return {
								install(Vue, options) {
								  Vue.Languages = self
									Vue.filter('t', (value, ...expression) => {
									  return self.translate(value, ...expression);
									})
								}
							} // return
					 }
				 } // second return
	    }
			translate(value, ...args) {
				var type, txt, namespace = "self", localCurrent;

				let arg = args[0]

				function shift() {
					arg = args.shift()[0];
				}

				if (this._list.indexOf(args[0]) != -1) {
					localCurrent = arg;
					shift()
				}
				if (typeof arg == "boolean") {
					let group = value.match(/\((.*?)\)/);
					if (group) {
						type = group[1].split("|");
						txt = arg ?
									value.replace(group[0], type[0].trim()) :
									value.replace(group[0], type[1].trim());
					}
					else {
						type = value.split("|");
						txt = arg ? type[0] : type[1];
					}
					shift()
				}
				else {
					txt = value;
				}
				let words = txt.split('+');
				let str = '', word;
				for (let w of words) {
					let match, namespace;
					if (match = /(.+)\.(.+)/.exec(w)) {
						namespace = match[1];
						w = match[2];
					}
					let word = this.get(w.trim(), namespace, localCurrent);
					if (word) {
						str += this.format(word, namespace, localCurrent, ...args);
					}
					str += ' ';
				}
				return this.capitalizeFirstLetter(str.trim());
			}
	}

	instance = new Languages();

	String.prototype.t = function(...args) {
		return instance.translate(this, ...args)
	}

	if (typeof(Handlebars) !== "undefined") instance.load.Handlebars(Handlebars);
	if (typeof(angular) !== "undefined")  instance.load.Angular(angular);

	return instance;
})();

module.exports = Languages;
