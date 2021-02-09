function __init() {
	// Set action to the select range 
	this.selecteur.table_size.addEventListener('change', () => { 
		this.selecteur.table_size_has_changed(); 
		this.grid.set_range(this.selecteur.get_range_name());
	} , false);
	
	this.selecteur.hero_pos.addEventListener('change', () => { 
		this.selecteur._set_vilain_pos(); 
		this.grid.set_range(this.selecteur.get_range_name());
	} , false);

	this.selecteur.action.addEventListener('change', () => { 
		this.selecteur.action_has_changed(); 
		this.grid.set_range(this.selecteur.get_range_name()); 
	}, false);

	this.selecteur.stack_size.addEventListener('change', () => {  
		this.grid.set_range(this.selecteur.get_range_name()); 
	}, false);

	//document.getElementbYId('range_slider').addEventListener(
	this.grid.set_range(this.selecteur.get_range_name());	
	this.info_range.set_combo_info();
}
