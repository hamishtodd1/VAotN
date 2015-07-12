/**
 * 
 */
//A and B can't be the same, nor can either be 0
function get_contravariant_vector(originalvector, origin_basisvectorA, origin_basisvectorB, new_basisvectorA, new_basisvectorB ){
	if(!logged && (origin_basisvectorA.length() ===0 || origin_basisvectorA.length() ===0 || new_basisvectorB.length() ===0 || new_basisvectorB.length() ===0 ) )
		console.log("one of those vectors was zero");
	
	var Acomponent = origin_basisvectorB.y * originalvector.x - origin_basisvectorB.x * originalvector.y;
	Acomponent /= origin_basisvectorB.y * origin_basisvectorA.x - origin_basisvectorB.x * origin_basisvectorA.y; //really shouldn't be zero
	
	var Bcomponent = origin_basisvectorA.y * originalvector.x - origin_basisvectorA.x * originalvector.y;
	Bcomponent /= origin_basisvectorA.y * origin_basisvectorB.x - origin_basisvectorA.x * origin_basisvectorB.y;
	//if(!logged)console.log(Acomponent,Bcomponent);	
	
	var newvectorA = new_basisvectorA.clone();
	var newvectorB = new_basisvectorB.clone();
	newvectorA.multiplyScalar(Acomponent);
	newvectorB.multiplyScalar(Bcomponent);
	
	var newvector = new THREE.Vector3();
	newvector.addVectors(newvectorA,newvectorB);
	
	var oldvectorA = origin_basisvectorA.clone();
	var oldvectorB = origin_basisvectorB.clone();
	oldvectorA.multiplyScalar(Acomponent);
	oldvectorB.multiplyScalar(Bcomponent);
	var oldvector = new THREE.Vector3();
	oldvector.addVectors(oldvectorA,oldvectorB);
	if(oldvector.x-originalvector.x > 0.001 || oldvector.y-originalvector.y > 0.001) console.log(oldvector,originalvector);
	
	
	return newvector;
}
var axis = new THREE.Vector3(0,1,0);
function fill_out_layer(hand, layer) {
	dodecahedron_vertices.setXYZ(layer*3+1,	hand.x,hand.y,hand.z);
	hand.applyAxisAngle(axis, -TAU/3); //you may be rotating the wrong way	
	dodecahedron_vertices.setXYZ(layer*3+2,	hand.x,hand.y,hand.z);
	hand.applyAxisAngle(axis, -TAU/3);
	dodecahedron_vertices.setXYZ(layer*3+3,	hand.x,hand.y,hand.z);
}

function dodecahedron_vertex(i){
	vec = new THREE.Vector3(dodecahedron_vertices.array[i*3+0],
							dodecahedron_vertices.array[i*3+1],
							dodecahedron_vertices.array[i*3+2]);
	return vec;
}

