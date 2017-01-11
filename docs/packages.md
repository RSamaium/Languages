# Using an object directly

Instead of searching the JSON in a file, you can directly assign objects with the `packages()` method. You then set the default language with `default()`

## Browser

```js
const fr_FR = [
  {
    "hello": "bonjour"
  },
  {}
]
const en_EN =  [
  {
    "hello": "hello"
  },
  {}
]

Languages.packages({ fr_FR, en_EN }).default('en_EN')
'hello'.t() // 'Hello'
```

[Test Code](https://jsfiddle.net/2vu4531f/)

## NodeJS

With NodeJS, you can recover the JSON with `require()`

 ```js
const fr_FR = require('./languages/fr_FR.json')
const en_EN = require('./languages/en_EN.json')

Languages.packages({ fr_FR, en_EN }).default('en_EN')
 ```
