/* "Playing field width/height" appears in here, and we want to get rid of that.
 * It just means the area that the camera can see on the plane z = 0.
 * So update it, and update the pictures, if the window is resized.
 * Actually we certainly don't want dependence on window size. State a size for the window. Give a certain number of pixels.
 * Orthographic projection may simplify you walking around.
 * 
 * 
 * Rift Valley Fever (big one) - 12
 * may want to aim to have the t=1 CK arrangment look like the QS version
 * 
 * QS  
 * How about layering konevtsova's spots on them? 
 * Would you need the density maps? Those are nice. Could fade to a density map and put "x-ray" underneath. Hopefully you saved those nice maps on work computer :(
 * Could get the viruses into chimera and color them yourself trying to suggest the quasilattice shapes
 * Or you could just say in the video "the proteins on these viruses sit at the corners of the shapes, and connected corners are connected proteins"
 * 
 * So we have bocavirus on all of them? Four each is nice.
 * 
 * TODO they highlight somehow when mouse is over them
 * 
 * When do they pop up? When you get them? When you've been playing a while?
 */

var texture_loader = new THREE.TextureLoader(); //only one?
var picture_objects = Array(19);

var pictures_loaded = 0;

function loadpics(){
	var picturepanel_width = playing_field_width; //7*HS3
	var y_of_picturepanel_bottom = -0.5 * playing_field_height;
	
	for(var i = 0; i < picture_objects.length; i++){
		var ourdimension; //width and height are the same
		if(i === 0 ) //WIP warning
			ourdimension = 7*HS3;
		else if( i === 16 ) //CKhider
			ourdimension = 6.93513143351; // this is how big you need to be to cover the hexagonlattice
		else if( i === 17 || i === 18 )
			ourdimension = 0.6;
		else
			ourdimension = picturepanel_width / 4;
		
		picture_objects[i] = new THREE.Mesh(
				new THREE.CubeGeometry(ourdimension, ourdimension, 0),
				new THREE.MeshBasicMaterial({ transparent:true
//					, depthTest: false, depthWrite: false, transparent: true //trying to put them on top stuff
					}) );
		
		picture_objects[i].renderOrder = 0;
	}
	
	picture_objects[0].name = "http://hamishtodd1.github.io/Data/warning.png";
	
	picture_objects[1].name = "http://hamishtodd1.github.io/Data/1 - BV.jpg";
	picture_objects[2].name = "http://hamishtodd1.github.io/Data/9 - N4.gif";
	picture_objects[3].name = "http://hamishtodd1.github.io/Data/13 - RV.png";
	
	picture_objects[4].name = "http://hamishtodd1.github.io/Data/3 - PV.png";
	picture_objects[5].name = "http://hamishtodd1.github.io/Data/4 - SFV.png";
	picture_objects[6].name = "http://hamishtodd1.github.io/Data/7 - CV.png"; //better to claim it's p2? Actually it's HPV :(
	picture_objects[7].name = "http://hamishtodd1.github.io/Data/12 - RVFV.png";
	
	picture_objects[ 8].name = "http://hamishtodd1.github.io/Data/Bocavirus file.png";
	picture_objects[ 9].name = "http://hamishtodd1.github.io/Data/Bluetongue file.png";
	picture_objects[10].name = "http://hamishtodd1.github.io/Data/Zika file.png";
	picture_objects[11].name = "http://hamishtodd1.github.io/Data/HPV file.png";
	
	picture_objects[12].name = "http://hamishtodd1.github.io/Data/T4 file.png";
	picture_objects[13].name = "http://hamishtodd1.github.io/Data/Phi29 file.png";
	picture_objects[14].name = "http://hamishtodd1.github.io/Data/HIV file.png";
	picture_objects[15].name = "http://hamishtodd1.github.io/Data/Herpes file.png";
	
	picture_objects[16].name = "http://hamishtodd1.github.io/Data/CKhider.png";
	
	picture_objects[17].name = "http://hamishtodd1.github.io/Data/open.png";
	picture_objects[18].name = "http://hamishtodd1.github.io/Data/close.png";
	
	for(var i = 1; i < picture_objects.length; i++){ //all except the first
		picture_objects[i].enabled = 0; //switch to 1 when clicked, switch all to 0 when player changes anything
		picture_objects[i].TimeThroughMovement = 100; //start at a place where you're settled
		
		picture_objects[i].default_position = new THREE.Vector3(0,0,0.01);
		if(16 > i && i > 11)
			picture_objects[i].default_position.z *= -1;
		if(i > 3 && i < 16){
			picture_objects[i].default_position.x = -3/8 * picturepanel_width;
			picture_objects[i].default_position.x += (i%4) * picturepanel_width / 4;
			
			var virus_pixels = 414;
			var entire_picture_pixels = 512;
			
			picture_objects[i].default_position.y = y_of_picturepanel_bottom + 0.5 * picturepanel_width / 4; //the picture's height
		}
		
		if( 0 < i && i < 16){ //virus pics
			picture_objects[i].enabled_position = picture_objects[i].default_position.clone();
			picture_objects[i].enabled_position.y += 0.4; //maybe too much
			picture_objects[i].position.copy(picture_objects[i].default_position);
		}
		
		if(i === 17 || i === 18){
			picture_objects[i].position.set(1.9,-0.7,0.0001);
			picture_objects[i].capsidopen = 0;
		}
		
		if(i === 16)
			picture_objects[i].default_position.z = 0.0001;
	}
	
	for(var i = 0; i < picture_objects.length; i++)
		loadpic(i);
}

