# Change the language

You can change the language with the `set()` method. Think, however, of initializing languages :

```js
Languages.init(['en_EN', 'fr_FR'], 'languages/', () => {
	'hello'.t() // Hello
  Languages.set('fr_FR', () => {
    'hello'.t() // Bonjour
  });
});
```

## With packages

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
Languages.set('fr_FR')
'hello'.t() // 'Bonjour'
```
