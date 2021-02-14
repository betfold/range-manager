"use strict"; 

var range_manager = (function() {

	// load class
	/** 
 * A simple get/save range
 * **/

const RMDb = {


	save(name, range) {
		range = JSON.stringify(range);
		if ( range.length > 8 ) { localStorage.setItem( name, range); }
	},


	get(range_name) {
		return JSON.parse(localStorage.getItem(range_name));
	}

}
	/**
 *  The current range
 *
 *  saved_range store the original range
 *  we work on a clone of range on this.ranges
 *  **/

class Range {

	constructor(name) {
		this.name = name; // The id in base
		this.saved_range = RMDb.get(name);
		this.grid = new RMGrid();
		this.action = new RMAction(); 
		this.ranges;
		this.cards = [];
		this.alter = null;
		this.info;

		this._set_range();
	}

	_set_range() {
		this.ranges = JSON.parse(JSON.stringify(this.saved_range));
		this.card_list();
		this.info = new RangeInfo(this.ranges);
		this.info.set_combo_info();
		this.grid.set_range(this.ranges);
	}

	update_range() {
		this.alter = {};
		this.ranges = this.grid.get_range();
		this.info = new RangeInfo(this.ranges);
		this.info.set_combo_info(); 

		for(var action in this.ranges) {
			this.alter[action] = _.difference(this.ranges[action], this.saved_range[action]);
		}
	}

	get_range() { return this.ranges; }

	// return uniq list of card
	card_list() {
		for(var k in this.ranges) {
			this.ranges[k].forEach(e => this.cards.push(e))
		}
		this.cards = _.uniq(this.cards);
	}

}
	/**
 * Range Manager Selecteur
 *  **/

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
		var name	 = `${this.table_size.value}${this.hero_pos.value}${this.stack_size.value}${this.action.value}`;
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
	/** Grid Manager
 *
 * **/

class RMGrid {

	constructor(range) {
		this.grid	= document.getElementById('range_manager');
		this.set_range(range);
	}

	// Set the html grid with the range
	// range: id list  of cards in the range
	set_range(range) {
		this.reset_grid();
		if(range != null) {
			for(var action in range) {
				for(var i=0; i < range[action].length; i++) { 
					document.getElementById(range[action][i]).classList.add(action); 
				}
			}
		}
	}

	get_range() {
		var cells = this.grid.getElementsByTagName('td');
		var ranges = {};
		
		for(var n = 0, size = cells.length; n < size; n++) {
			
			var action_card = cells[n].className.split(' ');
			
			action_card.forEach(function(action_name) {
				switch ( action_name ) {
					case 'pair':
					case 'offsuit':
					case 'suited':
						break;
					default:
						if ( ! (action_name in ranges) ) { ranges[action_name] = []; }
						ranges[action_name].push(cells[n].id)
						break;
				}
			});
		}

		return ranges;
	}
	

	/* clean the html grid */
	reset_grid() {
		var grid = this.grid.rows;
		for(var i = 0; i < 13; i++) {
			var cols = grid[i].cells;
			for(var c = 0; c < 13; c++) {
				cols[c].className.split(' ').forEach(function(item) {
					switch ( item ) {
						case 'pair':
						case 'offsuit':
						case 'suited':
							break;
						default:
							cols[c].classList.remove(item);
							break;
					}
				});
			}
		}
		
	}

	// Return list of id hands selected
	// TODO change the html id of table hand to grid_mananger
	get_used_hand() {
		var rows = this.grid.getElementsByTagName('td');
		var hands = [];
		for ( var i = 0, n = rows.length; i < n; i++ ) {
			if ( rows[i].className.split(' ').length > 1 ) { hands.push( rows[i].id ); }
		}
		return hands;
	}

	get_card_by_action(action) {
		var cards = this.grid.getElementsByClassName(action);
		var c = [];
		for(var i=0; i < cards.length; i++) {
			c.push(cards[i].id);
		}
		return c;
	}
}
	const hand_combinations		= 1326;

// multiplacateur
const pair_combinations			= 6; 
const suited_combinations		= 4;
const offsuit_combinations	= 12;

const suited_pourcent		= suited_combinations / hand_combinations * 100;
const offsuit_pourcent	= offsuit_combinations / hand_combinations * 100;
const pair_pourcent			= pair_combinations / hand_combinations * 100;

/**
 *
 *  RangeInfo use the html hand grid for making stats
 *  TODO change this with class object of the current range
 *  **/

class RangeInfo {

	constructor(range) {
		this.screen		= document.getElementById('range_info');
		this.range		= range;
		this.pair			= 0;
		this.suited		= 0;
		this.offsuit	= 0;
		this.action2card	= {};
	}

	calcul_combo() {
		this.pair = 0;
		this.suited = 0;
		this.offsuit = 0;
		this.screen =  document.getElementById('range_info');
		var temp_cards	= []; // pour eviter les doublons 
		for(var action in this.range) {
			this.action2card[action] = { pourcent: 0, combos: 0 };
			var cards = this.range[action];
			for(var i in cards) {
				var card = cards[i];

				if(card[2] === "s") { 
					this.action2card[action].combos += suited_combinations;
					this.action2card[action].pourcent += suited_pourcent; 
				}
				else if(card[2] === "o") {
					this.action2card[action].combos += offsuit_combinations;
					this.action2card[action].pourcent += offsuit_pourcent;
				}
				else {
					this.action2card[action].combos += pair_combinations;
					this.action2card[action].pourcent += pair_pourcent;
				}

				if(!temp_cards.includes(card)) {
					temp_cards.push(card);
					if(card[2] === "s") { this.suited += 1; }
					else if(card[2] === "o") {	this.offsuit += 1; }
					else { this.pair += 1; }
				}
			}
		}
	}

	set_combo_info() {
		this.calcul_combo();
		var calcul = {
			pair: { pourcent: 0, combo: 0 },
			offsuit: { pourcent: 0, combo: 0 },
			suited: { pourcent: 0, combo: 0},
		}
		// the info for compare with slider
		var total_selected		= this.pair + this.suited + this.offsuit;		
		calcul.pair.combo			= this.pair * pair_combinations;
		calcul.offsuit.combo	= this.offsuit * offsuit_combinations;
		calcul.suited.combo		= this.suited * suited_combinations;

		calcul.pair.pourcent		= this.pair * pair_pourcent;
		calcul.offsuit.pourcent = this.offsuit * offsuit_pourcent;
		calcul.suited.pourcent	= this.suited * suited_pourcent;

		// clear info
		this.screen.innerHTML = '';

		// set stat by action
		for(var action in this.action2card) {	

			var stat  = this.action2card[action];

			this.screen.innerHTML += this.template_info_range(stat.pourcent.toFixed(2) + '%', action, stat.combos + ' combo', action);
		}
		
		// set global stat
		var totalc = calcul.pair.combo + calcul.offsuit.combo + calcul.suited.combo;
		var totalp = calcul.pair.pourcent + calcul.offsuit.pourcent + calcul.suited.pourcent;
		
		this.screen.innerHTML += this.template_info_range('TOTAL', totalp.toFixed(2) + '%', totalc + " combos", 'global_info_range');

		// set stat by type of cards
		for(var typeofcard in calcul) {
			this.screen.innerHTML += this.template_info_range(this[typeofcard] + " " + typeofcard, calcul[typeofcard].pourcent.toFixed(2) + "%", calcul[typeofcard].combo + " combos", typeofcard);
		}

		// FIXME change this
		// set the slider value
		var slider = document.getElementById('range_slider');
		slider.value = totalp;
	}


	template_info_range(first, second, three, classename) {
		return `<ul class="${classename}"><li>${first}</li><li>${second}</li><li>${three}</li></ul>`;
	}
}
	/**
 * @class
 * @classdesc Set the background color referer to the action to the grid
 */
class RMAction {
	/**
		* Get the grid.<HTMLElement> grid_manager
		*/  
	constructor() {
		this.grid = document.getElementById('range_manager');
		this.cells = this.grid.getElementsByTagName('td');
		this.rfi = document.getElementById('rfi');
		this.facingrfi = document.getElementById('facingrfi');
		this.bvb = document.getElementById('bt_bvb');
	}
	
	cells() {
		return this.cells;
	}

	set_action_to_card(card_id) {
		console.log('set action card');
		var bts = document.getElementsByName('sel');
		for(var i = 0; i < bts.length; i++) {
			if(bts[i].checked) {
				var action = bts[i].value;
				this.card_toggle_class(card_id, action)
			}
		}
	}
	/**
	 * Set the visibility to the good pannel action
	 * @param { String } action
	 */
	action_visibility(action) {

		switch ( action ) {
			case 'rfi':
				if ( this.rfi.classList.contains('disable') ) this.rfi.classList.remove('disable');
				if ( ! this.facingrfi.classList.contains('disable') )	this.facingrfi.classList.add('disable');
				if ( ! this.bvb.classList.contains('disable') )	this.bvb.classList.add('disable');
				document.getElementById('action_bet').checked = true;
				break;
			case 'facingip':
			case 'facingoop':
				if ( ! this.rfi.classList.contains('disable') ) this.rfi.classList.add('disable');
				if ( this.facingrfi.classList.contains('disable') )	this.facingrfi.classList.remove('disable');
				if ( ! this.bvb.classList.contains('disable') )	this.bvb.classList.add('disable');
				document.getElementById('facing_flat').checked = true;
				break;
		}
		if ( action === 'bvb') {
			var value = document.getElementById('rs').shadowRoot.getElementById('positions').value;
			switch (value) {
				case 'Small Blind Strategy':
					if ( ! this.rfi.classList.contains('disable') ) this.rfi.classList.add('disable');
					if ( ! this.facingrfi.classList.contains('disable') )	this.facingrfi.classList.add('disable');
					if ( this.bvb.classList.contains('disable') )	this.bvb.classList.remove('disable');
					document.getElementById('action_limpfold').checked = true;
					break;
				case 'BB vs SB Limp':
					document.getElementById('action_bet').checked = true;
					if ( this.rfi.classList.contains('disable') ) this.rfi.classList.remove('disable');
					if ( ! this.facingrfi.classList.contains('disable') )	this.facingrfi.classList.add('disable');
					if ( ! this.bvb.classList.contains('disable') )	this.bvb.classList.add('disable');
					document.getElementById('action_bet').checked = true;
					break;
				case 'BB vs SB Raise':
					if ( ! this.rfi.classList.contains('disable') ) this.rfi.classList.add('disable');
					if ( this.facingrfi.classList.contains('disable') )	this.facingrfi.classList.remove('disable');
					if ( ! this.bvb.classList.contains('disable') )	this.bvb.classList.add('disable');
					document.getElementById('facing_flat').checked = true;
					break;
			}

		}
	}

	card_toggle_class(idcard, action) {
		var card = document.getElementById(idcard)
		if (card.classList.contains(action)) {
			this.remove_card_value(card, action);
		}
		else { this.add_card_value(card, action); }
	}

	remove_card_value(card, value) {
		card.classList.remove(value);
	}
		
	// Reset card
	grid_set_hh_to_unset(hhid) {
		var hh = document.getElementById(hhid);
		hh.className = hh.className.split(' ')[0]; // Keep the first classname (pair, suited, offsuit)
	}

	add_card_value(card, value) {
		
		switch(value) {
			case "flat3bet":
			case "fourbet":
			case "flat5bet":
				if(!card.classList.contains('bet')) { card.classList.add('bet'); }
				card.classList.remove("flat3bet", "fourbet", "flat5bet", "allin");
				break;		
			case "allin":
				card.classList.remove("bet", "flat3bet", "fourbet", "flat5bet", "threebet", "flat4bet", "flat", "fivebet");
				break;
			case "bet":
				card.classList.remove("allin");
				break;
			case "flat":
				card.classList.remove("threebet", "allin");
				break;
			case "threebet":
				card.classList.remove("flat");
				break;
			case "flat4bet":
			case "fivebet":
				card.classList.remove("flat");
				card.classList.add("threebet");
				break;
			case 'limpfold':
			case 'limpcall':
			case 'limpraise':
			case 'raisefold':
			case 'raisecall':
				card.classList.remove("limpfold", "limpcall", "limpraise", "raisefold", "raisecall");
				break;
				
		}

		card.classList.add(value)
	}

}
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

	// load function
	//source https://www.gamblingsites.org/poker/texas-holdem/starting-hand-rankings/
// holdmem have a grid of 169 pf hand 
// TODO fixe the correct pourcentage win value
// is not a json file in fact !!
var rank_holdem = {
	"1": { "hand": "AA", "win_pourcentage": "31" },
	"2": { "hand": "KK", "win_pourcentage": "26" },
	"3": { "hand": "QQ", "win_pourcentage": "22" },
	"4": { "hand": "AKs", "win_pourcentage": "20.20" },
	"5": { "hand": "JJ", "win_pourcentage": "19.10" },
	"6": { "hand": "AQs", "win_pourcentage": "18.70" },
	"7": { "hand": "KQs", "win_pourcentage": "18.10" },
	"8": { "hand": "AJs", "win_pourcentage": "17.50" },
	"9": { "hand": "KJs", "win_pourcentage": "31" },
	"10": { "hand": "TT", "win_pourcentage": "31" },
	"11": { "hand": "AKo", "win_pourcentage": "31" },
	"12": { "hand": "ATs", "win_pourcentage": "31" },
	"13": { "hand": "QJs", "win_pourcentage": "31" },
	"14": { "hand": "KTs", "win_pourcentage": "31" },
	"15": { "hand": "QTs", "win_pourcentage": "31" },
	"16": { "hand": "JTs", "win_pourcentage": "31" },
	"17": { "hand": "99", "win_pourcentage": "31" },
	"18": { "hand": "AQs", "win_pourcentage": "31" },
	"19": { "hand": "A9s", "win_pourcentage": "31" },
	"20": { "hand": "KQo", "win_pourcentage": "31" },
	"21": { "hand": "88", "win_pourcentage": "31" },
	"22": { "hand": "K9s", "win_pourcentage": "31" },
	"23": { "hand": "T9s", "win_pourcentage": "31" },
	"24": { "hand": "A8s", "win_pourcentage": "31" },
	"25": { "hand": "Q9s", "win_pourcentage": "31" },
	"26": { "hand": "J9s", "win_pourcentage": "31" },
	"27": { "hand": "AJo", "win_pourcentage": "31" },
	"28": { "hand": "A5s", "win_pourcentage": "31" },
	"29": { "hand": "77", "win_pourcentage": "31" },
	"30": { "hand": "A7s", "win_pourcentage": "31" },
	"31": { "hand": "KJo", "win_pourcentage": "31" },
	"32": { "hand": "A4s", "win_pourcentage": "31" },
	"33": { "hand": "A3s", "win_pourcentage": "31" },
	"34": { "hand": "A6s", "win_pourcentage": "31" },
	"35": { "hand": "QJo", "win_pourcentage": "31" },
	"36": { "hand": "66", "win_pourcentage": "31" },
	"37": { "hand": "K8s", "win_pourcentage": "31" },
	"38": { "hand": "T8s", "win_pourcentage": "31" },
	"39": { "hand": "A2s", "win_pourcentage": "31" },
	"40": { "hand": "98s", "win_pourcentage": "31" },
	"41": { "hand": "J8s", "win_pourcentage": "31" },
	"42": { "hand": "ATo", "win_pourcentage": "31" },
	"43": { "hand": "Q8s", "win_pourcentage": "31" },
	"44": { "hand": "K7s", "win_pourcentage": "31" },
	"45": { "hand": "KTo", "win_pourcentage": "31" },
	"46": { "hand": "55", "win_pourcentage": "31" },
	"47": { "hand": "JTo", "win_pourcentage": "31" },
	"48": { "hand": "87s", "win_pourcentage": "31" },
	"49": { "hand": "QTo", "win_pourcentage": "31" },
	"50": { "hand": "44", "win_pourcentage": "31" },
	"51": { "hand": "33", "win_pourcentage": "31" },
	"52": { "hand": "22", "win_pourcentage": "31" },
	"53": { "hand": "K6s", "win_pourcentage": "31" },
	"54": { "hand": "97s", "win_pourcentage": "31" },
	"55": { "hand": "K5s", "win_pourcentage": "31" },
	"56": { "hand": "76s", "win_pourcentage": "31" },
	"57": { "hand": "T7s", "win_pourcentage": "31" },
	"58": { "hand": "K4s", "win_pourcentage": "31" },
	"59": { "hand": "K3s", "win_pourcentage": "31" },
	"60": { "hand": "K2s", "win_pourcentage": "31" },
	"61": { "hand": "Q7s", "win_pourcentage": "31" },
	"62": { "hand": "86s", "win_pourcentage": "31" },
	"63": { "hand": "65s", "win_pourcentage": "31" },
	"64": { "hand": "J7s", "win_pourcentage": "31" },
	"65": { "hand": "54s", "win_pourcentage": "31" },
	"66": { "hand": "Q6s", "win_pourcentage": "31" },
	"67": { "hand": "75s", "win_pourcentage": "31" },
	"68": { "hand": "96s", "win_pourcentage": "31" },
	"69": { "hand": "Q5s", "win_pourcentage": "31" },
	"70": { "hand": "65s", "win_pourcentage": "31" },
	"71": { "hand": "Q4s", "win_pourcentage": "31" },
	"72": { "hand": "Q3s", "win_pourcentage": "31" },
	"73": { "hand": "T9o", "win_pourcentage": "31" },
	"74": { "hand": "T6s", "win_pourcentage": "31" },
	"75": { "hand": "Q2s", "win_pourcentage": "31" },
	"76": { "hand": "A9o", "win_pourcentage": "31" },
	"77": { "hand": "53s", "win_pourcentage": "31" },
	"78": { "hand": "85s", "win_pourcentage": "31" },
	"79": { "hand": "J6s", "win_pourcentage": "31" },
	"80": { "hand": "J9s", "win_pourcentage": "31" },
	"81": { "hand": "K9o", "win_pourcentage": "31" },
	"82": { "hand": "J5s", "win_pourcentage": "31" },
	"83": { "hand": "Q9o", "win_pourcentage": "31" },
	"84": { "hand": "43s", "win_pourcentage": "31" },
	"85": { "hand": "74s", "win_pourcentage": "31" },
	"86": { "hand": "J4s", "win_pourcentage": "31" },
	"87": { "hand": "J3s", "win_pourcentage": "31" },
	"88": { "hand": "95s", "win_pourcentage": "31" },
	"89": { "hand": "J2s", "win_pourcentage": "31" },
	"90": { "hand": "63s", "win_pourcentage": "31" },
	"91": { "hand": "A8o", "win_pourcentage": "31" },
	"92": { "hand": "52s", "win_pourcentage": "31" },
	"93": { "hand": "T5s", "win_pourcentage": "31" },
	"94": { "hand": "84s", "win_pourcentage": "31" },
	"95": { "hand": "T4s", "win_pourcentage": "31" },
	"96": { "hand": "T3s", "win_pourcentage": "31" },
	"97": { "hand": "42s", "win_pourcentage": "31" },
	"98": { "hand": "T2s", "win_pourcentage": "31" },
	"99": { "hand": "98o", "win_pourcentage": "31" },
	"100": { "hand": "T8o", "win_pourcentage": "31" },
	"101": { "hand": "A5o", "win_pourcentage": "31" },
	"102": { "hand": "A7o", "win_pourcentage": "31" },
	"103": { "hand": "73s", "win_pourcentage": "31" },
	"104": { "hand": "A4o", "win_pourcentage": "31" },
	"105": { "hand": "32s", "win_pourcentage": "31" },
	"106": { "hand": "94s", "win_pourcentage": "31" },
	"107": { "hand": "93s", "win_pourcentage": "31" },
	"108": { "hand": "J8o", "win_pourcentage": "31" },
	"109": { "hand": "A3o", "win_pourcentage": "31" },
	"110": { "hand": "62s", "win_pourcentage": "31" },
	"111": { "hand": "92s", "win_pourcentage": "31" },
	"112": { "hand": "K8o", "win_pourcentage": "31" },
	"113": { "hand": "A6o", "win_pourcentage": "31" },
	"114": { "hand": "87o", "win_pourcentage": "31" },
	"115": { "hand": "Q8o", "win_pourcentage": "31" },
	"116": { "hand": "83o", "win_pourcentage": "31" },
	"117": { "hand": "A2o", "win_pourcentage": "31" },
	"118": { "hand": "82s", "win_pourcentage": "31" },
	"119": { "hand": "97o", "win_pourcentage": "31" },
	"120": { "hand": "72s", "win_pourcentage": "31" },
	"121": { "hand": "76o", "win_pourcentage": "31" },
	"122": { "hand": "K7o", "win_pourcentage": "31" },
	"123": { "hand": "65o", "win_pourcentage": "31" },
	"124": { "hand": "T7o", "win_pourcentage": "31" },
	"125": { "hand": "K6o", "win_pourcentage": "31" },
	"126": { "hand": "86o", "win_pourcentage": "31" },
	"127": { "hand": "54o", "win_pourcentage": "31" },
	"128": { "hand": "K5o", "win_pourcentage": "31" },
	"129": { "hand": "J7o", "win_pourcentage": "31" },
	"130": { "hand": "75o", "win_pourcentage": "31" },
	"131": { "hand": "Q7o", "win_pourcentage": "31" },
	"132": { "hand": "K4o", "win_pourcentage": "31" },
	"133": { "hand": "K3o", "win_pourcentage": "31" },
	"134": { "hand": "96o", "win_pourcentage": "31" },
	"135": { "hand": "K2o", "win_pourcentage": "31" },
	"136": { "hand": "64o", "win_pourcentage": "31" },
	"137": { "hand": "Q6o", "win_pourcentage": "31" },
	"138": { "hand": "53o", "win_pourcentage": "31" },
	"139": { "hand": "85o", "win_pourcentage": "31" },
	"140": { "hand": "T6o", "win_pourcentage": "31" },
	"141": { "hand": "Q5o", "win_pourcentage": "31" },
	"142": { "hand": "43o", "win_pourcentage": "31" },
	"143": { "hand": "Q4o", "win_pourcentage": "31" },
	"144": { "hand": "Q3o", "win_pourcentage": "31" },
	"145": { "hand": "74o", "win_pourcentage": "31" },
	"146": { "hand": "Q2o", "win_pourcentage": "31" },
	"147": { "hand": "J6o", "win_pourcentage": "31" },
	"148": { "hand": "63o", "win_pourcentage": "31" },
	"149": { "hand": "J5o", "win_pourcentage": "31" },
	"150": { "hand": "95o", "win_pourcentage": "31" },
	"151": { "hand": "52o", "win_pourcentage": "31" },
	"152": { "hand": "J4o", "win_pourcentage": "31" },
	"153": { "hand": "J3o", "win_pourcentage": "31" },
	"154": { "hand": "42o", "win_pourcentage": "31" },
	"155": { "hand": "J2o", "win_pourcentage": "31" },
	"156": { "hand": "84o", "win_pourcentage": "31" },
	"157": { "hand": "T5o", "win_pourcentage": "31" },
	"158": { "hand": "T4o", "win_pourcentage": "31" },
	"159": { "hand": "32o", "win_pourcentage": "31" },
	"160": { "hand": "T3o", "win_pourcentage": "31" },
	"161": { "hand": "73o", "win_pourcentage": "31" },
	"162": { "hand": "T2o", "win_pourcentage": "31" },
	"163": { "hand": "62o", "win_pourcentage": "31" },
	"164": { "hand": "94o", "win_pourcentage": "31" },
	"165": { "hand": "93o", "win_pourcentage": "31" },
	"166": { "hand": "92o", "win_pourcentage": "31" },
	"167": { "hand": "83o", "win_pourcentage": "31" },
	"168": { "hand": "82o", "win_pourcentage": "31" },
	"169": { "hand": "72o", "win_pourcentage": "31" }
}

/**
 * @class
 * @classdesc 
 * update the pourcent of selected hands on the grid
 * the default action set to card is always the first possible action
 */
class RMSlider {

	constructor() {
		this.slider			= document.getElementById('range_slider');
	}

	change(handsingrid, action) {
		// 
		var slider_want = Math.round(169 * this.slider.value / 100);
		var grid_have		= handsingrid.length;
		
		//var randum_nhand = Math.floor( Math.random() * 100 + 1 )
		//console.log(`debug affichage de d'une main random ${rank_holdem[randum_nhand].hand} numéro ${randum_nhand}`);
		
		if ( slider_want > grid_have ) {
			var total2added = slider_want - grid_have;
			for(var cpt = 0, i = 1; i <= 169; i++) {
				if ( cpt === total2added ) { break; }
				var hh = rank_holdem[i];
				if ( !handsingrid.includes(hh.hand) ) {
					// FIXME By the hell how this can works !
					action.set_action_to_card( hh.hand );

					cpt += 1;	
				}
			}
		}
		else {
			var total2remove = grid_have - slider_want;
			for ( cpt = 0, i = 169; i > 0; i--) {
				if ( cpt === total2remove ) { break; }
				hh = rank_holdem[i];
				if ( handsingrid.includes(hh.hand) ) {
					var hid = handsingrid.indexOf(hh.hand);
					hid = handsingrid.splice(hid, 1)
					action.grid_set_hh_to_unset(hid);
					cpt += 1;
				}
			}
		}
	}
}
	

	/** 
 * author: E.p 
 * **/
class PRM {

	constructor() {
		this.selector = new RMSelector();
		this.range		= new Range(this.selector.get_range_name());
		this.options  = new GridAlter();
		this.slider	  = new RMSlider();
	
		this.set_eventListener();
	}


	set_eventListener() {
		this.range.action.action_visibility(this.selector.action.value);

		// Set event action to the select range 
		this.selector.table_size.addEventListener('change', () => { 
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
			this.range.action.action_visibility(this.selector.action.value);
		} , false);
		
		this.selector.hero_pos.addEventListener('change', () => { 
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
			this.range.action.action_visibility(this.selector.action.value);
		} , false);

		this.selector.action.addEventListener('change', () => { 
			this.range		= new Range(this.selector.get_range_name());
			this.options.reset(this.selector.get_range_name());
			this.range.action.action_visibility(this.selector.action.value);
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
			this.slider.change(this.range.grid.get_used_hand(), this.range.action);
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


	return new PRM();

})();

