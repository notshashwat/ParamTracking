let video;
let poseNet;

let pose;
let skeleton;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  //initialize the model - 
  poseNet = ml5.poseNet(video, function(){
    console.log('ml5 posenet is loaded'); 
    //callback function called if posenet is working correctly
  } ); 
  
  poseNet.on('pose', function(poses){
    //if a pose is detected with confidence >20%, update the variable 'pose' with this pose (only one person's pose is being kept track of, we can make it for multiple people by using an array pose[])
    //  console.log(poses);
      
    if(poses.length > 0 && poses[0].pose.score > 0.2){
      
      pose = poses[0].pose;  
      skeleton = poses[0].skeleton;
    }
  })
}

function draw() {
  background(220);
  tint(255, 70)
  image(video, 0, 0);
  if(pose){
    //if there is a pose detected by poseNet then draw the stick figure corresponding to it.
    let keypoints = pose.keypoints;
    for(let i=0;i<keypoints.length ; i++){
      //loop through all the detected points on the body and draw a a circle for each of them.
      fill(255,0,0);
      ellipse(keypoints[i].position.x,keypoints[i].position.y,16);   
    }
    
    //for each pair of points in the skeleton, join them with a line
    for(let i=0;i<skeleton.length;i++){
      let point1 = skeleton[i][0].position;
      let point2 = skeleton[i][1].position;
      stroke(255,0,0);
      strokeWeight(5);
      line(point1.x,point1.y,point2.x,point2.y);
    }
    
    
    //drawing the line from nose to the middle of both shoulders
    stroke(255,0,0);
    strokeWeight(5);
    let midshoulderX = (pose.leftShoulder.x + pose.rightShoulder.x)/2;
    let midshoulderY = (pose.leftShoulder.y + pose.rightShoulder.y)/2;
    line(pose.nose.x, pose.nose.y , midshoulderX, midshoulderY);
    
  //drawing big circle for head around nose
    fill(255,0,0);
    // let scale = dist(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y)
    ellipse(pose.nose.x, pose.nose.y , 100);
   
  }
}