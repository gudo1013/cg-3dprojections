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

// Initialization function - called when web page loads
function init() {
    let w = 800;
    let h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');

    
        //Perspective House:
         scene = {
             view: {
                 type: 'perspective',
                 prp: Vector3(0, 10, -5),
                 srp: Vector3(20, 15, -49), //20, 15, -40 original, use -9, 15, -40 for clipping check
                 vup: Vector3(1, 1, 0),
                 clip: [-12, 6, -12, 6, 10, 500]
                
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
                     animation: {
                         axis: 'x',
                         rps: 5
                     },
                     matrix: new Matrix(4, 4)
                 }/*,
                 {
                    type: "cube",
                    center: [-15, 15, -50],
                    width: 10,
                    height: 10,
                    depth: 10
                },
                {
                    type: "cone",
                    base: [-18, 25, -49],
                    radius: 5,
                    height: 10,
                    sides: 20,
                    animation: {
                        axis: "y",
                        rps: 0.5
                    }
                },
                {
                    type: "cylinder",
                    center: [-5, 30, -49],
                    radius: 4,
                    height: 20,
                    sides: 20,
                    animation: {
                        axis: "y",
                        rps: 0.5
                    }
                }*/
             ]
            
            
     };
     /*


    //Parallel House
     scene = {
         view: {
             type: "parallel",
             prp: [0, 0, 10],
             srp: [0, 0, 0],
             vup: [0, 1, 0],
             clip: [-4, 20, -1, 17, 5, 75]
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
                 //animation: {
                     //axis: 'x',
                     //rps: .5
                 //},
                 matrix: new Matrix(4, 4)
             }
         ]
       
       
 };
 */

    // Ensure prp, srp, and vup are all vectors
    if(scene.view.prp.x == undefined || scene.view.srp.x == undefined || scene.view.vup.x == undefined){
        scene.view.prp = new Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]);
        scene.view.srp = new Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]);
        scene.view.vup = new Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]);
    }
    // event handler for pressing arrow keys
    document.addEventListener('keydown', onKeyDown, false);

    let displayRate = 7 * (1/this.rps);
    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds
    //animate(performance.now());
    drawScene();
}


// Animation loop - repeatedly calls rendering code
function animate(timestamp) {
    // step 1: calculate time (time since start)
    let time = timestamp - start_time;

    //What if we did something with taking the calculation of 1000 milleseconds,
    //and delaying the for loop to run so it only happens every 1/60th of a
    //second, with Thread.sleep? 
    //let spaceTime = 1000/(60*scene.models.animation.rps);
    //Thread.sleep(spaceTime)

    //console.log(seconds);
    // step 2: transform models based on time
    let rotatemat = new Matrix(4,4);
    for(let i = 0; i < scene.models.length; i++){
        if (scene.models[i].animation != undefined){

            let theta = 3//scene.models[i].animation.rps * 6;
            for(let j = 0; j < scene.models[i].vertices.length; j++){
                switch(scene.models[i].animation.axis){
                    case 'x': 
                        Mat4x4RotateX(rotatemat, theta);
                        break;
                    case 'y':
                        Mat4x4RotateY(rotatemat, theta);
                        break;
                    case 'z':sw
                        Mat4x4RotateZ(rotatemat, theta);
                        break;
                }
                scene.models[i].vertices[j] = new Vector(rotatemat.mult(scene.models[i].vertices[j]));
            }
        }
    }
    
    // step 3: draw scene
    drawScene();


    // step 4: request next animation frame (recursively calling same function)
    // (may want to leave commented out while debugging initially)
    //delayTime(rps);
    //window.requestAnimationFrame(animate);

    // setTimeout(() => {
    //     window.requestAnimationFrame(animate);
    // }, this.displayRate);

    console.log("Testing");

}



