## Create a JSON language

The files must be defined in the `path` folder in `init()` method. The file name must be the identifier defined in the method `init()`. If possible, use the same name as the identifier of the browser (`navigator.language`)

Example : `languages/fr_FR.json`, `languages/en_EN.json`, `languages/en_US.json`, etc.

JSON file must have the following format:

```json
[{
    "ID": "text"
},
{
    "config": {}
}]
```

The first entry in the table contains the identifiers with texts. The second contains the configuration values ​​as the plural.

Example :

```json
[
  {
    "hello": "hello"
  },
  {

  }
]
```

With the above example, in the code, `"hello".t()` returns `Hello` (with a capital letter)
