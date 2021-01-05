class GameObjectHandler{    
    constructor(){
        this.objectList_active = [];      
        this.objectList_inactive = [];  
        this.playerIndex = 0;
    }
    
    add(GameObject){        
        this.objectList_active.push(GameObject);
        return this.objectList_active.length-1;
    }

    remove(index){
        if(typeof(index)=="number")
            this.objectList_active.splice(index, 1);
        else    
            console.log("GameObjectHandler.remove(index) failed. Invalid index.");
    }

    get(index){
        return this.objectList_active[index];
    }

    activeLength(){
        return this.objectList_active.length;
    }   
    inactiveLength(){
        return this.objectList_inactive.length;
    }  

    sleepObject(index){
        this.objectList_inactive.push(this.objectList_active[index]);       
        this.objectList_active.splice(index, 1);
    }

    wakeObject(index){      
        this.objectList_active.push(this.objectList_inactive[index]);        
        this.objectList_inactive.splice(index, 1);        
    }
    
    getPlayer(){
        return this.objectList_active[this.playerIndex];
    }

    tick(camera){
        var length = this.objectList_inactive.length;
        for(var x = 0; x<length; x++){            
            var tempObject = this.objectList_inactive[x];     
            if(tempObject !== undefined)              
                if(camera.intersects(tempObject))
                    this.wakeObject(x);
                     
        }
        length = this.objectList_active.length;
        for(var x = 0; x<length; x++){
            var tempObject = this.objectList_active[x];     
            if(tempObject !== undefined){ 
                if(tempObject.getID()=="player"){     
                    this.playerIndex=x;                                                                           
                    tempObject.tick();
                    camera.tick(tempObject); 
                }else if(camera.intersects(tempObject)){                    
                    tempObject.tick();                    
                }else if(tempObject.getID() === "bullet"){
                    this.remove(x);
                }else if(tempObject.getID() !== "player"){                    
                    this.sleepObject(x);                
                }
            }         
        }       

    }

    render(g, camera){
        var length = this.activeLength();
        var arrayRender = [];
        /*
          Index
            [0] [0] tempObject.getY()
            [0] [1] tempObject index -> i

            [1] [0]
            [1] [1]
        */
        for(var i = 0; i<length; i++){
            var tempObject = this.get(i);
            if(camera.intersects(tempObject))
                arrayRender.push([tempObject.getY()+tempObject.getSizeY(), i]);
        }

        arrayRender.sort();

        length = arrayRender.length;
        for(var i = 0; i<length; i++)          
            this.get(arrayRender[i][1]).render(g);
        
    }

}


///===============================================================================



    
class GameObject{
    constructor(x, y, sizeX, sizeY,  height, ID){
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.height = height;
        this.ID = ID;        
        this.velX = 0;
        this.velY = 0;
    }

    tick() {  }

    render(g){ }

    setX(x){    this.x = x;    }
    setY(y){    this.y = y;    }    
    setSizeX(sizeX){    this.sizeX = sizeX;    }
    setSizeY(sizeY){    this.sizeY = sizeY;    }
    setVelX(velX){   this.velX = velX;    }
    setVelY(velY){   this.velY = velY;    }
    setHeight(height){   this.height = height; };
    
    getX(){    return this.x;    }
    getY(){    return this.y;    }    
    getSizeX(){    return this.sizeX;    }
    getSizeY(){    return this.sizeY;    }
    getVelX(){   return this.velX;    }
    getVelY(){   return this.velY;    }
    getHeight(){ return this.height;  };

    getID(){    return this.ID   }

    getCenterX(){    return this.x+(this.sizeX/2);    }
    getCenterY(){    return this.y+(this.sizeY/2);    }

    intersects(tempObject){
        var temp_x = tempObject.getX(),
            temp_x_max = temp_x+tempObject.getSizeX(),
            temp_y = tempObject.getY(),
            temp_y_max = temp_y+tempObject.getSizeY(),
            x_max = this.x+this.sizeX,
            y_max = this.y+this.sizeY;

       return  !( x_max <= temp_x        ||
                  this.x >= temp_x_max   ||
                  this.y >= temp_y_max   ||
                  y_max <= temp_y              );
    }

