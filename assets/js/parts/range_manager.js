"use strict"; 

var range_manager = (function() {

	// load class
	{% include 'db.js' %}
	{% include 'range.js' %}
	{% include 'selector.js' %}
	{% include 'grid.js' %}
	{% include 'range_info.js' %}
	{% include 'action.js' %}
	{% include 'range_option.js' %}
	{% include 'slider.js' %}

	{# include 'cmd.js' #}

	{% include 'PRM.js' %}


	return new PRM();

})();

