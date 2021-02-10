/** 
 * author: E.p 
 * **/
class PRM {

	constructor() {
		this.selector = new RMSelector();
		this.range		= new Range(this.selector.get_range_name());
	
		this.set_eventListener();
	}


	set_eventListener() {

		// Set event action to the select range 
		this.selector.table_size.addEventListener('change', () => { 
			this.range		= new Range(this.selector.get_range_name());
			this.selector.table_size_has_changed(); 
		} , false);
		
		this.selector.hero_pos.addEventListener('change', () => { 
			this.range		= new Range(this.selector.get_range_name());
			this.selector._set_vilain_pos(); 
		} , false);

		this.selector.action.addEventListener('change', () => { 
			this.range		= new Range(this.selector.get_range_name());
			this.selector.action_has_changed(); 
		}, false);

		this.selector.stack_size.addEventListener('change', () => {  
			this.range		= new Range(this.selector.get_range_name());
		}, false);

		document.getElementById('range_slider').addEventListener('change', () => {
			slider_on_change(this.range.cards, this.action);
		}, false);
	}
}
