
var TITLE_I_MENU        = "img/title_menu.png";
var TITLE_S_BGM         = "sound/title_bgm.mp3";
var TITLE_S_SELECT      = "sound/title_select.mp3";


enchant.title = { assets:[
    TITLE_I_MENU
] };

if( navigator.userAgent.search(/Android/) == -1 ){
    enchant.title.assets.push(
        TITLE_S_BGM,
        TITLE_S_SELECT
    );
} else {
    enchant.util.Sound.initSe(TITLE_S_SELECT);
}

// -----------------------------------------------------------------------------
enchant.title.Title = enchant.Class.create(enchant.Scene, 
{
	initialize: function() 
	{
        enchant.Scene.call(this);

        Log.d('call title.');


        this.backgroundColor = "white";
        
        game.story = 1;
    
        Sound.init(TITLE_S_BGM, this);
        Sound.play(this);



        var MX = 8, MY = 10;
        var size = SCREEN_W / MX;
        for(var y = 0; y < MY; y++) {

            this.surface = new Surface(size, size);
            this.surface.context.beginPath();
            this.surface.context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
            this.surface.context.fillStyle = "rgb("+(200+y*7)+", "+(150+y*10)+", 0)";
            this.surface.context.fill();

            for(var x = 0; x < MX; x++) {
                this.sprite  = new Sprite(size, size);
            	this.sprite.image = this.surface;
            	
            	var r = Math.random();
            	var s1 = r * ((y*2+1) / (MY*2)) + Math.random() * (y / MY);
            	var s2 = r * ((y*2+1) / (MY*2)) + 0.5 + Math.random() / 2 * (y / 2);
            	this.sprite.x = x * size + (y % 2) * size / 2 - 30;
            	this.sprite.y = y * size;
            	this.sprite.scale(s1, s1);
            	this.sprite.tl
                	.scaleTo(s2, s2, 20 + Math.ceil(30 * r))
                	.scaleTo(s1 ,s1, 20 + Math.ceil(30 * r))
                	.loop();
            	this.addChild(this.sprite);
            }
        }
    
        var group = new Group();
        this.addChild(group);
        
        this.bg = new Sprite(SCREEN_W, SCREEN_H);
        this.bg.image = game.assets[BG];
        this.bg.frame = 0;
        group.addChild(this.bg);
    
        var _this = this;
        //
        this.menu1 = new Sprite(520, 80);
        this.menu1.image = game.assets[TITLE_I_MENU];
        this.menu1.x = 50;
        this.menu1.y = 450;
        this.menu1.frame = 0;
        this.menu1.mode = MODE_STORY;
        this.menu1.on(Event.TOUCH_START, function(){ _this.start(_this.menu1); });
        group.addChild(this.menu1);
    
        //
        this.menu2 = new Sprite(520, 80);
        this.menu2.image = game.assets[TITLE_I_MENU];
        this.menu2.x = 50;
        this.menu2.y = 530;
        this.menu2.frame = 1;
        this.menu2.mode = MODE_ENDLESS;
        this.menu2.on(Event.TOUCH_START, function(){ _this.start(_this.menu2); });
        group.addChild(this.menu2);
    
//        //
//        var menu3 = new Sprite(520, 80);
//        menu3.image = game.assets[TITLE_I_MENU];
//        menu3.x = 50;
//        menu3.y = 610;
//        menu3.frame = 2;
//        menu3.mode = MODE_BATTLE;
//        menu3.on(Event.TOUCH_START, function(){ _this.start(menu3); });
//        group.addChild(menu3);
    
        //this.version = new ShadowLabel("Version " + VERSION);
        this.version = new ShadowLabel("2015 RyuN / BGM・SE SKIPMORE");
        this.version.font = "32px 'Noto Sans CJK JP'";
        this.version.width = 640;
        this.version.x = 0;
        this.version.y = SCREEN_H - this.version.height * 1.3;
        this.version.color = "#a50";
        this.version.textAlign = "center";
        this.version.on(Event.TOUCH_START, function(){
            System.gotoSkipmore();
        });
        this.addChild(this.version);
    
        this.shiscore = new ShadowLabel("Story HiScore: " + System.loadScore(HISCORE_STORY));
        this.shiscore.font = "25px 'Noto Sans CJK JP'";
        this.shiscore.x = 10;
        this.shiscore.y = this.shiscore.height / 3;
        this.shiscore.color = "#C44";
        this.addChild(this.shiscore);
    
        this.ehiscore = new ShadowLabel("Endless HiScore: " + System.loadScore(HISCORE_ENDLESS));
        this.ehiscore.font = "25px 'Noto Sans CJK JP'";
        this.ehiscore.y = this.ehiscore.height / 3;
        this.ehiscore.color = "#C44";
        this.addChild(this.ehiscore);
        this.ehiscore.x = SCREEN_W - this.ehiscore.width - 10;



        this.on(enchant.Event.EXIT, function(){
            ['sprite', 'surface','bg','menu1','menu2','version','shiscore','ehiscore'].forEach(function(name){
                _this[name].clearEventListener();
                _this[name] = null;
             });
        });

        System.start();
    },
    
    start: function(menu)
    {
        if( game.mode ) return;

        Sound.se(TITLE_S_SELECT);

        menu.on(Event.ENTER_FRAME, function(){
            this.visible = !this.visible;
        });
        
        game.mode = menu.mode;

        var _this = this;
        var fadeout = new Entity();
        fadeout.width = SCREEN_W;
        fadeout.height = SCREEN_H;
        fadeout.opacity = 0;
        fadeout.backgroundColor = "white";
        fadeout.tl
            .fadeIn(getTime(500))
            .then(function()
            {
                Sound.stop(_this);
                game.rootScene.dispatchEvent(new Event('ChangeMode'));
                fadeout = null;
            });
        this.addChild(fadeout);
    }
        
});
