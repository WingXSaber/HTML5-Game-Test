
var gameCanvas;
var gameUI;
var gameMouseEventHandler;
var camera;
var gameObjectHandler;
var all_Images = [];

var loadingTimer;

var lastTime = 0,        // The last time the loop was run    
    ms_lag = 0;          // the lag in between, determines how many ticks needed to be processed
    ms_step_per_tick = 1000 / 60, //the expected time between per tick
    ticks = 0,           //ticks per second counter
    frames = 0,
    lastSecond = performance.now();

var isKeyUp = isKeyDown = isKeyLeft = isKeyRight = false,
    is_90 = true,
    is_n_157_5 = is_n_135 = is_n_112_5 = is_n_90 = is_n_67_5 = is_n_45 = is_n_22_5 = false,
    is_180 = is_157_5 = is_135 = is_112_5 = is_67_5 = is_45 = is_22_5 = is_0 = false;
    

var radiansToDegrees = 180 / Math.PI,
    degreesToRadians = Math.PI / 180;
var tps = "", fps = "";

var playerIndex = 0;



var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

function intialize(){    
    gameCanvas = document.getElementById("GraphicsBox");       
    gameUI = document.getElementById("UIBox");   
    gameMouseEventHandler = document.getElementById("MouseEventHandler");

    camera = new Camera(0,0,gameCanvas.width, gameCanvas.height);
    gameObjectHandler = new GameObjectHandler();    

    gameMouseEventHandler.addEventListener("click", MouseEventClick);
    gameMouseEventHandler.addEventListener("mousemove", MouseEventHover);
    
    document.addEventListener("keydown", KeyPressed);
    document.addEventListener("keyup", KeyReleased);

    loadAssets();

    loadingTimer = setInterval(hasInitialized, 250);
}






function loadAssets(){
    //set all assets here    
    all_Images.push([getImageFile("level1.png"),       "level1"]);
    all_Images.push([getImageFile("Enemy.png"),        "Enemy"]);

    for(var i =0; i<=5; i++){
        var folder = "larawan\\", prefix="", suffix="";
        if(i==0){
            prefix += "Player_Head_";
        }
        else if(i>=1&&i<=4){
            prefix += "Player_LowerBody_";
            suffix = "_"+(i-1);
        }else if(i==5){
            prefix += "Player_Shotgun_";
        }

        if(prefix!="" && i>=1&&i<=4){
            all_Images.push( [getImageFile(folder+prefix+"0"+suffix+".png"),    prefix+"0"+suffix]    );  
            all_Images.push( [getImageFile(folder+prefix+"45"+suffix+".png"),   prefix+"45"+suffix]   );
            all_Images.push( [getImageFile(folder+prefix+"90"+suffix+".png"),   prefix+"90"+suffix]   );
            all_Images.push( [getImageFile(folder+prefix+"135"+suffix+".png"),  prefix+"135"+suffix]  );
            all_Images.push( [getImageFile(folder+prefix+"180"+suffix+".png"),  prefix+"180"+suffix]  );
            all_Images.push( [getImageFile(folder+prefix+"-135"+suffix+".png"), prefix+"-135"+suffix] );
            all_Images.push( [getImageFile(folder+prefix+"-90"+suffix+".png"),  prefix+"-90"+suffix]  );
            all_Images.push( [getImageFile(folder+prefix+"-45"+suffix+".png"),  prefix+"-45"+suffix]  );
        }else if(prefix!=""){
            all_Images.push( [getImageFile(folder+prefix+"0"+suffix+".png"),     prefix+"0"+suffix]      );
            all_Images.push( [getImageFile(folder+prefix+"22.5"+suffix+".png"),  prefix+"22.5"+suffix]   );
            all_Images.push( [getImageFile(folder+prefix+"45"+suffix+".png"),    prefix+"45"+suffix]     );
            all_Images.push( [getImageFile(folder+prefix+"67.5"+suffix+".png"),  prefix+"67.5"+suffix]   );
            all_Images.push( [getImageFile(folder+prefix+"90"+suffix+".png"),    prefix+"90"+suffix]     );
            all_Images.push( [getImageFile(folder+prefix+"112.5"+suffix+".png"), prefix+"112.5"+suffix]  );
            all_Images.push( [getImageFile(folder+prefix+"135"+suffix+".png"),   prefix+"135"+suffix]    );
            all_Images.push( [getImageFile(folder+prefix+"157.5"+suffix+".png"), prefix+"157.5"+suffix]  );
            all_Images.push( [getImageFile(folder+prefix+"180"+suffix+".png"),   prefix+"180"+suffix]    );
            all_Images.push( [getImageFile(folder+prefix+"-157.5"+suffix+".png"),prefix+"-157.5"+suffix] );
            all_Images.push( [getImageFile(folder+prefix+"-135"+suffix+".png"),  prefix+"-135"+suffix]   );
            all_Images.push( [getImageFile(folder+prefix+"-112.5"+suffix+".png"),prefix+"-112.5"+suffix] );        
            all_Images.push( [getImageFile(folder+prefix+"-90"+suffix+".png"),   prefix+"-90"+suffix]    );    
            all_Images.push( [getImageFile(folder+prefix+"-67.5"+suffix+".png"), prefix+"-67.5"+suffix]  );
            all_Images.push( [getImageFile(folder+prefix+"-45"+suffix+".png"),   prefix+"-45"+suffix]    );
            all_Images.push( [getImageFile(folder+prefix+"-22.5"+suffix+".png"), prefix+"-22.5"+suffix]  );
        }
    }
    
}


