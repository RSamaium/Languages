# Pattern

If a word is found several times, it is not useful to rewrite it more times. In this case, we use the re-use of a word with curly braces

```json
[{
    "remember": "remember",
    "remember me": "{1} me"
},
{
    "plurial": {
		    "p": ["s"]
	  }
}]
```

 The `1` between brace allows to recover `remember` located in first position in the key.

 It is possible to use the parameters :

 ```json
 [{
     "your": "your",
     "message": "message%p",
     "your nb message": "{1} %d {3} !"
 },
 {
     "plurial": {
 		    "p": ["s"]
 	  }
 }]
 ```

 In Js :

 ```js
 'your nb message'.t(2); // Your 2 messages
 ```
