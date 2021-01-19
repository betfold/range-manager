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