function getImageFile(prefix){
    var imgVar = document.createElement("img");
    imgVar.setAttribute("src", prefix);
    return imgVar;
}


function didAssetsLoad(){
    for (var x = 0; x < all_Images.length; x++) //check images if loaded
        if (!all_Images[x][0].complete) return false;
    return true;
}


function hasInitialized(){        
    if( didAssetsLoad() ){        
        clearInterval(loadingTimer);    
        gameCanvas.getContext("2d").imageSmoothingEnabled = false;
        //gameCanvas.getContext("2d").save();
        
/*        console.log("all_Images contains: ");
        for(var i =0; i<all_Images.length; i++){
            console.log(all_Images[i][1]);
        }                                           */
  

        for(var i =0; i<this.all_Images.length; i++)
            console.log(""+i+"] "+this.all_Images[i][1]);

        loadLevel(all_Images[0][0]);
        requestAnimationFrame(gameLoop);        
    }
}





function loadLevel(image){    
    var tempCanvas = document.createElement('canvas');
    var context = tempCanvas.getContext("2d");
    context.drawImage(image,0, 0);   

    var pixel;    
    var unit = 48;

    var wallFound = false;
    var wallX = 0, wallY = 0, wallSizeX = 0;
    for(var y=0; y<image.height; y++){
       
        for(var x=0; x<image.width; x++){            
           pixel = context.getImageData(x,y,1,1).data;                
           //pixel[0] -> red
           //pixel[1] -> green
           //pixel[2] -> blue
           //pixel[3] -> alpha        
           if(!(pixel[0]==255 && pixel[1]==0 && pixel[2]==0)){
               if(pixel[0]==0 && pixel[1]==162 && pixel[2]==255){   
                   playerIndex = gameObjectHandler.add(new Player(x*unit, y*unit*.75, 100, 5000) );                   
               }else if(pixel[0]==0 && pixel[1]==255 && pixel[2]==0){
                   gameObjectHandler.add(new Enemy_1(x*unit, y*unit*.75, 100) );
               }else if(pixel[0]==255 && pixel[1]==255 && pixel[2]==255){
                   //gameObjectHandler.add(new AmmoBox(x*unit,y*unit,unit,unit) );
               }else if(wallFound){
                   gameObjectHandler.add(new Wall(wallX*unit, wallY*unit*.75, wallSizeX, unit*.75, 56) );
                   wallFound = false;
                   wallX = 0, wallY = 0, wallSizeX = 0;
               }                
           }else{
               if(!wallFound){
                   wallX = x;
                   wallY = y;
               }
               wallSizeX+=unit;
               wallFound = true;
               
           }
       }        
   }
}




