/**
 *  The current range
 *
 *  saved_range store the original range
 *  we work on a clone of range on this.ranges
 *  **/

class Range {

	constructor(name) {
		this.name = name; // The id in base
		this.saved_range = RMDb.get(name);
		this.grid = new RMGrid();
		this.action = new RMAction(); 
		this.ranges;
		this.cards = [];
		this.alter = null;
		this.info;

		this._set_range();
	}

	_set_range() {
		this.ranges = JSON.parse(JSON.stringify(this.saved_range));
		this.card_list();
		this.info = new RangeInfo(this.ranges);
		this.info.set_combo_info();
		this.grid.set_range(this.ranges);
	}

	update_range() {
		this.alter = {};
		this.ranges = this.grid.get_range();
		this.info = new RangeInfo(this.ranges);
		this.info.set_combo_info(); 

		for(var action in this.ranges) {
			this.alter[action] = _.difference(this.ranges[action], this.saved_range[action]);
		}
	}

	get_range() { return this.ranges; }

	// return uniq list of card
	card_list() {
		for(var k in this.ranges) {
			this.ranges[k].forEach(e => this.cards.push(e))
		}
		this.cards = _.uniq(this.cards);
	}

}
