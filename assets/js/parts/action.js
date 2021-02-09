
class RMAction {

	set_action_to_card(card_id) {

		var bts = document.getElementsByName('sel');
		for(var i = 0; i < bts.length; i++) {
			if(bts[i].checked) {
				var action = bts[i].value;
				this.card_toggle_class(card_id, action)
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
