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
		let temp_cards	= []; // pour eviter les doublons 
		for(let action in this.range) {
			this.action2card[action] = { pourcent: 0, combos: 0 };
			let cards = this.range[action];
			for(let i in cards) {
				let card = cards[i];

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
		let calcul = {
			pair: { pourcent: 0, combo: 0 },
			offsuit: { pourcent: 0, combo: 0 },
			suited: { pourcent: 0, combo: 0},
		}
		// the info for compare with slider
		let total_selected		= this.pair + this.suited + this.offsuit;		
		calcul.pair.combo			= this.pair * pair_combinations;
		calcul.offsuit.combo	= this.offsuit * offsuit_combinations;
		calcul.suited.combo		= this.suited * suited_combinations;

		calcul.pair.pourcent		= this.pair * pair_pourcent;
		calcul.offsuit.pourcent = this.offsuit * offsuit_pourcent;
		calcul.suited.pourcent	= this.suited * suited_pourcent;

		// clear info
		this.screen.innerHTML = '';

		// set stat by action
		for(let action in this.action2card) {	

			let stat  = this.action2card[action];

			this.screen.innerHTML += this.template_info_range(stat.pourcent.toFixed(2) + '%', action, stat.combos + ' combo', action);
		}
		
		// set global stat
		let totalc = calcul.pair.combo + calcul.offsuit.combo + calcul.suited.combo;
		let totalp = calcul.pair.pourcent + calcul.offsuit.pourcent + calcul.suited.pourcent;
		
		this.screen.innerHTML += this.template_info_range('TOTAL', totalp.toFixed(2) + '%', totalc + " combos", 'global_info_range');

		// set stat by type of cards
		for(let typeofcard in calcul) {
			this.screen.innerHTML += this.template_info_range(this[typeofcard] + " " + typeofcard, calcul[typeofcard].pourcent.toFixed(2) + "%", calcul[typeofcard].combo + " combos", typeofcard);
		}

		// FIXME change this
		// set the slider value
		let slider = document.getElementById('range_slider');
		slider.value = totalp;
	}


	template_info_range(first, second, three, classename) {
		return `<ul class="${classename}"><li>${first}</li><li>${second}</li><li>${three}</li></ul>`;
	}
}
