function save_range() {

	var grid			= document.getElementById('range_manager');
	var cards_td	= grid.getElementsByTagName('td');
	var ranges		= {};
	
	for(var n = 0, size = cards_td.length; n < size; n++) {
		var action_card = cards_td[n].className.split(' ');
		action_card.forEach(function(action_name) {
			switch ( action_name ) {
				case 'pair':
				case 'offsuit':
				case 'suited':
					break;
				default:
					if ( ! (action_name in ranges) ) { ranges[action_name] = []; }
					ranges[action_name].push(cards_td[n].id);
					break;
			}
		});
	}

	ranges = JSON.stringify(ranges);
	if ( ranges.length > 8 ) { localStorage.setItem( get_range_name(), ranges); }
}

function set_range() {
	clear_range();
	var ranges = get_range();
	var ac     = ui.classname_to_remove;
	ac         = ac.split(' ');
	if(ranges != null) {
		for(var action in ranges) {
			for(var i=0; i < ranges[action].length; i++) { 
				if(ac.includes(action)) {
					document.getElementById(ranges[action][i]).classList.add(action); 
				}
			}
		}
	}
	set_combo_info(); // FIXME change function to get_range_info
}

function get_range() {
	return JSON.parse(localStorage.getItem(get_range_name()));
}

/* clean the html grid */
function clear_range() {
	var grid = document.getElementById('range_manager').rows;
	for(var i = 0; i < 13; i++) {
		var cols = grid[i].cells;
		for(var c = 0; c < 13; c++) {
			cols[c].className.split(' ').forEach(function(item) {
				switch ( item ) {
					case 'pair':
					case 'offsuit':
					case 'suited':
						break;
					default:
						cols[c].classList.remove(item);
						break;
				}
			});
		}
	}
	
}

function get_card_by_action(action) {
	var rm = document.getElementById("range_manager");
	var cards = rm.getElementsByClassName(action);
	var c = [];
	for(var i=0; i < cards.length; i++) {
		c.push(cards[i].id);
	}
	return c;
}

