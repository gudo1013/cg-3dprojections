let view;
let ctx;
let scene;
let start_time;

const LEFT = 32; // binary 100000
const RIGHT = 16; // binary 010000
const BOTTOM = 8;  // binary 001000
const TOP = 4;  // binary 000100
const FAR = 2;  // binary 000010
const NEAR = 1;  // binary 000001
const FLOAT_EPSILON = 0.000001;

let uoffset = 0;
let noffset = 0;

// Initialization function - called when web page loads
function init() {
    let w = 800;
    let h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');


    // initial scene... feel free to change this
    /*
    scene = {
        view: {
            type: 'perspective',
            prp: Vector3(44, 20, -16),
            srp: Vector3(20, 20, -40),
            vup: Vector3(0, 1, 0),
            clip: [-19, 5, -10, 8, 12, 100]
        },
        models: [
            {
                type: 'generic',
                vertices: [
                    Vector4(0, 0, -30, 1),
                    Vector4(20, 0, -30, 1),
                    Vector4(20, 12, -30, 1),
                    Vector4(10, 20, -30, 1),
                    Vector4(0, 12, -30, 1),
                    Vector4(0, 0, -60, 1),
                    Vector4(20, 0, -60, 1),
                    Vector4(20, 12, -60, 1),
                    Vector4(10, 20, -60, 1),
                    Vector4(0, 12, -60, 1)
                ],
                edges: [
                    [0, 1, 2, 3, 4, 0],
                    [5, 6, 7, 8, 9, 5],
                    [0, 5],
                    [1, 6],
                    [2, 7],
                    [3, 8],
                    [4, 9]
                ],
                matrix: new Matrix(4, 4)
            }
        ]
        
        */
        scene = {
            view: {
                type: 'perspective',
                prp: Vector3(0, 10, -5),
                srp: Vector3(-9, 15, -40), //20, 15, -40 original, use -9, 15, -40 for clipping check
                vup: Vector3(1, 1, 0),
                clip: [-12, 6, -12, 6, 10, 100]
            },
            models: [
                {
                    type: 'generic',
                    vertices: [
                        Vector4( 0,  0, -30, 1),
                        Vector4(20,  0, -30, 1),
                        Vector4(20, 12, -30, 1),
                        Vector4(10, 20, -30, 1),
                        Vector4( 0, 12, -30, 1),
                        Vector4( 0,  0, -60, 1),
                        Vector4(20,  0, -60, 1),
                        Vector4(20, 12, -60, 1),
                        Vector4(10, 20, -60, 1),
                        Vector4( 0, 12, -60, 1)
                    ],
                    edges: [
                        [0, 1, 2, 3, 4, 0],
                        [5, 6, 7, 8, 9, 5],
                        [0, 5],
                        [1, 6],
                        [2, 7],
                        [3, 8],
                        [4, 9]
                    ],
                    matrix: new Matrix(4, 4)
                }
            ]
            
            
    };


    // event handler for pressing arrow keys
    document.addEventListener('keydown', onKeyDown, false);

    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds
    window.requestAnimationFrame(animate);
}

// Animation loop - repeatedly calls rendering code
function animate(timestamp) {
    // step 1: calculate time (time since start)
    let time = timestamp - start_time;

    // step 2: transform models based on time
    // TODO: implement this!

    // step 3: draw scene
    drawScene();

    // step 4: request next animation frame (recursively calling same function)
    // (may want to leave commented out while debugging initially)
    // window.requestAnimationFrame(animate);
}