    collision(){        
        var targetObject;
        for(var i=0; i<gameObjectHandler.activeLength(); i++){
            targetObject = gameObjectHandler.get(i);
            if(targetObject !== undefined && targetObject!== this){
                
                if(targetObject.getID() === 'wall')
                    if(this.intersects(targetObject))
                        return true;
                
                if(targetObject.getID() === 'enemy' && this!==targetObject)
                    if(this.intersects(targetObject)){
                        return true;
                    }
                               
                if(targetObject.getID() === 'player')
                    if(this.intersects(targetObject))
                        return true;
                    
            }
        }
        return false;
    }

}



///===============================================================================



const GameObjectID = {
    PLAYER : 'player',
    WALL : 'wall',
    AMMOBOX : 'ammobox',
    ENEMY : 'enemy',
    BULLET : 'bullet',
    DUMMY : 'dummy'
}



///===============================================================================




class Player extends GameObject{
    constructor(x, y, hp, ammo){        
        super(x, y, 32, 32*.75, 48, GameObjectID.PLAYER);                
        this.isUp = this.isRight = this.isLeft = false;
        this.isDown = true;
        this.hp = hp;
        this.ammo = ammo;
        this.speedStep = 1;
        this.speedMax = 8;     
        
        this.sprites = [];
        for(var i =0; i<all_Images.length; i++){
            if(all_Images[i][1]==="Player_00"    ||    //0 
               all_Images[i][1]==="Player_22.5"  ||    //1
               all_Images[i][1]==="Player_45"    ||    //2
               all_Images[i][1]==="Player_67.5"  ||    //3 
               all_Images[i][1]==="Player_90"    ||    //4
               all_Images[i][1]==="Player_112.5" ||    //5 
               all_Images[i][1]==="Player_135"   ||    //6
               all_Images[i][1]==="Player_157.5" ||    //7
               all_Images[i][1]==="Player_180"   ||    //8
               all_Images[i][1]==="Player_-157.5"||    //9              
               all_Images[i][1]==="Player_-135"  ||    //10
               all_Images[i][1]==="Player_-112.5"||    //11
               all_Images[i][1]==="Player_-90"   ||    //12
               all_Images[i][1]==="Player_-67.5" ||    //13
               all_Images[i][1]==="Player_-45"   ||    //14
               all_Images[i][1]==="Player_-22.5"  )    //15
                this.sprites.push(all_Images[i][0])
                
        }

        this.sprites_LowerBody = [];
        for(var i =0; i<all_Images.length; i++){
            for(var j = 0; j<4; j++){                
                if(all_Images[i][1]==="Player_LowerBody_0_"     +j ||    //0
                   all_Images[i][1]==="Player_LowerBody_45_"    +j ||    //1
                   all_Images[i][1]==="Player_LowerBody_90_"    +j ||    //2
                   all_Images[i][1]==="Player_LowerBody_135_"   +j ||    //3 
                   all_Images[i][1]==="Player_LowerBody_180_"   +j ||    //4 
                   all_Images[i][1]==="Player_LowerBody_-135_"  +j ||    //5
                   all_Images[i][1]==="Player_LowerBody_-90_"   +j ||    //6
                   all_Images[i][1]==="Player_LowerBody_-45_"   +j  )    //7
                        this.sprites_LowerBody.push(all_Images[i])
            }
        }
        
        this.sprites_Head = [];
        for(var i =0; i<all_Images.length; i++){
            if(all_Images[i][1]==="Player_Head_0"      ||    //0 
               all_Images[i][1]==="Player_Head_22.5"   ||    //1
               all_Images[i][1]==="Player_Head_45"     ||    //2
               all_Images[i][1]==="Player_Head_67.5"   ||    //3 
               all_Images[i][1]==="Player_Head_90"     ||    //4
               all_Images[i][1]==="Player_Head_112.5"  ||    //5 
               all_Images[i][1]==="Player_Head_135"    ||    //6
               all_Images[i][1]==="Player_Head_157.5"  ||    //7
               all_Images[i][1]==="Player_Head_180"    ||    //8
               all_Images[i][1]==="Player_Head_-157.5" ||    //9              
               all_Images[i][1]==="Player_Head_-135"   ||    //10
               all_Images[i][1]==="Player_Head_-112.5" ||    //11
               all_Images[i][1]==="Player_Head_-90"    ||    //12
               all_Images[i][1]==="Player_Head_-67.5"  ||    //13
               all_Images[i][1]==="Player_Head_-45"    ||    //14
               all_Images[i][1]==="Player_Head_-22.5"   )    //15
                    this.sprites_Head.push(all_Images[i])
            
        }        
        
        this.sprites_Shotgun = [];
        for(var i =0; i<all_Images.length; i++){
            if(all_Images[i][1]==="Player_Shotgun_0"      ||    //0 
               all_Images[i][1]==="Player_Shotgun_22.5"   ||    //1
               all_Images[i][1]==="Player_Shotgun_45"     ||    //2
               all_Images[i][1]==="Player_Shotgun_67.5"   ||    //3 
               all_Images[i][1]==="Player_Shotgun_90"     ||    //4
               all_Images[i][1]==="Player_Shotgun_112.5"  ||    //5 
               all_Images[i][1]==="Player_Shotgun_135"    ||    //6
               all_Images[i][1]==="Player_Shotgun_157.5"  ||    //7
               all_Images[i][1]==="Player_Shotgun_180"    ||    //8
               all_Images[i][1]==="Player_Shotgun_-157.5" ||    //9              
               all_Images[i][1]==="Player_Shotgun_-135"   ||    //10
               all_Images[i][1]==="Player_Shotgun_-112.5" ||    //11
               all_Images[i][1]==="Player_Shotgun_-90"    ||    //12
               all_Images[i][1]==="Player_Shotgun_-67.5"  ||    //13
               all_Images[i][1]==="Player_Shotgun_-45"    ||    //14
               all_Images[i][1]==="Player_Shotgun_-22.5"   )    //15
                    this.sprites_Shotgun.push(all_Images[i])
        }      
        this.animation_isRunning = false;
        this.animation_Running_frame = 0;
        this.animation_Running_MaxFrame = 30;
        this.animation_Running_currentSprite = 0;

    }
    
