# i18n and l10n : Languages.js

Version 2.2.x
https://languages.js.org

## Description

Translation system in Javascript with the JSON format.

## Fully Documentation

https://languages.js.org/docs

## Works with

* Javascript
* Node.js
* AngularJS
* Handlebars
* Pug
* VueJS 2

## Get Started

Follow the steps below to start:

1. Install the script

Link

```html
<script src="path/languages.min.js"></script>
```

CDN

```html
<script src="https://unpkg.com/languages-js@latest/languages.min.js"></script>
```

NPM

```
npm install languages-js --save
```

Yarn

```
yarn add languages-js
```

Bower

```
bower install languages-js
```

2. Import :

```js
const Languages = require('languages-js')
```

or ES6

```js
import Languages from 'languages-js'
```

3. Directory structure

  - languages
    - fr_FR.json
    - en_EN.json
    - ...
  - script.js

4. Initialize languages

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


5. To translate a sentence, use the identifier with the function `t()` in the callback function :

```js
Languages.init(['fr_FR'], './languages/', () => {
    'hello'.t() // Bonjour
});
```

##

[Simple Plunker Demo](https://plnkr.co/edit/yMB2LkZ1oA4b0xOLUy96)

## License

MIT. Free for commercial use.
