{% include 'holdem_combinaison_rank.json' %}

/**
 * @class
 * @classdesc 
 * update the pourcent of selected hands on the grid
 * the default action set to card is always the first possible action
 */
class RMSlider {

	constructor() {
		this.slider			= document.getElementById('range_slider');
	}

	change(handsingrid, action) {
		// 
		let slider_want = Math.round(169 * this.slider.value / 100);
		let grid_have		= handsingrid.length;
		
		//var randum_nhand = Math.floor( Math.random() * 100 + 1 )
		//console.log(`debug affichage de d'une main random ${rank_holdem[randum_nhand].hand} numéro ${randum_nhand}`);
		
		if ( slider_want > grid_have ) {
			let total2added = slider_want - grid_have;
			for(let cpt = 0, i = 1; i <= 169; i++) {
				if ( cpt === total2added ) { break; }
				let hh = rank_holdem[i];
				if ( !handsingrid.includes(hh.hand) ) {
					action.set_action_to_card( hh.hand );

					cpt += 1;	
				}
			}
		}
		else {
			let total2remove = grid_have - slider_want;
			for (let cpt = 0, i = 169; i > 0; i--) {
				if ( cpt === total2remove ) { break; }
				let hh = rank_holdem[i];
				if ( handsingrid.includes(hh.hand) ) {
					let hid = handsingrid.indexOf(hh.hand);
					hid = handsingrid.splice(hid, 1)
					action.grid_set_hh_to_unset(hid);
					cpt += 1;
				}
			}
		}
	}
}
