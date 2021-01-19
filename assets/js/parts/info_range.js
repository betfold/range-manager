
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
			pair: { pourcent: "", combo: "" },
			offsuit: { pourcent: "", combo: "" },
			suited: { pourcent: "", combo: ""}
		}
		
		calcul.pair.combo = ui.pair * 6;
		calcul.offsuit.combo = ui.offsuit * 12;
		calcul.suited.combo = ui.suited * 4;

		calcul.pair.pourcent = ui.pair * 6 / 1326 * 100;
		calcul.offsuit.pourcent = ui.offsuit * 12 / 1326 * 100;
		calcul.suited.pourcent = ui.suited * 4 / 1326 * 100;

		var block_info = document.getElementById('combo_info');
		var pair = block_info.getElementsByClassName('pair')[0];
		var offsuit = block_info.getElementsByClassName('offsuit')[0];
		var suited = block_info.getElementsByClassName('suited')[0];
		pair.innerHTML= ui.pair + " pairs "+calcul.pair.pourcent.toFixed(2) + "% des mains ("+calcul.pair.combo+ " combos)";
		suited.innerHTML= ui.suited + " suited "+calcul.suited.pourcent.toFixed(2) + "% des mains  ("+calcul.suited.combo+ " combos)";
		offsuit.innerHTML= ui.offsuit + " offsuit "+calcul.offsuit.pourcent.toFixed(2) + "% des mains ("+calcul.offsuit.combo+ " combos)";

		
		var info_range = document.getElementById('range_info');
		info_range.innerHTML = '';
		for(var action in ui['action']) {	

			var stat  = ui['action'][action];

			var ul = document.createElement('ul');
			ul.classList.add(action);

			var li_action = document.createElement('li');
			li_action.innerHTML = action;
			var li_pourcent = document.createElement('li');
			li_pourcent.innerHTML = stat.pourcent.toFixed(2) + '%';
			var li_combo = document.createElement('li');
			li_combo.innerHTML = stat.combos + ' combos';
			ul.appendChild(li_action);
			ul.appendChild(li_pourcent);
			ul.appendChild(li_combo);

			info_range.appendChild(ul);
		}
	}
