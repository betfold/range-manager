/**
 *  The current range
 *  **/

class Range {

	constructor(name, ranges) {
		this.name = name; // The id in base
		this.ranges = ranges; // action:[cards+]
		
		this.info = new RangeInfo(this.ranges);
		this.info.set_combo_info();
	}

}
