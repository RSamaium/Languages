let fs, instance, isServerSide = false;

if (typeof (exports) !== "undefined" && typeof (window) === "undefined") {
    fs = require('fs');
    isServerSide = true;
}

module.exports = class Languages {

    constructor() {
        this.current = "en";
        this.data = {};
        this.options = {};
        this._path = null;
        this._cache = {};
        this._list = [];
    }

    set(id, callback) {
        this.init(id, this._path, callback);
        return this;
    }

    add(id, path, namespace, callback) {
        this.init(id, path, callback, {
            namespace
        });
    }

    packages(languages, options = {}) {
        let ids = []

        const namespace = options.namespace || "self";
        if (!this._cache[namespace]) {
            this._cache[namespace] = {};
        }
        for (let key in languages) {
            this._cache[namespace][key] = languages[key];
            ids.push(key)
        }

        return this.init(ids, false, false, options)
    }

    default (id) {
        this.current = id
    }

    // NodeJS only
    all(path, callback, options = {}) {

        const _callback = (files) => {
            let filter = [],
                ext = /\.json$/;
            for (let file of files) {
                if (ext.test(file)) {
                    filter.push(file.replace(ext, ''))
                }
            }
            this.init(filter, path, callback, options)
        }
        if (!callback) {
            _callback(fs.readdirSync(path));
        } else {
            fs.readdir(path, (err, files) => {
                if (err) throw err;
                _callback(files)
            });
        }

    }

    init(id, path, callback, options = {}) {

        let _path, xhr;

        const namespace = options.namespace || "self";

        if (typeof path == "function") {
            callback = path;
            path = false;
        }

        this._path = path;

        if (!(id instanceof Array)) {
            id = [id];
        }

        this._list = id;

        let getCountryCode = lang => lang += '_' + lang.toUpperCase();
        let userLang = getCountryCode((this.getUserLanguage()).replace(/\-.+/, ""));
        if (this._list.indexOf(userLang) == -1) {
            this.current = this._list[0];
        } else {
            this.current = userLang;
        }

        if (path) {
            _path = path + this.current + ".json";
        }

        let _callback = (txt, id, notCall) => {

            let json;

            if (!id) {
                id = this.current;
            }

            if (path) {
                txt = txt.toString('utf8');
                json = JSON.parse(txt);
            } else {
                json = txt;
            }

            if (!this._cache[namespace]) {
                this._cache[namespace] = {};
            }

            let [data, options] = json;
            this.data[id] = {};
            this.options[id] = {};
            this.data[id][namespace] = this._initMultiple(data);
            this.options[id][namespace] = options;
            this._cache[namespace][id] = txt;
            if (callback && !notCall) callback.call(self);
        }

        if (this._cache[namespace] && this._cache[namespace][this.current]) {
            for (let lang in this._cache[namespace]) {
                _callback(this._cache[namespace][lang], lang);
            }
            return this;
        }

        if (fs) {
            if (!callback) {
                for (let lang of this._list) {
                    _callback(fs.readFileSync(path + lang + ".json"), lang, true);
                }
            } else {
                let index = 0;
                for (let lang of this._list) {
                    fs.readFile(path + lang + ".json", (err, ret) => {
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
        } catch (e) {
            xhr = false;
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                _callback(xhr.responseText);
            }
        };

        xhr.open("GET", _path, true);
        xhr.send();

        return this;
    }

    getUserLanguage() {
        const first = this._list[0]
        if (isServerSide) {
            return first;
        } else {
            return navigator.language || navigator.userLanguage || first;
        }
    }

    _initMultiple(obj) {
        let ids,
            specialId,
            isGroup,
            tmpObj = {},
            finalObj = {};

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
                } else {
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

        const newObj = JSON.parse(JSON.stringify(obj))

        for (let key in newObj) {

            let isGroup = /^\$[^ ]+$/.test(key);
            let regex = /\[(.+)\]/
            let special = /\$[^ ]+/g

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
                } else {
                    mergeWithOriginal(obj, tmpObj);
                }
            }
            if (isGroup) {
                if (obj[key] instanceof Array) {
                    let buffer = {}
                    let name = key.replace(/^\$/, '')
                    for (let i=0 ; i < obj[key].length ; i++) {
                        buffer[name + '_' + i] = obj[key][i]
                    }
                    obj[key] = buffer
                }
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
        if (!this.data[lang]) {
            return '';
        }
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
            return this.get(ids[number - 1], namespace);
        });
    }

    getGroup(name, namespace = 'self') {
        let groups = this.data[this.current][namespace]['$' + name];
        let array = [];
        for (let key in groups) {
            array.push(key);
        }
        return array;
    }

    render(text, {
        patternStart = '{{',
        patternEnd = '}}',
        pipe = '|',
        fnStart = '',
        fnEnd = '',
        paramsSeparator = ':'
    } = {}, language) {
        const escape = pattern => pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        patternStart = escape(patternStart)
        patternEnd = escape(patternEnd)
        pipe = escape(pipe)
        fnStart = escape(fnStart)
        fnEnd = escape(fnEnd)
        let escapeParamsSeparator = escape(paramsSeparator)
        const regexp = new RegExp(`${patternStart}([^${patternEnd}]+)${pipe}[ ]*t(${escapeParamsSeparator}?${fnStart}([^${patternEnd}]+)${fnEnd})?${patternEnd}`, 'g')
        text = text.replace(regexp, (match, key, t, params, offset, string) => {
            key = key.replace(/["']/g, '');
            key = key.trim()
            if (params) {
                params = params.split(paramsSeparator)
                params = params.map(val => {
                    val = val.trim();
                    if (val >= 0 || val <= 0) {
                        val = +val;
                    } else if (val == 'true') {
                        val = val === 'true'
                    } else if (val == 'false') {
                        val = val === 'false'
                    }
                    return val;
                })
            } else {
                params = []
            }
            if (language) {
                params = [language, ...params];
            }
            return this.translate(key, ...params);
        })
        return text;
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
        if (val > 2 && plurial[val - 1]) {
            return plurial[val - 1];
        } else if (val > 1) {
            return plurial[0];
        } else {
            return plurial[1] || '';
        }
    }

    format(word, namespace, localCurrent, ...args) {
        let i = -1,
            plurial, val;
        let match = word.match(/%[sdp]/g);
        if (!match) return word;
        for (let m of match) {
            i++;
            if (m == "%d") {
                plurial = args[i];
            } else if (m == "%p") {
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

                Handlebars.registerHelper('t', function (text, options) {
                    var nb = options.hash.nb,
                        _if = options.hash.if;
                    if (nb === undefined) {
                        return text.t();
                    } else {
                        if (_if === undefined) {
                            return text.t(+nb);
                        } else {
                            return text.t(_if, +nb);
                        }
                    }

                });

                return Handlebars;

            },
            Pug(filters = {}) {
                filters.translate = text => self.render(text);
                return filters
            },
            Angular(angular) {
                angular.module("Languages", [])
                    .provider("Languages", function () {

                        this.init = self.init.bind(Languages);

                        this.$get = function () {
                            return self;
                        }

                    }).filter('t', function () {

                        return function (str, ...expression) {
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
        var type, txt, namespace = "self",
            localCurrent;

        if (value === null || typeof value === 'undefined') return ''

        let arg = args[0]

        function shift() {
            args.shift();
            arg = args[0]
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
            } else {
                type = value.split("|");
                txt = arg ? type[0] : type[1];
            }
            shift()
        } else {
            txt = value;
        }
        let words = txt.split('+');
        let str = '',
            word;
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