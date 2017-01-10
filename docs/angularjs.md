# AngularJS 1

1. Add module to application :

```js
var app = angular.module('app', ['Languages'])
```

2. Initialize the language in the config method

```js
Languages.init('fr_FR', './languages/', () => {
  angular.bootstrap(document, ['app']);
});
```

3. Using filters in templates :

```html
<p>{{'hello' | t}}</p>
```

You can use the settings :

```html
<p>{{'you have nb message' | t:2}}</p>
```

## Use service

You can access Language with Injection Dependency :

```js
app.controller('MyController', function(Languages) {
  Languages.translate('hello');
})
```