function deduce_dodecahedron(secondrun) {
	dodecahedron_vertices.setXYZ(0,	0,0,0);
	
	var pentagon = [];
	for(var i = 0; i < 5; i++)
		pentagon.push( new THREE.Vector3(pentagon_vertices.array[i*3+0],pentagon_vertices.array[i*3+1],0) );
	var angles = [];
	for(var i = 0; i<5; i++){
		var toright = new THREE.Vector3();
		var toleft = new THREE.Vector3();
		toright.subVectors(pentagon[(i+1)%5], pentagon[i]);
		toleft.subVectors(pentagon[(i+4)%5], pentagon[i]);
		angles.push(toright.angleTo(toleft));
	}
	
	var l = pentagon[0].distanceTo(pentagon[1]);
	var w = pentagon[4].distanceTo(pentagon[1]);
	
	var first_layer_y = -Math.sqrt(l*l-w*w/3); 
	var first_layer_radius = w/Math.sqrt(3);
	
	var basisvector0 = new THREE.Vector3();
	var basisvector1 = new THREE.Vector3();
	var pentagonbasisvector0 = new THREE.Vector3();
	var pentagonbasisvector1 = new THREE.Vector3();
	
	var hand = new THREE.Vector3(0,first_layer_y,first_layer_radius);
	fill_out_layer(hand, 0);
	
	basisvector0.set( 	dodecahedron_vertices.array[1*3+0] - dodecahedron_vertices.array[0*3+0],
						dodecahedron_vertices.array[1*3+1] - dodecahedron_vertices.array[0*3+1],
						dodecahedron_vertices.array[1*3+2] - dodecahedron_vertices.array[0*3+2]);
	basisvector1.set( 	dodecahedron_vertices.array[3*3+0] - dodecahedron_vertices.array[0*3+0],
						dodecahedron_vertices.array[3*3+1] - dodecahedron_vertices.array[0*3+1],
						dodecahedron_vertices.array[3*3+2] - dodecahedron_vertices.array[0*3+2]); //so we have points 1 and 3 as basis vectors
	
	pentagonbasisvector0.subVectors(pentagon[1], pentagon[0]);
	pentagonbasisvector1.subVectors(pentagon[4], pentagon[0]);
	
	hand.subVectors(pentagon[2], pentagon[0]);	
	hand.copy(get_contravariant_vector(hand,pentagonbasisvector0,pentagonbasisvector1,basisvector0, basisvector1));
	fill_out_layer(hand, 1);
	
	hand.subVectors(pentagon[3], pentagon[0]);	
	hand.copy(get_contravariant_vector(hand,pentagonbasisvector0,pentagonbasisvector1,basisvector0, basisvector1));
	fill_out_layer(hand, 2);
	
	
	basisvector0.set( 	dodecahedron_vertices.array[7*3+0] - dodecahedron_vertices.array[3*3+0],
						dodecahedron_vertices.array[7*3+1] - dodecahedron_vertices.array[3*3+1],
						dodecahedron_vertices.array[7*3+2] - dodecahedron_vertices.array[3*3+2]);
	basisvector1.set( 	dodecahedron_vertices.array[6*3+0] - dodecahedron_vertices.array[3*3+0],
						dodecahedron_vertices.array[6*3+1] - dodecahedron_vertices.array[3*3+1],
						dodecahedron_vertices.array[6*3+2] - dodecahedron_vertices.array[3*3+2]); //now points 7 and 3.
	
	pentagonbasisvector0.subVectors(pentagon[4],pentagon[3]);
	pentagonbasisvector1.subVectors(pentagon[2],pentagon[3]);
	
	if(Math.abs(pentagonbasisvector0.angleTo(pentagonbasisvector1) - basisvector0.angleTo(basisvector1) ) > 0.01) {
		if(secondrun === 1) {
			console.log("fuck");
			if(!logged)console.log(Math.abs(pentagonbasisvector0.angleTo(pentagonbasisvector1) - basisvector0.angleTo(basisvector1) ));
			logged = 1;
			return;
		}
		
		var new234angle = basisvector0.angleTo(basisvector1);
		var across = new THREE.Vector3();
		across.subVectors(pentagon[1], pentagon[4]);
		var home = new THREE.Vector3();
		home.subVectors(pentagon[0], pentagon[4]);
		var subalpha1 = home.angleTo(across);
		var alpha1 = angles[4] - subalpha1;
		var subalpha2 = TAU/2 - subalpha1 - angles[0];
		var alpha2 = angles[1] - subalpha2;
		var littleangle = (new234angle+alpha1+alpha2 - TAU/2) / 2;
		
		var newedge1length = across.length() * Math.sin(alpha1) / 2 / Math.cos(littleangle) / Math.sin(new234angle-littleangle);
		var newedge1 = new THREE.Vector3();
		newedge1.subVectors(pentagon[2],pentagon[1]);
		newedge1.normalize();
		newedge1.multiplyScalar(newedge1length);
		newedge1.add(pentagon[1]);
		pentagon_vertices.array[2*3+0] = newedge1.x; pentagon_vertices.array[2*3+1] = newedge1.y;
		
		var newedge4length = across.length() * Math.sin(alpha2-littleangle)/Math.sin(new234angle-littleangle);
		var newedge4 = new THREE.Vector3();
		newedge4.subVectors(pentagon[3],pentagon[4]);
		//console.log(newedge4.length(), newedge1length);
		newedge4.normalize();
		newedge4.multiplyScalar(newedge4length);
		newedge4.add(pentagon[4]);
		pentagon_vertices.array[3*3+0] = newedge4.x; pentagon_vertices.array[3*3+1] = newedge4.y;
		
		deduce_dodecahedron(1);
		return;
	}
	
	hand.subVectors(pentagon[0], pentagon[3]);
	hand.copy(get_contravariant_vector(hand,pentagonbasisvector0,pentagonbasisvector1,basisvector0, basisvector1));
	hand.x += dodecahedron_vertices.array[3*3+0]; hand.y += dodecahedron_vertices.array[3*3+1]; hand.z += dodecahedron_vertices.array[3*3+2];
	fill_out_layer(hand, 3); //yeah, there's a problem
	
	hand.subVectors(pentagon[1], pentagon[3]);	
	hand.copy(get_contravariant_vector(hand,pentagonbasisvector0,pentagonbasisvector1,basisvector0, basisvector1));
	hand.x += dodecahedron_vertices.array[3*3+0]; hand.y += dodecahedron_vertices.array[3*3+1]; hand.z += dodecahedron_vertices.array[3*3+2];
	fill_out_layer(hand, 4);//we suspect that this is offending
	
	basisvector0.set( 	dodecahedron_vertices.array[4*3+0] - dodecahedron_vertices.array[7*3+0],
						dodecahedron_vertices.array[4*3+1] - dodecahedron_vertices.array[7*3+1],
						dodecahedron_vertices.array[4*3+2] - dodecahedron_vertices.array[7*3+2]);
	basisvector1.set( 	dodecahedron_vertices.array[10*3+0] - dodecahedron_vertices.array[7*3+0],
						dodecahedron_vertices.array[10*3+1] - dodecahedron_vertices.array[7*3+1],
						dodecahedron_vertices.array[10*3+2] - dodecahedron_vertices.array[7*3+2]);
	
	pentagonbasisvector0.subVectors(pentagon[2],pentagon[1]);
	pentagonbasisvector1.subVectors(pentagon[0],pentagon[1]);
	
	hand.subVectors(pentagon[4], pentagon[1]);
	hand.copy(get_contravariant_vector(hand,pentagonbasisvector0,pentagonbasisvector1,basisvector0, basisvector1));
	hand.x += dodecahedron_vertices.array[7*3+0]; hand.y += dodecahedron_vertices.array[7*3+1]; hand.z += dodecahedron_vertices.array[7*3+2];
	fill_out_layer(hand, 5);
	
	
	var testpent = [];
	testpent.push(dodecahedron_vertex(10));
	testpent.push(dodecahedron_vertex(13));
	testpent.push(dodecahedron_vertex(6));
	testpent.push(dodecahedron_vertex(3));
	testpent.push(dodecahedron_vertex(7));
	for( var i = 0; i < 5; i++){
		edgelenP = pentagon[i].distanceTo(pentagon[(i+1)%5]);
		edgelenD = testpent[i].distanceTo(testpent[(i+1)%5]);
		
		edgelenP -= edgelenD;
		if(Math.abs(edgelenP) > 0.01)
			console.log(i, edgelenP);
		
		var toright = new THREE.Vector3();
		var toleft = new THREE.Vector3();
		toright.subVectors(testpent[(i+1)%5], testpent[i]);
		toleft.subVectors(testpent[(i+4)%5], testpent[i]);
		var angle = toright.angleTo(toleft);
		
		if( Math.abs(angles[i] - angle) > 0.01)
			console.log(i, angles[i] - angle);
	}
	
	
	
	
	
	
	
	
	basisvector0.set( 	dodecahedron_vertices.array[11*3+0] - dodecahedron_vertices.array[14*3+0],
						dodecahedron_vertices.array[11*3+1] - dodecahedron_vertices.array[14*3+1],
						dodecahedron_vertices.array[11*3+2] - dodecahedron_vertices.array[14*3+2]);
	basisvector1.set( 	dodecahedron_vertices.array[16*3+0] - dodecahedron_vertices.array[14*3+0],
						dodecahedron_vertices.array[16*3+1] - dodecahedron_vertices.array[14*3+1],
						dodecahedron_vertices.array[16*3+2] - dodecahedron_vertices.array[14*3+2]);
	
	pentagonbasisvector0.subVectors(pentagon[3],pentagon[2]);
	pentagonbasisvector1.subVectors(pentagon[1],pentagon[2]);
	
	hand.subVectors(pentagon[0], pentagon[2]);
	hand.copy(get_contravariant_vector(hand,pentagonbasisvector0,pentagonbasisvector1,basisvector0, basisvector1));
	hand.x += dodecahedron_vertices.array[14*3+0]; hand.y += dodecahedron_vertices.array[14*3+1]; hand.z += dodecahedron_vertices.array[14*3+2];

	var finalx = 0;
	var finalz = 0;
	finalx+=hand.x;
	finalz+=hand.z;
	hand.applyAxisAngle(axis, -TAU/3); //you may be rotating the wrong way	
	finalx+=hand.x;
	finalz+=hand.z;
	hand.applyAxisAngle(axis, -TAU/3);
	finalx+=hand.x;
	finalz+=hand.z;
	
	finalx /=3;
	finalz /=3;
	
	dodecahedron_vertices.setXYZ(19, finalx,hand.y,finalz);

	var height = -hand.y;
	for( var i = 0; i < 20; i++)
		dodecahedron_vertices.array[i*3+1] += height/2;
	
	dodecahedron_vertices.needsUpdate = true;
}