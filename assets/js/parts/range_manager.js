var range_manager = (function() {


	{% include 'RMSelector.js' %}
	{% include 'RMGrid.js' %}
	{% include 'head.js' %}
	{% include 'info_range.js' %}
	{% include 'action.js' %}
	{% include 'cmd.js' %}
	{% include 'slider.js' %}
	{% include 'init.js' %}

	return { 
		clear: clear_range,
		save: save_range, 
		load: set_range, 
		set_background_card: set_action_to_card,
		selecteur: this.selecteur,
		cmd: parse_cmd,
		init: __init,
	}

})();

range_manager.init();
