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

const LanguagesClass = require('./languages.class') 

var Languages = (function () {

	var instance = new LanguagesClass();

	instance.instance = function() {
        return instance = new LanguagesClass();
    }

	String.prototype.t = function (...args) {
		return instance.translate(this, ...args)
	}

	if (typeof (Handlebars) !== "undefined") instance.load.Handlebars(Handlebars);
	if (typeof (angular) !== "undefined") instance.load.Angular(angular);
	if (typeof (Vue) !== "undefined") Vue.use(instance.load.Vue);

	return instance;
})();

module.exports = Languages;
