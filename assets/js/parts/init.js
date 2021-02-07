function __init() {
	// Set action to the select range 
	this.selecteur.table_size.addEventListener('change', () => { this.selecteur.table_size_has_changed(); set_range();} , false);
	this.selecteur.hero_pos.addEventListener('change', () => { this.selecteur._set_vilain_pos();set_range();} , false);
	this.selecteur.action.addEventListener('change', () => { this.selecteur.action_has_changed(); set_range(); }, false);
	this.selecteur.stack_size.addEventListener('change', () => {  set_range(); }, false);

	set_range();	
}