// Main drawing code - use information contained in variable `scene`
function drawScene() {
    //console.log(scene);

    // Clear the previous drawn scene
    ctx.clearRect(0, 0, view.width, view.height)

    // TODO: implement drawing here!
    // For each model, for each edge
    //  * transform to canonical view volume  - - - - - Believe this is completed for perspective
    //  * clip in 3D
    //  * project to 2D
    //  * draw line

    //Draw all scene models necessary.
    /*
    for(let i = 0; i < scene.models.length; i++){
        if(scene.models[i].type == "cube"){
            scene.models[i] = drawCube(scene.models[i]);
        }
        if(scene.models[i].type == "cone"){
            scene.models[i] = drawCone(scene.models[i]);
        }
        if(scene.models[i].type == "cylinder"){
            scene.models[i] = drawCylinder(scene.models[i]);
        }
        console.log(i);
    }
    */

    // Loop through all models
    for(let modelnum = 0; modelnum < scene.models.length; modelnum++){
        if (scene.view.type == 'perspective') {

            // z_min = near/far (from scene clip)
            let z_min = scene.view.clip[4] / scene.view.clip[5];

            // V matrix for after the Mper transformation to transform vertices to framebuffer units based on canvas size
            let vmat = new Matrix(4, 4);
            vmat.values = [ [view.width / 2, 0, 0, view.width / 2],
                            [0, view.height / 2, 0, view.height / 2],
                            [0, 0, 1, 0],
                            [0, 0, 0, 1]];


            //-----------TRANSFORM-----------

            console.log("Modelnum: " + modelnum);

            // Get the perspective Nper matrix
            let transformmat = mat4x4Perspective(scene.view.prp, scene.view.srp, scene.view.vup, scene.view.clip);

            // Create a copy of the vertices from the scene so as not to change the original vertices
            let newvertices = [];
            
            // Transform each of the vertices using Nper, ensuring that they are in Vector format
            for (let i = 0; i < scene.models[modelnum].vertices.length; i++) {
                newvertices[i] = new Vector(transformmat.mult(scene.models[modelnum].vertices[i]));
            };


            
            

            //-----------CLIP---------------

            // Loop through the edge list in the scene models to draw each edge
            // element = one array in the edge list
            scene.models[modelnum].edges.forEach(element => {
                // Loop through the element's edges
                for (let i = 0; i < element.length - 1; i++) {
                    //console.log(newvertices[element[i]])
                    // Created a line for clipping using the corresponding verticies that the edge list is associated with
                    let line = {
                        pt0: newvertices[element[i]],
                        pt1: newvertices[element[i+1]]
                    };
                    
                    // Clip the line and receive a new line with the points to draw
                    let newline = clipLinePerspective(line, z_min);
                    //console.log(newline);
                    // Only draw if the line exists after clipping
                    if (newline != null) {
                        
                        //------------TRANSFORM-------------

                        // Recreate the points in Vector form and readd the w's
                        point1 = new Vector4(newline.pt0.x, newline.pt0.y, newline.pt0.z, newvertices[i].data[3][0]);
                        point2 = new Vector4(newline.pt1.x, newline.pt1.y, newline.pt1.z, newvertices[i+1].data[3][0]);
                    
                        // Multiply the points by Mpar to get the final transformed vertices of the line
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

        else if(scene.view.type == 'parallel'){
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
            let transformmat = mat4x4Parallel(scene.view.prp, scene.view.srp, scene.view.vup, scene.view.clip);

            // Create a copy of the vertices from the scene so as not to change the original vertices
            let newvertices = [];
            
            // Transform each of the vertices using Nper, ensuring that they are in Vector format
            for (let i = 0; i < scene.models[modelnum].vertices.length; i++) {
                newvertices[i] = new Vector(transformmat.mult(scene.models[modelnum].vertices[i]));
            };


            //-----------CLIP---------------

            // Loop through the edge list in the scene models to draw each edge
            // element = one array in the edge list
            scene.models[modelnum].edges.forEach(element => {
                // Loop through the element's edges
                for (let i = 0; i < element.length - 1; i++) {
                    //console.log(newvertices[element[i]])
                    // Created a line for clipping using the corresponding verticies that the edge list is associated with
                    let line = {
                        pt0: newvertices[element[i]],
                        pt1: newvertices[element[i+1]]
                    };
                    
                    // Clip the line and receive a new line with the points to draw
                    let newline = clipLineParallel(line);
                    //console.log(newline);
                    // Only draw if the line exists after clipping
                    if (newline != null) {
                        
                        //------------TRANSFORM-------------

                        // Recreate the points in Vector form and readd the w's
                        point1 = new Vector4(newline.pt0.x, newline.pt0.y, newline.pt0.z, newvertices[i].data[3][0]);
                        point2 = new Vector4(newline.pt1.x, newline.pt1.y, newline.pt1.z, newvertices[i+1].data[3][0]);
                    
                        // Multiply the points by Mper to get the final transformed vertices of the line
                        point1 = mat4x4MPar().mult(point1);
                        point2 = mat4x4MPar().mult(point2);

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
            });
        }
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
        //console.log(vertex.x + " LEFT " + (-vertex.z + FLOAT_EPSILON));
        outcode += LEFT;
    }
    else if (vertex.x > (-vertex.z + FLOAT_EPSILON)) {
        //console.log(vertex.x + " RIGHT " + (-vertex.z + FLOAT_EPSILON));
        outcode += RIGHT;
    }
    if (vertex.y < (vertex.z - FLOAT_EPSILON)) {
        //console.log(vertex.y + " BOTTOM " + (-vertex.z + FLOAT_EPSILON));
        outcode += BOTTOM;
    }
    else if (vertex.y > (-vertex.z + FLOAT_EPSILON)) {
        //console.log(vertex.y + " TOP " + (-vertex.z + FLOAT_EPSILON));
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        //console.log(vertex.z + " FAR " + (-1.0 - FLOAT_EPSILON));
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
    if ((out0 & out1) == 0) {

        // Loop until trivial accept, if the line is already entirely in the view plane, skip the loop
        result = line;

        //For parametric line equation
        

        // This is purely for a bug that happens when clipping: occasionally will have an infinite loop and can't figure out the reason.
        let i = 0;
        // Loop ends once the OR of the outcodes equals 0, meaning that they both are in the viewspace
        while ((out0 | out1) != 0 && result != null) {

            //console.log("x0 = " + p0.x + ", y0 = " + p0.y + ", z0 = " + p0.z);
            //console.log("x1 = " + p1.x + ", y1 = " + p1.y + ", z1 = " + p1.z);
            let t;

            // Check for first point being outside
            if (out0 != 0) {
                //For the first outcode that it comes across, calculate the corresponding t value
                if ((out1 & LEFT) >= 1) {
                    t = (-1 - p0.x) / (p0.x - p1.x);
                }
                else if ((out1 & RIGHT) >= 1) {
                    t = (1 - p0.x) / (p0.x - p1.x);
                }
                else if ((out1 & BOTTOM) >= 1) {
                    t = (-1 - p0.y) / (p0.y - p1.y);
                }
                else if ((out1 & TOP) >= 1) {
                    t = (1 - p0.y) / (p0.y - p1.y);
                }
                else if ((out1 & FAR )>= 1) {
                    t = (-1 - p0.z) / (p0.z - p1.z);
                }
                else { // NEAR
                    t = (0 - p0.z) / (p0.z - p1.z);
                }

                // Use the parametric line equations to update coordinates using the calculated t value
                //console.log("t = " + t);
                p0.x = ((1 - t) * p0.x) + (t * p1.x);
                p0.y = ((1 - t) * p0.y) + (t * p1.y);
                p0.z = ((1 - t) * p0.z) + (t * p1.z);

                // Recalculate the outcode using the updated coordinates
                out0 = outcodeParallel(p0);
            }// if out1

            // Second point is not inside
            else {
                // For the first outcode that it comes across, calculate the corresponding t value
                // Outcode is bitwise AND with each bit representation
                if ((out1 & LEFT) >= 1) {
                    t = (-1 - p1.x) / (p1.x - p0.x);
                }
                else if ((out1 & RIGHT) >= 1) {
                    t = (1 - p1.x) / (p1.x - p0.x);
                }
                else if ((out1 & BOTTOM) >= 1) {
                    t = (-1 - p1.y) / (p1.y - p0.y);
                }
                else if ((out1 & TOP) >= 1) {
                    t = (1 - p1.y) / (p1.y - p0.y);
                }
                else if ((out1 & FAR )>= 1) {
                    t = (-1 - p1.z) / (p1.z - p0.z);
                }
                else { // NEAR
                    t = (0 - p1.z) / (p1.z - p0.z);
                }

                //Use the parametric line equations to update coordinates using the calculated t value
                p1.x = ((1 - t) * p1.x) + (t * p0.x);
                p1.y = ((1 - t) * p1.y) + (t * p0.y);
                p1.z = ((1 - t) * p1.z) + (t * p0.z);

                //Recalculate the outcode using the updated coordinates
                out1 = outcodeParallel(p1);
                
            }//else out1
            // Check for a trivial deny case that could arise after new intersections calculated
            if((out0 & out1) != 0 || i >= 7){
                out0 = 0;
                out1 = 0;
                result = null;
            }
            i++;
        }//while outcodes & != 0

        
        //Set the coordinates of the new line with intersection points to the result if the result is not null
        if(result != null){
            result.pt0 = p0;
            result.pt1 = p1;
        }
    }//if outcodes == 0

    // Either null or a line
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
        result = line;

        //For parametric line equation
        

        // This is purely for a bug that happens when clipping: occasionally will have an infinite loop and can't figure out the reason.
        let i = 0;
        // Loop ends once the OR of the outcodes equals 0, meaning that they both are in the viewspace
        while ((out0 | out1) != 0 && result != null) {

            //console.log("x0 = " + p0.x + ", y0 = " + p0.y + ", z0 = " + p0.z);
            //console.log("x1 = " + p1.x + ", y1 = " + p1.y + ", z1 = " + p1.z);
            let t;

            // Check for first point being outside
            if (out0 != 0) {

                //Change in x, y, and z
                let dx = p1.x - p0.x;
                let dy = p1.y - p0.y;
                let dz = p1.z - p0.z;

                //For the first outcode that it comes across, calculate the corresponding t value
                if ((out0 & LEFT) >= 1) {
                    //console.log("LEFT")
                    t = (-p0.x + p0.z) / (dx - dz);
                }
                else if ((out0 & RIGHT) >= 1) {
                    //console.log((out0 & RIGHT))
                    //console.log("RIGHT")
                   // console.log("x0 = " + p0.x + ", y0 = " + p0.y + ", z0 = " + p0.z);
                    //console.log("x1 = " + p1.x + ", y1 = " + p1.y + ", z1 = " + p1.z);
                    //console.log((p0.x + p0.z))
                    //console.log((-dx - dz))
                    t = (p0.x + p0.z) / (-dx - dz);     
                }
                else if ((out0 & BOTTOM) >= 1) {
                    //console.log("BOTTOM")
                    t = (-p0.y + p0.z) / (dy - dz);
                }
                else if ((out0 & TOP) >= 1) {
                    //console.log("TOP")
                    t = (p0.y + p0.z) / (-dy - dz);
                    
                }
                else if ((out0 & FAR) >= 1) {
                    //console.log("FAR")
                    t = ((-p0.z) - 1) / (dz);
                }
                else { // NEAR
                    //console.log("NEAR")
                    t = (p0.z - z_min) / (-dz);
                }

                // Use the parametric line equations to update coordinates using the calculated t value
                //console.log("t = " + t);
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
                    t = ((-p1.z) - 1) / (dz);
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
            // Check for a trivial deny case that could arise after new intersections calculated
            if((out0 & out1) != 0 || i >= 7){
                out0 = 0;
                out1 = 0;
                result = null;
            }
            i++;
        }//while outcodes & != 0

        
        //Set the coordinates of the new line with intersection points to the result if the result is not null
        if(result != null){
            result.pt0 = p0;
            result.pt1 = p1;
        }
    }//if outcodes == 0

    // Either null or a line
    return result;

}// function clipLinePerspective


// Called when user presses a key on the keyboard down 
function onKeyDown(event) {
    switch (event.keyCode) {
        case 37: // LEFT Arrow
            console.log("left");
            scene.view.srp = rotateAxisV(-2, scene.view.prp, scene.view.srp, scene.view.vup);
            break;
        case 39: // RIGHT Arrow
            console.log("right");
            scene.view.srp = rotateAxisV(2, scene.view.prp, scene.view.srp, scene.view.vup);
            break;
        case 65: // A key
            console.log("A");
            scene.view.prp.x = scene.view.prp.x + 1;
            scene.view.prp.y = scene.view.prp.y - 1;
            scene.view.srp.x = scene.view.srp.x + 1;
            scene.view.srp.y = scene.view.srp.y - 1;
            break;
        case 68: // D key
            console.log("D");
            scene.view.prp.x = scene.view.prp.x - 1;
            scene.view.prp.y = scene.view.prp.y + 1;
            scene.view.srp.x = scene.view.srp.x - 1;
            scene.view.srp.y = scene.view.srp.y + 1;
            break;
        case 83: // S key
            console.log("S");
            scene.view.prp.z = scene.view.prp.z + 1;
            scene.view.srp.z = scene.view.srp.z + 1;
            break;
        case 87: // W key
            console.log("W");
            scene.view.prp.z = scene.view.prp.z - 1;
            scene.view.srp.z = scene.view.srp.z - 1;
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

//Generic function that creates the requirements for each model
function generic() {
    return {
    type: "generic",
    vertices: [],
    edges: [],
    matrix: new Matrix(4, 4)
    }
}

//Draws a cube, based on the inputs, and pushes all vertices and edges
//to create the cube, and returns.
function drawCube(modelCube){
    var cube = generic();
    var center = modelCube.center;
    var width = modelCube.width;
    var height = modelCube.height;
    var depth = modelCube.depth;

    cube.vertices.push(Vector4((center[0] + -depth/2), (center[1] + -height/2), (center[2] + -width/2), 1)); //bottom front left
    cube.vertices.push(Vector4((center[0] + -depth/2), (center[1] + height/2), (center[2] + -width/2), 1)); //top front left
    cube.vertices.push(Vector4((center[0] + depth/2), (center[1] + height/2), (center[2] + -width/2), 1)); //top front right
    cube.vertices.push(Vector4((center[0] + depth/2), (center[1] + -height/2), (center[2] + -width/2), 1)); //bottom front right
    cube.vertices.push(Vector4((center[0] + -depth/2), (center[1] + -height/2), (center[2] + width/2), 1)); //bottom back left
    cube.vertices.push(Vector4((center[0] + -depth/2), (center[1] + height/2), (center[2] + width/2), 1)); //top back left
    cube.vertices.push(Vector4((center[0] + depth/2), (center[1] + height/2), (center[2] + width/2), 1)); //top back right
    cube.vertices.push(Vector4((center[0] + depth/2), (center[1] + -height/2), (center[2] + width/2), 1)); //bottom back right
    console.log("Cube ran");

    cube.edges.push([0, 1, 2, 3, 0]);
    cube.edges.push([4, 5, 6, 7, 4]);
    cube.edges.push([0, 4]);
    cube.edges.push([1, 5]);
    cube.edges.push([2, 6]);
    cube.edges.push([3, 7]);

    return cube;
}

//Draws a cone, with the given inputs, and pushes the top vertice first, then all
//the following vertices on the base, or the circle of the cone.
function drawCone(modelCone){
    var cone = generic();
    var center = modelCone.base;
    var radius = modelCone.radius;
    var height = modelCone.height;
    var sides = modelCone.sides;

    cone.vertices.push(Vector4(center[0], (center[1] + height), center[2], 1));

    //cone.edges.push(0, 1);

    var phi = this.toRadians((360/sides)* 0);
    var x0 = center[0] + (radius * Math.cos(phi));
    var z0 = center[2] + (radius * Math.sin(phi));
    cone.vertices.push(Vector4(x0, center[1], z0, 1));

    cone.edges.push(0, 1);

    for(var i=2; i<=sides; i++) {
        var phi = this.toRadians((360/sides)*i)
        var x0 = center[0] + (radius * Math.cos(phi));
        var z0 = center[2] + (radius * Math.sin(phi));

        cone.vertices.push(Vector4(x0, center[1], z0, 1));

        cone.edges.push([0, i]);
        cone.edges.push([(i-1), (i)]);
        console.log("Cone ran!");
        if(i == sides){
            cone.edges.push([i, 1]);
        }
    }

    return cone;
}



//Creates a cylinder generic, makes the bottom and top circles, and then
//connects all the points together.
function drawCylinder(modelCylinder){
    var cylinder = generic();
    var center = modelCylinder.center;
    var radius = modelCylinder.radius;
    var height = modelCylinder.height;
    var sides = modelCylinder.sides;


    for(var i=1; i<=sides; i++) {
        var phi = this.toRadians((360/sides)*i);
        var x0 = center[0] + (radius * Math.cos(phi));
        var z0 = center[2] + (radius * Math.sin(phi));

        cylinder.vertices.push(Vector4(x0, center[1], z0, 1));

        if(i == 1){

        } else if(i == sides){
            cylinder.edges.push([(i-1), 0]);
            cylinder.edges.push([(i-2), (i-1)]);
        } else{
            cylinder.edges.push([(i-2), (i-1)]);
        }

        console.log("Cylinder ran!");
        
    }

    for(var i=1; i<=sides; i++) {
        var phi = this.toRadians((360/sides)*i);
        var x0 = center[0] + (radius * Math.cos(phi));
        var z0 = center[2] + (radius * Math.sin(phi));

        cylinder.vertices.push(Vector4(x0, center[1] + height, z0, 1));

        if(i == 1){

        } else if(i == sides){
            cylinder.edges.push([(sides + i-1), sides]);
            cylinder.edges.push([(sides + i-2), (sides + i-1)]);
        } else{
            cylinder.edges.push([(sides + i-2), (sides +i-1)]);
        }

        console.log("Cylinder ran!");
        
    }

    for(var i=0; i < sides; i++){
        cylinder.edges.push([i, i+sides]);
    }

    return cylinder;
}


//Takes degrees and outputs radians.
function toRadians(degrees){
    return degrees* Math.PI/180;
}

//This draws a circle with a given center, radius, and the amount of sides on the x y plane
function drawCircle(center, radius, sides) {
    for(var i=1; i<=sides; i++) {
         var phi = this.toRadians((360/sides)*i)
         var x0 = center.x + (radius * Math.cos(phi));
         var z0 = center.z + (radius * Math.sin(phi));

         var phi = this.toRadians((360/sides)*(i+1))

         var x1 = center.x + (radius * Math.cos(phi));
         var z1 = center.z + (radius * Math.sin(phi));

         var p0 = new Point(x0, y0);
         var p1 = new Point(x1, y1);


         this.drawLine(p0.x, p0.y, p1.x, p1.y);
         
    }
}
