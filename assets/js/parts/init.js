function __init() {
	selecteur.set_position();
	selecteur.set_action();
	selecteur.set_versus_position();
	var action = document.getElementById("position_name").value;
	if(action === "rfi") {
		document.getElementById("versus").classList.add("hidden");
		document.getElementById("versuslabel").classList.add("hidden");
	} else { 
		document.getElementById("versus").classList.remove("hidden"); 
		document.getElementById("versuslabel").classList.remove("hidden"); 
	}
	set_range();	
	document.getElementById("versuslabel").classList.add("hidden")

	document.getElementById('range_slider').oninput = function() { 
		slider_on_change();
	} 
}
