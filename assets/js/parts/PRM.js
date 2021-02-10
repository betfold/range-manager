/** 
 * author: E.p 
 * **/
class PRM {

	constructor() {
		this.selector = new RMSelector();
		this.range		= new Range(this.selector.get_range_name());
		this.options = new GridAlter();
		this.copy = null;
	
		this.set_eventListener();
	}


	set_eventListener() {

		// Set event action to the select range 
		this.selector.table_size.addEventListener('change', () => { 
			this.selector.table_size_has_changed(); 
			this.selector.action_has_changed(); 
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
		} , false);
		
		this.selector.hero_pos.addEventListener('change', () => { 
			this.selector._set_vilain_pos(); 
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
		} , false);

		this.selector.action.addEventListener('change', () => { 
			this.selector.action_has_changed(); 
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
		}, false);

		this.selector.stack_size.addEventListener('change', () => {  
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
		}, false);

		this.selector.vilain_pos.addEventListener('change', () => {
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
		}, false);

		// Slider event
		document.getElementById('range_slider').addEventListener('change', () => {
			slider_on_change(this.range.cards, this.range.action);
			this.range.update_range();
		}, false);

		// Card on grid event
		for(var i = 0, n = this.range.action.cells.length; i < n; i++) {
			var cell = this.range.action.cells[i];
			cell.addEventListener('click', (e) => {
				this.range.action.set_action_to_card(e.target.id);
				this.options.range_change();
				this.range.update_range();
			}, false);
		}

		// Set action on save
		document.getElementById('grid_save').addEventListener('click', () => {
			RMDb.save(this.selector.get_range_name(), this.range.grid.get_range());
			this.options.reset(this.selector.get_range_name());
			this.range.saved_range = this.range.grid.get_range();
		}, false);

		document.getElementById('grid_copy').addEventListener('click', () => {
			this.options.copy_range(this.selector.get_range_name(), this.range.grid.get_range());
		}, false);

		document.getElementById('grid_undo').addEventListener('click', () => {
			this.range.grid.set_range(this.range.saved_range);
			this.options.reset(this.selector.get_range_name())	
		}, false);

		document.getElementById('grid_paste').addEventListener('click', () => {
			this.range.grid.set_range(this.options.range);
			this.options.paste();
		}, false);
	}

}
