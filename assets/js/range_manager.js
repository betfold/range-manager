var range_manager = (function() {


	var ui = {
	classname_to_remove: "bet flat3bet fourbet flat5bet allin flat threebet flat4bet fivebet limpfold limpcall raisefold limpraise raisecall",
	actions: {
		rfi:        ["bet", "flat3bet", "fourbet", "flat5bet", "allin"],
		facingrfi:  ["flat", "threebet", "flat4bet", "fivebet", "allin"],
		bvb:        ["limpfold", "limpcall", "raisefold", "limpraise", "raisecall", "allin"]
		},
	pair: 0,
	suited: 0,
	offsuit: 0,
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
	
	function calcul_combo() {
		ui.pair = 0;
		ui.offsuit = 0;
		ui.suited = 0;
		ui['action'] = {}
		var temp_cards = []; // pour eviter les doublons 
		var range = get_range();	
		for(var action in range) {
			var cards = range[action];
			ui['action'][action] = { pourcent: 0, combos: 0 };
			for(var i in cards) {
				var card = cards[i];

				if(card[2] === "s") { 
					ui['action'][action].combos += 4;
					ui['action'][action].pourcent += (4 / 1326 * 100);
				}
				else if(card[2] === "o") {
					ui['action'][action].combos += 12;
					ui['action'][action].pourcent += (12 / 1326 * 100);
				}
				else {
					ui['action'][action].combos += 6;
					ui['action'][action].pourcent += (6 / 1326 * 100);
				}

				if(!temp_cards.includes(card)) {
					temp_cards.push(card);
					if(card[2] === "s") { ui.suited += 1; }
					else if(card[2] === "o") {	ui.offsuit += 1; }
					else { ui.pair += 1; }
				}
			}
		}
	}

	function set_combo_info() {
		calcul_combo();
		var calcul = {
			pair: { pourcent: 0, combo: 0 },
			offsuit: { pourcent: 0, combo: 0 },
			suited: { pourcent: 0, combo: 0}
		}
		
		calcul.pair.combo = ui.pair * 6;
		calcul.offsuit.combo = ui.offsuit * 12;
		calcul.suited.combo = ui.suited * 4;

		calcul.pair.pourcent = ui.pair * 6 / 1326 * 100;
		calcul.offsuit.pourcent = ui.offsuit * 12 / 1326 * 100;
		calcul.suited.pourcent = ui.suited * 4 / 1326 * 100;

		
		
		var info_range = document.getElementById('range_info');
		info_range.innerHTML = '';
		for(var action in ui['action']) {	

			var stat  = ui['action'][action];

			var ul = document.createElement('ul');
			ul.classList.add(action);

			var li_pourcent = document.createElement('li');
			li_pourcent.innerHTML = stat.pourcent.toFixed(2) + '%';
			var li_action = document.createElement('li');
			li_action.innerHTML = action;
			var li_combo = document.createElement('li');
			li_combo.innerHTML = stat.combos + ' combos';
			ul.appendChild(li_pourcent);
			ul.appendChild(li_action);
			ul.appendChild(li_combo);

			info_range.appendChild(ul);
		}

		for(var typeofcard in calcul) {
			var ult = document.createElement('ul');
			ult.classList.add(typeofcard);
			var lit = document.createElement('li')
			lit.innerHTML = ui[typeofcard] + " " + typeofcard;
			var lip = document.createElement('li');
			lip.innerHTML = calcul[typeofcard].pourcent.toFixed(2) + "%";
			var lic = document.createElement('li');
			lic.innerHTML = calcul[typeofcard].combo + " combos";
			ult.appendChild(lit);
			ult.appendChild(lip);
			ult.appendChild(lic);
			info_range.appendChild(ult);
		}

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
	ranges = JSON.stringify(ranges);
	if( ranges.length > 8 ) { localStorage.setItem(get_range_name(), ranges); }
	set_combo_info();
}

function set_range() {
	clear_range();
	var ranges = get_range();
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
	set_combo_info(); // FIXME change function to get_range_info
}

function get_range() {
	return JSON.parse(localStorage.getItem(get_range_name()));
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
	
	set_combo_info();
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
			
	}

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
	
	var user_cmd = { 
	args: '', 
	hand_range_weight: ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"],
	hand_sign: ['o', 's', '+', '-'],
	auth_char: _.concat(this.hand_range_weight, this.hand_sign),
	ranges: [],

 }
	

function parse_cmd() {

	user_cmd.args = _.compact(document.getElementById('cmdselect').value.split(' '));
	user_cmd.ranges = [];
	user_cmd.args.forEach(filtre =>	exec_cmd(filtre));
	user_cmd.ranges.forEach(e => set_action_to_card(e));
	
}


function exec_cmd(filtre) {

	console.log("commande :"+ filtre);

	var cmd = nota_parse_cmd_hand(filtre);
	var ranges = [];

	if (cmd.hands[0][0] === cmd.hands[0][1]) {
		ranges = nota_sel_by_pair(cmd);
	}
	else if ( cmd.hands.length === 1 ) {
		ranges = nota_sel_unique_range(cmd);
	}
	else {
		ranges = nota_set_multiple_range(cmd);
	}
	

	if ( ranges.length > 0 ) {
		ranges.forEach(ch => console.log(ch));
		ranges.forEach(ch => user_cmd.ranges.push(ch));
	}
}

function nota_set_multiple_range(cmd) {
	var start_at = 0;
	var end_at = 0;
	var ranges = [];	
	if (cmd.hands[0][0] === cmd.hands[1][0] ) {
		start_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][1] );
		end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[1][1] );
		for(start_at; start_at < end_at; start_at++) {
			var c = cmd.hands[0][0] + ""+ user_cmd.hand_range_weight[start_at];
			ranges.push(c);
		}
		ranges = nota_added_card_by(ranges, cmd.type)
	}
	return ranges;
}

