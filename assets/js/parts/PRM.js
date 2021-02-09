/** 
 * author: E.p 
 * **/
class PRM {

	constructor() {
		this.selector = new RMSelector();
		this.grid			= new RMGrid();
		this.action		= new RMAction();
		this.range		= new Range(this.selector.get_range_name(), this.grid.get_range(this.selector.get_range_name()) );
	
		this.set_eventListener();
	}

	update_screen() {
		this.range.info.set_combo_info();
	}

	// Set action to the select range 
	set_eventListener() {

		this.selector.table_size.addEventListener('change', () => { 
			this.selector.table_size_has_changed(); 
			this.grid.set_range(this.selector.get_range_name());
			this.range		= new Range(this.selector.get_range_name(), this.grid.get_range(this.selector.get_range_name()) );
			this.range.info.set_combo_info();
		} , false);
		
		this.selector.hero_pos.addEventListener('change', () => { 
			this.selector._set_vilain_pos(); 
			this.grid.set_range(this.selector.get_range_name());
		this.range		= new Range(this.selector.get_range_name(), this.grid.get_range(this.selector.get_range_name()) );
			this.range.info.set_combo_info();
		} , false);

		this.selector.action.addEventListener('change', () => { 
			this.selector.action_has_changed(); 
			this.grid.set_range(this.selector.get_range_name()); 
		this.range		= new Range(this.selector.get_range_name(), this.grid.get_range(this.selector.get_range_name()) );
			this.range.info.set_combo_info();
		}, false);

		this.selector.stack_size.addEventListener('change', () => {  
			this.grid.set_range(this.selector.get_range_name()); 
		this.range		= new Range(this.selector.get_range_name(), this.grid.get_range(this.selector.get_range_name()) );
			this.range.info.set_combo_info();
		}, false);

		this.grid.set_range(this.selector.get_range_name());	
		this.range		= new Range(this.selector.get_range_name(), this.grid.get_range(this.selector.get_range_name()) );
		this.range.info.set_combo_info();

		//document.getElementbYId('range_slider').addEventListener(
	}
}
