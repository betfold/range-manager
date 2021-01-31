function set_position() {
	var sel = selecteur.get_position();
	var position = get_position_by_max();
	set_selecteur_pos(sel, position.hero);
	//set_action_sel();
}

function set_versus_pos() {
	var sel = document.getElementById('versus');
	var position = get_position_by_max();
	set_selecteur_pos(sel, position.vilain);
}

function set_action_sel() {

	var sel			= document.getElementById('position_name');
	var max			= selecteur.current_id();
	var action	= {};

	clear_select(sel);

	switch (max) {
		case '9':
			action = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
			break;
		case '6':
			action = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
			break;
		case '4':
			action = { rfi: "RFI", facingip: "Facing RFI IP", facingoop: "Facing RFI OOP", bvb: "Blind vs Blind" };
			break;
		case '3':
			action = { rfi: "RFI", bvb: "Blind vs Blind" };
			break;
		case '2':
			action = { bvb: "Blind vs Blind" };
			break;
	}
	var names = Object.keys(action);
	for(var i = 0, n = names.length; i < n; i++) {
		var option = document.createElement('option');
		var name = names[i];
		option.value = name;
		option.innerHTML = action[name];
		sel.appendChild(option);
	}
	
}

function set_selecteur_pos(sel, position) {

	clear_select(sel);
	

	for(const name in position) {
		var optgroup = document.createElement("optgroup");
		optgroup.label = name + " position";
		if ( position[name].length > 0) {
			for(var v in position[name]) {
				var option = document.createElement("option");
				var value = position[name][v];
				option.value = value;
				option.innerHTML = value;
				optgroup.appendChild(option);
			}
			sel.appendChild(optgroup);
		}	
	}
}

function get_position_by_max() {

	var maxid			= selecteur.current_id();
	var hero_pos	= document.getElementById('position').value;
	var action		= selecteur.current_action();
	var pos				= { hero: {}, vilain: {}, action: {}  };

	switch (maxid) {
		case '9':
			pos.hero = { early: ["UTG", "UTG1", "UTG2"], middle: ["LJ", "HJ"], late: ["CO", "BT"] };	
			break;
		case '6':
			pos.hero = { early: ["LJ"], middle: ["HJ"], late: ["CO", "BT"] };
			break;
		case '4':
			pos.hero = { early: ["CO"], late: ["BT"] };
			break;
		case '3':
			pos.hero = { late: ["BT"] };
			break;
		case '2':
			pos.hero = { blind: ['Small Blind Strategy', 'BB vs SB Limp', 'BB vs SB Raise'] }
			break;
	} 
	
	pos.vilain = {};
	

	switch (action) {
		case 'facingip':
			// vilain cant be at the same place of hero and behind him
			var stop = true; // Fixme it's probalby not good
			for(var i = 0; i < Object.keys(pos.hero).length && stop; i++) {
				var zone = Object.keys(pos.hero)[i];
				pos.vilain[zone] = [];
				for( var e = 0; e < pos.hero[zone].length; e++ ) {
					var position_name = pos.hero[zone][e];
					if ( position_name === hero_pos ) { stop = false; break; }
					else { pos.vilain[zone].push(position_name); }
				}
			}
			// hero can't be the first
			var first_optgroup = Object.keys(pos.hero)[0];
			pos.hero[first_optgroup] = _.drop(pos.hero[first_optgroup]);
			break;
		case 'facingoop':
			pos.vilain = JSON.parse(JSON.stringify(pos.hero));
			pos.hero = { blind: ['SB', 'BB'] };
			break;
		case 'bvb':
			pos.hero = { blind: ['Small Blind Strategy', 'BB vs SB Limp', 'BB vs SB Raise'] }
			break;
	}
	
	return pos;
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
	var action = document.getElementById('position_name').value;		
	name+= action
	if (action == "facing")	{  name+= document.getElementById('versus').value; }
	return name;
}

function togle_versus_selecteur() {
	var action_selected = document.getElementById('position_name').value;
	var versus_s = document.getElementById('versus');
	var versus_l = document.getElementById('versuslabel');
	var versus_ar = document.getElementById('rfi');
	var versus_af = document.getElementById('facingrfi');

	if (action_selected === "rfi" || action_selected === "bvb") {
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

