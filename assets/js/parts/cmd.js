var user_cmd = { 
	args: '', 
	hand_range_weight: ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"],
	hand_sign: ['o', 's', '+', '-'],
	auth_char: _.concat(this.hand_range_weight, this.hand_sign),
	ranges: [],

 }
	

function parse_cmd() {

	user_cmd.args = _.compact(document.getElementById('cmdselect').value.split(' '));
	user_cmd.ranges = [];
	user_cmd.args.forEach(filtre =>	exec_cmd(filtre));
	user_cmd.ranges.forEach(e => this.action.set_action_to_card(e));
	
}


function exec_cmd(filtre) {

	console.log("commande :"+ filtre);

	var cmd = nota_parse_cmd_hand(filtre);
	var ranges = [];

	if (cmd.hands[0][0] === cmd.hands[0][1]) {
		ranges = nota_sel_by_pair(cmd);
	}
	else if ( cmd.hands.length === 1 ) {
		ranges = nota_sel_unique_range(cmd);
	}
	else {
		ranges = nota_set_multiple_range(cmd);
	}
	

	if ( ranges.length > 0 ) {
		ranges.forEach(ch => console.log(ch));
		ranges.forEach(ch => user_cmd.ranges.push(ch));
	}
}

function nota_set_multiple_range(cmd) {
	var start_at = 0;
	var end_at = 0;
	var ranges = [];	
	if (cmd.hands[0][0] === cmd.hands[1][0] ) {
		start_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][1] );
		end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[1][1] );
		for(start_at; start_at < end_at; start_at++) {
			var c = cmd.hands[0][0] + ""+ user_cmd.hand_range_weight[start_at];
			ranges.push(c);
		}
		ranges = nota_added_card_by(ranges, cmd.type)
	}
	return ranges;
}

function nota_sel_unique_range(cmd) {
	console.log(cmd);
	var start_at = 0;
	var end_at = 0;
	var ranges = [];
	switch ( cmd['opt'] ) {
		case '-':
			start_at = 0;
			end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][1] );
			break;
		case '+':
			start_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][1] );
			end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][0] );
			break;
	}

	if ( cmd.opt === '+' || cmd.opt === '-' ) {
		for(start_at; start_at < end_at; start_at++) {
			var c = cmd.hands[0][0] + ""+ user_cmd.hand_range_weight[start_at];
			ranges.push(c);
		}
		
	}
	else {
		ranges.push(cmd.hands[0]);
	}

	ranges = nota_added_card_by(ranges, cmd.type);
	return ranges;
}

function nota_parse_cmd_hand(filtre) {
	var arg_cmd = {hands: [], type: "all", opt: "none" };
	filtre = filtre.split('');
	if (filtre.includes('-') && filtre.slice(-1) !== '-') {
		arg_cmd.hands = filtre.join('').split('-');
	} else { arg_cmd.hands.push(filtre.join('')); }

	arg_cmd.hands.forEach(function(argument, index) {
		argument = argument.split('');
		var opts = argument.splice(2, 2);
		argument = argument.splice(0, 2);

		if (user_cmd.hand_range_weight.indexOf( argument[0] ) < user_cmd.hand_range_weight.indexOf( argument[1] )) {
			argument.reverse();
		}
		
		arg_cmd.hands[index] = argument.join('');

		opts.forEach(function(signe) {
			switch (signe) {
				case 'o':
				case 's':
					arg_cmd.type = signe;
					break;
				case '+':
				case '-':
					arg_cmd.opt = signe;
					break;
			}
		});
	});

	if ( arg_cmd.hands.length > 1) {
		if ( user_cmd.hand_range_weight.indexOf( arg_cmd.hands[0][0] ) > user_cmd.hand_range_weight.indexOf( arg_cmd.hands[1][0] )) {
			arg_cmd.hands.reverse();
		}
	}
	return arg_cmd;	
}


function nota_sel_by_pair(cmd) {
	var start_at = user_cmd.hand_range_weight.indexOf( cmd.hands[0][0] );
	var end_at   = 13;
	var ranges = [];
	if ( cmd.hands.length > 1 ) { end_at = user_cmd.hand_range_weight.indexOf( cmd.hands[1][0] ) + 1; }

	for(start_at; start_at < end_at; start_at++) {
		var c = user_cmd.hand_range_weight[start_at];
		c += c;
		ranges.push(c);
	}
	return ranges;
}

function nota_added_card_by(cards, by) {
	// NOTE Sometimes I make a mistake betwen slice & splice 
	var cs = cards.slice(); //
	switch (by) {
		case 'all':
			cs.forEach(e => cards.push(e+'o'));
			cs.forEach(e => cards.push(e+'s'));
		break;
		case 's':
			cs.forEach(e => cards.push(e+'s'));
		break;
		case 'o':
			cs.forEach(e => cards.push(e+'o'));
		break;
	}
	for(var i = 0; i < cs.length; i++) {
		cards.splice(cards.indexOf(cs[i]), 1);
	}
	return cards	
}


