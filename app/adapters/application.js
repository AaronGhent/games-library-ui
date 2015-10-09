import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	host: 'http://localhost:3693',
	namespace: 'api',
	defaultSerializer: 'JSONSerializer'
});
