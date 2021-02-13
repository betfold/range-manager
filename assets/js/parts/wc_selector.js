// WebComponent
// It's the Select range - 

// FIXME the value of id are not const !
const TableSizePosition = {
	tables_size: [2, 3, 4, 5, 6, 7, 8, 9],
	tables: { 
		2: { blind: ['Small Blind Strategy', 'BB vs SB Limp', 'BB vs SB Raise'] },
		3: { late: ["BT"] },
		4: { early: ["CO"], late: ["BT"] },
		5: { early: ["HJ"], middle: ["CO"], late: ["BT"] },
		6: { early: ["LJ"], middle: ["HJ"], late: ["CO", "BT"] },
		7: { early: ["UTG2"], middle: ["LJ", "HJ"], late: ["CO", "BT"] },
		8: { early: ["UTG1", "UTG2"], middle: ["LJ", "HJ"], late: ["CO", "BT"] },
		9: { early: ["UTG", "UTG1", "UTG2"], middle: ["LJ", "HJ"], late: ["CO", "BT"] } 
	},
	get_table: function(size) { return JSON.parse(JSON.stringify(this.tables[size])); },
}

const StackSize = ["12-20bb", "25-50bb", "70-100bb"];

const range_selector_template = document.createElement('template');
range_selector_template.innerHTML = `
<div id="range_selector">
	<select id="tables"></select>
	<select id="stack_size"></select>
	<select id="actions"></select>
	<select id="positions"></select>
	<span id="g_versus">
		<label>Versus</label>
		<select id="versus_positions"></select>
	</span>
</div>
<style>
.hidden { display: none; }
select { box-shadow: 1px 1px 1px; }
</style>
`;

class SelectRange extends HTMLElement {
	constructor() {
		super();
		this._rselector = this.attachShadow({mode: 'open' });
		this._rselector.appendChild(range_selector_template.content.cloneNode(true));

		this.tables			= this._rselector.getElementById('tables');
		this.stack_size	= this._rselector.getElementById('stack_size');
		this.actions		= this._rselector.getElementById('actions');
		this.positions	= this._rselector.getElementById('positions');
		this.versus_positions = this._rselector.getElementById('versus_positions');
		this.versus_screen = this._rselector.getElementById('g_versus');

		this.hero_pos_list = {};
		this.vilain_pos_list = {};


		this.set_table();
		this.set_stack_size();
		this.set_action();
		this.set_position();
		this.setOnChange();
	}

	setOnChange() {
		this.tables.addEventListener('change', () => {
			this.tables_change();
		}, false);
		this.actions.addEventListener('change', () => {
			this.set_position();
		}, false);
		this.positions.addEventListener('change', () => {
			this._set_versus_pos();	
		}, false);
	}

	tables_change() {
		this.set_action();
		this.set_position();
	}

	set_table() {
		for(var i of TableSizePosition.tables_size) {
			this.tables.innerHTML += `<option value="${i}">${i}-max</option>`;
		}
	}

	// wooot that's coming to suck
	// TODO change the format of name range
	set_stack_size() {
		this.stack_size.innerHTML = '';
		StackSize.forEach(el => {
			var value = el.split('-').join('#').split('')
			value = value.splice(0, (el.length -2)).join('');
			this.stack_size.innerHTML += `<option value="${value}">${el}</option>`
		});	
	}

	set_action() {
		var actions = '';
		switch ( this.tables.value ) {
			case '2':
				actions = { bvb: "Blind vs Blind" };
				break;
			case '3':
				actions = { rfi: "RFI", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
			default:
				actions = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
				break;
		}	
		this.actions.innerHTML = '';
		for(const [k, v] of Object.entries(actions)) { 
			this.actions.innerHTML += `<option value="${k}">${v}</option>`;
		}
	}

	set_position() {
		this._set_hero_pos();
		this._set_versus_pos();
	}


	_set_hero_pos() {
		this.set_hero_pos_list();
		this.set_selecteur_options(this.positions, this.hero_pos_list);
	}

	_set_versus_pos() {
		this.set_versus_pos_list();
		this.set_selecteur_options(this.versus_positions, this.vilain_pos_list);
	}

	set_selecteur_options(select, positions) {

		select.innerHTML = '';
		
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

	set_versus_pos_list() {

		const l = TableSizePosition.get_table(this.tables.value);

		this.vilain_pos_list = {};

		switch (this.actions.value) {
			case 'facingip':
				for(const zone in l) {
					var n = false;
					for( var position_name of l[zone] ) {
						if ( position_name === this.positions.value ) 
							{  n = true; break; }
						else {
							if (!(zone in this.vilain_pos_list)) this.vilain_pos_list[zone] = [];
							this.vilain_pos_list[zone].push(position_name);
						}
					}
					if (n ) break;	
				}
				break;
			case 'facingoop':
				this.vilain_pos_list = l;
				break;
		}
	
	}

	// set the hero pos list and set visibilty on versus if needed
	set_hero_pos_list() {
		this.hero_pos_list = TableSizePosition.get_table(this.tables.value);
		switch (this.actions.value) {
			case 'facingip':
				// hero can't be the first
				var first_optgroup				= Object.keys(this.hero_pos_list)[0];
				this.hero_pos_list[first_optgroup]	= _.drop(this.hero_pos_list[first_optgroup]);
				if (  this.versus_screen.classList.contains('hidden') ) { this.versus_screen.classList.remove('hidden'); }
				break;
			case 'facingoop':
				this.hero_pos_list   = { blind: ['SB', 'BB'] };
				if (  this.versus_screen.classList.contains('hidden') ) { this.versus_screen.classList.remove('hidden'); }
				break;
			case 'bvb':
				this.hero_pos_list = { blind: ['Small Blind Strategy', 'BB vs SB Limp', 'BB vs SB Raise'] }
				if ( ! this.versus_screen.classList.contains('hidden') ) { this.versus_screen.classList.add('hidden'); }
				break;
			case 'rfi':
				if ( ! this.versus_screen.classList.contains('hidden') ) { this.versus_screen.classList.add('hidden'); }
				break;				
		}
	}

}

window.customElements.define('select-range', SelectRange);
