var ui = {
	pair: 0,
	suited: 0,
	offsuit: 0,
	copy: "", // the range name to copy 
}

var selecteur = {
	get_position:					function() { return document.getElementById('position'); },
	current_id:						function() { return document.getElementById('max').value; }, 
	current_pos:					function() { return document.getElementById('position').value; },
	current_action:				function() { return document.getElementById('position_name').value; },
	set_position:					function() { set_position(); },
	set_versus_position:	function() { set_versus_pos(); },
	set_action:						function() { set_action_sel(); },
}
