var range_manager = (function() {

	// load class
	{% include 'selector.js' %}
	{% include 'grid.js' %}
	{% include 'range_info.js' %}
	{% include 'action.js' %}

	// load function
	{% include 'cmd.js' %}
	{% include 'slider.js' %}
	{% include 'init.js' %}

	return { 
		grid: this.grid,
		action: this.action, 
		selecteur: this.selecteur,
		info: this.info,
		set_background_card: this.action.set_action_to_card,
		cmd: parse_cmd,
		init: __init,
	}

})();

range_manager.init();
