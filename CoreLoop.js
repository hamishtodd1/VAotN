/*
 * Long term To Do
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
			
		case ASSEMBLY_MODE:
			break;
			
		case QC_SPHERE_MODE:
			UpdateQuasiSurface();
			MoveQuasiLattice();
			Map_To_Quasisphere();
			break;
			
		case IRREGULAR_MODE:
			HandleCapsidOpenness(); //really this is "update surface"
			HandleCapsidRotation(); //what you probably need to keep in mind is a picture of this as a list of the things that happen inside their functions
			update_surfperimeter();
			
			HandleVertexRearrangement();
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
	STATIC_PROTEIN_MODE = 0;
	var STATIC_DNA_MODE = 1; 
	var CK_MODE = 2;
	var ASSEMBLY_MODE = 3;
	var QC_SPHERE_MODE = 4;
	var IRREGULAR_MODE = 5;
	
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
			
		case ASSEMBLY_MODE:
			break;
			
		case QC_SPHERE_MODE:
			scene.add(dodeca);
			for( var i = 0; i < quasicutouts.length; i++)
				scene.add(quasicutouts[i]);
			break;
			
		case IRREGULAR_MODE:
			scene.add(flatnet);
			scene.add(polyhedron);
			break;
	}
}