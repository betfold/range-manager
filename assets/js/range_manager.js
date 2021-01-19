var range_manager = (function() {


	var ui = {
	classname_to_remove: "bet flat3bet fourbet flat5bet allin flat threebet flat4bet fivebet limpfold limpcall raisefold limpraise raisecall",
	actions: {
		rfi:        ["bet", "flat3bet", "fourbet", "flat5bet", "allin"],
		facingrfi:  ["flat", "threebet", "flat4bet", "fivebet", "allin"],
		bvb:        ["limpfold", "limpcall", "raisefold", "limpraise", "raisecall", "allin"]
		},
	selected_hands: {},
	info_range: {
		pair: 0,
		suited: 0,
		offsuit: 0,
		},
}

var selecteur = {
	6: 
		{
			table_size: 6,
			table_name: "6-max",
			position: { early: ["LJ"], middle: ["HJ"], late:["CO", "BT"], blind: ["SB", "BB"] }
		},
	9:
		{
			table_size: 9,
			table_name: "9-max",
			position: { early: ["UTG", "UTG1", "UTG2"], middle: ["HJ", "LJ"], late:["CO", "BT"], blind: ["SB", "BB"] } ,
		},
	2: 
		{
			table_size: 2,
			table_name: "HU",
			position: { blind: ["SB", "BB"] }
		},

	4:
		{
			table_size: 4,
			table_name: "4-handed",
			position: { early: ["CO"], late:["BT"], blind: ["SB", "BB"] },
		},
	3:
		{
			table_size: 3,
			table_name: '3-handed',
			position: { late: ["BT"], blind: ['SB', 'BB'] }
		},
	


	get_position: function() { return document.getElementById('position'); },
	current_id: function() { return document.getElementById('max').value; }, 
	current_pos: function() { return document.getElementById('position').value; },
	current_action: function() { return document.getElementById('action').value; },
	set_position: function() { set_position(); },
}
	function save_range() {
	var ranges = {};
	
	for(var pos in ui.actions) {
		for(var i in ui.actions[pos]) {
			var action = ui.actions[pos][i];
			var combos = get_card_by_action(action);
			if ( combos.length > 0 ) {
				ranges[action] = [];
				Array.prototype.push.apply(ranges[action], combos);
			}
		}
	}
	localStorage.setItem(get_range_name(), JSON.stringify(ranges));
}

function set_range() {
	clear_range();
	var name   = get_range_name();
	var ranges = JSON.parse(localStorage.getItem(name));
	var ac     = ui.classname_to_remove;
	ac         = ac.split(' ');
	if(ranges != null) {
		for(var action in ranges) {
			for(var i=0; i < ranges[action].length; i++) { 
				if(ac.includes(action)) {
					document.getElementById(ranges[action][i]).classList.add(action); 
				}
			}
		}
	}
}

/* clean the html grid */
function clear_range() {
	var grid = document.getElementById('range_manager').rows;
	for(var i = 0; i < 13; i++) {
		var cols = grid[i].cells;
		for(var c = 0; c < 13; c++) {
			// fixme have some error when I want to use ui.classname_to_remove or ui.actions.rfi.join(", ") or whatever you want to create this
			cols[c].classList.remove("bet", "threebet", "fourbet", "fivebet", "flat", "flat3bet", "falt4bet", "flat5bet", "allin", "limp", "limpfold", "limpcall", "limp3bet");
		}
	}
	
}

function get_card_by_action(action) {
	var rm = document.getElementById("range_manager");
	var cards = rm.getElementsByClassName(action);
	var c = [];
	for(var i=0; i < cards.length; i++) {
		c.push(cards[i].id);
	}
	return c;
}

	
function set_action_to_card(card_id) {

	var bts = document.getElementsByName('sel');
	for(var i = 0; i < bts.length; i++) {
		if(bts[i].checked) {
			var action = bts[i].value;
			card_toggle_class(card_id, action)
		}
	}
	
}
	

function card_toggle_class(idcard, action) {
	var card = document.getElementById(idcard)
	if (card.classList.contains(action)) {
		remove_card_value(card, action);
	}
	else { add_card_value(card, action); }
}

function remove_card_value(card, value) {
	card.classList.remove(value);
}
	

function add_card_value(card, value) {
	card.classList.add(value)
}





	function set_position() {
	var sel = selecteur.get_position();
	var max = selecteur.current_id()
	var pos = selecteur[max].position;
	set_selecteur_pos(sel, pos);
}

function set_versus_pos() {
	var sel = document.getElementById("versus");
	var max = selecteur.current_id();
	var pos = selecteur[max].position;
	set_selecteur_pos(sel, pos);
}

function set_selecteur_pos(sel, pos) {

	clear_select(sel);
	for(const name in pos) {
		var optgroup = document.createElement("optgroup");
		optgroup.label = name + " position";
		for(var v in pos[name]) {
			var option = document.createElement("option");
			var value = pos[name][v];
			option.value = value;
			option.innerHTML = value;
			optgroup.appendChild(option);
		}
		sel.appendChild(optgroup);
	}	
}


function clear_select(select) {
	var optgroup = select.getElementsByTagName("optgroup");
	var option = select.getElementsByTagName("option");
	var size = optgroup.length;
	for(var i = 0; i < size; i++) { optgroup[0].remove(); }
	size = option.length;
	for(i = 0; i < size; i++) { select.remove(0); }
}


function get_range_name() {
	var name = document.getElementById('max').value;
	name += document.getElementById('position').value;
	name += document.getElementById('bb').value;
	var action = document.getElementById('action').value;		
	name+= action
	if (action == "facing")	{  name+= document.getElementById('versus').value; }
	return name;
}

function togle_versus_selecteur() {
	var action_selected = document.getElementById('action').value;
	var versus_s = document.getElementById('versus');
	var versus_l = document.getElementById('versuslabel');
	var versus_ar = document.getElementById('rfi');
	var versus_af = document.getElementById('facingrfi');

	if (action_selected == "rfi") {
		document.getElementById('action_bet').checked = true;
		versus_s.classList.add('hidden');
		versus_l.classList.add('hidden');
		versus_af.classList.add('disable');
		versus_ar.classList.remove('disable');
	} 
	else {
		set_versus_pos();
		document.getElementById('facing_flat').checked = true;
		versus_s.classList.remove('hidden');
		versus_l.classList.remove('hidden');
		versus_ar.classList.add('disable');
		versus_af.classList.remove('disable');
	}
}
	
	function __init() {
	selecteur.set_position();
	var action = document.getElementById("action").value;
	if(action === "rfi") {
		document.getElementById("versus").classList.add("hidden");
		document.getElementById("versuslabel").classList.add("hidden");
	} else { 
		document.getElementById("versus").classList.remove("hidden"); 
		document.getElementById("versuslabel").classList.remove("hidden"); 
	}
	set_range();	
	document.getElementById("versuslabel").classList.add("hidden")
}

	return { 
		clear: clear_range,
		save: save_range, 
		load: set_range, 
		set_background_card: set_action_to_card,
		togle_visibility: togle_versus_selecteur,
		selecteur: selecteur,
		init: __init,
	}

})();

range_manager.init();
