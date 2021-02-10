// Tools for manage unod copy call and save
//
class GridAlter {

	constructor(range_name) {
		this.alter = false;
		this.copy = false;
		this.current_range_name = range_name;
		this.range_name = '';
		this.range = {};
		
		this.set_display();
	}

	range_change() {
		this.alter = true;
		this.set_display();
	}

	reset(current_range_name) {
		this.alter = false;
		this.current_range_name = current_range_name;
		this.set_display();
	}

	paste() {
		this.copy = false;
		this.alter = true;
		this.range_name = '';
		this.set_display();
	}
	copy_range(range_name, range) {
		this.copy = true;
		this.range = range;
		this.range_name = range_name;
	}

	set_display() {
		if ( this.alter ) {
			document.getElementById('grid_save').classList.remove('disable'); 
			document.getElementById('grid_undo').classList.remove('disable');
			
		}
		else { 
			document.getElementById('grid_save').classList.add('disable');
			document.getElementById('grid_undo').classList.add('disable');
		}

		if ( this.copy && this.current_range_name === this.range_name ) { 
			document.getElementById('grid_copy').classList.add('disable'); 
			document.getElementById('grid_paste').classList.add('disable'); 
		}
		else if( this.copy && this.current_range_name !== this.range_name ) {
			document.getElementById('grid_copy').classList.remove('disable');
			document.getElementById('grid_paste').classList.remove('disable'); 
		}
		else { 
			document.getElementById('grid_paste').classList.add('disable'); 
		}

	}
}
