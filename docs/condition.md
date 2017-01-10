# Conditional value

Here's the JSON :

```json
[{
  "$you": {
    "you have": "you have"
  },
  "$you nb message": "{1} %d message%p",
  "$you no message": "{1} no message"
},
{
    "plurial": {
		    "p": ["s"]
	  }
}]
```

You can use a condition to display one's self according to the value of a boolean :

```js
let nbMsg = 3
'you have nb message | you have no message'.t(nbMsg>0, nbMsg) // You have 3 messages

nbMsg = 0
'you have nb message | you have no message'.t(nbMsg>0, nbMsg) // You have no message
```

If the parameter is true, it will take the first identifier (separated by `|`). Otherwise, it takes the second.
The above expression plus being simplified:

```js
let nbMsg = 3
'you have (nb message | no message)'.t(nbMsg>0, nbMsg) // You have 3 messages
```
