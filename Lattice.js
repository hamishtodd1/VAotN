//Optimization for many things to do with lattice: just work on one one-sixth slice

//might things actually be better if the net got smaller?

var inverse_vertex_mass = 150; //really just a constant that accel is multiplied by
var dampingconstant = 0.05;
var distunit = 10;
//the above are tuned
var minaccel = 0.00001; //prevents round-off errors when lattice is still

function get_accel(index,vertex_destinationX,vertex_destinationY,vertex_destinationZ,distance ) {
	var accel = new THREE.Vector3(	vertex_destinationX - flatlattice_vertices.array[index*3+0],
									vertex_destinationY - flatlattice_vertices.array[index*3+1],
									vertex_destinationZ - flatlattice_vertices.array[index*3+2]);
	
	accel.x -= dampingconstant * flatlattice_vertices_velocities[index*3+0];
	accel.y -= dampingconstant * flatlattice_vertices_velocities[index*3+1];
	accel.z -= dampingconstant * flatlattice_vertices_velocities[index*3+2];
	
	//TODO we do something potentially complex with distance. It should probably have something to do with the pivot too
	//For time being, normalize then inverse square
	distance /= distunit;
	distance += 1; //because if distance is zero we want no impact
	
	accel.multiplyScalar(inverse_vertex_mass/Math.pow(distance,2));
	return accel;
}

var maxspeed = 34;
function updatelattice() {
	var costheta = Math.cos(LatticeAngle);
	var sintheta = Math.sin(LatticeAngle);

	for(var i = 1; i < number_of_lattice_points; i++) {
		var vertex_destinationX = (flatlattice_default_vertices[i*3+0] * costheta - flatlattice_default_vertices[i*3+1] * sintheta) * LatticeScale;
		var vertex_destinationY = (flatlattice_default_vertices[i*3+0] * sintheta + flatlattice_default_vertices[i*3+1] * costheta) * LatticeScale;
		var vertex_destinationZ = (1-capsidopenness) * camera.position.z * 1.5;
		
		var destination_distance = Math.pow(vertex_destinationX - MousePosition.x, 2) + Math.pow(vertex_destinationY - MousePosition.y, 2) + Math.pow(vertex_destinationZ, 2);
		destination_distance = Math.sqrt(destination_distance);
		
		flatlattice_vertices.array[i*3+0] += delta_t * flatlattice_vertices_velocities[i*3+0];
		flatlattice_vertices.array[i*3+1] += delta_t * flatlattice_vertices_velocities[i*3+1];
		flatlattice_vertices.array[i*3+2] += delta_t * flatlattice_vertices_velocities[i*3+2];
	
		var accel = get_accel(i, vertex_destinationX, vertex_destinationY,vertex_destinationZ,destination_distance);
		
		flatlattice_vertices.array[i*3+0] += delta_t * delta_t * accel.x / 2;
		flatlattice_vertices.array[i*3+1] += delta_t * delta_t * accel.y / 2;
		flatlattice_vertices.array[i*3+2] += delta_t * delta_t * accel.z / 2;
		
		var intermediate_velocityX = flatlattice_vertices_velocities[i*3+0] + delta_t * accel.x / 2;
		var intermediate_velocityY = flatlattice_vertices_velocities[i*3+1] + delta_t * accel.y / 2;
		var intermediate_velocityZ = flatlattice_vertices_velocities[i*3+2] + delta_t * accel.z / 2;
		
		flatlattice_vertices_velocities[i*3+0] = intermediate_velocityX + delta_t / 2 * accel.x;
		flatlattice_vertices_velocities[i*3+1] = intermediate_velocityY + delta_t / 2 * accel.y;
		flatlattice_vertices_velocities[i*3+2] = intermediate_velocityZ + delta_t / 2 * accel.z;
		
		accel.copy( get_accel(i, vertex_destinationX, vertex_destinationY, vertex_destinationZ,destination_distance) );
		
		flatlattice_vertices_velocities[i*3+0] = intermediate_velocityX + delta_t * accel.x / 2;
		flatlattice_vertices_velocities[i*3+1] = intermediate_velocityY + delta_t * accel.y / 2;
		flatlattice_vertices_velocities[i*3+2] = intermediate_velocityZ + delta_t * accel.z / 2;
		
		var speed = Math.pow(flatlattice_vertices_velocities[i*3+0]*flatlattice_vertices_velocities[i*3+0]
							+flatlattice_vertices_velocities[i*3+1]*flatlattice_vertices_velocities[i*3+1]
							+flatlattice_vertices_velocities[i*3+2]*flatlattice_vertices_velocities[i*3+2], 0.5);
		if(speed > maxspeed ) {
			//flatlattice_vertices_velocities[i*3+0] *= maxspeed/speed;
			speed = maxspeed;
		}
		lattice_colors[i*3+1] = speed/maxspeed;		
		
		//it's more like you want to limit how far away they get from their neighbours, pretty hard
	}
	
	flatlattice.geometry.attributes.position.needsUpdate = true;
	flatlattice.geometry.attributes.color.needsUpdate = true;
}

