var secondsthroughvid = animation_beginning_second;

function react_to_video(){
	secondsthroughvid += delta_t;
	
	if(nextbutton_pressed) {
		ChangeScene(MODE+1);
		nextbutton_pressed = 0;
	}
	if(prevbutton_pressed) {
		ChangeScene(MODE-1);
		prevbutton_pressed = 0;
	}
}

var nextbutton_pressed = 0;
var prevbutton_pressed = 0;

document.addEventListener("keydown", function onDocumentMouseMove( event ) {
	if(event.keyCode === 39){
		event.preventDefault();
		nextbutton_pressed = 1;
	}	
	if(event.keyCode === 37){
		event.preventDefault();
		prevbutton_pressed = 1;
	}	
}, false);

function attempt_launch(){
	if( !INITIALIZED || !PICTURES_LOADED )
		return;
	ChangeScene(MODE);
	render();
}

//BEGIN
THREE.TextureLoader.prototype.crossOrigin = '';
loadpics();
init();