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
		let bts = document.getElementsByName('sel');
		for(let i = 0; i < bts.length; i++) {
			if(bts[i].checked) {
				let action = bts[i].value;
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
		let card = document.getElementById(idcard)
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
		let hh = document.getElementById(hhid);
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
