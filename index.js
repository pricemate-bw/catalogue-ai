let mobileNet;

// Image dimensions
var image_width = 0;
var image_height =  0;

// Canvas
var cnv;

// Image
let img;

// Window width & height
const window_width  = 520;
const window_height = 712;

let objects = [];

let status;




function centerCanvas() {
  var x = (windowWidth - window_width) / 2;
  var y = (windowHeight - window_height) / 2;
  
  cnv.position(x, y);
}


function setImageSize(){
    
  image_width = img.width;
  image_height = img.height;

  var image_ratio = img.height / img.width;

  if(img.width > window_width){
    image_width = window_width;
    image_height = image_width * image_ratio;

  }

}



function setup() {

  cnv = createCanvas(window_width, window_height);

  img = createImg('assets/catalogue-1.jpg', () => {
    status = true
    console.log("Image loaded");
    centerCanvas();
    setImageSize()
    image(img, 0,0, image_width, image_height);
  });

  img.hide();

  mobileNet = ml5.YOLO("MobileNet", ()=>{
    console.log("Model loaded");
  })



  var button = createButton('Predict');
  button.mousePressed(()=>{

    mobileNet.detect(img, (error, results)=>{
      if(error){
        console.log("Failed to predict");
        
      }else{
        console.log(results);
        objects = results;
        
      }
    })

  }); 
  
  

}


function windowResized() {
  centerCanvas();
}

function draw() {
  // unless the model is loaded, do not draw anything to canvas
  if (status != undefined) {
    image(img, 0,0, image_width, image_height);

    for (let i = 0; i < objects.length; i++) {
      noStroke();
      fill("red");
      text(objects[i].label + " " + nfc(objects[i].confidence * 100.0, 2) + "%", objects[i].x * width + 5, objects[i].y * height + 15);
      noFill();
      strokeWeight(4);
      stroke("red");
      rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
    }
  }
}