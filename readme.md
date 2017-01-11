# i18n and l10n : Languages.js

Version 2.0.0

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

* id {Array or String} : Identifier of the language in the JSON file.

> `id` format :

>     ISO-639 + _ + ISO-3166
>     Language Code + "_" + Country Code
> Example :
>    * fr_FR
>    * en_EN
>    * en_US

> If only ISO-639 (en, fr, jp, etc.) :

>    * fr : fr_FR
>    * en : en_EN

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

## License

MIT. Free for commercial use.