    tick(){         
        this.x+=this.velX;
        
        if(this.velX!=0)
            while(this.collision()){    
                if(this.velX>0)
                    this.x--;
                else
                    this.x++;
            }     

        this.y+=this.velY;

        if(this.velY!=0)
            while(this.collision()){
                if(this.velY>0)
                    this.y--;
                else
                    this.y++;
            }  

        if(this.animation_isRunning){
            if(this.animation_Running_frame<this.animation_Running_MaxFrame)
                this.animation_Running_frame++;
            else
                this.animation_Running_frame = 0;                
            
            if(this.animation_Running_frame<=5) //5 frames
                this.animation_Running_currentSprite = 0;
            else if(this.animation_Running_frame>5 && this.animation_Running_frame<=15)  //10 frames
                this.animation_Running_currentSprite = 1;
            else if(this.animation_Running_frame>15 && this.animation_Running_frame<=20)  //5 frames
                this.animation_Running_currentSprite = 2;            
            else if(this.animation_Running_frame>20 && this.animation_Running_frame<=30) //10 frames
                this.animation_Running_currentSprite = 3;
        }else{
            this.animation_Running_frame = 0;       
            this.animation_Running_currentSprite = 0;
        }

        if(this.velX!=0 || this.velY!=0)
            this.animation_isRunning = true;
        else
            this.animation_isRunning = false;

        

        if(isKeyUp)
            if(this.velY-this.speedStep >= -this.speedMax)
                this.velY -= this.speedStep;
        if(isKeyDown)
            if(this.velY+this.speedStep <= this.speedMax)
                this.velY += this.speedStep;
        if(!isKeyUp&&!isKeyDown || (isKeyUp&&isKeyDown) )
            if(this.velY>0)
                this.velY -= this.speedStep;                    
            else if (this.velY<0)
                this.velY += this.speedStep;                

        if(isKeyLeft)
            if(this.velX-this.speedStep >= -this.speedMax)
                this.velX -= this.speedStep;
        if(isKeyRight)
            if(this.velX+this.speedStep <= this.speedMax)
                this.velX += this.speedStep;
        if(!isKeyLeft&&!isKeyRight || (isKeyLeft&&isKeyRight) )
            if(this.velX>0)
                this.velX -= this.speedStep;                    
            else if (this.velX<0)
                this.velX += this.speedStep;   
                
        if(this.velX>0){
            this.isLeft = false;
            this.isRight = true;  
            if(this.velY == 0){         
                this.isUp = false;
                this.isDown = false;
            }
        }else if(this.velX<0){
            this.isLeft = true;
            this.isRight = false;
            if(this.velY == 0){         
                this.isUp = false;
                this.isDown = false;
            }
        }

        if(0>this.velY){
            this.isUp = true;
            this.isDown = false;
            if(this.velX == 0){         
                this.isLeft = false;
                this.isRight = false;
            }
        }else if(0<this.velY){
            this.isUp = false
            this.isDown = true;
            if(this.velX == 0){         
                this.isLeft = false;
                this.isRight = false;
            }
        }
            
    }
    
