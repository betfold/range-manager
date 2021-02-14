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

	get_range() {
		let cells = this.grid.getElementsByTagName('td');
		let ranges = {};
		
		for(let n = 0, size = cells.length; n < size; n++) {
			
			let action_card = cells[n].className.split(' ');
			
			action_card.forEach(function(action_name) {
				switch ( action_name ) {
					case 'pair':
					case 'offsuit':
					case 'suited':
						break;
					default:
						if ( ! (action_name in ranges) ) { ranges[action_name] = []; }
						ranges[action_name].push(cells[n].id)
						break;
				}
			});
		}

		return ranges;
	}
	

	/* clean the html grid */
	reset_grid() {
		let grid = this.grid.rows;
		for(let i = 0; i < 13; i++) {
			var cols = grid[i].cells;
			for(let c = 0; c < 13; c++) {
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
		let rows = this.grid.getElementsByTagName('td');
		let hands = [];
		for ( let i = 0, n = rows.length; i < n; i++ ) {
			if ( rows[i].className.split(' ').length > 1 ) { hands.push( rows[i].id ); }
		}
		return hands;
	}

	get_card_by_action(action) {
		let cards = this.grid.getElementsByClassName(action);
		let c = [];
		for(let i=0; i < cards.length; i++) {
			c.push(cards[i].id);
		}
		return c;
	}
}
