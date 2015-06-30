//--------------Mathematically fundamental
var HS3 = Math.sqrt(3)/2;
var PHI = (Math.sqrt(5) + 1) / 2;
var TAU = Math.PI * 2;

//--------------Technologically fundamental
var scene = new THREE.Scene();
var playing_field_width = 7*HS3;
var playing_field_height = 6;
var window_height = 600;
var window_width = 600 * playing_field_width / playing_field_height;
var min_cameradist = 10;
var cameradist = min_cameradist;
var vertical_fov = 2 * Math.atan(playing_field_height/(2*cameradist));
var horizontal_fov = 2 * Math.atan(playing_field_width/(2*cameradist));

var camera = new THREE.PerspectiveCamera( vertical_fov * 360 / TAU, window_width / window_height, 0.1, 1000 );
//var camera = new THREE.OrthographicCamera( playing_field_width / -2, playing_field_width / 2, playing_field_height / 2, playing_field_height / -2, 0.1, 1000 );
camera.position.z = cameradist;
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window_width, window_height );
document.body.appendChild( renderer.domElement );



//----------------Static
var FLATNET = 0;
var SURFACE = 1;
var POLYHEDRON = 2;

//Not including the central vertex.
//mimivirus needs exactly 100. Try and work out how many a human can distinguish though
//you need 40 for phyconaviridae, which is pushing distinguishability
var number_of_hexagon_rings = 30;
var number_of_lattice_points = 1 + 3 * number_of_hexagon_rings*(number_of_hexagon_rings+1);

//----------------Initialized, then static
var squarelattice_vertices = Array(number_of_lattice_points*2);
var flatlattice_default_vertices = Array(number_of_lattice_points*3);

var backgroundtexture_file;
var backgroundtexture;

//--------------
var vertex_tobechanged = 666;

var capsidopenness = 0;
var capsidclock = 0;
var capsidopeningspeed = 0.018;

var logged = 0;

var showdebugstuff = 0;
var net_warnings = 0;
var ourclock = new THREE.Clock( true );
var delta_t = 0;

var surfaceangle = 0.63;
var net_triangle_vertex_indices;

var line_index_pairs = new Uint16Array(60 * 2);

var flatnet;
var flatnet_vertices_numbers;
var flatnet_vertices;
var flatnet_geometry;

//we need the polyhedron both to be seen and to help us get the minimum angles
var polyhedron;
var polyhedron_vertices_numbers = new Float32Array(22 * 3);
var polyhedron_vertices;
var polyhedron_geometry;

var surface;
var surface_vertices_numbers = new Float32Array(22*3);
var surface_vertices;
var surface_geometry;

var surface_triangle_side_unit_vectors = new Array();
var shear_matrix = new Array(20);

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
InputObject.mousex = window_width/2+1;
InputObject.mousey = window_height/2+1;
InputObject.isMouseDown = false;

var raycaster = new THREE.Raycaster();
var MousePosition = new THREE.Vector2(0,0);
var OldMousePosition = new THREE.Vector2(0,0);
var Mouse_delta = new THREE.Vector2(0,0);