    collision(){          
        var tempObject;
        for(var i=0; i<gameObjectHandler.activeLength(); i++){
            tempObject = gameObjectHandler.get(i);
            if(tempObject !== undefined){
                if(tempObject.getID() === 'wall')
                    if(this.intersects(tempObject))
                        return true;
                
                if(tempObject.getID() === 'enemy')
                    if(this.intersects(tempObject))
                        return true;
                
                if(tempObject.getID() === 'ammobox')
                    //ammo++;
                    if(this.intersects(tempObject)){                                                
                        gameObjectHandler.remove(i);
                    }
                               
            }
        }
        return false;
    }


    render(g){
        //g.beginPath();
        //g.arc(this.x+(this.sizeX/2), this.y+(this.sizeY/2), this.sizeX/2, 0, 2*Math.PI, false);            
        g.fillStyle = "rgba(0,10,0,0.2)";
        //g.fill();
        g.fillRect(this.x, this.y, this.sizeX, this.sizeY);

        /*
        g.fillStyle = '#ffffff';
        g.font = '10px arial';
        g.fillText(""+this.x, this.x, this.y+10);
        g.fillText(""+this.y, this.x, this.y+25);
        */

        if(is_135)     {
            this.draw(g, this.sprites_Shotgun[6][0]);
        }else if(is_157_5)   {
            this.draw(g, this.sprites_Shotgun[7][0]);
        }else if(is_180)     {
            this.draw(g, this.sprites_Shotgun[8][0]);
        }else if(is_n_157_5) {
            this.draw(g, this.sprites_Shotgun[9][0]);
        }else if(is_n_135)   {
            this.draw(g, this.sprites_Shotgun[10][0]);
        }else if(is_n_112_5) {
            this.draw(g, this.sprites_Shotgun[11][0]);
        }
        
        this.frameIndex = this.animation_Running_currentSprite*8;
             if(this.isUp&&this.isRight)   this.draw(g, this.sprites_LowerBody[7+this.frameIndex][0]);  
        else if(this.isUp&&this.isLeft)    this.draw(g, this.sprites_LowerBody[5+this.frameIndex][0]);
        else if(this.isDown&&this.isRight) this.draw(g, this.sprites_LowerBody[1+this.frameIndex][0]);   
        else if(this.isDown&&this.isLeft)  this.draw(g, this.sprites_LowerBody[3+this.frameIndex][0]);  
        else if(this.isUp)            this.draw(g, this.sprites_LowerBody[6+this.frameIndex][0]);  
        else if(this.isDown)          this.draw(g, this.sprites_LowerBody[2+this.frameIndex][0]);  
        else if(this.isLeft)          this.draw(g, this.sprites_LowerBody[4+this.frameIndex][0]);  
        else if(this.isRight)         this.draw(g, this.sprites_LowerBody[0+this.frameIndex][0]);
        
        
        if(is_0){
            this.draw(g, this.sprites_Shotgun[0][0]);
            this.draw(g, this.sprites_Head[0][0]);            
        }else if(is_22_5)     {
            this.draw(g, this.sprites_Shotgun[1][0]);
            this.draw(g, this.sprites_Head[1][0]);           
        }else if(is_45)       {
            this.draw(g, this.sprites_Shotgun[2][0]);
            this.draw(g, this.sprites_Head[2][0]);            
        }else if(is_67_5)     {
            this.draw(g, this.sprites_Shotgun[3][0]);
            this.draw(g, this.sprites_Head[3][0]);            
        }else if(is_90)      {
            this.draw(g, this.sprites_Shotgun[4][0]);
            this.draw(g, this.sprites_Head[4][0]);            
        }else if(is_112_5)   {
            this.draw(g, this.sprites_Shotgun[5][0]);
            this.draw(g, this.sprites_Head[5][0]);            
        }else if(is_135)     {
            this.draw(g, this.sprites_Head[6][0]);
        }else if(is_157_5)   {
            this.draw(g, this.sprites_Head[7][0]);
        }else if(is_180)     {
            this.draw(g, this.sprites_Head[8][0]);
        }else if(is_n_157_5) {
            this.draw(g, this.sprites_Head[9][0]);
        }else if(is_n_135)   {
            this.draw(g, this.sprites_Head[10][0]);
        }else if(is_n_112_5) {
            this.draw(g, this.sprites_Head[11][0]);
        }else if(is_n_90)    {
            this.draw(g, this.sprites_Shotgun[12][0]);
            this.draw(g, this.sprites_Head[12][0]);
        }else if(is_n_67_5)  {
            this.draw(g, this.sprites_Shotgun[13][0]);
            this.draw(g, this.sprites_Head[13][0]);
        }else if(is_n_45)    {
            this.draw(g, this.sprites_Shotgun[14][0]);
            this.draw(g, this.sprites_Head[14][0]);
        }else if(is_n_22_5)  {
            this.draw(g, this.sprites_Shotgun[15][0]);
            this.draw(g, this.sprites_Head[15][0]);
        }
       
    }
    
