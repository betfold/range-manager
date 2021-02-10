/** Grid Manager
 *
 * **/

class RMGrid {

	constructor(range) {
		this.grid	= document.getElementById('range_manager');
		this.set_range(range);
	}

	// Set the html grid with the range
	// range: id list  of cards in the range
	set_range(range) {
		this.reset_grid();
		if(range != null) {
			for(var action in range) {
				for(var i=0; i < range[action].length; i++) { 
					document.getElementById(range[action][i]).classList.add(action); 
				}
			}
		}
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
