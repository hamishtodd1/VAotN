var inverse_vertex_mass = 150; //really just a constant that accel is multiplied by
var dampingconstant = 0.05;
var distunit = 10;
//the above are tuned
var minaccel = 0.00001; //prevents round-off errors when lattice is still

function get_accel(index,vertex_destinationX,vertex_destinationY,distance ) {
	//a force is created that is inversely proportional to your distance from the moved vertex, that is directed towards their intended destination. Every vertex has a momentum
	var accel = new THREE.Vector2(	vertex_destinationX - flatlattice_vertices.array[index*3+0],
									vertex_destinationY - flatlattice_vertices.array[index*3+1] );
	
//	if(accel.x < minaccel && accel.y < minaccel) {
//		accel.set(0,0);
//		return accel;
//	}
	
	accel.x -= dampingconstant * flatlattice_vertices_velocities[index*3+0];
	accel.y -= dampingconstant * flatlattice_vertices_velocities[index*3+1];
	
	//TODO we do something potentially complex with distance. It should probably have something to do with the pivot too
	//For time being, normalize then inverse square
	distance /= distunit;
	distance += 1; //because if distance is zero we want no impact
	
	accel.multiplyScalar(inverse_vertex_mass/Math.pow(distance,2));
	return accel;
}
var maxaccel = 0;
function updatelattice() {
	var costheta = Math.cos(LatticeAngle);
	var sintheta = Math.sin(LatticeAngle);
	
	var oldmaxaccel = maxaccel;

	for(var i = 1; i < number_of_lattice_points; i++) {
		var vertex_destinationX = (flatlattice_default_vertices[i*3+0] * costheta - flatlattice_default_vertices[i*3+1] * sintheta) * LatticeScale;
		var vertex_destinationY = (flatlattice_default_vertices[i*3+0] * sintheta + flatlattice_default_vertices[i*3+1] * costheta) * LatticeScale;
		var destination_distance = Math.pow(vertex_destinationX - MousePosition.x, 2) + Math.pow(vertex_destinationY - MousePosition.y, 2);
		destination_distance = Math.sqrt(destination_distance);
		
		flatlattice_vertices.array[i*3+0] += delta_t * flatlattice_vertices_velocities[i*3+0];
		flatlattice_vertices.array[i*3+1] += delta_t * flatlattice_vertices_velocities[i*3+1];
	
		//a force is created that is inversely proportional to your distance from the moved vertex, that is directed towards their intended destination. Every vertex has a momentum
		var accel = get_accel(i, vertex_destinationX, vertex_destinationY,destination_distance);
		
		flatlattice_vertices.array[i*3+0] += delta_t * delta_t * accel.x / 2;
		flatlattice_vertices.array[i*3+1] += delta_t * delta_t * accel.y / 2;
		
		var intermediate_velocityX = flatlattice_vertices_velocities[i*3+0] + delta_t * accel.x / 2;
		var intermediate_velocityY = flatlattice_vertices_velocities[i*3+1] + delta_t * accel.y / 2;
		
		flatlattice_vertices_velocities[i*3+0] = intermediate_velocityX + delta_t / 2 * accel.x;
		flatlattice_vertices_velocities[i*3+1] = intermediate_velocityY + delta_t / 2 * accel.y;
		
		accel.copy( get_accel(i, vertex_destinationX, vertex_destinationY,destination_distance) );
		
		flatlattice_vertices_velocities[i*3+0] = intermediate_velocityX + delta_t * accel.x / 2;
		flatlattice_vertices_velocities[i*3+1] = intermediate_velocityY + delta_t * accel.y / 2;
		
		var speed = Math.pow(flatlattice_vertices_velocities[i*3+0]*flatlattice_vertices_velocities[i*3+0]+flatlattice_vertices_velocities[i*3+1]*flatlattice_vertices_velocities[i*3+1], 0.5);
		if(speed > 0.1 )
			lattice_colors[i*3+1] = 0;
		else
			lattice_colors[i*3+1] = 1;
		
		if(speed > maxaccel )
			maxaccel = speed;
		if(speed > maxaccel )
			maxaccel = speed;
	}
	
	//if(maxaccel>oldmaxaccel) console.log(maxaccel);
	
	flatlattice.geometry.attributes.position.needsUpdate = true;
	flatlattice.geometry.attributes.color.needsUpdate = true;
}

function Lattice_freewheel() {
	return;
}

//you could move the net. There again, the lattice has to move on the screen, so.
function HandleLatticeMovement() {
	if(!InputObject.isMouseDown){
		LatticeGrabbed = false;
		Lattice_freewheel();
	} else {
		if( vertex_tobechanged !== 666) //temporary, think of a better system
			return;
			
		var Mousedist = MousePosition.distanceTo(flatlattice_center);
		if( Mousedist < HS3 * 10/3) {
			LatticeGrabbed = true;
			
			var OldMousedist = OldMousePosition.distanceTo(flatlattice_center); //unless the center is going to change?
			
			LatticeScale *= Mousedist / OldMousedist;
			if(LatticeScale < 1/(40*HS3))
				LatticeScale = 1/(40*HS3);
			if(LatticeScale > 1)
				LatticeScale = 1;
			//you could have a more sophisticated upper limit, a flower or something that keeps things more valid
			//however, it raises the possibility of people not realizing they can go to one, which'd be awful
			
			var MouseAngle = Math.atan2( (MousePosition.x - flatlattice_center.x), (MousePosition.y - flatlattice_center.y) );
			var OldMouseAngle = Math.atan2( (OldMousePosition.x - flatlattice_center.x), (OldMousePosition.y - flatlattice_center.y) );
			
			LatticeAngle += OldMouseAngle - MouseAngle;
		}
	}
	updatelattice();
}

function Map_lattice() {
	//potential optimization: break out of the loop when you're past a certain radius. That only helps small capsids though.
	//potential optimization: just put one in each net triangle and extrapolate
	for(var i = 0; i < number_of_lattice_points; i++) {
		var triangle = locate_in_net(flatlattice_vertices.array[ i*3+0 ], flatlattice_vertices.array[ i*3+1 ]);
		if( triangle !== 666) {
			var mappedpoint = map_from_lattice_to_surface(
				flatlattice_vertices.array[ i*3+0 ], flatlattice_vertices.array[ i*3+1 ],
				triangle);
				
				//if(!logged)console.log(mappedpoint);
			
			surflattice_vertices.setXYZ(i, mappedpoint.x, mappedpoint.y, mappedpoint.z );
			
			//remove us from the flatlattice
//			if(cutout_mode) {
//				lattice_colors[i*3+0] = 0;
//				lattice_colors[i*3+1] = 0;
//				lattice_colors[i*3+2] = 0;
//			}
		}
		else {
			surflattice_vertices.setXYZ(i, 0,0,0);
		}
	}
	
	surflattice_vertices.needsUpdate = true;
}