//=====================================================================================================




function gameLoop(currentTime){   
    if(currentTime-lastSecond>=1000){ //just a tps & fps counter display
        if(ticks>60) ticks -= (ticks - 60);
        tps = "TPS "+ticks+"/60";
        fps = "FPS "+frames+"/60"
        ticks = 0;
        frames =0;
        lastSecond = currentTime;
    }        

    ms_lag +=  currentTime - lastTime;        
    lastTime = currentTime;    

    while(ms_lag >= ms_step_per_tick){   
       if(ms_lag >= 500) //0.5 second worth of lag            
            ms_lag = ms_step_per_tick; //don't chase the lag anymore, at the cost of inaccuracy
            /*   Big lags may come from:
                -Actual computer processing lag, or
                -When the user changes tabs/minimizes which pauses rAF() and takes some time away from the game 
                This big lag may cause the browser to hang indefinetly.  */
        
        tick();                        
        ms_lag -= ms_step_per_tick;
        ticks++;
    }  
    frames++;
    render();

    requestAnimationFrame(gameLoop);
   
    //requestAnimationFrame() is a callback function, where the parameter inside is a function.
    //also requestAnimationFrame() passes a timestamp to the callback function    
    //requestAnimationFrame (RAF) is designed to halt running when you its browser tab loses focus.
}



//======================================================================================================



function tick(){
    gameObjectHandler.tick(camera);   
}



//======================================================================================================



function render(){ 
    var g = gameCanvas.getContext("2d");       
    g.setTransform(1, 0, 0, 1, 0, 0); //clear zoom and resize  
    //g.restore();

    //g.scale(zoom, zoom);
    g.translate(-camera.getX(), -camera.getY());    //move
    g.clearRect(camera.getX()-1, camera.getY()-1, camera.getXMax()-camera.getX()+1, camera.getYMax()-camera.getY()+1 ); //clear  
        
    gameObjectHandler.render(g, camera);    

    g.beginPath();
    g.strokeStyle = '#ff0000';
    g.lineWidth = 2;
    g.moveTo(camera.getCenterX(),camera.getY());
    g.lineTo(camera.getCenterX(),camera.getY()+camera.getSizeY());
    g.moveTo(camera.getX(),camera.getCenterY());
    g.lineTo(camera.getX()+camera.getSizeX(),camera.getCenterY());
    g.stroke();

    var ui = gameUI.getContext("2d");    
    ui.clearRect(0, 0, gameUI.width, gameUI.height ); //clear  
    ui.fillStyle = "rgba(0,0,0, 0.7)";
    ui.fillRect(3,3, 140, 65);
    ui.fillStyle = "#ffffff";
    ui.font = "12px Arial";
    ui.fillText(tps, 10, 15 );
    ui.fillText(fps, 10, 30 );
    ui.fillText("Objects Active\t: "+gameObjectHandler.activeLength(), 10, 45);
    ui.fillText("Objects Sleeping\t: "+gameObjectHandler.inactiveLength(), 10, 60);

    ui.fillStyle = "rgba(0,0,0, 0.7)";
    ui.fillRect( 16, gameUI.height-55, 140, 40);
    ui.fillStyle = "#ffffff";
    ui.font = "12px Arial";    

    ui.fillText("Health : " + gameObjectHandler.getPlayer().hp, 40, gameUI.height-40 );
    ui.fillText("Ammo : " + gameObjectHandler.getPlayer().ammo, 40, gameUI.height-25 );
    ui.drawImage(all_Images[5][0], -34, gameUI.height-70);

    
}

