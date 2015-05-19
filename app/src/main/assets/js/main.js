
var SCREEN_W        = 640;
var SCREEN_H        = 760;
var FPS             = 10;

var MODE_TITLE      = 0;
var MODE_STORY      = 1;
var MODE_WHACK      = 2;
var MODE_ENDLESS    = 3;
var MODE_BATTLE     = 4;
var MODE_AGGREGATE_STORY    = 5;
var MODE_AGGREGATE_ENDLESS  = 6;

var HISCORE_STORY   = 'shiscore';
var HISCORE_ENDLESS = 'ehiscore';

var VERSION         = "0.0.1";

var ASSETS = [];



enchant(['util', 'title', 'story', 'whack', 'aggregate']);
window.onload = function() 
{
    game = new Core(SCREEN_W, SCREEN_H);
//    game.debug();
    game.fps = FPS;
    game.preload(ASSETS);
    game.rootScene.backgroundColor = 'black';
    game.mode = MODE_TITLE;
    game.stage = 1;
    game.score = {endless: 0, stage2: 0, stage2: 0, stage3: 0, stage4: 0, stage5: 0, maxchain: 0};

    Log.enable = false;

//    enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
//        initialize: function() {
//            enchant.Scene.call(this);
//            
//            var splash = new Sprite(SCREEN_W, SCREEN_H);
//            splash.image = game.assets[SPLASH];
//            this.addChild(splash);
//
//            this.addEventListener(Event.PROGRESS, function(e) {
//                progress = e.loaded / e.total;
//            });
//            this.addEventListener('enterframe', function() {
//                // animation
//            });
//        }
//    });

    var scene = new enchant.Scene();
    scene.backgroundColor = "white";
    scene.addEventListener('load', function(e) {
        var core = enchant.Core.instance;
        core.removeScene(core.loadingScene);
        core.dispatchEvent(e);
    });
    game.loadingScene = scene;
    

    game.onload = function(){
        Log.d("onload");
        
        var scale_w = window.innerWidth / SCREEN_W;
        var scale_h = window.innerHeight / SCREEN_H;
        game.scale = scale_h >= scale_w ? scale_h : scale_w;
        game.rootScene.dispatchEvent(new Event('ChangeMode'));
        
        //System.start();
    };
    
    game.rootScene.on('ChangeMode', function(){
        Log.d("ChangeMode " + game.mode);
        
        var scene;
        switch(game.mode){
            case MODE_TITLE: 
                scene = new enchant.title.Title(); break;
            case MODE_STORY: 
                scene = new enchant.story.Story(); break;
            case MODE_WHACK: 
                scene = new enchant.whack.Story(); break;
            case MODE_ENDLESS: 
                scene = new enchant.whack.Endless(); break;
            case MODE_BATTLE: 
                scene = new enchant.whack.Battle(); break;
            case MODE_AGGREGATE_STORY: 
                scene = new enchant.aggregate.Story(); break;
            case MODE_AGGREGATE_ENDLESS: 
                scene = new enchant.aggregate.Endless(); break;
        }


        var s = game.popScene();
        s.childNodes.forEach(function(node1){
            if( node1 instanceof Group ) {
                node1.childNodes.forEach(function(node2){
                    node2.clearEventListener();
                    s.removeChild(node2);
                    node2 = null;
                });
            } else {
                node1.clearEventListener();
                s.removeChild(node1);
                node1 = null;
            }
        });
        s = null;

        game.pushScene(scene);
    });


    game.start();
};
