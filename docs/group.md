# Group


You can group translations in the JSON :

```json
[{
    "you have nb $objects": "you have %d {4}",
    "$objects": {
        "image": "image%p",
        "file": "file%p",
        "message": "message%p"
    }
},
{
    "plurial": {
		    "p": ["s"]
	  }
}]
```

A group starts with a `$`. Here, the name is `$objects`. It contains 3 words that can be in the plural.Thus, we can make 3 combinations:

* you have %d image%p
* you have %d file%p
* you have %d message%p

In Js :

```js
'you have nb image'.t(1); // You have 1 image
'you have nb file'.t(2); // You have 2 files
'you have nb message'.t(3); // You have 3 messages
```

You can also use only the word present in the group

```js
'image'.t(1); // Image
'file'.t(2); // Files
'message'.t(3); // Messages
```

## Combining groups

```json
[{
    "$verbs": {
      "add": "add",
      "remove": "remove"
    },
    "$objects": {
        "image": "image%p",
        "file": "file%p"
    },
    "$verbs $objects": "{1} {2}"
},
{
    "plurial": {
		    "p": ["s"]
	  }
}]
```

In JS :

```js
'add image'.t(); // Add image
'remove image'.t(); // Remove image
'add file'.t(); // Add file
'remove file'.t(2); // Remove files
```
