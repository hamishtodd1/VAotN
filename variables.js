//--------------Fundamental shit
var scene = new THREE.Scene();
var window_width = 1200, window_height = 600;

//var camera = new THREE.PerspectiveCamera( 75, window_width / window_height, 0.1, 1000 );
var orthographic_cuboid_width = 16;
var camera = new THREE.OrthographicCamera( orthographic_cuboid_width / -2, orthographic_cuboid_width / 2, orthographic_cuboid_width / 4, orthographic_cuboid_width / -4, 0.1, 1000 );
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window_width, window_height );
document.body.appendChild( renderer.domElement );



//--------------Still quite fundamental
var isMouseDown = false;
var vertex_tobechanged = 666;

var HS3 = Math.sqrt(3)/2;
var PHI = (Math.sqrt(5) + 1) / 2;
var TAU = Math.PI * 2;

var capsidopenness = 1;
var capsidclock = 0;

var logged = 0;

//-----------not just constants
var net_triangle_vertex_indices;

var line_index_pairs = new Uint16Array(60 * 2);

var flatnet;
var flatnet_vertices_numbers;
var flatnet_vertices;
var flatnet_geometry;

//we need the polyhedron both to be seen and to help us get the minimum angles
var polyhedron;
var polyhedron_vertices_numbers;
var polyhedron_vertices;
var polyhedron_geometry;

var surface;
var surface_vertices_numbers;
var surface_vertices;
var surface_geometry;

var vertices_derivations;
var minimum_angles = new Array(); //between these two, we derive the polyhedron and surface

var circle;
var circleGeometry;

var vertex_identifications = new Array();
var W_triangle_indices = new Array();
var W_vertex_indices = new Array();
var W_surrounding_angles = new Float32Array([0,0,0,0,0,0]);
var V_vertex_indices = new Array();
var V_triangle_indices = new Array();

var CENTRAL_TRIANGLE = 6;
var CENTRAL_TRIANGLE_CORNER = 12;
var RIGHT_DEFECT = 13;
var CORE = 0;
var ASSOCIATED = 1;

var raycaster = new THREE.Raycaster();
var MousePosition = new THREE.Vector2();
var OldMousePosition = new THREE.Vector2();