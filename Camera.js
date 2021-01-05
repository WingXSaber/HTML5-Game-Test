class Camera{
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.sizeX = width;
        this.sizeY = height;
        //this.zoom = zoom;
        this.objectSizeX = 0;
        this.objectSizeY = 0; 
        
    }
    tick(gameObject){
        this.objectSizeX = gameObject.getSizeX();
        this.objectSizeY = gameObject.getSizeY();      
        this.x = gameObject.getX() - (this.sizeX / 2) + gameObject.getSizeX()/2;
        this.y = gameObject.getY() - (this.sizeY / 2) + gameObject.getSizeY()/2;   
        /*
        if(zoom == 1){
            this.x = ((gameObject.getX()+this.objectSizeX/2) - this.width / 2);
            this.y = ((gameObject.getY()+this.objectSizeY/2) - this.height / 2);   
        }else if(this.zoom>1){ //it works
            this.x+=(this.width/ 2 / this.zoom)*(this.zoom-1); // *(zoom-1) is percentage
            this.y+=(this.height/2 / this.zoom)*(this.zoom-1); // *(zoom-1) is percentage
        }else if (zoom<1){           
            this.x-=(this.width/ 2 / this.zoom)*(1-this.zoom); //(zoom-1) is percentage
            this.y-=(this.height/2 / this.zoom)*(1-this.zoom); //(zoom-1) is percentage
        }
        */
    }
    setX(x){ this.x = x; }
    setY(y){ this.y = y; }
    //setZoom(zoom){ this.zoom = zoom; }
    getX(){ return this.x; }
    getY(){ return this.y; }

    getSizeX(){ return this.sizeX; }
    getSizeY(){ return this.sizeY; }

    getXMax(){ return this.x+this.sizeX;  }
    getYMax(){ return this.y+this.sizeY; }

    getCenterX(){ return this.x+(this.sizeX/2);  }
    getCenterY(){ return this.y+(this.sizeY/2); }
    
    //getXMax(){ return this.x+(this.width/this.zoom); }
    //getYMax(){ return this.y+(this.height/this.zoom); }
    
    intersects(tempObject){

        var allowance = (this.sizeX+this.sizeY)*0.05,
            temp_x = tempObject.getX(),
            temp_x_max = temp_x+tempObject.getSizeX(),
            temp_y = tempObject.getY(),
            temp_y_max = temp_y+tempObject.getSizeY(),
            x_max = this.x+this.sizeX+allowance,
            y_max = this.y+this.sizeY+allowance;
       
        return  !( x_max + allowance <= temp_x         ||
                    this.x - allowance >= temp_x_max   ||
                    this.y - allowance >= temp_y_max   ||
                    y_max + allowance <= temp_y              );
    }

}