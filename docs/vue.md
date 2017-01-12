# VueJS

Languages works with SSR (Server Side Rendering) feature

# Browser : Use Languages.js with VueJS :

```html
<script src="path/to/vue.min.js"></script>
<script src="path/to/languages.min.js"></script>
```

and JS :

```js
// use plugin
var app = new Vue({
  // your component
})

window.onload = function() {
  Languages.init(['en_EN', 'fr_FR'], '../langs/', () => {
    app.$mount('#app');
  })
}
```

> This code does not work with SSR. See below

## When using CommonJS via Browserify or Webpack

```js
var Vue = require('vue')
var Languages = require('languages-js')

var fr_FR = require('./languages/fr_FR.json')
var en_EN = require('./languages/en_EN.json')
// etc.

Vue.use(Languages.load.Vue)

Languages .packages({fr_FR, en_EN})
          .default('en_EN')
```

or with ES6 :

```js
import Vue from 'vue'
import Languages from 'languages-js'

import fr_FR from './languages/fr_FR.json'
import en_EN from './languages/en_EN.json'
// etc.

Vue.use(Languages.load.Vue)

Languages .packages({fr_FR, en_EN})
          .default('en_EN')

export default Languages
```

## Use filter

```html
<p>{{'hello' | t}}</p>
```

You can use the settings :

```html
<p>{{'you have nb message' | t(2)}}</p>
```

## Languages instance

You can access to `Languages` instance directly in `Vue` :

```js
Vue.Languages
```

Example :

```js
Vue.Languages.set('fr_FR')
```
