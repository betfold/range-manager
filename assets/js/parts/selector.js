/**
 * Range Manager Selecteur
 *  **/

{% include 'wc_selector.js' %}

class RMSelector {

	constructor() {
		this.range_selector = document.getElementById('rs');
		this.table_size		= this.range_selector.shadowRoot.getElementById('tables');
		this.stack_size		= this.range_selector.shadowRoot.getElementById('stack_size');
		this.action				= this.range_selector.shadowRoot.getElementById('actions');
		this.hero_pos			= this.range_selector.shadowRoot.getElementById('positions');
		this.vilain_pos		= this.range_selector.shadowRoot.getElementById('versus_positions'); 

		
	}

	
	get_range_name() {
		let name	 = `${this.table_size.value}${this.hero_pos.value}${this.stack_size.value}${this.action.value}`;
		switch ( this.action.value ) {
			case 'facingip':
			case 'facingoop':
				name += this.vilain_pos.value;
				break;
		}
		console.log(`nom de la range ${name}`);
		return name;
	}

		
	
	
}
