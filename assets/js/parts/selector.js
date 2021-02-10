/**
 * Range Manager Selecteur
 *  **/

class RMSelector {

	constructor() {
		this.table_size		= document.getElementById('table_size');
		this.stack_size		= document.getElementById('stack_size');
		this.action				= document.getElementById('action_name');
		this.hero_pos			= document.getElementById('hero_pos');
		this.vilain_pos		= document.getElementById('vilain_pos'); 
		this.actions			= {};
		this.positions		= { hero: {}, vilain: {} };
		this.vs_isvisible = false; // show hide the versus select (vilain_pos)

		this.table_size_has_changed();	
		
	}

	// Set the HTML select position and action 
	table_size_has_changed() {

		// init value
		this._get_action_by_position();
		this._get_position_by_tablesize();

		// set value
		this.set_action();
		this.set_position();
		this.toggle_versus();
	}
	
	action_has_changed() {
		this._get_position_by_tablesize()
		this.set_position();
		this.toggle_versus();
		// hidde/show pannel 
		switch ( this.action.value ) {
			case 'rfi':
				document.getElementById('rfi').classList.remove('disable');
				document.getElementById('facingrfi').classList.add('disable');
				document.getElementById('bt_bvb').classList.add('disable');
				document.getElementById('action_bet').checked = true;
				break;
			case 'facingip':
			case 'facingoop':
				document.getElementById('rfi').classList.add('disable');
				document.getElementById('facingrfi').classList.remove('disable');
				document.getElementById('bt_bvb').classList.add('disable');
				document.getElementById('facing_flat').checked = true;
				break;
			case 'bvb':
				document.getElementById('rfi').classList.add('disable');
				document.getElementById('facingrfi').classList.add('disable');
				document.getElementById('bt_bvb').classList.remove('disable');
				document.getElementById('action_limpfold').checked = true;
				break;
		}
	}
	
	get_range_name() {
		var name	 = `${this.table_size.value}${this.hero_pos.value}${this.stack_size.value}${this.action.value}`;
		switch ( this.action.value ) {
			case 'facingip':
			case 'facingoop':
				name += this.vilain_pos.value;
				break;
		}
		return name;
	}

	set_action() {
		this._clear(this.action);
		for(var action in this.actions) {
			var item = document.createElement('option');
			item.value = action;
			item.innerHTML = this.actions[action];
			this.action.appendChild(item);
		}

	}

	set_position() {
		this._set_hero_pos();
		this._set_vilain_pos();
	}

	_set_hero_pos() {
		this.set_selecteur_options(this.hero_pos, this.positions.hero);
	}

	_set_vilain_pos() {
		this._get_position_by_tablesize();
		this.set_selecteur_options(this.vilain_pos, this.positions.vilain);
	}

	set_selecteur_options(select, positions) {

		this._clear(select);
		
		for(const name in positions) {
			var optgroup = document.createElement("optgroup");
			optgroup.label = name + " position";
			if ( positions[name].length > 0) {
				for(var v in positions[name]) {
					var option = document.createElement("option");
					var value = positions[name][v];
					option.value = value;
					option.innerHTML = value;
					optgroup.appendChild(option);
				}
				select.appendChild(optgroup);
			}	
		}
	}

	
	toggle_versus() {
		switch (this.action.value) {
			case 'rfi':
			case 'bvb':
				if( !this.vilain_pos.classList.contains('hidden') ) {
					this.vilain_pos.classList.add('hidden');
					document.getElementById('versuslabel').classList.add('hidden');
				}
				break;
			default:
				if ( this.vilain_pos.classList.contains('hidden') ) {
					this.vilain_pos.classList.remove('hidden');
					document.getElementById('versuslabel').classList.remove('hidden');
				}
		}
	}

	_clear(select) {
		select.innerHTML = '';
	}


	// Set possible actions
	//
	// TODO I dont think is the best way FIXME
	_get_action_by_position() {

		switch (this.table_size.value) {
			case '9':
				this.actions = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			case '8':
				this.actions = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			case '7':
				this.actions = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			case '6':
				this.actions = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			case '5':
				this.actions = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			case '4':
				this.actions = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			case '3':
				this.actions = { rfi: "RFI", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			case '2':
				this.actions = { bvb: "Blind vs Blind" };
				break;
		}
	
	}


	_get_position_by_tablesize() {

		switch (this.table_size.value) {
			case '9':
				this.positions.hero = { early: ["UTG", "UTG1", "UTG2"], middle: ["LJ", "HJ"], late: ["CO", "BT"] };	
				break;
			case '8':
				this.positions.hero = { early: ["UTG1", "UTG2"], middle: ["LJ", "HJ"], late: ["CO", "BT"] };	
				break;
			case '7':
				this.positions.hero = { early: ["UTG2"], middle: ["LJ", "HJ"], late: ["CO", "BT"] };	
				break;
			case '6':
				this.positions.hero = { early: ["LJ"], middle: ["HJ"], late: ["CO", "BT"] };
				break;
			case '5':
				this.positions.hero = { early: ["HJ"], middle: ["CO"], late: ["BT"] };
				break;
			case '4':
				this.positions.hero = { early: ["CO"], late: ["BT"] };
				break;
			case '3':
				this.positions.hero = { late: ["BT"] };
				break;
			case '2':
				this.positions.hero = { blind: ['Small Blind Strategy', 'BB vs SB Limp', 'BB vs SB Raise'] }
				break;
		} 

		switch (this.action.value) {
			case 'facingip':
				// vilain cant be at the same place of hero and behind him
				var stop = true; // Fixme it's probalby not good
				for(var i = 0; i < Object.keys(this.positions.hero).length && stop; i++) {
					var zone = Object.keys(this.positions.hero)[i];
					this.positions.vilain[zone] = [];
					for( var e = 0; e < this.positions.hero[zone].length; e++ ) {
						var position_name = this.positions.hero[zone][e];
						if ( position_name === this.hero_pos.value ) { stop = false; break; }
						else {
							this.positions.vilain[zone].push(position_name);
						}
					}	
				}
				// hero can't be the first
				var first_optgroup				= Object.keys(this.positions.hero)[0];
				this.positions.hero[first_optgroup]	= _.drop(this.positions.hero[first_optgroup]);
				break;
			case 'facingoop':
				this.positions.vilain = JSON.parse(JSON.stringify(this.positions.hero));
				this.positions.hero   = { blind: ['SB', 'BB'] };
				break;
			case 'bvb':
				this.positions.hero = { blind: ['Small Blind Strategy', 'BB vs SB Limp', 'BB vs SB Raise'] }
				break;
		}
		
	}


	
}
