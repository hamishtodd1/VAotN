/*
 * Long term To Do
 * 
 *  -working on atoms doing random walks will make the one here easy
 *  -same for reading atomic data
 * 
 *  -implement protein models
 *  -implement look-inside
 *  -make it feel good
 *  -make video
 *  -integrate video; it must read only one variable, the time you are into the video.
 *  -test
 *  -iterate (maybe add puzzles)
 */



function UpdateWorld() {
	update_mouseblob();
	
	switch(MODE){
		case STATIC_PROTEIN_MODE:
			break;
		
		case STATIC_DNA_MODE:
			break;
			
		case CK_MODE:
			HandleCapsidOpenness(); //really this is "update surface"
			HandleCapsidRotation(); //what you probably need to keep in mind is a picture of this as a list of the things that happen inside their functions
			update_surfperimeter();
			
			HandleLatticeMovement();
			Update_net_variables();
			
			Map_lattice();
			break;
			
		case CUBIC_LATTICE_MODE:
			update_3DLattice();
			break;
			
		case QC_SPHERE_MODE:
			UpdateQuasiSurface();
			MoveQuasiLattice();
			Map_To_Quasisphere();
			break;
			
		case IRREGULAR_MODE:
			HandleCapsidOpenness(); //really this is "update surface"
			HandleCapsidRotation();
			update_surfperimeter();
			
			HandleVertexRearrangement();
			correct_minimum_angles();
			Update_net_variables();
			
			Map_lattice();
			break;
	}
}

function render() {
	delta_t = ourclock.getDelta();
	if(delta_t > 0.1) delta_t = 0.1;
	//delta_t = 0.01;
	
	ReadInput();
	UpdateWorld();
	UpdateCamera();
	
	//setTimeout( function() { requestAnimationFrame( render );}, 100 );
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}
init();
render();

//eventually we'll add some trigger to this that makes it reasonable to call every frame
function ChangeScene() {	
	switch(MODE){
		case STATIC_PROTEIN_MODE:
			break;
		
		case STATIC_DNA_MODE:
			break;
			
		case CK_MODE:
			scene.add(surface);
			scene.add(surflattice);
			for( var i = 0; i < surfperimeter_cylinders.length; i++) {
				scene.add(surfperimeter_spheres[i]);
				scene.add(surfperimeter_cylinders[i]);
			}
			for( var i = 0; i < blast_cylinders.length; i++)
				scene.add(blast_cylinders[i]);
			break;
			
		case CUBIC_LATTICE_MODE:
			//scene.add(golden_triacontahedra[0]);
			//scene.add(goldenicos[0]);
			for( var i = 0; i < golden_rhombohedra.length; i++)
				scene.add(golden_rhombohedra[i]);
			break;
			
		case QC_SPHERE_MODE:
			//scene.add(dodeca);
			for( var i = 0; i < quasicutouts.length; i++)
				scene.add(quasicutouts[i]);
			
			scene.add(back_hider);			
			break;
			
		case IRREGULAR_MODE:
			scene.add(flatnet);
			scene.add(surface);
			for( var i = 0; i < surfperimeter_cylinders.length; i++) {
				scene.add(surfperimeter_spheres[i]);
				scene.add(surfperimeter_cylinders[i]);
			}
			break;
	}
}