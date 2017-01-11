# Namespaces

It is possible that you need to create a plugin using its own translation. In this case, you can use the namespaces

 ```js
// Initialize Language
Languages.init('fr_FR', 'core/languages/', () => {
	'hello'.t()
});

// Add namespace
Languages.add('fr_FR', 'plugins/my_plugin/languages/', 'plugin_name', () => {
	'plugin_name.hello'.t()
});
 ```

Use the `add()` method and add the plugin name (namespace)
