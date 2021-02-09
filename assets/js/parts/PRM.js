/** 
 * author: E.p 
 * **/
class PRM {

	constructor() {
		this.selector = new RMSelector();
		this.grid			= new RMGrid();
		this.range_info = new RangeInfo(this.grid.get_range(this.selector.get_range_name()));	
		this.action			= new RMAction();
	}

	update_screen() {
		this.range_info.set_combo_info();
	}

	
}
