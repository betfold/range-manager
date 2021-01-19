
	function calcul_combo() {
		ui.pair = 0;
		ui.offsuit = 0;
		ui.suited = 0;
		var temp_cards = []; // pour eviter les doublons 
		var range = get_range();	
		for(var action in range) {
			var cards = range[action];
			console.log(action + " with ");
			for(var i in cards) {
				console.log(cards[i]);
				if(!temp_cards.includes(cards[i])) {
					temp_cards.push(cards[i]);
					if(cards[i][2] === "s") { ui.suited += 1; }
					else if(cards[i][2] === "o") {	ui.offsuit += 1; }
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

		calcul.pair.pourcent = ui.pair * 6 / 1263 * 100;
		calcul.offsuit.pourcent = ui.offsuit * 12 / 1263 * 100;
		calcul.suited.pourcent = ui.suited * 4 / 1263 * 100;

		var block_info = document.getElementById('combo_info');
		var pair = block_info.getElementsByClassName('pair')[0];
		var offsuit = block_info.getElementsByClassName('offsuit')[0];
		var suited = block_info.getElementsByClassName('suited')[0];
		pair.innerHTML= ui.pair + " pairs "+calcul.pair.pourcent.toFixed(2) + "% des mains - "+calcul.pair.combo+ " combos";
		suited.innerHTML= ui.suited + " suited "+calcul.suited.pourcent.toFixed(2) + "% des mains - "+calcul.suited.combo+ " combos";
		offsuit.innerHTML= ui.offsuit + " offsuit "+calcul.offsuit.pourcent.toFixed(2) + "% des mains - "+calcul.offsuit.combo+ " combos";
	}
