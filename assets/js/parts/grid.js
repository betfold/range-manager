function save_range() {
	var ranges = {};
	
	for(var pos in ui.actions) {
		for(var i in ui.actions[pos]) {
			var action = ui.actions[pos][i];
			var combos = get_card_by_action(action);
			if ( combos.length > 0 ) {
				ranges[action] = [];
				Array.prototype.push.apply(ranges[action], combos);
			}
		}
	}
	ranges = JSON.stringify(ranges);
	if( ranges.length > 8 ) { localStorage.setItem(get_range_name(), ranges); }
}

function set_range() {
	clear_range();
	var name   = get_range_name();
	var ranges = JSON.parse(localStorage.getItem(name));
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
}

/* clean the html grid */
function clear_range() {
	var grid = document.getElementById('range_manager').rows;
	for(var i = 0; i < 13; i++) {
		var cols = grid[i].cells;
		for(var c = 0; c < 13; c++) {
			// fixme have some error when I want to use ui.classname_to_remove or ui.actions.rfi.join(", ") or whatever you want to create this
			cols[c].classList.remove("bet", "threebet", "fourbet", "fivebet", "flat", "flat3bet", "falt4bet", "flat5bet", "allin", "limp", "limpfold", "limpcall", "limp3bet");
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

