# Languages [.js ; .php]

Version 0.9.0

## Description

Management phrases in several languages

## Works with

* Javascript
* Node.js
* PHP (>=5.3)

## Get Started

Follow the steps below to start:

1. Install the script

        <script src="path/Languages.js"></script>

2. Initialize languages

        Languages.init([id], [path], [callback]);

        * id  : Identifier of the language in the JSON file.
        * path (optional) : Path to the folder JSON files. Default: `languages/`
        * callback (optional) : Function called when the JSON file is loaded

    Example :

        Languages.init("fr", "languages/", function() {

        });

    If the type of `id` is an array, language is the browser among the identifiers of the array. If it is not found in the array, the first element of the array will be the default language

     Example :

        Languages.init(["en", "fr", "jp", "es"], "languages/", function() {

        });

3. To translate a sentence, use the identifier with the function `t()` in the callback function :

        Languages.init("fr", "languages/", function() {
            var txt = "HELLO_WORD".t();
        });

4. To change the language :
    
        Languages.set("jp", function() {
            var txt = "HELLO_WORD".t();
        });

    > Think about the functions and remember to update your interface


### NodeJS

The code is very simple. You just get the `Languages` ​​Module :

    var Languages = require("Languages").Languages;
    
    Languages.init("fr", "languages/", function() {
    	// Code
    });

### Add a plugin system

Sometimes you want to have language files elsewhere for a plugin. Files are loaded and added language to the interface

    Languages.init("en", "core/languages/", function() {
    	var txt = "HELLO_WORD".t();
    });
	Languages.add("en", "plugins/my_plugin/languages/", "plugin_name", function() {
    	var txt = "plugin_name.HELLO_WORD".t();
    });

Use the `add()` method and add the plugin name (namespace)

## JSON configuration

The files must be defined in the `path` folder in `init()` method. The file name must be the identifier defined in the method `init()`. If possible, use the same name as the identifier of the browser (`navigator.language`)

Example : `languages/fr.json`, `languages/en.json`, etc.

JSON file must have the following format:

    [{
        "ID": "text"
    },
    {
        "config": {}
    }]

The first entry in the table contains the identifiers with texts. The second contains the configuration values ​​as the plural.

Example :

    [{
        "HELLO_WORD": "Hello World"
    },
    {
        "plurial": {
    		"p": ["s"]
    	}
    }]

With the above example, in the code, `"HELLO_WORLD".t()` returns `Hello World`

### Plurial

The plural is defined in the JSON with the `plurial` key. Consider an example :

    [{
        "NB_MSG": "You have %d post%p"
    },
    {
        "plurial": {
    		"p": ["s"]
    	}
    }]

Here, the `%d `parameter specifies an integer number is expected for `NB_MSG` id. `%p` indicates that the plural of the term is used. The plural will be based on the value of `%d`. In `plurial` parameter, we define a rule. For `%p` in the plural, the letter `s` is added at the end.

The result will be :

    var nb_msg = 1;
    "NB_MSG".t(nb_msg); // You have 1 post

    nb_msg = 2;
    "NB_MSG".t(nb_msg); // You have 2 posts

#### Plural feature

It may be that the plural is different depending on a word. You can set it like this:

    [{
        "NB_ACC": "You have %d accessor%p1"
    },
    {
        "plurial": {
    		"p": ["s"],
            "p1": ["ies", "y"]
    	}
    }]

Here, we define a new rule of plural.

The result will be :

    var nb = 1;
    "NB_ACC".t(nb); // You have 1 accessory

    nb_msg = 2;
    "NB_ACC".t(nb); // You have 2 accessories

Thus, the table is defined as follows:

    "p[0-9]+": [plurial, singular, duel, triel, etc.]

## Parameters

In a string, you can add parameters :

    "NAME": "You name is %s, you're %d"

The code will :

    "NAME".t("Sam", 21);

* `%s` : string
* `%d` : decimal
* `%p` : indicates a plural (see above)

## Advanced Usage

It is possible to couple id :

    [{
        "LOGIN": "Login",
        "LOGOUT": "Logout"
    },
    {
        "plurial": {}
    }]

The code :

    "LOGIN|LOGOUT".t(true);

If the parameter is true, it will take the first identifier (separated by |). Otherwise, it takes the second

Other example :

    [{
    	"NB_MSG": "You have %d post%p",
    	"EMPTY": "You have no messages !"
    },
    {
        "plurial": {
    		"p": ["s"]
    	}
    }]

The code : 

     var nb_msg = 0;
     "NB_MSG|EMPTY".t(nb_msg > 0, nb_msg); // You have no messages !

     nb_msg = 2;
    "NB_MSG|EMPTY".t(nb_msg > 0, nb_msg); // You have 2 posts !

Finally, if the identifiers are separated by a space, you can use multiple identifiers :

    [{
        "LOGIN": "Login",
        "WITH": "with"
    },
    {
        "plurial": {}
    }]

The code :

    "LOGIN WITH".t() // Login with
    
## License

MIT. Free for commercial use.
