/*	The below gets you radii, from which you can get minimum_angles
	which should be called polyhedron dihedral angles
	
	So you need to write something that gets the dihedral angle of a tetrahedron from edge lengths
*/

//delta is step width
//T is triangulation
//epsilon is error
//r is the set of radii
//kappa is a vector with all the curvatures kappa_i coming from r. Get its length to zero!
//kappa_i = TAU - omega_i. Omega_i is the defect when the tetrahedra are glued around an edge

delta = deltamax;
kappa_tilda = (1 - delta) * kappa(r);
while( norm(kappa(r)) > epsilon)  {
	try to get r_tilda s.t. kappa(r_tilda) === kappa_tilda
	if (you got r_tilda ){
		get concave edges
		if ( no concave edges ) {
			r = r_tilda
			delta = deltamax
		}
	}
	else //unsolvable, step size was too much
		delta = delta*delta;
	
	kappa_tilda = (1 - delta) * kappa(r)
}
return r;

function curvatures(r) {
	var curvature_array = Array([0,0,0,0,0,0,0,0,0,0,0,0]);
	for( var i = 0; i < 12; i++) {
		for( var j = 0; j < 5; j++) {
			var angle = //the formula is in the thesis
			
			curvature_array[i] += angle;
		}
	}
	return curvature_array;
}