//==================================


function MouseEventClick(e){
    e = e || window.event;
    //document.getElementById("MouseEventHandler").requestPointerLock = document.getElementById("MouseEventHandler").requestPointerLock || document.getElementById("MouseEventHandler").mozRequestPointerLock;
    //document.getElementById("MouseEventHandler").requestPointerLock();
  
    tempObject = gameObjectHandler.getPlayer();
    if(tempObject !== undefined){                       
        var bulletSize = 5,
            bulletHeight = 24,
            speed = 10,
            x = tempObject.getX()+(tempObject.getSizeX()/2),
            y = tempObject.getY()+(tempObject.getSizeY()/2),
            xMouse = e.clientX-gameCanvas.getBoundingClientRect().left +camera.getX(),                    
            yMouse = e.clientY-gameCanvas.getBoundingClientRect().top  +camera.getY(),
            degreesMouse = getDegrees(x,y,xMouse,yMouse);

        //off-center the origin
        x+=Math.cos((degreesMouse+10)*degreesToRadians)*40;
        y+=Math.sin((degreesMouse+10)*degreesToRadians)*40;

        //Since oblique pespective, adjust y depending on angle
        if(degreesMouse>=0)
            if(degreesMouse<=90)
                y-=degreesMouse/10;            
            else 
                y-=(180-degreesMouse)/10
        else
            if(degreesMouse>=-90)
                y-=degreesMouse/10;            
            else 
                y+=(degreesMouse+180)/10;

       /*
        //single shot
        gameObjectHandler.add(new Bullet(x, y, bulletSize, bulletSize, bulletHeight,
            Math.cos((degreesMouse)*degreesToRadians)*speed , 
            Math.sin((degreesMouse)*degreesToRadians)*speed ) );
            tempObject.ammo--;
        */

        //spread multi shot        
        for(var d = degreesMouse-5; d<degreesMouse+5; d+=2 ){
            gameObjectHandler.add(new Bullet(x, y, bulletSize, bulletSize, bulletHeight,
                Math.cos((d)*degreesToRadians)*speed , 
                Math.sin((d)*degreesToRadians)*speed ) );
            tempObject.ammo--;
        }
        
      
    }
}

function MouseEventHover(e){
    //console.log(e.movementX);
    e = e || window.event;
    

    tempObject = gameObjectHandler.getPlayer();
    if(tempObject !== undefined){                       
        var x = tempObject.getX()+(tempObject.getSizeX()/2),
            y = tempObject.getY()+(tempObject.getSizeY()/2),            
            xMouse = e.clientX-gameCanvas.getBoundingClientRect().left +camera.getX(),                    
            yMouse = e.clientY-gameCanvas.getBoundingClientRect().top  +camera.getY(),
            degreesMouse = getDegrees(x,y,xMouse,yMouse);

        is_n_157_5 = is_n_135 = is_n_112_5 = is_n_90 = is_n_67_5 = is_n_45 = is_n_22_5 = false;
        is_180 = is_157_5 = is_135 = is_112_5 = is_90 = is_67_5 = is_45 = is_22_5 = is_0 = false;

        if(degreesMouse>-11.25 && degreesMouse <=11.25){
            is_0 = true;            
        }else if(degreesMouse>11.25 && degreesMouse <=33.75){
            is_22_5 = true;
        }else if(degreesMouse>33.75 && degreesMouse <=56.25){            
            is_45 = true;     
        }else if(degreesMouse>56.25 && degreesMouse <=78.75){            
            is_67_5 = true;    
        }else if(degreesMouse>78.75 && degreesMouse <=101.25){            
            is_90 = true;
        }else if(degreesMouse>101.25 && degreesMouse <=123.75){            
            is_112_5 = true;            
        }else if(degreesMouse>123.75 && degreesMouse <=146.25){            
            is_135 = true;
        }else if(degreesMouse>146.25 && degreesMouse <=168.75){            
            is_157_5 = true;
        }else if(degreesMouse>168.75 || degreesMouse <=-168.75){            
            is_180 = true;
        }else if(degreesMouse>-168.75 && degreesMouse <=-146.25){            
            is_n_157_5 = true;
        }else if(degreesMouse>-146.25 && degreesMouse <=-123.75){            
            is_n_135 = true;
        }else if(degreesMouse>-123.75 && degreesMouse <=-101.25){            
            is_n_112_5 = true;
        }else if(degreesMouse>-101.25 && degreesMouse <=-78.75){            
            is_n_90 = true;
        }else if(degreesMouse>-78.75 && degreesMouse <=-56.25){
            is_n_67_5= true;
        }else if(degreesMouse>-56.25 && degreesMouse <=-33.75){
            is_n_45= true;
        }else if(degreesMouse>-33.75 && degreesMouse <=-11.25){
            is_n_22_5= true;
        }
        
        
    }
}

