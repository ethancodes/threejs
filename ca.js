/*
  functions for cellular automata
*/

var ca_generation = 0;
var ca_generation_size = 50;

var material;
var m_black = new THREE.LineBasicMaterial( { color: 'black' } );
var m_green = new THREE.LineBasicMaterial( { color: '#00ff00' } );
var m_on    = m_green;


function ca_init() {
  var g = [];
  for (var cell = 0; cell <= ca_generation_size; cell++) {
    if (Math.random() > 0.5) {
      g.push(1);
    } else {
      g.push(0);
    }
  }
  ca_draw_generation(g);
  return g;
}


function ca_next_generation(g, callback) {
  
  var nextg = [];
  
  var l, c, r, nc;
  var debug;
  
  for (var gc = 0; gc <= ca_generation_size; gc++) {
    
    // what is the cell to the left of this one, wrap to the end
    if (gc == 0) {
      l = g[g.length-1];
    } else {
      l = g[gc-1];
    }
    
    // what is this cell
    c = g[gc];
    
    // what is the cell to the right of this one, wrap to the beginning
    if (gc == g.length-1) {
      r = g[0];
    } else {
      r = g[gc+1];
    }
    
    nc = callback(l, c, r);
    
    //debug = l.toString() + "x" + c.toString() + "x" + r.toString();
    //debug += " > " + nc.toString();
    //console.log(debug);
    
    nextg.push(nc);
    
  }
  
  return nextg;
  
}


function ca_draw_generation(g) {
  
  var y = ca_calculate_y();
  
  console.log("DRAWING " + ca_generation.toString() + "@" + y.toString());
  
  var debug = "";
  for (var c = 0; c <= ca_generation_size; c++) {
    debug += g[c].toString();
  }
  console.log(debug);
  
  for (var c = 0; c <= ca_generation_size; c++) {
    
    if (g[c]) {
      material = m_on;
    } else {
      material = m_black;
    }
    
    var x = ca_calculate_x(c);
    
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
    geometry.vertices.push( new THREE.Vector3( x, y-2, 0 ) );
    geometry.vertices.push( new THREE.Vector3( x+2, y-2, 0 ) );
    geometry.vertices.push( new THREE.Vector3( x+2, y, 0 ) );

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    
    var shape = new THREE.Mesh( geometry, material );
    scene.add( shape );
    
  }
  
  
  renderer.render( scene, camera );
  ca_generation++;
  
}


function ca_calculate_x(c) {
  
  var a = ca_generation_size * 2;
  var b = ca_generation_size;
  
  return ((a - (c * 2)) - b) * -1;
  
}


function ca_calculate_y(c) {

  var a = ca_generation_size * 2;
  var b = ca_generation_size;
  c = (typeof c !== 'undefined') ?  c : ca_generation;
  
  return (a - (c * 2)) - b;
  
}


/* functions for 2D */

function ca_init2D() {
  
  var grid = [];
  var g;
  
  for (var i = 0; i < ca_generation_size; i++) {
    g = ca_init();
    grid.push(g);
  }
  
  return grid;
  
}

function ca_draw_generation2D(grid) {
  
  var y;
  
  for (var i = 0; i < ca_generation_size; i++) {
    
    y = ca_calculate_y(i);

    for (var j = 0; j < ca_generation_size; j++) {
    
      if (grid[i][j]) {
        material = m_on;
      } else {
        material = m_black;
      }
    
      var x = ca_calculate_x(j);
    
      var geometry = new THREE.Geometry();
      geometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
      geometry.vertices.push( new THREE.Vector3( x, y-2, 0 ) );
      geometry.vertices.push( new THREE.Vector3( x+2, y-2, 0 ) );
      geometry.vertices.push( new THREE.Vector3( x+2, y, 0 ) );

      geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
      geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      var shape = new THREE.Mesh( geometry, material );
      scene.add( shape );
      
    }
    
  }
  
  renderer.render( scene, camera );
  ca_generation++;  
  
}

function ca_next_generation2D(grid, callback) {
  
  var nextgrid = [], nextrow = [];
  
  var ul, uc, ur, l, r, ll, lc, lr, nc;
  var debug, lookatx, lookaty;
  
  for (var i = 0; i < ca_generation_size; i++) {
        
    nextrow = [];
    
    for (var j = 0; j < ca_generation_size; j++) {
      
      // upper left, and wrap
      lookatx = i - 1;
      lookaty = j - 1;
      if (lookatx < 0) {
        lookatx = ca_generation_size - 1;
      }
      if (lookaty < 0) {
        lookaty = ca_generation_size - 1;
      }
      ul = grid[lookatx][lookaty];
      
      // upper center
      lookatx = i - 1;
      lookaty = j;
      if (lookatx < 0) {
        lookatx = ca_generation_size - 1;
      }
      uc = grid[lookatx][lookaty];

      // upper right, and wrap
      lookatx = i - 1;
      lookaty = j + 1;
      if (lookatx < 0) {
        lookatx = ca_generation_size - 1;
      }
      if (lookaty >= ca_generation_size-1) {
        lookaty = 0;
      }
      ur = grid[lookatx][lookaty];

      // left, and wrap
      lookatx = i;
      lookaty = j - 1;
      if (lookaty < 0) {
        lookaty = ca_generation_size - 1;
      }
      l = grid[lookatx][lookaty];
      
      // center, which is the current cell
      c = grid[i][j];
      
      // right, and wrap
      lookatx = i;
      lookaty = j + 1;
      if (lookaty >= ca_generation_size-1) {
        lookaty = 0;
      }
      r = grid[lookatx][lookaty];

      // lower left, and wrap
      lookatx = i + 1;
      lookaty = j - 1;
      if (lookatx >= ca_generation_size-1) {
        lookatx = 0;
      }
      if (lookaty < 0) {
        lookaty = ca_generation_size - 1;
      }
      ll = grid[lookatx][lookaty];
      
      // lower center
      lookatx = i + 1;
      lookaty = j;
      if (lookatx >= ca_generation_size-1) {
        lookatx = 0;
      }
      lc = grid[lookatx][lookaty];

      // lower right, and wrap
      lookatx = i + 1;
      lookaty = j + 1;
      if (lookatx >= ca_generation_size-1) {
        lookatx = 0;
      }
      if (lookaty >= ca_generation_size-1) {
        lookaty = 0;
      }
      lr = grid[lookatx][lookaty];
      
      nc = callback(ul, uc, ur, l, c, r, ll, lc, lr);
      
      nextrow.push(nc);
      
    }
    
    nextgrid.push(nextrow);
    
  }
  
  return nextgrid;  
  
}
