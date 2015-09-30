//--------------Mathematically fundamental
var HS3 = Math.sqrt(3)/2;
var PHI = (Math.sqrt(5) + 1) / 2;
var TAU = Math.PI * 2;

//--------------Structurally fundamental
var STATIC_PROTEIN_MODE = 0;
var STATIC_DNA_MODE = 1; 
var CK_MODE = 2;
var CUBIC_LATTICE_MODE = 3;
var QC_SPHERE_MODE = 4;
var IRREGULAR_MODE = 5; //so we're going to have a button below the thing
	
var MODE = IRREGULAR_MODE;

//--------------Technologically fundamental
var playing_field_width = MODE === IRREGULAR_MODE ? HS3 * 16 : 7*HS3;
var playing_field_height = 6;
var window_height = 600; //100 pixels per unit
var window_width = window_height * playing_field_width / playing_field_height;
var min_cameradist = 10; //get any closer and the perspective is weird
var vertical_fov = 2 * Math.atan(playing_field_height/(2*min_cameradist));

var camera = new THREE.PerspectiveCamera( vertical_fov * 360 / TAU, window_width / window_height, 0.1, 1000 );
//var camera = new THREE.OrthographicCamera( playing_field_width / -2, playing_field_width / 2, playing_field_height / 2, playing_field_height / -2, 0.1, 1000 );
camera.position.z = min_cameradist;

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window_width, window_height );
document.body.appendChild( renderer.domElement );

var ourclock = new THREE.Clock( true );
var delta_t = 0;

//----------------Static
var FLATNET = 0;
var SURFACE = 1;
var POLYHEDRON = 2;

var showdebugstuff = 0;
var net_warnings = 0;

var surfperimeter_default_radius = 0.02;

//Not including the central vertex
//mimivirus needs exactly 100. Try and work out how many a human can distinguish though
//you need 40 for phyconaviridae, which is pushing distinguishability
var number_of_hexagon_rings = 30;
var number_of_lattice_points = 1 + 3 * number_of_hexagon_rings*(number_of_hexagon_rings+1);

//in the limited environment we will end up with (and might do well to be going with) a circle of existence for lattice pts is prb. best

//----------------Initialized, then static
var squarelattice_vertices = Array(number_of_lattice_points*2);
var flatlattice_default_vertices = Array(number_of_lattice_points*3);

var backgroundtexture_file;
var backgroundtexture;

var net_triangle_vertex_indices;
var line_index_pairs = new Uint16Array(60 * 2);

//--------------Varying, fundamental
var logged = 0;

//--------------Varying
var vertex_tobechanged = 666;

var capsidopenness = 0; //much depends on this, but we should have as few sharp changes as possible
var capsidclock = 0;
var capsidopeningspeed = 0;

var surfaceangle = 0.63;

var dodeca;
var dodeca_vertices_numbers = new Float32Array(47 * 3);
var dodeca_geometry;
var dodeca_openness = 0;
var dodeca_faceflatness = 0;
var dodeca_angle = 0;
var dodeca_triangle_vertex_indices;
var back_hider;
var quasilattice_default_vertices = Array(18*5);
var quasilattice_pairs = Array(29*5*2);
var cutout_vector0; //these lie on the lattice
var cutout_vector1;
var quasi_shear_matrix = Array(4);
var quasicutout_intermediate_vertices = Array(36);
var quasicutouts_vertices_components = Array(36);
var quasicutout_line_pairs = new Uint16Array(36*2);
var quasicutouts = Array(60);

var golden_rhombohedra = Array(20);
var golden_triacontahedra = Array(12);
var goldenicos = Array(12);
var explodedness = 1;

var flatnet;
var flatnet_vertices_numbers;
var flatnet_vertices;
var flatnet_geometry;

//we need the polyhedron to be seen
var polyhedron;
var polyhedron_vertices_numbers = new Float32Array(22 * 3);
var polyhedron_vertices;
var polyhedron_geometry;

var surface;
var surface_vertices_numbers = new Float32Array(22*3);
var surface_vertices;
var surface_geometry;

var surfperimeter_line_index_pairs = new Uint16Array(22 * 2);
var surfperimeter_cylinders = Array(22);
var surfperimeter_spheres = Array(22);
var blast_cylinders = Array(10);

var groovepoints = Array(
	[21,5,20,3,18,1,0,0],
	[5,9,4,7,2,2],
	[9,13,8,11,6,6],
	[13,17,12,15,10,10],
	[17,21,16,19,14,14]);

var surface_triangle_side_unit_vectors = new Array();
var shear_matrix = new Array(20);

var radii = new Float32Array([100,100,100, 100,100,100, 100,100,100, 100,100,100]); //initial values chosen rather randomly. Potential speedup by decreasing this? Does algorithm ever increase them?
var polyhedron_edge_length;

var lattice_colors = new Float32Array(number_of_lattice_points * 3);

var flatlattice;
var flatlattice_vertices;
var flatlattice_geometry;
var flatlattice_center = new THREE.Vector2(0,0);
var flatlattice_vertices_numbers = new Float32Array(3 * number_of_lattice_points);
var flatlattice_vertices_velocities = new Float32Array(3 * number_of_lattice_points);

var net_vertices_closest_lattice_vertex = Array(22);

var surflattice;
var surflattice_vertices_numbers = new Float32Array(3 * number_of_lattice_points);
var surflattice_vertices;
var surflattice_geometry;

var LatticeScale = 10/3 * HS3 / number_of_hexagon_rings;
var LatticeAngle = TAU/12;
var LatticeGrabbed = false;

var vertices_derivations;
var minimum_angles = new Array(22); //between these two, we derive the polyhedron and surface

var circle;
var circleGeometry;

var cutout_mode = true;

var vertex_identifications = new Array();
var W_triangle_indices = new Array();
var W_vertex_indices = new Array();
var W_surrounding_angles = new Float32Array([0,0,0,0,0,0]);
var V_vertex_indices = new Array();
var V_triangle_indices = new Array();
var V_angles = new Array(22);

var V_squasher;

var CENTRAL_TRIANGLE = 6;
var CENTRAL_TRIANGLE_CORNER = 12;
var RIGHT_DEFECT = 13;
var CORE = 0;
var ASSOCIATED = 1;

var InputObject = {};
InputObject.mousex = window_width/2+30;
InputObject.mousey = window_height/2+30;
InputObject.isMouseDown = false;

var raycaster = new THREE.Raycaster();
var MousePosition = new THREE.Vector2(0,0);
var OldMousePosition = new THREE.Vector2(0,0);
var Mouse_delta = new THREE.Vector2(0,0);