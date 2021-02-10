/** 
 * A simple get/save range
 * **/

const RMDb = {


	save_range(name, range) {
		range = JSON.stringify(range);
		if ( range.length > 8 ) { localStorage.setItem( name, range); }
	},


	get_range(range_name) {
		return JSON.parse(localStorage.getItem(range_name));
	}

}
