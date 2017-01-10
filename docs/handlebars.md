# Handlebars

## Browser

Use directly in a template :

```html
<script id="entry-template" type="text/x-handlebars-template">
  <p>{{t "hello"}}</p>
</script>
```

```js
Languages.init('fr_FR', './languages/', () => {
  var source   = $("#entry-template").html();
  var template = Handlebars.compile(source)
})
```

## NodeJS

With Express-hbs module :

```js
const hbs = require('express-hbs')
const Languages = require("languages-js")

Languages.init('fr_FR', './languages/') // sync
Languages.load.Handlebars(hbs)
```

## Use settings

Example 1 :

```html
<p>{{t "NB_MSG" nb=2}}</p>
```

Example 2 :

```html
<p>{{t "you have (nb message | no message)" nb=1 if=true}}</p>
```