function loadpic(i) {
	//these lines are for if you have no internet
//	picture_objects[i].material.color = 0x000000;
//	pictures_loaded++;
//	if(pictures_loaded === picture_objects.length ) {
//		PICTURES_LOADED = 1;
//		attempt_launch();
//	}
	
	texture_loader.load(
		picture_objects[i].name,
		function(texture) {
			picture_objects[i].material.map = texture;
			
			pictures_loaded++;

			if(pictures_loaded === picture_objects.length ) {
				PICTURES_LOADED = 1;
				attempt_launch();
			}
		},
		function ( xhr ) {}, function ( xhr ) {
			console.log( 'texture loading error, switch to using the other code in this function' );
		}
	);
}

function Update_pictures_in_scene(){
	for(var i = 1; i < 16; i++){
		if( scene.getObjectByName(picture_objects[i].name) !== undefined)
			Update_picture(i);
	}
}

function Disable_pictures(){
	for(var i = 1; i < 16; i++){
		if(picture_objects[i].enabled === 1){
			picture_objects[i].enabled = 0;
			picture_objects[i].TimeThroughMovement = 0;
		}
	}
}

function Update_picture(index){
	var MouseRelative = MousePosition.clone();
	MouseRelative.sub(picture_objects[index].position);
	/*
	 * Bluetongue is 8, boca is 2, zika is 9, hpv is 7.
	 */
	
	if( isMouseDown && !isMouseDown_previously ){
		var ClickWasInPicture = 0;
		if(Math.abs(MouseRelative.x) < picture_objects[index].geometry.vertices[0].x &&
		   Math.abs(MouseRelative.y) < picture_objects[index].geometry.vertices[0].y)
			ClickWasInPicture = 1;
		
		if(picture_objects[index].enabled == 0){
			if( ClickWasInPicture ){
				Disable_pictures();
				
				picture_objects[index].enabled = 1;
				picture_objects[index].TimeThroughMovement = 0;
				
				//TODO get the whatever in the right position, and they will be enabled.
				
				if( 12 <= index && index < 16){
					for(var i = 0; i < flatnet_vertices.array.length; i++)
						flatnet_vertices.array[i] = setvirus_flatnet_vertices[index-12][i];
					correct_minimum_angles(flatnet_vertices.array);
				}
				else if( 4 <= index && index < 8){
					if( index === 4){ LatticeScale=0.577; LatticeAngle = 0.5236; }
					if( index === 5){ LatticeScale = 0.5; LatticeAngle = 0; }
					if( index === 6){ LatticeScale=0.3779; LatticeAngle =0.714; }
					if( index === 7){ LatticeScale = 1/3; LatticeAngle = 0.5236; }
				}
				else if(8 <= index && index < 12){
					if(index === 8){cutout_vector0.set(-0.5,1.2139220723547204,0); 				cutout_vector1.set(1,0.85065080835204,0); }
					if(index === 9){cutout_vector0.set( 0.309016994374947,1.801707324647194,0); cutout_vector1.set(1.809016994374948,0.2628655560595675,0); }
					if(index ===10){cutout_vector0.set(1.809016994374948, 1.4384360606445132,0);cutout_vector1.set(1.9270509831248428, 1.2759762125280603,0); }
					if(index ===11){cutout_vector0.set(0,3.47930636894770,0); 					cutout_vector1.set(3.309016994374948, 1.075164796641833,0); }
					
					cutout_vector0_player.copy(cutout_vector0);cutout_vector1_player.copy(cutout_vector1);
				}
			}
		}
	}
	else if( picture_objects[index].enabled === 0 && !isMouseDown && //pics can also be turned on by us being in the right place
	   ((stable_point_of_meshes_currently_in_scene === 2 && index === 8) ||
		(stable_point_of_meshes_currently_in_scene === 8 && index === 9) ||
		(stable_point_of_meshes_currently_in_scene === 9 && index === 10)||
		(stable_point_of_meshes_currently_in_scene === 7 && index === 11)) )
	{
		Disable_pictures();
		picture_objects[index].enabled = 1;
		picture_objects[index].TimeThroughMovement = 0;
	}
	
	picture_objects[index].TimeThroughMovement += delta_t;	
	var MovementTime = 0.65;	
	if(picture_objects[index].enabled){
		picture_objects[index].position.copy( move_smooth_vectors(
				picture_objects[index].default_position,
				picture_objects[index].enabled_position,
				MovementTime,
				picture_objects[index].TimeThroughMovement) );
	}
	else{
		picture_objects[index].position.copy( move_smooth_vectors(
				picture_objects[index].enabled_position,
				picture_objects[index].default_position,
				MovementTime,
				picture_objects[index].TimeThroughMovement) );
	}
}