function nota_sel_unique_range(cmd) {
	console.log(cmd);
	var start_at = 0;
	var end_at = 0;
	var ranges = [];
	switch ( cmd['opt'] ) {
		case '-':
			start_at = 0;
			end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][1] );
			break;
		case '+':
			start_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][1] );
			end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][0] );
			break;
	}

	if ( cmd.opt === '+' || cmd.opt === '-' ) {
		for(start_at; start_at < end_at; start_at++) {
			var c = cmd.hands[0][0] + ""+ user_cmd.hand_range_weight[start_at];
			ranges.push(c);
		}
		
	}
	else {
		ranges.push(cmd.hands[0]);
	}

	ranges = nota_added_card_by(ranges, cmd.type);
	return ranges;
}

function nota_parse_cmd_hand(filtre) {
	var arg_cmd = {hands: [], type: "all", opt: "none" };
	filtre = filtre.split('');
	if (filtre.includes('-') && filtre.slice(-1) !== '-') {
		arg_cmd.hands = filtre.join('').split('-');
	} else { arg_cmd.hands.push(filtre.join('')); }

	arg_cmd.hands.forEach(function(argument, index) {
		argument = argument.split('');
		var opts = argument.splice(2, 2);
		argument = argument.splice(0, 2);

		if (user_cmd.hand_range_weight.indexOf( argument[0] ) < user_cmd.hand_range_weight.indexOf( argument[1] )) {
			argument.reverse();
		}
		
		arg_cmd.hands[index] = argument.join('');

		opts.forEach(function(signe) {
			switch (signe) {
				case 'o':
				case 's':
					arg_cmd.type = signe;
					break;
				case '+':
				case '-':
					arg_cmd.opt = signe;
					break;
			}
		});
	});

	if ( arg_cmd.hands.length > 1) {
		if ( user_cmd.hand_range_weight.indexOf( arg_cmd.hands[0][0] ) > user_cmd.hand_range_weight.indexOf( arg_cmd.hands[1][0] )) {
			arg_cmd.hands.reverse();
		}
	}
	return arg_cmd;	
}


function nota_sel_by_pair(cmd) {
	var start_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][0] );
	var end_at   = 13;
	var ranges = [];
	if ( cmd.hands.length > 1 ) { end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[1][0] ) + 1; }

	for(start_at; start_at < end_at; start_at++) {
		var c = user_cmd.hand_range_weight[start_at];
		c += c;
		ranges.push(c);
	}
	return ranges;
}

function nota_added_card_by(cards, by) {
	// NOTE Sometimes I make a mistake betwen slice & splice 
	var cs = cards.slice(); //
	switch (by) {
		case 'all':
			cs.forEach(e => cards.push(e+'o'));
			cs.forEach(e => cards.push(e+'s'));
		break;
		case 's':
			cs.forEach(e => cards.push(e+'s'));
		break;
		case 'o':
			cs.forEach(e => cards.push(e+'o'));
		break;
	}
	for(var i = 0; i < cs.length; i++) {
		cards.splice(cards.indexOf(cs[i]), 1);
	}
	return cards	
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
		cmd: parse_cmd,
		init: __init,
	}

})();

range_manager.init();
