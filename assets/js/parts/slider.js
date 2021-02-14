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
		var slider_want = Math.round(169 * this.slider.value / 100);
		var grid_have		= handsingrid.length;
		
		//var randum_nhand = Math.floor( Math.random() * 100 + 1 )
		//console.log(`debug affichage de d'une main random ${rank_holdem[randum_nhand].hand} numéro ${randum_nhand}`);
		
		if ( slider_want > grid_have ) {
			var total2added = slider_want - grid_have;
			for(var cpt = 0, i = 1; i <= 169; i++) {
				if ( cpt === total2added ) { break; }
				var hh = rank_holdem[i];
				if ( !handsingrid.includes(hh.hand) ) {
					action.set_action_to_card( hh.hand );

					cpt += 1;	
				}
			}
		}
		else {
			var total2remove = grid_have - slider_want;
			for ( cpt = 0, i = 169; i > 0; i--) {
				if ( cpt === total2remove ) { break; }
				hh = rank_holdem[i];
				if ( handsingrid.includes(hh.hand) ) {
					var hid = handsingrid.indexOf(hh.hand);
					hid = handsingrid.splice(hid, 1)
					action.grid_set_hh_to_unset(hid);
					cpt += 1;
				}
			}
		}
	}
}
