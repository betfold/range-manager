{% include 'holdem_combinaison_rank.json' %}

// TODO create a current list of selected cards with they're id
//

// update the pourcent of selected hands on the grid
// the default action set to card is always the first possible action
function slider_on_change() {
	// 
	var slider			= document.getElementById('range_slider');
	var slider_want = Math.round(169 * slider.value / 100);
	var grid_have		= ui.total_selected;
	var handsingrid = this.grid.get_used_hand();


	//var randum_nhand = Math.floor( Math.random() * 100 + 1 )
	//console.log(`debug affichage de d'une main random ${rank_holdem[randum_nhand].hand} numéro ${randum_nhand}`);
	
	if ( slider_want > grid_have ) {
		var total2added = slider_want - grid_have;
		for(var cpt = 0, i = 1; i <= 169; i++) {
			if ( cpt === total2added ) { break; }
			var hh = rank_holdem[i];
			if ( !handsingrid.includes(hh.hand) ) {
				this.action.set_action_to_card( hh.hand );

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
				this.grid.grid_set_hh_to_unset(hid);
				cpt += 1;
			}
		}
	}
	this.grid.save_range();
	this.info_range.set_combo_info();	
}
