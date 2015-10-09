/* global Materialize */

import Ember from 'ember';

export default Ember.Controller.extend({
	platforms: function() {
		return Ember.A([
			{ id: 'android', value: 'Android' },
			{ id: 'iphone', value: 'iPhone' },
			{ id: 'xbox', value: 'Xbox' },
			{ id: 'playstation', value: 'Playstation' },
			{ id: 'windows', value: 'Windows' },
			{ id: 'mac', value: 'mac' },
			{ id: 'linux', value: 'Linux' }
		]);
	}.property(),

	games: Ember.computed.oneWay('model'),

	modalIsOpen: false,
	searchGameValue: '',

	title: '',
	selectedPlatform: null,
	description: '',

	searchGame: function() {
		var self = this;
		var title = this.get('searchGameValue');
		if (Ember.isEmpty(title)) {
			self.set('games', this.store.findAll('game'));
		} else {
			this.store.query('game', {"filter": {"where": {"title": {"like": title }}}}).then(function (results) {
				self.set('games', results);
			}, function(error) {
				Materialize.toast('Error:' + error, 4000);
			});
		}
	},

	searchGameValueObserver: function() {
		Ember.run.debounce(this, this.searchGame, 369);
	}.observes('searchGameValue'),

	actions: {
		add: function() {
			this.set('modalIsOpen', true);
		},

		resetSearch: function() {
			this.set('searchGameValue', '');
		},

		submitGame: function() {
			var title = this.get('title');
			var platform = this.get('selectedPlatform.id');
			var description = this.get('description');
			var self = this;

			if (Ember.isPresent(title) 
				&& Ember.isPresent(platform) 
				&& Ember.isPresent(description)) {
				// form is valid

				var game = self.store.createRecord('game', {
					title: title,
					platform: platform,
					description: description
				});

				game.save().then(function (game) {
					self.searchGame();
					self.send('closeModal');
				}).catch(function (failure) {
					Materialize.toast('Error:' + failure, 4000);
				});
			} else {
				Materialize.toast('All fields are required', 4000);
			}
		},

		closeModal: function() {
			this.set('title', '');
			this.set('selectedPlatform', null);
			this.set('description', '');
			this.set('modalIsOpen', false);
		}
	}
});
