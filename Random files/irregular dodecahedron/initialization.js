function init() {
	vertices_derivations = new Array(
		[666,666,666],
		[666,666,666],
		[666,666,666],
		
		[2,1,0],
		[2,3,1],
		[4,3,2],
		
		[0,2,1],
		[6,2,0],
		[6,7,2],
		[8,7,6],
		
		[0,6,2],
		[10,6,0],
		[10,11,6],
		[12,11,10],
		
		[0,10,6],
		[14,10,0],
		[14,15,10],
		[16,15,14],
		
		[0,14,10],
		[18,14,0],
		[18,19,14],
		[20,19,18]);
		
	var default_minimum_angle = 2 * Math.atan(PHI/(PHI-1));
	for( var i = 0; i < 22; i++ )
		minimum_angles[i] = default_minimum_angle;
	//minimum_angles[3] = 
		
	flatnet_vertices_numbers = new Float32Array([
		0,0,0,
		HS3,-0.5,0,
		
		HS3, 0.5, 0,
		2*HS3, 0,0,
		2*HS3,1,0,
		3*HS3,0.5,0,
		
		0,1,0,
		HS3,1.5,0,
		0,2,0,
		HS3,2.5,0,
		
		-HS3,0.5,0,
		-HS3,1.5,0,
		-2*HS3,1,0,
		-2*HS3,2,0,
		
		-HS3,-0.5,0,
		-2*HS3,0,0,
		-2*HS3,-1,0,
		-3*HS3,-0.5,0,
		
		0,-1,0,
		-HS3,-1.5,0,
		0,-2,0,
		-HS3,-2.5,0]);
	
	var h = 1/PHI;
	var f = 1+h;
	var g = 1-h*h;
	dodecahedron_vertices_numbers = new Float32Array([ 		
 		 1, 1, 1,
 		 1,-1, 1,
 		 1, 1,-1,
 		 1,-1,-1,

 		-1, 1, 1,
 		-1,-1, 1,
 		-1, 1,-1,
 		-1,-1,-1,
 		 
 		 0, f, g,
		 0,-f, g,
		 0, f,-g,
 		 0,-f,-g,
 		 
 		 f, g, 0,
 		-f, g, 0,
 		 f,-g, 0,
 		-f,-g, 0,
 		 
 		 g, 0, f,
 		-g, 0, f,
 		 g, 0,-f,
 		-g, 0,-f]);
	pentagon_vertices_numbers = new Float32Array([
	     0,0.5/Math.sin(TAU/10),0,
	     PHI/2,0.5/Math.sin(TAU/10)-Math.cos(TAU/20*3),0,
	     0.5,-Math.tan(TAU/20*3) / 2,0,
	    -0.5,-Math.tan(TAU/20*3) / 2,0,
	    -PHI/2,0.5/Math.sin(TAU/10)-Math.cos(TAU/20*3),0]);
	for(var i = 0; i<5; i++) {
		pentagon_line_pairs[ i*2 ] = i;
		pentagon_line_pairs[i*2+1] = (i+1)%5;
	}
	
		
	surface_vertices_numbers = new Float32Array(22*3);
	for( var i = 0; i < 22 * 3; i++)
		surface_vertices_numbers[i] = flatnet_vertices_numbers[i];
	
	net_triangle_vertex_indices = new Uint16Array([
		2,1,0,
		1,2,3,
		4,3,2,
		3,4,5,
		
		6,2,0,
		2,6,7,
		8,7,6,
		7,8,9,
		
		10,6,0,
		6,10,11,
		12,11,10,
		11,12,13,
		
		14,10,0,
		10,14,15,
		16,15,14,
		15,16,17,
		
		18,14,0,
		14,18,19,
		20,19,18,
		19,20,21]);
	
	for( var i = 0; i < 20; i++ ) {
		line_index_pairs[i*6 + 0] = net_triangle_vertex_indices[i*3 + 0];
		line_index_pairs[i*6 + 1] = net_triangle_vertex_indices[i*3 + 1];
		
		line_index_pairs[i*6 + 2] = net_triangle_vertex_indices[i*3 + 1];
		line_index_pairs[i*6 + 3] = net_triangle_vertex_indices[i*3 + 2];
		
		line_index_pairs[i*6 + 4] = net_triangle_vertex_indices[i*3 + 2];
		line_index_pairs[i*6 + 5] = net_triangle_vertex_indices[i*3 + 0];
	}
	
	for(var i = 0; i < 22; i++) {
		V_angles[i] = Array(4);
		for(var j = 0; j < 4; j++)
			V_angles[i][j] = TAU /3;
	}
	
	//-------------stuff that goes in the scene
	{
		var material1 = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});
		
		
		flatnet_vertices = new THREE.BufferAttribute( flatnet_vertices_numbers, 3 );
		
		flatnet_geometry = new THREE.BufferGeometry();
		flatnet_geometry.addAttribute( 'position', flatnet_vertices );
		flatnet_geometry.addAttribute( 'index', new THREE.BufferAttribute( line_index_pairs, 1 ) ); //allowed to put that in there?

		flatnet = new THREE.Line( flatnet_geometry, material1, THREE.LinePieces );
		flatnet.position.x = -5;
		//scene.add(flatnet);
		
		surface_vertices = new THREE.BufferAttribute( surface_vertices_numbers, 3 ); //note the 3 means 3 numbers to a vector, not three vectors to a triangle
		
		surface_geometry = new THREE.BufferGeometry();
		surface_geometry.addAttribute( 'position', surface_vertices );
		surface_geometry.addAttribute( 'index', new THREE.BufferAttribute( line_index_pairs, 1 ) ); //allowed to put that in there?

		surface = new THREE.Line( surface_geometry, material1, THREE.LinePieces );
		//scene.add(surface);
		
		polyhedron_vertices = new THREE.BufferAttribute( polyhedron_vertices_numbers, 3 );
		
		polyhedron_geometry = new THREE.BufferGeometry();
		polyhedron_geometry.addAttribute( 'position', polyhedron_vertices );
		polyhedron_geometry.addAttribute( 'index', new THREE.BufferAttribute( line_index_pairs, 1 ) ); //allowed to put that in there?

		polyhedron = new THREE.Line( polyhedron_geometry, material1, THREE.LinePieces );
		polyhedron.position.x = 5;
		//scene.add(polyhedron);
		
		pentagon_vertices = new THREE.BufferAttribute( pentagon_vertices_numbers, 3 );
		
		pentagon_geometry = new THREE.BufferGeometry();
		pentagon_geometry.addAttribute( 'position', pentagon_vertices );
		pentagon_geometry.addAttribute( 'index', new THREE.BufferAttribute( pentagon_line_pairs, 1 ) ); //allowed to put that in there?

		pentagon = new THREE.Line( pentagon_geometry, material1, THREE.LinePieces );
		pentagon.position.x = -5;
		scene.add(pentagon);
		
		dodecahedron_vertices = new THREE.BufferAttribute( dodecahedron_vertices_numbers, 3 );
		deduce_dodecahedron();
		
		var index = 0;
		for(var i = 0; i<20; i++) {
			var ivector = new THREE.Vector3(dodecahedron_vertices_numbers[i*3+0],dodecahedron_vertices_numbers[i*3+1],dodecahedron_vertices_numbers[i*3+2]);
			for(var j = i+1; j < 20; j++){
				var jvector = new THREE.Vector3(dodecahedron_vertices_numbers[j*3+0],dodecahedron_vertices_numbers[j*3+1],dodecahedron_vertices_numbers[j*3+2]);
				if(ivector.distanceTo(jvector) < 1.1) {
					dodecahedron_line_pairs[index] = i;
					dodecahedron_line_pairs[index+1] = j;
					
					index+=2;
				}
			}			
		}
		
		dodecahedron_geometry = new THREE.BufferGeometry();
		dodecahedron_geometry.addAttribute( 'position', dodecahedron_vertices );
		dodecahedron_geometry.addAttribute( 'index', new THREE.BufferAttribute( dodecahedron_line_pairs, 1 ) ); //allowed to put that in there?

		dodecahedron = new THREE.Line( dodecahedron_geometry, material1, THREE.LinePieces );
		dodecahedron.position.x = 2;
		scene.add(dodecahedron);
		
		var material2 = new THREE.MeshBasicMaterial({
			color: 0xff00ff
		});

		var radius = 0.08;

		circleGeometry = new THREE.CircleGeometry( radius );				
		circle = new THREE.Mesh( circleGeometry, material2 );
		scene.add( circle );
	}
	
	for( var i = 0; i < 3 * 3; i++)
		polyhedron_vertices.array[i] = surface_vertices.array[i];
	deduce_surface(0, polyhedron_vertices.array);
	
	//---------------------------------------------------Vertex Rearrangement stuff
	associated_vertices = Array( //where there is a choice of index, you must have the version of the vertex in the 5th triangle of the W
		1,
		0,
		
		7,
		18,
		2,
		12,
		
		11,
		2,
		6,
		16,
		
		15,
		6,
		10,
		20,
		
		19,
		10,
		14,
		4,
		
		3,
		14,
		18,
		8
		);
	
	//in principle you could work these out from the changed vertex and the right defect.
	var a = TAU / 6;
	var b = TAU / 3;
	var c = TAU / 2;
	var d = -a; 
	var e = -b;
	var f = -c;
	var g = TAU; //mathematically the same as zero, but we do a "if thingy is 0" check to see what's there
		
	//put in two points, it'll tell you how to rotate the change-vector of the first one to get the second one
	vertex_identifications = Array(
		[g,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0],
		[0,g,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,a,0, 0,0],
		[0,0,g,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0],
		[0,0,0,g,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, c,0],
		[0,0,0,0,g, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0],
		
		[0,0,0,0,0, g,0,0,0,e, 0,0,0,b,0, 0,0,f,0,0, 0,c],
		[0,0,0,0,0, 0,g,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0],
		[0,0,0,0,b, 0,0,g,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0],
		[0,0,0,0,0, 0,0,0,g,0, 0,0,0,0,0, 0,0,0,0,0, 0,0],
		[0,0,0,0,0, 0,0,0,0,g, 0,0,0,e,0, 0,0,b,0,0, 0,d],
		
		[0,0,0,0,0, 0,0,0,0,0, g,0,0,0,0, 0,0,0,0,0, 0,0],
		[0,0,0,0,0, 0,0,0,b,0, 0,g,0,0,0, 0,0,0,0,0, 0,0],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,g,0,0, 0,0,0,0,0, 0,0],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,g,0, 0,0,e,0,0, 0,b],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,g, 0,0,0,0,0, 0,0],
		
		[0,0,0,0,0, 0,0,0,0,0, 0,0,b,0,0, g,0,0,0,0, 0,0],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,g,0,0,0, 0,0],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,g,0,0, 0,e],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,g,0, 0,0],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,b,0,0,g, 0,0],
		
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, g,0],
		[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,g]);
		
	for( var i = 0; i < 22; i++ ) {
		for( var j = 0; j < 22; j++ ) {
			if( vertex_identifications[i][j] != 0 )
				vertex_identifications[j][i] = -vertex_identifications[i][j];
		}
	}	
	
	W_triangle_indices = Array(
		[4,8,12,17,18,1,	16,0], //the last numbers are the central triangle and the top triangle. The top is only to help the V's, so no vertices needed
		[17,18,1,4,8,12,	0,16],
		
		[4, 0, 1, 3,7,6,	2,5],
		[19,3,2,0,16,17,	1,18],
		[3,7,6, 4,0,1,		5,2],
		[7,3,19,14,13,10,	15,11],
		
		[8,4,5,7,11,10,		6,9],
		[3,7,6, 4,0,1,		5,2],
		[7,11,10,8,4,5,		9,6],
		[11,7,3,18,17,14,	19,15],
		
		[12,8,9,11,15,14,	10,13],
		[7,11,10,8,4,5,		9,6],
		[11,15,14,12,8,9,	13,10],
		[15,11,7,2,1,18,	3,19],
		
		[16,12,13,15,19,18,	14,17],
		[11,15,14,12,8,9,	13,10],
		[15,19,18,16,12,13,	17,14],
		[19,15,11,6,5,2,	7,3],
		
		[0, 16,17,19, 3, 2,	18,1],
		[15,19,18,16,12,13,	17,14],
		[19,3,2,0,16,17,	1,18],
		[3,19,15,10,9,6,	11,7]);
	
	for( var i = 0; i < 22; i++)
		W_vertex_indices[i] = [];
	for( var vertex_tobechanged = 0; vertex_tobechanged < 22; vertex_tobechanged++) {
		var associated_vertex = associated_vertices[vertex_tobechanged];
		
		for( var triangle_index_in_W = 0; triangle_index_in_W < 7; triangle_index_in_W++) {
			var triangle = W_triangle_indices[vertex_tobechanged][triangle_index_in_W];
			
			//we need to find which vertex, in this triangle, was either the associated or the changed vertex, and then put the OTHER two vertices in the array
			for( var i = 0; i< 3; i++) {
				var vertex_index = net_triangle_vertex_indices[triangle*3+i];
				var next_vertex_index = net_triangle_vertex_indices[triangle*3 + (i+1)%3 ];
				
				if( triangle_index_in_W !== 6 ) {
					if( vertex_identifications[vertex_tobechanged][vertex_index] !== 0 ||
						vertex_identifications[associated_vertex][vertex_index] !== 0
					   ) {
						W_vertex_indices[vertex_tobechanged][triangle_index_in_W * 2] = net_triangle_vertex_indices[triangle*3 + (i+2)%3 ]; //the indexes ascend clockwise
						W_vertex_indices[vertex_tobechanged][triangle_index_in_W*2+1] = net_triangle_vertex_indices[triangle*3 + (i+1)%3 ]; //but we wind counter-clockwise around the w
					}
				}
				else { //for triangle 6, there should be both identifications
					if( vertex_identifications[vertex_tobechanged][vertex_index] !== 0 &&
						vertex_identifications[associated_vertex][next_vertex_index] !== 0
					   ) {
						W_vertex_indices[vertex_tobechanged][triangle_index_in_W * 2] = net_triangle_vertex_indices[triangle*3 + (i+2)%3 ];
						W_vertex_indices[vertex_tobechanged][RIGHT_DEFECT] = associated_vertex; //this doesn't have to be *here*, but they're side-by-side in the array, so.
					}
				}
			}
		}
	}
	
	//W_vertex_indices example:
	//[2,6, 6,10, 10,14, 14,19, 19,20, 3,2,		14,1]
	//vertices going around the perimeter. The last two are the central triangle corner, and then the right defect. 
	
	//TODO: get triangle 8 in W's
	V_triangle_indices[CORE] = [];
	V_triangle_indices[ASSOCIATED] = [];
	for( var i = 0; i < 22; i++) {
		V_triangle_indices[CORE][i] = [];
		V_triangle_indices[ASSOCIATED][i] = [];
	}
	for( var vertex_tobechanged = 0; vertex_tobechanged < 22; vertex_tobechanged++) {		
		V_triangle_indices[CORE][vertex_tobechanged][0] = W_triangle_indices[vertex_tobechanged][7];
		V_triangle_indices[CORE][vertex_tobechanged][1] = W_triangle_indices[vertex_tobechanged][0];
		V_triangle_indices[CORE][vertex_tobechanged][2] = W_triangle_indices[vertex_tobechanged][1];
		V_triangle_indices[CORE][vertex_tobechanged][3] = W_triangle_indices[vertex_tobechanged][2];
		V_triangle_indices[CORE][vertex_tobechanged][4] = W_triangle_indices[vertex_tobechanged][6];
		
		V_triangle_indices[ASSOCIATED][vertex_tobechanged][0] = W_triangle_indices[vertex_tobechanged][6];
		V_triangle_indices[ASSOCIATED][vertex_tobechanged][1] = W_triangle_indices[vertex_tobechanged][3];
		V_triangle_indices[ASSOCIATED][vertex_tobechanged][2] = W_triangle_indices[vertex_tobechanged][4];
		V_triangle_indices[ASSOCIATED][vertex_tobechanged][3] = W_triangle_indices[vertex_tobechanged][5];
		V_triangle_indices[ASSOCIATED][vertex_tobechanged][4] = W_triangle_indices[vertex_tobechanged][7];
	}
	
	V_vertex_indices[CORE] = [];
	V_vertex_indices[ASSOCIATED] = [];
	for( var i = 0; i < 22; i++) {
		V_vertex_indices[CORE][i] = [];
		V_vertex_indices[ASSOCIATED][i] = [];
	}
	for( var vertex_tobechanged = 0; vertex_tobechanged < 22; vertex_tobechanged++) {
		for( var triangle_index_in_V = 0; triangle_index_in_V < 5; triangle_index_in_V++) {
			var triangle = V_triangle_indices[CORE][vertex_tobechanged][triangle_index_in_V];
			
			for( var triangle_vertex = 0; triangle_vertex< 3; triangle_vertex++) {
				vertex_index = net_triangle_vertex_indices[triangle*3+triangle_vertex];
				
				if( vertex_identifications[vertex_tobechanged][vertex_index] !== 0 ) {//if this is the vertex to be changed										
					V_vertex_indices[CORE][vertex_tobechanged][triangle_index_in_V * 3 + 2] = vertex_index;
					V_vertex_indices[CORE][vertex_tobechanged][triangle_index_in_V * 3 + 0] = net_triangle_vertex_indices[triangle*3 + (triangle_vertex+2)%3];
					V_vertex_indices[CORE][vertex_tobechanged][triangle_index_in_V * 3 + 1] = net_triangle_vertex_indices[triangle*3 + (triangle_vertex+1)%3];
				}
			}
		}
		
		var associated_vertex = associated_vertices[vertex_tobechanged];
		
		for( var triangle_index_in_V = 0; triangle_index_in_V < 5; triangle_index_in_V++) {
			var triangle = V_triangle_indices[ASSOCIATED][vertex_tobechanged][triangle_index_in_V];
			for( var triangle_vertex = 0; triangle_vertex< 3; triangle_vertex++) {
				vertex_index = net_triangle_vertex_indices[triangle*3+triangle_vertex];
				
				if( vertex_identifications[associated_vertex][vertex_index] !== 0 ) {//if this is the vertex associated with the changed one to be changed									
					V_vertex_indices[ASSOCIATED][vertex_tobechanged][triangle_index_in_V * 3 + 2] = vertex_index;
					V_vertex_indices[ASSOCIATED][vertex_tobechanged][triangle_index_in_V * 3 + 0] = net_triangle_vertex_indices[triangle*3 + (triangle_vertex+2)%3];
					V_vertex_indices[ASSOCIATED][vertex_tobechanged][triangle_index_in_V * 3 + 1] = net_triangle_vertex_indices[triangle*3 + (triangle_vertex+1)%3];
				}
			}
		}
	}
		
	ourclock.getDelta();
	//V vertex indices example:	[2,6,0,		6,10,0,		10,14,0,	14,18,0,	1,2,0],
}