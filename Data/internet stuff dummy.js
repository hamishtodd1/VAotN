var secondsthroughvid = animation_beginning_second;

function react_to_video(){
	secondsthroughvid += delta_t;
}

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