
	function calcul_combo() {
		var temp_cards	= []; // pour eviter les doublons 
		var range				= get_range();	
		ui.pair					= 0;
		ui.offsuit			= 0;
		ui.suited				= 0;
		ui['action']		= {}
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
			suited: { pourcent: 0, combo: 0},
		}
		
		calcul.pair.combo			= ui.pair * 6;
		calcul.offsuit.combo	= ui.offsuit * 12;
		calcul.suited.combo		= ui.suited * 4;

		calcul.pair.pourcent		= ui.pair * 6 / 1326 * 100;
		calcul.offsuit.pourcent = ui.offsuit * 12 / 1326 * 100;
		calcul.suited.pourcent	= ui.suited * 4 / 1326 * 100;

		var info_range = document.getElementById('range_info');
		// clear info
		info_range.innerHTML = '';

		// set stat by action
		for(var action in ui['action']) {	

			var stat  = ui['action'][action];

			info_range.innerHTML += templete_info_range(stat.pourcent.toFixed(2) + '%', action, stat.combos + ' combo', action);
		}
		
		// set global stat
		var totalc = calcul.pair.combo + calcul.offsuit.combo + calcul.suited.combo;
		var totalp = calcul.pair.pourcent + calcul.offsuit.pourcent + calcul.suited.pourcent;
		
		info_range.innerHTML += templete_info_range('TOTAL', totalp.toFixed(2) + '%', totalc, 'global_info_range');

		// set stat by type of cards
		for(var typeofcard in calcul) {
			info_range.innerHTML += templete_info_range(ui[typeofcard] + " " + typeofcard, calcul[typeofcard].pourcent.toFixed(2) + "%", calcul[typeofcard].combo + " combos", typeofcard);
		}

	}


	function templete_info_range(first, second, three, classename) {
		return `<ul class="${classename}"><li>${first}</li><li>${second}</li><li>${three}</li></ul>`;
	}
