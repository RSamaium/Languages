# Pug

## Render

If you use Pug to render :

You must user `filters` options (https://pugjs.org/api/reference.html#options)

```js
const pug = require('pug');
const text = `p
  :translate() {{"hello" | t}} Sam`

Languages.init('en_EN', './languages/') // sync

let render = pug.render(text, {
  filters: {
    translate: text => Languages.render(text)
  }
});
```

### Shortcut


```js
const pug = require('pug');
const text = `p
  :translate() {{"hello" | t}} Sam`

Languages.init('en_EN') // sync

let render = pug.render(text, { filters: Languages.load.Pug() });
```

## Using custom patterns

In the `render` method of Languages, you can use custom patterns :

```js
const pug = require('pug');
const text = `p
  :translate() ["hello" - t(1,2)] Sam`
const customPattern =  {
  patternStart: '[',
  patternEnd: ']',
  pipe: '-',
  fnStart: '(',
  fnEnd: ')',
  paramsSeparator: ','
}

Languages.init('en_EN', './languages/') // sync

let render = pug.render(text, {
  filters: {
    translate: text => Languages.render(text, customPattern)
  }
});
```

By default :

```js
{
  patternStart: '{{',
  patternEnd: '}}',
  pipe: '|',
  fnStart: '',
  fnEnd: '',
  paramsSeparator: ':'
}
```
