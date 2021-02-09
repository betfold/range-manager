/** Grid Manager
 *
 * **/

class RMGrid {

	constructor() {
		this.grid					= document.getElementById('range_manager');
		this.cells_cards	= this.grid.getElementsByTagName('td');
		this.ranges				= {};
	}

	save_range(range_name) {
		this.ranges = {};
		
		for(var n = 0, size = this.cells_cards.length; n < size; n++) {
			var action_card = this.cells_cards[n].className.split(' ');
			action_card.forEach(function(action_name) {
				switch ( action_name ) {
					case 'pair':
					case 'offsuit':
					case 'suited':
						break;
					default:
						if ( ! (action_name in this.ranges) ) { this.ranges[action_name] = []; }
						this.ranges[action_name].push(this.cells_cards[n].id);
						break;
				}
			});
		}

		this.ranges = JSON.stringify(this.ranges);
		if ( this.ranges.length > 8 ) { localStorage.setItem( range_name, this.ranges); }
	}

	set_range(range_name) {
		this.reset_grid();
		this.ranges = this.get_range(range_name);
		if(this.ranges != null) {
			for(var action in this.ranges) {
				for(var i=0; i < this.ranges[action].length; i++) { 
					document.getElementById(this.ranges[action][i]).classList.add(action); 
				}
			}
		}
	}

	get_range(range_name) {
		return JSON.parse(localStorage.getItem(range_name));
	}

	/* clean the html grid */
	reset_grid() {
		var grid = this.grid.rows;
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

	// Return list of id hands selected
	// TODO change the html id of table hand to grid_mananger
	get_used_hand() {
		var rows = this.grid.getElementsByTagName('td');
		var hands = [];
		for ( var i = 0, n = rows.length; i < n; i++ ) {
			if ( rows[i].className.split(' ').length > 1 ) { hands.push( rows[i].id ); }
		}
		return hands;
	}

	get_card_by_action(action) {
		var cards = this.grid.getElementsByClassName(action);
		var c = [];
		for(var i=0; i < cards.length; i++) {
			c.push(cards[i].id);
		}
		return c;
	}
}
