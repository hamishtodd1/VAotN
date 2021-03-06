/*
 * TODO
 * Make it feel good, eg irreg limits and CK constraints and QS not-breaking-apart and limits and line to center, and then send to Ben
 * 
 * Maybe worth sending to Amit as well before rerecord
 * 
 * irreg limits? That is a major barrier to game-like enjoyment
 * Make use of the "now you can choose the next virus" clip
 * Fading pics. Probably the thing to do is to specify actual chapters that consist of a fade?
 * Test
 * 
 * flick to polio on football
 * virus bucky comparison
 * 
 * QS actually we want to start on 15
 * exerpt instead of tomoko fuse?
 * 	
 * Long term To Do
 *  -break up all the chapters into separate videos
 *  -is the usefulness of the models not coming through?
 * 	-everything listed in CKsurfacestuff, bocavirus, alexandrov, quasisphere, youtube stuff
 *  -get a person with a sense of color to look at everything - Ario?
 *  -no 666s, you don't want pearl-clutchers. Easiest is change it to 665, -1?
 *  -Test with a low framerate to see what it's like and chase down remaining framerate dependence
 *  -loading screen. You may need to stagger inits.
 *  -watch people a lot and tweak the zooming and rotating code, just because it is simple doesn't mean that it is good
 *  -If webgl doesn�t load (or etc), recommend a different browser or refreshing the page
 *  -all objects floating in space with a shadow/lighting? Something other than meshbasicmaterial?
 *  -Pentagons in your hexagon demo? Pentagon demo? Needs polish too
 *  
 *  -people on touchscreens : pose qs like HPV. Then the button is this simple thing that just opens and closes. That is a complex thing and you don't want to be making it harder with other stuff like having to hold it and be in a different state or anything
 *  
 *  -bifuricate for the touchscreen
 *  
 *  -bear in mind that people can move the mouse extremely fucking fast, they take points VERY far on irreg, and scale back and forth very fast on CK
 *  -and might not let go of the mouse
 *  -don't humiliate yourself: if the canvas isn't running, halt the video
 *  -make sure a good picture appears when shared on facebook and twitter
 *  
 *  
 *  
 *  -make it feel good
 *  	-optimize http://www.w3schools.com/js/js_performance.asp
 *  		-reduce latency?
 *  		-loops should not evaluate array lengths every time
 *  		-could generate some things once, then not again
 *  		-search for missing "console.log"s, those are old debug things and may have wasteful ifs.
 *  	-all the effects in camerastuff
 *  	-test on different setups
 *  	-make work in different resolutions/respond to resize.
 *  	-mouse position
 */

function UpdateWorld() {
	circle.position.copy(MousePosition);
	
	switch(MODE)
	{	
		case BOCAVIRUS_MODE:
			update_bocavirus();
			break;
			
		case CK_MODE:
			CheckIrregButton();
			
			HandleNetMovement();
			
			UpdateCapsid();
			update_surfperimeter();

			Update_net_variables();			
			Map_lattice();
			break;
			
		case IRREGULAR_MODE:
			CheckIrregButton();
			Update_pictures_in_scene();
			manipulate_vertices();
			update_varyingsurface();
			//correct_minimum_angles();
			update_wedges();
			break;
			
		case QC_SPHERE_MODE:
			UpdateQuasiSurface();
			UpdateGrabbableArrow();
			MoveQuasiLattice();
			Map_To_Quasisphere();
			update_QS_center();
			break;
			
		case TREE_MODE:
			update_tree();
			break;
			
		case HEXAGON_MODE:
			update_hexagon_demo();
			break;
	}
	
	//this only does anything if it needs to
//	Update_pictures_in_scene();
}

function render() {
	delta_t = ourclock.getDelta();
//	if(delta_t > 0.1) delta_t = 0.1;
	//delta_t = 0.01;
	
	ReadInput();
	UpdateWorld();
	UpdateCamera();
	
//	if(logged ){
////		setTimeout( function() { requestAnimationFrame( render ); }, 1000 );
//		logged = 0;
//	}
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

//eventually we'll add some trigger to this that makes it reasonable to call every frame
//should probably not have scene.add or scene.remove anywhere outside this. It probably doesn't affect performance
function ChangeScene(new_mode) {
	//don't go changing this outside of here.
	MODE = new_mode;
	
	//everyone out
	for( var i = scene.children.length - 1; i >= 0; i--){
		var obj = scene.children[i];
		scene.remove(obj);
	}
	
	if(showdebugstuff){
		for(var i = 0; i<indicatorblobs.length; i++)
			scene.add(indicatorblobs[i]);
	}
	
	camera_changes_for_mode_switch();
	
	//this is the one variable that seems to be conserved; at least if it isn't, then make it so. But thaaaaat is why you get weird jitters when you change mode!
	capsidopenness = 0;
	
	switch(MODE) //probably you want to have a "mode advanced" variable which, on top of these, adds some stuff
	{
		case SLIDE_MODE:
			scene.add(VisibleSlide);
			scene.add( EndingMusic );
			break;
	
		case BOCAVIRUS_MODE:
			for(var i = 0; i <neo_bocavirus_proteins.length; i++)
				scene.add(neo_bocavirus_proteins[i]);
			for(var i = 0; i< lights.length; i++)
				scene.add( lights[i] );
			for(var i = 0; i< reproduced_proteins.length; i++)
				scene.add( reproduced_proteins[i] );
			scene.add(EggCell);
			break;
			
		case CK_MODE:
			scene.add(IrregButton);
			
			scene.add(CKHider); //can remove this if you have no internet
			scene.add(HexagonLattice);
			scene.add(surface);
//			scene.add(surflattice);
			for( var i = 0; i < surfperimeter_cylinders.length; i++) {
//				scene.add(surfperimeter_spheres[i]);
				scene.add(surfperimeter_cylinders[i]);
			}
//			for( var i = 0; i < blast_cylinders.length; i++)
//				scene.add(blast_cylinders[i]);
//			scene.add(GrabbableArrow);
			break;
			
		case IRREGULAR_MODE:
			scene.add(manipulation_surface);
//			scene.add(varyingsurface);
			for( var i = 0; i < varyingsurface_cylinders.length; i++)
				scene.add(varyingsurface_cylinders[i]);
			for( var i = 0; i < varyingsurface_spheres.length; i++)
				scene.add(varyingsurface_spheres[i]);
			for( var i = 0; i < wedges.length; i++ )
				scene.add( wedges[i] );
			scene.add(IrregButton);
			break;
			
		case QC_SPHERE_MODE:
			scene.add(dodeca);
			if(stable_point_of_meshes_currently_in_scene !== 666) //if it is equal to this, it has yet to be derived from the cutout vectors
				dodeca.add(quasicutout_meshes[stable_point_of_meshes_currently_in_scene]);
			scene.add(QS_center);
//			scene.add(GrabbableArrow);
			break;
			
		case TREE_MODE:
			add_tree_stuff_to_scene();
			break;
			
		case HEXAGON_MODE:
			for(var i = 0; i < demonstration_hexagons.length; i++)
				scene.add(demonstration_hexagons[i]);
	}
}