    draw(g, image){
        if(image!=null)
           g.drawImage(image, this.x-36, this.y-this.height-6);
            //g.drawImage(image, this.x-36*1.5, this.y-this.height-6, image.width*1.5, image.height*1.5);
    }

}





///===============================================================================





class Wall extends GameObject{
    constructor(x, y, sizeX, sizeY, height){        
        super(x, y, sizeX, sizeY, 0, GameObjectID.WALL);             
    }
    
    tick(){         
        
    }
    render(g){        
        
        //g.fillStyle = "#326da8";

        //g.fillStyle = "rgba(50, 109, 168,1)";                ;
        g.fillRect(this.x, this.y, this.sizeX, this.sizeY);                
        
        //g.fillStyle = "rgba(50, 109, 168,1)";
        g.fillStyle = "rgba(100,100,100,1)";
        g.fillRect(this.x, this.y-this.height, this.sizeX, this.sizeY+this.height);

        //g.fillStyle = "rgba(50, 100, 140,1)";
        g.fillStyle = "rgba(30,30,30,1)";
        g.fillRect(this.x, this.y-this.height, this.sizeX, this.sizeY);        

        g.fillStyle = '#ffffff';
        g.font = '10px arial';
        g.fillText(""+this.x, this.x, this.y+10);
        g.fillText(""+this.y, this.x, this.y+25);

    }
}




///===============================================================================




class Enemy1 extends GameObject{
    constructor(x, y, hp){        
        super(x, y, 32, 32*.75, 52,  GameObjectID.ENEMY);
        this.hp = hp; 
        this.speed = 1.5;
        //this.speed_Max = 5;
        this.aggroDistance = 450;
        this.isAggro = false;
    }

    setAgrroDistance(distance){
        this.aggroDistance = distance;
    }
    
    tick(){    
        this.x+=this.velX;
        this.y+=this.velY;

        if(this.velX!=0 || this.velY!=0)
            while(this.collision()){    
                this.x+=(this.velX*-1)*.1;
                this.y+=(this.velY*-1)*.1;
            }     


        var playerObject = gameObjectHandler.getPlayer();
        if(playerObject!=undefined){
            var hypotenuse = Math.sqrt( Math.pow(playerObject.getCenterX() - this.getCenterX(), 2) + Math.pow(playerObject.getCenterY() - this.getCenterY(), 2));
            
            
            if(hypotenuse <= this.aggroDistance )
                this.isAggro = true;
            else
                this.isAggro = false;


            //if(this.isAggro && this.checkCollisionInPathTarget(this, playerObject)){            
            //    var degreesMouse = getDegrees(this.x, this.y, playerObject.getCenterX(), playerObject.getCenterY());
            //    this.velX = Math.cos(degreesMouse*degreesToRadians)*this.speed; 
            //    this.velY = Math.sin(degreesMouse*degreesToRadians)*this.speed;   
            //}else
				if(this.isAggro){
                var degreesMouse = getDegrees(this.x, this.y, playerObject.getCenterX(), playerObject.getCenterY());
                this.velX = Math.cos(degreesMouse*degreesToRadians)*this.speed; 
                this.velY = Math.sin(degreesMouse*degreesToRadians)*this.speed; 
            }else{
                this.velX = 0;
                this.velY = 0;
                //this.speed = 0;
            }
        }
        
    }

 
    checkCollisionInPathTarget(sourceObject, targetObject){
        var flag = false;     
		var hypotenuse = Math.sqrt( Math.pow(targetObject.getX() - sourceObject.getX(), 2) + Math.pow(targetObject.getY() - sourceObject.getY(), 2));		
		
        var degreesMouse = getDegrees(sourceObject.getX(), sourceObject.getY(), targetObject.getX(), targetObject.getY()),
            velX = Math.cos(degreesMouse*degreesToRadians)*(sourceObject.getSizeX()), 
            velY = Math.sin(degreesMouse*degreesToRadians)*(sourceObject.getSizeY());
        var tempObject = new GameObject(sourceObject.getX(), sourceObject.getY(), sourceObject.getSizeX(), sourceObject.getSizeY(), sourceObject.getHeight(), sourceObject.getID());
        
		
        for(var i=0; i<hypotenuse; i++){
            flag = this.collision();
            if(flag)
                return flag;
            else{
                tempObject.setX(tempObject.getX()+velX);
                tempObject.setY(tempObject.getY()+velY);                
            }            
            if(tempObject.intersects(targetObject))                
                i=hypotenuse;            
                
        }
        return flag;
    }

