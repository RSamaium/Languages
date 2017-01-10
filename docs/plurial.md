# Plurial

The plural is defined in the JSON with the `plurial` key. Consider an example :

```json
[{
    "you have nb message": "you have %d message%p"
},
{
    "plurial": {
		    "p": ["s"]
	  }
}]
```

Here, the `%d `parameter specifies an integer number is expected for `you have nb message` id. `%p` indicates that the plural of the term is used. The plural will be based on the value of `%d`. In `plurial` parameter, we define a rule. For `%p` in the plural, the letter `s` is added at the end.

The result will be :

```js
let nbMsg = 1;
'you have nb message'.t(nbMsg); // You have 1 message

nbMsg = 2;
'you have nb message'.t(nbMsg); // You have 2 messages
```

#### Plural feature

It may be that the plural is different depending on a word. You can set it like this:

```json
[{
    "you have nb accessory": "you have %d accessor%p1"
},
{
    "plurial": {
      "p": ["s"],
      "p1": ["ies", "y"]
	  }
}]
```

Here, we define a new rule of plural.

The result will be :

```js
let nb = 1;
'you have nb accessory'.t(nb); // You have 1 accessory

nb = 2;
'you have nb accessory'.t(nb); // You have 2 accessories
```

Thus, the table is defined as follows:

    "p[0-9]+": [plurial, singular, duel, triel, ...]

## Parameters

In a string, you can add parameters :

```json
[{
    "you name is": "you name is %s, you're %d"
},
{
    "plurial": {
      "p": ["s"]
	  }
}]
```

The code will :

```js
  'you name is'.t('Sam', 21);
```

Parameters are :

* `%s` : string
* `%d` : decimal
* `%p` : indicates a plural (see above)
