var SCREEN_W        = 640;
var SCREEN_H        = 760;
var FPS             = 30;

var ASSETS  = [];

enchant();
window.onload = function() 
{
    game = new Core(SCREEN_W, SCREEN_H);
    game.fps = FPS;
    game.preload(ASSETS);
    game.rootScene.backgroundColor = 'white';
    game.onload = function(){
        console.log("onload");
        
        var scale_w = window.innerWidth / SCREEN_W;
        var scale_h = window.innerHeight / SCREEN_H;
        game.scale = scale_h >= scale_w ? scale_h : scale_w;
        
        game.rootScene.on(Event.TOUCH_START, function(e){
            console.log('root start '+e.x+' '+e.y);
        });
        game.rootScene.on(Event.TOUCH_MOVE, function(e){
            console.log('root move '+e.x+' '+e.y);
        });
        game.rootScene.on(Event.TOUCH_END, function(e){
            console.log('root end '+e.x+' '+e.y);
        });
        
        var e1 = new Entity();
        e1.backgroundColor = "red";
        e1.width = 100;
        e1.height = 100;
        e1.on(Event.TOUCH_START, function(e){
            if(this.x > e.x || this.x + this.width < e.x || this.y > e.y || this.y + this.height < e.y) {
                e.type = Event.TOUCH_END;
                this.dispatchEvent(e);
                return false;
            }
            console.log('red start '+e.x+' '+e.y);
        });
        e1.on(Event.TOUCH_MOVE, function(e){
            console.log('red move '+e.x+' '+e.y);
        });
        e1.on(Event.TOUCH_END, function(e){
            console.log('red end '+e.x+' '+e.y);
        });

        game.rootScene.addChild(e1);


        var e2 = new Entity();
        e2.backgroundColor = "blue";
        e2.x = 50;
        e2.y = 50;
        e2.width = 100;
        e2.height = 100;
        e2.on(Event.TOUCH_START, function(e){
            console.log('blue start '+e.x+' '+e.y);
            e1.dispatchEvent(e);
        });
        e2.on(Event.TOUCH_MOVE, function(e){
            console.log('blue move '+e.x+' '+e.y);
            e1.dispatchEvent(e);
        });
        e2.on(Event.TOUCH_END, function(e){
            console.log('blue end '+e.x+' '+e.y);
            e1.dispatchEvent(e);
        });
        
        game.rootScene.addChild(e2);
    };
    
    game.start();
};