    render(g){
        /*
        g.fillStyle = "#32a852";
        g.fillRect(this.x, this.y, this.sizeX, this.sizeY);
        
        //g.fillStyle = "rgba(50, 168, 82, 1)";
        g.fillRect(this.x, this.y-this.height, this.sizeX, this.sizeY+this.height);

        g.fillStyle = "rgba(40, 150, 70, 1)";
        g.fillRect(this.x, this.y-this.height, this.sizeX, this.sizeY);

        g.fillStyle = '#ffffff';
        g.font = '10px arial';
        g.fillText(""+this.x, this.x, this.y+10);
        g.fillText(""+this.y, this.x, this.y+25);
        */
        
        //g.drawImage(all_Images[1][0], this.x-37, this.y-this.height-10, all_Images[1][0].width, all_Images[1][0].height);
        g.drawImage(all_Images[1][0], this.x-36, this.y-this.height-10);
       // g.drawImage(all_Images[1][0], this.x-36*1.5, this.y-this.height-10,all_Images[1][0].width*1.5, all_Images[1][0].height*1.5);
        g.fillStyle = "rgba(0, 0, 0, 0.2)";
        g.fillRect(this.x, this.y, this.sizeX, this.sizeY);
        
    }
}


class AmmoBox extends GameObject{
    constructor(x, y, sizeX, sizeY){
        super(x, y, sizeX, sizeY, 0,  GameObjectID.AMMOBOX);        
    }
    
    tick(){         
        
    }
    render(g){
        g.fillStyle = "#ffffff";
        g.fillRect(this.x, this.y, this.sizeX, this.sizeY);
        
        g.fillStyle = '#000000';
        g.font = '10px arial';
        g.fillText(""+this.x, this.x, this.y+10);
        g.fillText(""+this.y, this.x, this.y+25);
    }
}


class Bullet extends GameObject{
    constructor(x, y, sizeX, sizeY, height, velX, velY){      
        super(x-(sizeX/2), y-(sizeY/2), sizeX, sizeY, height, GameObjectID.BULLET);   
        this.velX = velX;
        this.velY = velY;    
    }
    
    tick(){         
        this.x+=this.velX;
        this.y+=this.velY;
            
        var tempObject;
        var selfTerminate = false;
        var thisIndex;
        for(var i=0; i<gameObjectHandler.activeLength(); i++){
            tempObject = gameObjectHandler.get(i);
            if(tempObject !== undefined){
                if(tempObject.getID() === 'wall'){                                    
                    if(this.intersects(tempObject)){
                        console.log("wall hit.");
                        selfTerminate = true;
                    }
                }
                if(tempObject.getID() === 'enemy'){
                    if(this.intersects(tempObject)){                                                
                        console.log("enemy hit! Dealt 50 dmg. Enemy hp:"+tempObject.hp);
                        selfTerminate = true;                            
                        tempObject.hp-=50;                        
                        if(tempObject.hp <= 0)
                            gameObjectHandler.remove(i);
                    }
                }
                if(tempObject === this){
                    thisIndex = i;
                }
            }
        }
        if(selfTerminate)
            gameObjectHandler.remove(thisIndex);
        
    }

    render(g){
        g.fillStyle = 'rgba(0,0,0,0.1)';
        g.fillRect(this.x, this.y, this.sizeX, this.sizeY);

        g.fillStyle = '#000000';
        g.fillRect(this.x, this.y-this.height, this.sizeX, this.sizeY);
        

    }
}


