# Languages.js

Version 1.0.0

## Description

Translation system in Javascript with the JSON format.

## Works with

* Javascript
* Node.js
* AngularJS
* Handlebars

## Get Started

Follow the steps below to start:

1. Install the script

Browser

```html
<script src="path/languages.min.js"></script>
```

NodeJS

```
npm install languages-js --save
```

and import :

```js
const Languages = require('languages-js')
```

or ES6

```js
import Languages from 'languages-js'
```

2. Initialize languages

```js
Languages.init(id, [path], [callback]);
```

    * id : Identifier of the language in the JSON file.
    * path : Path to the folder JSON files.
    * callback (optional) : Function called when the JSON file is loaded

  Example :

```js
Languages.init(['fr_FR'], './languages/', () => {
  // is loaded
});
```

If the type of `id` is an array, language is the browser among the identifiers of the array. If it is not found in the array, the first element of the array will be the default language


3. To translate a sentence, use the identifier with the function `t()` in the callback function :

```js
Languages.init(['fr_FR'], './languages/', () => {
    'hello'.t() // Bonjour
});
```


### Add a plugin system

Sometimes you want to have language files elsewhere for a plugin. Files are loaded and added language to the interface

    Languages.init("en", "core/languages/", function() {
    	var txt = "HELLO_WORD".t();
    });
	  Languages.add("en", "plugins/my_plugin/languages/", "plugin_name", function() {
    	var txt = "plugin_name.HELLO_WORD".t();
    });

Use the `add()` method and add the plugin name (namespace)


## License

MIT. Free for commercial use.
