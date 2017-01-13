window.onload = function() {

	var app = new Vue({
		data() {
			return {
				nb: 3,
			  activeName: 'first',
				item: 'message',
				lang: '',
				languages: {en_EN: 'English', fr_FR: 'French'}
			}
		},
		computed: {
			items() {
				return Languages.getGroup('objects')
			},
			msg() {
				return `you have (nb ${this.item} | no ${this.item})`
			}
		},
		methods: {
			itemClick(command) {
				this.item = command;
			},
			languageClick(lang) {
				Languages.set(lang, () => {
					this.lang = lang;
				})
			}
		}
	})

	Languages.init(['en_EN', 'fr_FR'], './languages/', () => {
		app.lang = Languages.current;
    app.$mount('#demo');
  })

}