// Main drawing code - use information contained in variable `scene`
function drawScene() {
    console.log(scene);

    //add the offset to the prp and srp to move along the u axis
    //don't think this will work, addtionally will run into problems when we try to load more scenes and there is an offset
    let newprp = new Vector(scene.view.prp);
    newprp.x = newprp.x + uoffset;
    let newsrp = new Vector(scene.view.srp);
    newsrp.x = newsrp.x + uoffset;

    // TODO: implement drawing here!
    // For each model, for each edge
    //  * transform to canonical view volume  - - - - - Believe this is completed for perspective
    //  * clip in 3D
    //  * project to 2D
    //  * draw line

    // Loop through all models
    for(let modelnum = 0; modelnum < scene.models.length; modelnum++){
        if (scene.view.type = 'perspective') {

            // z_min = near/far (from scene clip)
            let z_min = scene.view.clip[4] / scene.view.clip[5];

            // V matrix for after the Mper transformation to transform vertices to framebuffer units based on canvas size
            let vmat = new Matrix(4, 4);
            vmat.values = [ [view.width / 2, 0, 0, view.width / 2],
                            [0, view.height / 2, 0, view.height / 2],
                            [0, 0, 1, 0],
                            [0, 0, 0, 1]];


            //-----------TRANSFORM-----------

            // Get the perspective Nper matrix
            let transformmat = mat4x4Perspective(newprp, newsrp, scene.view.vup, scene.view.clip);

            // Create a copy of the vertices from the scene so as not to change the original vertices
            let newvertices = scene.models[modelnum].vertices;
            
            // Transform each of the vertices using Nper, ensuring that they are in Vector format
            for (let i = 0; i < newvertices.length; i++) {
                newvertices[i] = new Vector(transformmat.mult(newvertices[i]));
            };
            
            //-----------CLIP---------------

            // Loop through the edge list in the scene models to draw each edge
            // element = one array in the edge list
            scene.models[modelnum].edges.forEach(element => {
                // Loop through the element's edges
                for (let i = 0; i < element.length - 1; i++) {
                    // Created a line for clipping using the corresponding verticies that the edge list is associated with
                    let line = {
                        pt0: {
                            x: newvertices[element[i]].x,
                            y: newvertices[element[i]].y,
                            z: newvertices[element[i]].z,
                        },
                        pt1: {
                            x: newvertices[element[i + 1]].x,
                            y: newvertices[element[i + 1]].y,
                            z: newvertices[element[i + 1]].z,
                        }
                    };
                    
                    // Clip the line and receive a new line with the points to draw
                    let newline = clipLinePerspective(line, z_min);

                    // Only draw if the line exists after clipping
                    if (newline != null) {

                        //------------TRANSFORM-------------

                        // Recreate the points in Vector form and readd the w's
                        point1 = new Vector4(newline.pt0.x, newline.pt0.y, newline.pt0.z, newvertices[i].data[3][0]);
                        point2 = new Vector4(newline.pt1.x, newline.pt1.y, newline.pt1.z, newvertices[i+1].data[3][0]);
                    
                        // Multiply the points by Mper to get the final transformed vertices of the line
                        point1 = mat4x4MPer().mult(point1);
                        point2 = mat4x4MPer().mult(point2);

                        // Translate and scale the line based on canvas side for the framebuffer
                        point1 = vmat.mult(point1);
                        point2 = vmat.mult(point2);

                        // Convert to Cartesian coordinates by dividing x and y by the vertex's w coordinate
                        point1.data[0] = [point1.data[0] / point1.data[3]];
                        point1.data[1] = [point1.data[1] / point1.data[3]];
                        point2.data[0]= [point2.data[0] / point2.data[3]];
                        point2.data[1]= [point2.data[1] / point2.data[3]];

                        // ----------------DRAW LINE------------------ 
                        
                        drawLine(point1.data[0], point1.data[1], point2.data[0], point2.data[1]);
                        
                    } //if newline
                }//for element
            }); //forEach edge
        }//if perspective
    }//for modelnum

} // function drawScene()

