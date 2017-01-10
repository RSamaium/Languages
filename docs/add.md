# concatenate messages

It is possible to concatenate messages

Here's the JSON :

```json
[{
  "you have": "you have",
  "message": "%d message%p"
},
{
    "plurial": {
		    "p": ["s"]
	  }
}]
```

In JS :

```js
'you have + message'.t(2) // You have 2 messages
```

Use the + symbol to concatenate two messages

> Warning, this method can be useful but blocking for the translation of other languages. If the form of the sentence is different in another language, it will be difficult to use this method
