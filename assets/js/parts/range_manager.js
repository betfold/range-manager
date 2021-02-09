var range_manager = (function() {

	// load class
	{% include 'range.js' %}
	{% include 'selector.js' %}
	{% include 'grid.js' %}
	{% include 'range_info.js' %}
	{% include 'action.js' %}

	// load function
	{% include 'cmd.js' %}
	{% include 'slider.js' %}

	{% include 'PRM.js' %}

	return new PRM();

})();

range_manager.update_screen();