// Get outcode for vertex (parallel view volume)
function outcodeParallel(vertex) {
    let outcode = 0;
    if (vertex.x < (-1.0 - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (1.0 + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (-1.0 - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (1.0 + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (0.0 + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Get outcode for vertex (perspective view volume)
function outcodePerspective(vertex, z_min) {
    let outcode = 0;
    if (vertex.x < (vertex.z - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (-vertex.z + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (vertex.z - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (-vertex.z + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (z_min + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLineParallel(line) {
    let result = null;
   
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z);
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodeParallel(p0);
    let out1 = outcodeParallel(p1);

    // TODO: implement clipping here!

    return result;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLinePerspective(line, z_min) {
    
    // Initial Variables
    let result = null;
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z);
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodePerspective(p0, z_min);
    let out1 = outcodePerspective(p1, z_min);
    
    // Check for trivial deny: only enter loop if it is not a deny
    // Compare AND of outcodes, if it is not equal to 0, it is a trivial deny
    if ((out0 & out1) == 0) {

        // Loop until trivial accept, if the line is already entirely in the view plane, skip the loop
        // Result guaranteed to be a line, may or may not be clipped
        result = line;

        //For parametric line equation
        let t;

        // Loop ends once the OR of the outcodes equals 0, meaning that they both are in the viewspace
        while ((out0 | out1) != 0) {

            // Check for first point being outside
            if (out0 != 0) {

                

                //Change in x, y, and z
                let dx = p1.x - p0.x;
                let dy = p1.y - p0.y;
                let dz = p1.z - p0.z;

                //For the first outcode that it comes across, calculate the corresponding t value
                if ((out0 & LEFT) >= 1) {
                    t = (-p0.x + p0.z) / (dx - dz);
                }
                else if ((out0 & RIGHT) >= 1) {
                    t = (p0.x + p0.z) / ((-dx) - dz);     
                }
                else if ((out0 & BOTTOM) >= 1) {
                    t = (-p0.y + p0.z) / (dy - dz);
                }
                else if ((out0 & TOP) >= 1) {
                    t = (p0.y + p0.z) / (-dy - dz);
                }
                else if ((out0 & FAR) >= 1) {
                    t = (-p0.z - 1) / (dz);
                }
                else { // NEAR
                    t = (p0.z - z_min) / (-dz);
                }

                // Use the parametric line equations to update coordinates using the calculated t value
                p0.x = ((1 - t) * p0.x) + (t * p1.x);
                p0.y = ((1 - t) * p0.y) + (t * p1.y);
                p0.z = ((1 - t) * p0.z) + (t * p1.z);

                // Recalculate the outcode using the updated coordinates
                out0 = outcodePerspective(p0, z_min);
            }// if out1

            // Second point is not inside
            else {

                // Change in x, y, and z
                let dx = p0.x - p1.x;
                let dy = p0.y - p1.y;
                let dz = p0.z - p1.z;

                // For the first outcode that it comes across, calculate the corresponding t value
                // Outcode is bitwise AND with each bit representation
                if ((out1 & LEFT) >= 1) {
                    t = (-p1.x + p1.z) / (dx - dz);
                }
                else if ((out1 & RIGHT) >= 1) {
                    t = (p1.x + p1.z) / (-dx - dz);
                }
                else if ((out1 & BOTTOM) >= 1) {
                    t = (-p1.y + p1.z) / (dy - dz);
                }
                else if ((out1 & TOP) >= 1) {
                    t = (p1.y + p1.z) / (-dy - dz);
                }
                else if ((out1 & FAR )>= 1) {
                    t = (-p1.z - 1) / (dz);
                }
                else { // NEAR
                    t = (p1.z - z_min) / (-dz);
                }

                //Use the parametric line equations to update coordinates using the calculated t value
                p1.x = ((1 - t) * p1.x) + (t * p0.x);
                p1.y = ((1 - t) * p1.y) + (t * p0.y);
                p1.z = ((1 - t) * p1.z) + (t * p0.z);

                //Recalculate the outcode using the updated coordinates
                out1 = outcodePerspective(p1, z_min);
                
            }//else out1
        }//while outcodes & != 0

        //Set the coordinates of the new line with intersection points to the result
        result.pt0 = p0;
        result.pt1 = p1;
    }//if outcodes == 0

    // Either null or a line
    return result;

}// function clipLinePerspective


// Called when user presses a key on the keyboard down 
function onKeyDown(event) {
    switch (event.keyCode) {
        case 37: // LEFT Arrow
            console.log("left");
            break;
        case 39: // RIGHT Arrow
            console.log("right");
            break;
        case 65: // A key
            console.log("A");
            uoffset--;
            break;
        case 68: // D key
            console.log("D");
            uoffset++;
            break;
        case 83: // S key
            console.log("S");
            break;
        case 87: // W key
            console.log("W");
            break;
    }
    drawScene();
}

///////////////////////////////////////////////////////////////////////////
// No need to edit functions beyond this point
///////////////////////////////////////////////////////////////////////////

// Called when user selects a new scene JSON file
function loadNewScene() {
    let scene_file = document.getElementById('scene_file');

    console.log(scene_file.files[0]);

    let reader = new FileReader();
    reader.onload = (event) => {
        scene = JSON.parse(event.target.result);
        scene.view.prp = Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]);
        scene.view.srp = Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]);
        scene.view.vup = Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]);

        for (let i = 0; i < scene.models.length; i++) {
            if (scene.models[i].type === 'generic') {
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    scene.models[i].vertices[j] = Vector4(scene.models[i].vertices[j][0],
                        scene.models[i].vertices[j][1],
                        scene.models[i].vertices[j][2],
                        1);
                }
            }
            else {
                scene.models[i].center = Vector4(scene.models[i].center[0],
                    scene.models[i].center[1],
                    scene.models[i].center[2],
                    1);
            }
            scene.models[i].matrix = new Matrix(4, 4);
        }
    };
    reader.readAsText(scene_file.files[0], 'UTF-8');
}

// Draw black 2D line with red endpoints 
function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
}