//you could move the net. There again, the lattice has to move on the screen, so.
function HandleLatticeMovement() {
	if(!InputObject.isMouseDown){
		LatticeGrabbed = false;

		var centralaxis = new THREE.Vector3(0, 0, 1);	
		
		var firstnetvertex = new THREE.Vector3(flatnet_vertices.array[ 3 ],flatnet_vertices.array[ 4 ],0);
		firstnetvertex.multiplyScalar(1/LatticeScale);
		firstnetvertex.applyAxisAngle(centralaxis,-LatticeAngle);
		
		var closestlatticevertexindex = index_of_closest_default_lattice_vertex(firstnetvertex.x,firstnetvertex.y);
		var closestlatticevertex = new THREE.Vector3(flatlattice_default_vertices[closestlatticevertexindex*3+0],flatlattice_default_vertices[closestlatticevertexindex*3+1],0);

		var scaleaugmentation = firstnetvertex.length()/closestlatticevertex.length();
		var angleaugmentation = closestlatticevertex.angleTo(firstnetvertex);
		if(point_to_the_right_of_line(	closestlatticevertex.x,closestlatticevertex.y,
										firstnetvertex.x,firstnetvertex.y, 0,0) ===0 )
			angleaugmentation*=-1;
		
		LatticeScale *= scaleaugmentation;
		LatticeAngle += angleaugmentation;
	} else {
		if( vertex_tobechanged !== 666) //temporary, think of a better system. I mean, these are two different things so you could have "game mode
			return;
			
		var Mousedist = MousePosition.distanceTo(flatlattice_center);
		if( Mousedist < HS3 * 10/3) {
			LatticeGrabbed = true;
			
			var OldMousedist = OldMousePosition.distanceTo(flatlattice_center); //unless the center is going to change?
			
			var maxLatticeScaleChange = 10;
			var minLatticeScaleChange = 0.9;
			var LatticeScaleChange = Mousedist / OldMousedist;
			//TODO impose limits. The "fuzz" comes from scaling, not rotation
			//if( LatticeScaleChange > maxLatticeScaleChange) LatticeScaleChange = maxLatticeScaleChange;
			//if( LatticeScaleChange < minLatticeScaleChange) LatticeScaleChange = minLatticeScaleChange;
			
			LatticeScale *= LatticeScaleChange;
			if(LatticeScale < 10/3 * HS3 / number_of_hexagon_rings)
				LatticeScale = 10/3 * HS3 / number_of_hexagon_rings;
			if(LatticeScale > 1)
				LatticeScale = 1;
			//you could have a more sophisticated upper limit, a flower or something that keeps things more valid
			//however, it raises the possibility of people not realizing they can go to one, which'd be awful
			
			var MouseAngle = Math.atan2( (MousePosition.x - flatlattice_center.x), (MousePosition.y - flatlattice_center.y) );
			if(MousePosition.x - flatlattice_center.x === 0 && MousePosition.y - flatlattice_center.y === 0)
				MouseAngle = 0; //well, undefined
			
			var OldMouseAngle = Math.atan2( (OldMousePosition.x - flatlattice_center.x), (OldMousePosition.y - flatlattice_center.y) );
			if(OldMousePosition.x - flatlattice_center.x === 0 && OldMousePosition.y - flatlattice_center.y === 0)
				OldMouseAngle = 0;
			
			//speed up opening. TODO Sensetive enough so you know it happens, not so sensetive that touchscreens don't see slow opening
			if(Math.abs(OldMouseAngle - MouseAngle) > 0.08) capsidopeningspeed += 0.0045;
			
			var maxLatticeAngleChange = 0.5;
			var LatticeAngleChange = OldMouseAngle - MouseAngle;
			//if(Math.abs(LatticeAngleChange) > maxLatticeAngleChange) LatticeAngleChange = maxLatticeAngleChange * Math.sign(LatticeAngleChange);
			LatticeAngle += LatticeAngleChange;
		}
	}
	updatelattice();
}

function Map_lattice() {
	//potential optimisation: break out of the loop when you're past a certain radius. That only helps small capsids though.
	//potential optimisation: just put one in each net triangle and extrapolate
	for(var i = 0; i < number_of_lattice_points; i++) {
		var triangle = locate_in_squarelattice_net(squarelattice_vertices[i*2+0],squarelattice_vertices[i*2+1]);
		
		if( triangle !== 666) {
			var mappedpoint = map_from_lattice_to_surface(
				flatlattice_vertices.array[ i*3+0 ], flatlattice_vertices.array[ i*3+1 ],
				triangle);
			
			surflattice_vertices.setXYZ(i, mappedpoint.x, mappedpoint.y, mappedpoint.z );
			
			if(cutout_mode) {
				lattice_colors[i*3+0] = 1;
				lattice_colors[i*3+1] = 0;
				lattice_colors[i*3+2] = 0;
			}
		}
		else {
			surflattice_vertices.setXYZ(i, flatlattice_vertices.array[ i*3+0 ],flatlattice_vertices.array[ i*3+1 ],flatlattice_vertices.array[ i*3+2 ]);
			if(cutout_mode) {
				lattice_colors[i*3+0] = 1;
				lattice_colors[i*3+1] = 0.5;
				lattice_colors[i*3+2] = 0;
			}
		}
	}
	
	surflattice.geometry.attributes.position.needsUpdate = true;
	surflattice.geometry.attributes.color.needsUpdate = true;
}

//vertex *destination*. Not vertex, which may be interesting.
function index_of_closest_default_lattice_vertex(x,y) {
	var closest_point_so_far_index = 66666;
	var lowest_quadrance_so_far = 66666;
	for( var j = 0; j < number_of_lattice_points; j++) {
		var quadrance = (x-flatlattice_default_vertices[j*3 + 0])*(x-flatlattice_default_vertices[j*3 + 0]) + 
						(y-flatlattice_default_vertices[j*3 + 1])*(y-flatlattice_default_vertices[j*3 + 1]);
		
		if( quadrance < lowest_quadrance_so_far) {
			closest_point_so_far_index = j;
			lowest_quadrance_so_far = quadrance;
		}
	}
	return closest_point_so_far_index;
}