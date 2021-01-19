function __init() {
	selecteur.set_position();
	var action = document.getElementById("action").value;
	if(action === "rfi") {
		document.getElementById("versus").classList.add("hidden");
		document.getElementById("versuslabel").classList.add("hidden");
	} else { 
		document.getElementById("versus").classList.remove("hidden"); 
		document.getElementById("versuslabel").classList.remove("hidden"); 
	}
	set_range();	
	document.getElementById("versuslabel").classList.add("hidden")
}