function getDegrees(x1, y1, x2, y2){
    //hypotenuse = Math.sqrt( Math.pow(xMouse - x, 2) + Math.pow(yMouse - y, 2)),    //hypotenuse = radius
    //xDelta = (xMouse-x);
    //yDelta = (yMouse-y);
    
    /*       Notes:
    //having the degrees as theta and center point, find the point                   

    sin(theta)=y/r   |   y=sin(theta)*r   |   sin(theta)=cos(90-theta);
    cos(theta)=x/r   |   x=cos(theta)*r   |   cos(theta)=sin(90-theta); 

    //find degrees given the point and center point
    theta = atan2(y,x)

    degrees to radians:
        radians = degrees * pi / 180
    radians to degrees:
        degrees = radians * 180 / pi

    radiansToDegrees = 180 / Math.PI;
    degreesToRadians = Math.PI / 180;
    
    */
    return Math.atan2(y2-y1,x2-x1) * radiansToDegrees;
}

function KeyPressed(e){
    e = e || window.event;
    //console.log(e);
    if(e.code == "KeyD") isKeyRight = true;
    if(e.code == "KeyA")  isKeyLeft = true; 
    if(e.code == "KeyW")    isKeyUp = true;
    if(e.code == "KeyS")  isKeyDown = true;    
   
    if(e.code == "KeyP"){
        var screen = document.getElementById("BackgroundBox");
        if (screen.requestFullscreen) {
            screen.requestFullscreen();
            //gameUI.requestFullscreen();
            //gameMouseEventHandler.requestFullscreen();
        } else if (screen.mozRequestFullScreen) { /* Firefox */
            screen.mozRequestFullScreen();
           // gameUI.mozRequestFullScreen();
            //gameMouseEventHandler.mozRequestFullScreen();
        } else if (screen.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            screen.webkitRequestFullscreen();
           // gameUI.webkitRequestFullscreen();
           // gameMouseEventHandler.webkitRequestFullscreen();
        } else if (screen.msRequestFullscreen) { /* IE/Edge */
            screen.msRequestFullscreen();
            //gameUI.msRequestFullscreen();
            //gameMouseEventHandler.msRequestFullscreen();
        }
    }

    if(e.code == "Numpad1") zoom+=.5;
    if(e.code == "Numpad2") zoom-=.5;
}

function KeyReleased(e){
    e = e || window.event;
    //console.log(e);
    if(e.code == "ArrowRight" || e.code == "KeyD") isKeyRight = false;
    if(e.code == "ArrowLeft"  || e.code == "KeyA")  isKeyLeft = false;
    if(e.code == "ArrowUp"    || e.code == "KeyW")    isKeyUp = false;
    if(e.code == "ArrowDown"  || e.code == "KeyS")  isKeyDown = false; 

}
