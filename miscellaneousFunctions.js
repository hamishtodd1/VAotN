function get_sin_Vector2(side1, side2)
{
	return (side1.x * side2.y - side1.y * side2.x ) / side1.length() / side2.length();
}

function get_cos(side1, side2)
{
	return side1.dot( side2 ) / side1.length() / side2.length();
}

function get_angle(side1, side2) {
	return Math.acos(get_cos(side1, side2));
}

//a is the length of the side that is opposite the desired angle
function get_cos_rule(a,b,c)
{
	return (b*b + c*c - a*a) / (2*b*c);
}

//COUNTER CLOCKWISE
function rotate_vector2_counterclock( myvector, angle)
{
	var costheta = Math.cos(angle);
	var sintheta = Math.sin(angle);
	var newvector = new THREE.Vector2(
		myvector.x * costheta - myvector.y * sintheta,
		myvector.x * sintheta + myvector.y * costheta);
		
	return newvector;
}

//new vector would be at an angle to the rootvector
function vector_from_bearing( rootvector, length, angle, cos, sin) {
	if( sin === undefined ) {			
		var newvector = new THREE.Vector2(
			length / rootvector.length() * ( -Math.sin( angle) * rootvector.y - Math.cos(angle) * rootvector.x),
			length / rootvector.length() * (  Math.sin( angle) * rootvector.x - Math.cos(angle) * rootvector.y ) );
			
		return newvector;
	}
	else { //we might have been given a shortcut
		var newvector = new THREE.Vector2(
			length / rootvector.length() * ( cos * rootvector.x + sin * rootvector.y),
			length / rootvector.length() * ( cos * rootvector.y - sin * rootvector.x) );
			
		return newvector;
	}
}