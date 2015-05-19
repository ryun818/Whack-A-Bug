var StageData = {
    "stage1": { bug:  20, maxbug:  50, second: 1 * 60 * 1000, types:    [1] },
    "stage2": { bug:  40, maxbug: 100, second: 1 * 60 * 1000, types:  [1,2] },
    "stage3": { bug:  70, maxbug: 200, second: 2 * 60 * 1000, types:  [1,2] },
    "stage4": { bug: 100, maxbug: 300, second: 2 * 60 * 1000, types:[1,2,3] },
    "stage5": { bug: 130, maxbug: 400, second: 3 * 60 * 1000, types:[1,2,3] },
    "endless":{ bug:   0, maxbug:   0, second: 2 * 60 * 1000, types:[1,2,3] }
}
var HoleList = [
    {x: 20,y:338,s:0}, {x:140,y:338,s:0}, {x:260,y:338,s:0}, {x:380,y:338,s:0},
    {x: 80,y:458,s:0}, {x:200,y:458,s:0}, {x:320,y:458,s:0},
    {x: 20,y:578,s:0}, {x:140,y:578,s:0}, {x:260,y:578,s:0}
];
//var WARNING_LIMIT = 30 * 1000;



var WHACK_I_LEVEL       = "img/whack_level.png";
var WHACK_I_CHAIN       = "img/whack_chain.png";
var WHACK_I_STAR        = "img/whack_star.png";
var WHACK_I_PAUSE       = "img/whack_pause.png";
var WHACK_I_DOC         = "img/whack_document.png";
var WHACK_I_CONDITION   = "img/whack_condition.png";
var WHACK_I_REMAINING   = "img/whack_remaining.png";
var WHACK_I_TIME_RING   = "img/whack_time_ring.png";
var WHACK_I_TIME_CIRCLE = "img/whack_time_circle.png";
var WHACK_I_CONTINUE    = "img/whack_continue.png";

var WHACK_S_BGM         = "sound/whack_bgm.mp3";
var WHACK_S_BGM_FINAL   = "sound/whack_bgm_final.mp3";
var WHACK_S_BGM_ENDLESS = "sound/whack_bgm_endless.mp3";
var WHACK_S_STAGESTART  = "sound/whack_stagestart.mp3";
var WHACK_S_STAGECLEAR  = "sound/whack_stageclear.mp3";
var WHACK_S_GAMEOVER    = "sound/whack_gameover.mp3";
var WHACK_S_MISS        = "sound/whack_miss.mp3";
var WHACK_S_ATTACK_NORMAL   = "sound/whack_attack_normal.mp3";
var WHACK_S_ATTACK_STRESS   = "sound/whack_attack_stress.mp3";
var WHACK_S_ATTACK_ITN      = "sound/whack_attack_itn.mp3";
var WHACK_S_ATTACK_MISS     = "sound/whack_attack_miss.mp3";
var WHACK_S_ATTACK_BONUS    = "sound/whack_attack_bonus.mp3";
var WHACK_S_LEVELUP     = "sound/whack_levelup.mp3";
var WHACK_S_MAXIMUM     = "sound/whack_maximum.mp3";

enchant.whack = { assets:[
    WHACK_I_CHAIN, WHACK_I_PAUSE, WHACK_I_DOC, WHACK_I_STAR, 
    WHACK_I_TIME_RING, WHACK_I_TIME_CIRCLE, WHACK_I_LEVEL,
    WHACK_I_CONDITION, WHACK_I_REMAINING, WHACK_I_CONTINUE
]};

if( navigator.userAgent.search(/Android/) == -1 ){
    enchant.whack.assets.push(
        WHACK_S_BGM, WHACK_S_BGM_FINAL, WHACK_S_BGM_ENDLESS,
        WHACK_S_STAGESTART, WHACK_S_STAGECLEAR, WHACK_S_GAMEOVER, WHACK_S_MISS,
        WHACK_S_ATTACK_NORMAL, WHACK_S_ATTACK_STRESS, WHACK_S_ATTACK_ITN,
        WHACK_S_ATTACK_MISS, WHACK_S_ATTACK_BONUS, WHACK_S_LEVELUP, WHACK_S_MAXIMUM
    );
} else {
    enchant.util.Sound.initSe(WHACK_S_STAGESTART);
    enchant.util.Sound.initSe(WHACK_S_STAGECLEAR);
    enchant.util.Sound.initSe(WHACK_S_GAMEOVER);
    enchant.util.Sound.initSe(WHACK_S_MISS);
    enchant.util.Sound.initSe(WHACK_S_ATTACK_NORMAL);
    enchant.util.Sound.initSe(WHACK_S_ATTACK_STRESS);
    enchant.util.Sound.initSe(WHACK_S_ATTACK_ITN);
    enchant.util.Sound.initSe(WHACK_S_ATTACK_MISS);
    enchant.util.Sound.initSe(WHACK_S_ATTACK_BONUS);
    enchant.util.Sound.initSe(WHACK_S_LEVELUP);
    enchant.util.Sound.initSe(WHACK_S_MAXIMUM);
}

// -----------------------------------------------------------------------------

enchant.whack.Whack = enchant.Class.create(enchant.Scene, 
{
    
	initialize: function() 
	{
        enchant.Scene.call(this);

	    Log.d('call whack.');

        this.active = false;

        var _this = this;

        this.bgLayer = new Group();
        this.addChild(this.bgLayer);

        this.bugLayer = new Group();
        this.addChild(this.bugLayer);
    
        this.frontLayer = new Group();
        this.addChild(this.frontLayer);

        this.kbArea = new Entity();
        this.kbArea.width = SCREEN_W;
        this.kbArea.height = 400;
        this.kbArea.y = 360;
        this.kbArea.opacity = .0;
        this.kbArea.on(Event.TOUCH_START, function(e){

            if( this.beforeTouch != null && Math.abs(this.beforeTouch.x - e.x) < 2 && Math.abs(this.beforeTouch.y - e.y) < 2 ) return;
            this.beforeTouch = e;

            Log.d('Keyboard touch!');

            if( _this.stress && _this.stress.ferver ) {
                Sound.se(WHACK_S_ATTACK_STRESS);
                System.vibration();
                
                _this.flashBg.tl
                    .cue({
                        0: function(){ this.visible = true; },
                        1: function(){ this.visible = false; }
                    });

                _this.bugLayer.childNodes.forEach(function(bug){
                    if( bug instanceof Bug && bug.active ) {
                        bug.hide();
                        var event = new Event('hit');
                        event.x = bug.x;
                        event.y = bug.y;
                        bug.dispatchEvent(event);
                    }
                    if( bug instanceof Itn && bug.active ) {
                        bug.hide();
                        var event = new Event('bonus');
                        event.x = bug.x;
                        event.y = bug.y;
                        bug.dispatchEvent(event);
                    }
                });
            } else {
                _this.bugLayer.childNodes.some(function(obj){
                    if( obj.x < e.x && obj.x + obj.width > e.x && obj.y < e.y && obj.y + obj.height > e.y ) {
                        var evt = new Event(Event.TOUCH_START);
                        evt.x = e.x;
                        evt.y = e.y;
                        obj.dispatchEvent(evt);
                        //_this.kbArea.bug = obj;
                        return true;
                    } else {
                        return false;
                    }
                });
            }
            return false;
        });
        this.kbArea.on(Event.TOUCH_MOVE, function(e){
            _this.bugLayer.childNodes.some(function(obj){
                if( obj.x < e.x && obj.x + obj.width > e.x && obj.y - obj.height / 2 < e.y && obj.y + obj.height > e.y ) {
                    var evt = new Event(Event.TOUCH_MOVE);
                    evt.x = e.x;
                    evt.y = e.y;
                    obj.dispatchEvent(evt);
                    return true;
                } else {
                    return false;
                }
            });
            return false;
        });
        this.kbArea.on(Event.TOUCH_END, function(e){
            _this.bugLayer.childNodes.some(function(obj){
                if( obj.x < e.x && obj.x + obj.width > e.x && obj.y < e.y && obj.y + obj.height > e.y ) {
                    var evt = new Event(Event.TOUCH_END);
                    evt.x = e.x;
                    evt.y = e.y;
                    obj.dispatchEvent(evt);
                    return true;
                } else {
                    return false;
                }
            });
            return false;
        });
        this.addChild(this.kbArea);
        
        this.modalLayer = new Group();
        this.addChild(this.modalLayer);

        // -------------------------------
        
        this.numOfChain = 0;
        this.beforeBugType = null;
    
        this.bg = new Bg(Bg.WHACK);
        this.bgLayer.addChild(this.bg);

        this.timeCircle = new Sprite(338, 338);
        this.timeCircle.image = game.assets[WHACK_I_TIME_CIRCLE];
        this.timeCircle.moveTo(-2, -57);
        this.bgLayer.addChild(this.timeCircle);

        this.timeRing = new Sprite(442, 442);
        this.timeRing.image = game.assets[WHACK_I_TIME_RING];
        this.timeRing.moveTo(-50, -109);
        this.bgLayer.addChild(this.timeRing);

        this.levelLabel = new Sprite(120, 30);
        this.levelLabel.image = game.assets[WHACK_I_LEVEL];
        this.levelLabel.moveTo(80, 200);
        this.bgLayer.addChild(this.levelLabel);

        this.level = new CustomLabel(220, 179);
        this.level.color = [148,85,0];
        this.level.text = "1";
        this.level.textAlign = "center";
        this.level.scale(.45, .45);
        this.bgLayer.addChild(this.level);

        this.remaining = new Sprite(150, 100);
        this.remaining.image = game.assets[WHACK_I_REMAINING];
        this.remaining.moveTo(245, 5);
        this.bgLayer.addChild(this.remaining);

        this.time = new TimeLabel(10, 85);
        this.time.on('warning', function(){
            Log.d('warning');
            _this.timeRing.visible = true;
            _this.timeRing.frame = 1;
            _this.timeRing.tl.rotateTo(0,0).rotateBy(360, getTime(10000)).loop();

            _this.alertBg.visible = true;
            _this.alertBg.backgroundColor = "red";
            _this.alertBg.tl
                .tween({opacity: .3, time: getTime(1000), easing: enchant.Easing.EXPO_EASEOUT})
                .tween({opacity: .0, time: getTime(1000), easing: enchant.Easing.EXPO_EASEOUT})
                .loop();
        });
        this.time.on('normal', function(){
            _this.timeRing.tl.clear();
            _this.timeRing.visible = false;
            _this.alertBg.tl.clear();
            _this.alertBg.visible = false;
        });
        this.time.on('timeover', function(){
            _this.gameOver();
        });
        this.bgLayer.addChild(this.time);

        this.bug = new CustomLabel(440, 50);
        this.bug.width = 130;
        this.bug.textAlign = "right";
//        this.bug.text = this.numOfBug;
        this.bgLayer.addChild(this.bug);
        
        // 
        this.chain = new enchant.Group();
        this.chain.x = SCREEN_W;
        this.chain.y = 250;
        this.bgLayer.addChild(this.chain);
        
        this.chainBar = new Sprite(244, 24);
        this.chainBar.image = game.assets[WHACK_I_CHAIN];
        this.chainBar.y = 30;
        this.chain.addChild(this.chainBar);
        
        this.chainStr = new ShadowLabel();
        this.chainStr.font = "46px 'Noto Sans CJK JP'";
        this.chainStr.text = "chain";
        this.chain.addChild(this.chainStr);


    
        // ---------------------------------


        this.pauseBtn = new Sprite(60, 60);
        this.pauseBtn.image = game.assets[WHACK_I_PAUSE];
        this.pauseBtn.x = 10;
        this.pauseBtn.y = 10;
        this.pauseBtn.on(Event.TOUCH_START, function(e){

            if( this.beforeTouch != null && Math.abs(this.beforeTouch.x - e.x) < 2 && Math.abs(this.beforeTouch.y - e.y) < 2 ) return;
            this.beforeTouch = e;

            _this.pause();
            
            _this.modal.opacity = .5;
            _this.modal.visible = true;
            
            _this.pop.opacity = 1;
            _this.pop.frame = WhackPop.MENU;
            _this.pop.x = (SCREEN_W - _this.pop.width) / 2;
            _this.pop.y = (SCREEN_H - _this.pop.height) / 2;
            _this.pop.visible = true;
            
    
    
            var back = new Entity();
            back.width = 530;
            back.height = 100;
            back.x = (SCREEN_W - back.width) / 2;
            back.y = (SCREEN_H - _this.pop.height) / 2 + 40;
            back.on(Event.TOUCH_START, function(){
                game.resume();
                game.stage = 1;
                game.mode = MODE_TITLE;
                game.rootScene.dispatchEvent(new Event('ChangeMode'));            
            });
            _this.addChild(back);
    
            var cancel = new Entity();
            cancel.width = 530;
            cancel.height = 100;
            cancel.x = (SCREEN_W - cancel.width) / 2;
            cancel.y = (SCREEN_H - _this.pop.height) / 2 + 170;
            cancel.on(Event.TOUCH_START, function(){
                back.tl.removeFromScene();
                cancel.tl.removeFromScene();
                _this.resume();
                        
                _this.modal.opacity = .0;
                _this.modal.visible = false;
                _this.pop.visible = false;
                _this.menu.visible = false;
                _this.removeChild(back);
                _this.removeChild(cancel);
            });
            _this.addChild(cancel);
        });
        this.frontLayer.addChild(this.pauseBtn);
        


        this.alertBg = new Entity();
        this.alertBg.width = SCREEN_W;
        this.alertBg.height = SCREEN_H;
        this.alertBg.backgroundColor = "red";
        this.alertBg.opacity = .0;
        this.alertBg.visible = false;
        this.frontLayer.addChild(this.alertBg);

        this.feverBg = new Entity();
        this.feverBg.width = SCREEN_W;
        this.feverBg.height = SCREEN_H;
        this.feverBg.visible = false;
        this.bgLayer.addChild(this.feverBg);
        
        this.flashBg = new Entity();
        this.flashBg.width = SCREEN_W;
        this.flashBg.height = SCREEN_H;
        this.flashBg.backgroundColor = "white";
        this.flashBg.visible = false;
        this.bgLayer.addChild(this.flashBg);

        this.modal = new Entity();
        this.modal.width = SCREEN_W;
        this.modal.height = SCREEN_H;
        this.modal.backgroundColor = "black";
        this.modal.opacity = .0;
        this.modal.visible = false;
        this.modalLayer.addChild(this.modal);
        
        this.pop = new WhackPop();
        this.pop.visible = false;
        this.modalLayer.addChild(this.pop);
        

        var _this = this;
        this.on(enchant.Event.EXIT, function(){
            ['active', 'bgLayer', 'bugLayer', 'frontLayer', 'kbArea', 'modalLayer', 'numOfChain',
             'beforeBugType', 'bg', 'timeCircle', 'timeRing', 'levelLabel', 'level', 'remaining',
             'time', 'bug', 'chain', 'chainBar', 'chainStr', 'pauseBtn', 'alertBg', 'feverBg',
             'flashBg', 'modal', 'pop', 'bgm'].forEach(function(name){

                _this[name] = null;
             });
        });
	},
	
    info: function(frame)
    {
        Log.d('info.' + frame);
        
        var _this = this;

        Sound.play(this);

        this.modal.opacity = .3;
        this.modal.visible = true;
        
        var desc = new Sprite(SCREEN_W, SCREEN_H);
        desc.image = game.assets[WHACK_I_CONDITION];
        desc.frame = frame;
        desc.opacity = 0;
        desc.tl.fadeIn(getTime(500));
        desc.on(Event.TOUCH_START, function(){
            this.tl
                .fadeOut(getTime(500))
                .removeFromScene()
                .then(function(){
                    _this.readyGo();
                });
        });
        this.addChild(desc);
    },
    
    readyGo: function()
    {
        Log.d('ready go.');
        
        var _this = this;
        
        this.pop.frame = WhackPop.READY;
        this.pop.tl
            .moveTo(SCREEN_W, (SCREEN_H-this.pop.height)/2, 0)
            .moveBy(-SCREEN_W-this.pop.width, 0, getTime(500))
            .delay(getTime(200))
            .then(function(){
                Sound.se(WHACK_S_STAGESTART);
                this.frame = WhackPop.GO;
                this.x = SCREEN_W / 2 - this.width / 2;
                this.y = SCREEN_H / 2 - this.height / 2;
                this.tl
                    .delay(getTime(1000))
                    .fadeOut(getTime(100))
                    .then(function(){
                        this.visible = false;
                        _this.start();
                    });
                _this.modal.tl
                    .fadeOut(getTime(300))
                    .then(function(){
                        this.visible = false; 
                    });
            });
        this.pop.visible = true;
    },
    
    start: function()
    {
        Log.d('strat.');
        
        this.active = true;

        this.time.start();
        
    },

    stageClear: function()
    {
        Log.d("stage clear.");
        
        this.pause();
        game.score['stage'+game.stage] = this.time.second;
        
        Sound.se(WHACK_S_STAGECLEAR);

        var _TIME = getTime(500);


        var _this = this;
        this.modal.visible = true;
        this.modal.tl
            .tween({opacity: .3, time: _TIME, easing: enchant.Easing.EXPO_EASEOUT})
            .then(function(){
                _this.pop.frame = WhackPop.STAGECLEAR;
                _this.pop.tl
                    .moveTo(SCREEN_W, -_this.pop.height, 0)
                    .tween({
                        x: (SCREEN_W - _this.pop.width) / 2, y: (SCREEN_H - _this.pop.height) / 2, 
                        rotation: 360, opacity: 1, time:_TIME, easing: enchant.Easing.ELASTIC_EASEOUT})
                    .then(function(){
                        _this.on(Event.TOUCH_START, function(){
                            blackLayer(_this).tl
                                .fadeIn(_TIME)
                                .delay(_TIME)
                                .then(function(){
                                    game.stage++;
                                    game.mode = MODE_STORY;
                                    game.rootScene.dispatchEvent(new Event('ChangeMode'));
                                });
                            
                        });
                    });
                _this.pop.visible = true;
            });

    },
    
    gameOver: function()
    {
        Log.d("game over.");
        
        Sound.stop(this);
        Sound.se(WHACK_S_GAMEOVER);
        
        this.active = false;

        if( game.mode == MODE_ENDLESS ) game.score['endless'] = this.numOfBug;
        else                game.score['stage'+game.stage] = this.time.second;
        
        var _TIME = getTime(300);

        var _this = this;
        
        this.modal.opacity = 0;
        this.modal.backgroundColor = "black";
        this.modal.tl
            .tween({opacity: .3, time: _TIME, easing: enchant.Easing.EXPO_EASEOUT})
            .then(function(){
                _this.pop.frame = WhackPop.GAMEOVER;
                _this.pop.opacity = 1;
                _this.pop.moveTo((SCREEN_W - _this.pop.width) / 2, -_this.pop.height);
                _this.pop.tl
                    .moveBy(0, (SCREEN_H + _this.pop.height) / 2, _TIME, enchant.Easing.BOUNCE_EASEIN)
                    .then(function(){

                        if( game.mode == MODE_WHACK ) {
                            _this.on(Event.TOUCH_START, function(){
                                _this.clearEventListener(Event.TOUCH_START);
                                _this.pop.visible = false;

                                var conti = new Sprite(640, 380);
                                conti.image = game.assets[WHACK_I_CONTINUE];
                                conti.moveTo(0, 200);
                                _this.addChild(conti);

                                var message = new ShadowLabel(100, 210);
                                message.moveTo(38, 235);
                                message.font = "46px 'Noto Sans CJK JP'";
                                message.width = 380;
                                message.text = "諦めたら、それで社畜終了よ！";
                                _this.addChild(message);

                                var yes = new Entity();
                                yes.width = 400;
                                yes.height = 50;
                                //yes.backgroundColor = "#AAA";
                                yes.moveTo(30, 445);
                                yes.on(Event.TOUCH_START, function(){
                                    if( System.isOnLine() ) {
                                        message.text = "あんたドＭね。";

                                        System.showAd();
                                        blackLayer(_this).tl
                                            .fadeIn(_TIME)
                                            .then(function(){
                                                game.rootScene.dispatchEvent(new Event('ChangeMode'));
                                            });
                                    } else {
                                        message.text = "インターネットに接続できないと、コンティニューは許しません！";
                                    }
                                });
                                _this.addChild(yes);

                                var no = new Entity();
                                no.width = 400;
                                no.height = 50;
                                //no.backgroundColor = "#AAA";
                                no.moveTo(30, 510);
                                no.on(Event.TOUCH_START, function(){
                                    message.text = "おめでとう。";

                                    blackLayer(_this).tl
                                        .fadeIn(_TIME)
                                        .then(function(){
                                            game.mode = MODE_AGGREGATE_STORY;
                                            game.rootScene.dispatchEvent(new Event('ChangeMode'));
                                        });
                                });
                                _this.addChild(no);
                            });
                        } else {
                            blackLayer(_this).on(Event.TOUCH_START, function(){
                                this.tl
                                    .fadeIn(_TIME)
                                    .then(function(){
                                        game.mode = MODE_AGGREGATE_ENDLESS;
                                        game.rootScene.dispatchEvent(new Event('ChangeMode'));
                                    });
                            });
                        }
                    });
                _this.pop.visible = true;
            });
        this.modal.visible = true;
    },
    
    pause: function()
    {
        Log.d('pause');
        
 //       game.pause();
        this.active = false;
        Sound.pause(this);
        this.time.stop();

        this.bugLayer.childNodes.forEach(function(bug){
            bug.pause();
        });

    },

    resume: function(e)
    {
        Log.d('resume');
        
        this.bugLayer.childNodes.forEach(function(bug){
            bug.resume();
        });
    
        this.time.start();
        Sound.resume(this);
        this.active = true;
//        game.resume();
    },
    
    checkChain: function(scene, type)
    {
        Log.d('checkChain old=' + scene.beforeBugType +" new="+ type);
        
        if ( scene.beforeBugType == type ) {
            scene.numOfChain++;

            if( scene.numOfChain > game.score['maxchain'] ) 
                game.score['maxchain'] = scene.numOfChain;
            
            if( scene.numOfChain > 1 ) {
                scene.chainStr.text = scene.numOfChain + " chains";
                scene.chain.tl
                    .clear()
                    .moveTo(SCREEN_W, 250, 0)
                    .moveTo(420, 250, getTime(1000), enchant.Easing.EXPO_EASEOUT)
                    .delay(getTime(1000))
                    .moveTo(SCREEN_W, 250, getTime(1000), enchant.Easing.EXPO_EASEOUT);
            }
        } else {
            scene.beforeBugType = type;
            scene.numOfChain = 1;
        }
    }
});
enchant.whack.Whack.WARNING_LIMIT = 30 * 1000;


enchant.whack.Story = enchant.Class.create(enchant.whack.Whack, 
{
	initialize: function() 
	{
        enchant.whack.Whack.call(this);

	    Log.d('call whack Story.');

        var _this = this;

        this.data = StageData['stage'+game.stage];

        this.numOfBug = this.data.bug;
        this.bug.text = this.numOfBug;

        Sound.init(game.stage != 5 ? WHACK_S_BGM : WHACK_S_BGM_FINAL, this);

        this.time.second = this.data.second;

        this.levelLabel.frame = 1;
        this.remaining.frame = 0;
        this.level.text = game.stage;


        HoleList.forEach(function(h, i){
            var bug = new Bug(h.x, h.y);
            bug.tag = i;

            bug.on("hit", function(e){
                Log.d('bug hit!' + _this.numOfBug);
                
                PutStamp(_this, e.x, e.y);
                
                var soul = new Soul(this.x, this.y);
                _this.frontLayer.addChild(soul);
                Sound.se(WHACK_S_ATTACK_NORMAL);


                _this.checkChain(_this, this.type);

                _this.numOfBug--;
                if( _this.numOfBug == 0 ) _this.stageClear();
                if( _this.numOfBug < 0 ) _this.numOfBug = 0;
                _this.bug.text = _this.numOfBug;
                
            });
            bug.on("miss5", function(e){
                Log.d('miss5 !');

                var miss = new Miss(this.x, this.y, Miss.TYPE_MISS5);
                _this.frontLayer.addChild(miss);
                Sound.se(WHACK_S_MISS);
                _this.time.second -= 5 * 1000;
                
                _this.numOfChain = 1;
            });
            bug.on("miss2", function(e){
                Log.d('miss2 !');

                var miss = new Miss(this.x, this.y, Miss.TYPE_MISS2);
				_this.frontLayer.addChild(miss);
                Sound.se(WHACK_S_ATTACK_MISS);
                _this.time.second -= 2 * 1000;
                
            });
            
            _this.bugLayer.addChild(bug);
        });

        this.info(game.stage); 
    },

    L_MAX: 5,
    N_MAX: 16,
    C_MAX: 10,
    S_MIN: 1,
    S_MAX: 5,
    D_MAX: 11,
    V_MAX: 6,
    onenterframe: function()
	{
	//this.childNodes().each
	    if( ! this.active ) return;
	    
	    if( this.age % (game.fps * 2) === 0 ) return;

        //Log.d('bug check');

        var L = game.stage;
        var T = this.time.second;
        var ST = this.data.second;
        
        var N = this.time.second / this.numOfBug;
        if( N > this.N_MAX ) N = this.N_MAX;
        var C = this.numOfChain;
        
        var P = ( (N / this.N_MAX) + ((ST - T) / ST) + (C <= this.C_MAX ? C / this.C_MAX : 1) ) / 3;


        if( Math.random() < P ) {
            
            //Log.d('bug P ' + P);
            
            var holes = [];
            this.bugLayer.childNodes.forEach(function(obj){
                if( !obj.active ) holes.push(obj);
            });
            
            //var TP = 1 - T / ST;
            var D = 1 + (this.V_MAX * (L / this.L_MAX)) * (1 - T / ST);

            //Log.d('bug D ' + D);
            
            if( this.D_MAX - holes.length > D ) return;
            
            
            var K = Bug.TYPE_BAGU;
            var Ks = {1: 60, 2: 30, 3: 10};

            var K_MAX = 0;
            this.data.types.forEach(function(v, k) { K_MAX += Ks[v]; });
            var r = Math.random();
            var tmp = 0;
            this.data.types.forEach(function(v, k) {
                if( r > tmp ) K = v;
                tmp += Ks[v] / K_MAX;
            });


            //Log.d('bug K ' + K);

            var S = this.S_MIN + Math.random() * (this.S_MAX - this.S_MIN) * ((this.L_MAX - (L-1)) / this.L_MAX);
    
            //Log.d('bug S ' + S);

            var pos = Math.floor(Math.random() * holes.length);
            holes[pos].show(K, S);
        }

	}
});

enchant.whack.Endless = enchant.Class.create(enchant.whack.Whack, 
{
    
	initialize: function() 
	{
        enchant.whack.Whack.call(this);

	    Log.d('call whack Endless.');

        this.data = StageData['endless'];

        this.numOfBug = this.data.bug;
        this.bug.text = this.numOfBug;


        Sound.init(WHACK_S_BGM_ENDLESS, this);

        this.time.second = this.data.second;

        this.levelLabel.frame = 0;
        this.remaining.frame = 1;


        var _this = this;
        
        
        this.stress = new Stress(450, 388);
        this.stress.on('ferver', function(){
            
            if( ! _this.active ) return;

            Log.d("ferver start");
            
            _this.pause();
            
            Sound.se(WHACK_S_MAXIMUM);
            
            var ox = _this.pop.x;
            var oy = _this.pop.y;
            _this.tl
                .then(function(){
                    _this.modal.opacity = .5;
                    _this.modal.visible = true;
                    
                    _this.pop.frame = WhackPop.MAXIMUM;
                    _this.pop.visible = true;
                    _this.pop.moveCenter();
                    _this.pop.opacity = 1;
                })
                .repeat(function(){
                    var vx = Math.random() * 10 - 5;
                    var vy = Math.random() * 10 - 5;
                    _this.pop.moveTo(ox + vx, oy + vy);
                }, getTime(1000))
                .then(function(){
                    _this.modal.visible = false;
                    _this.pop.visible = false;
    
                    _this.resume();

                    _this.feverBg.tl
                        .then(function(){
                            this.opacity = .3;
                            var r = Math.random() > .5 ? 255 : 0;
                            var g = Math.random() > .5 ? 255 : 0;
                            var b = Math.random() > .5 ? 255 : 0;
                            this.backgroundColor = "rgb("+r+","+g+","+b+")";
                            this.visible = true;
                        })
                        .delay(5)
                        .loop();
        
                    _this.timeRing.frame = 2;
                    _this.timeRing.visible = true;
                    _this.timeRing.tl
                        .rotateTo(0, 0)
                        .rotateBy(360, getTime(10000))
                        .loop();
                    
                    _this.timeCircle.frame = 2;
                    _this.timeCircle.visible = true;
                    _this.timeCircle.tl
                        .then(function() {
                            this.frame = 1 + ((this.frame+1) % 2);
                        })
                        .delay(10)
                        .loop();
                   
                   _this.resume()
                });

        });
        this.stress.on('end', function(){
            Log.d("ferver end");
            
            _this.timeRing.tl.clear();
            _this.timeRing.frame = 0;
            
            _this.timeCircle.tl.clear();
            _this.timeCircle.frame = 0;
            
            _this.feverBg.tl.clear();
            _this.feverBg.visible = false;
            
        });
        this.bgLayer.addChild(this.stress);


        HoleList.forEach(function(h, i){
            var bug = new Bug(h.x, h.y);
            bug.tag = i;

            bug.on("hit", function(e){
                Log.d('bug hit!' + _this.numOfBug);
                
                //PutStamp(_this, e.x, e.y, _this.stress.ferver);
                PutStamp(_this, e.x, e.y);

                var soul = new Soul(this.x, this.y);
                _this.frontLayer.addChild(soul);
                Sound.se(WHACK_S_ATTACK_NORMAL);

                _this.checkChain(_this, this.type);

                _this.knockdownBug();
            });
            bug.on("miss5", function(e){
                Log.d('miss5 !');

                var miss = new Miss(this.x, this.y, Miss.TYPE_MISS5);
                _this.frontLayer.addChild(miss);
                Sound.se(WHACK_S_ATTACK_MISS);
                _this.time.second -= 5 * 1000;
                
                _this.stress.add(5);

            });
            bug.on("miss2", function(e){
                Log.d('miss2 !');
                
                var miss = new Miss(this.x, this.y, Miss.TYPE_MISS2);
				_this.frontLayer.addChild(miss);
                Sound.se(WHACK_S_MISS);
                _this.time.second -= 2 * 1000;
                
                _this.stress.add(2);
            });
            
            _this.bugLayer.addChild(bug);
        });
        
        this.itn = new Itn(390, 605);
        this.itn.on("hit", function(e){
            Log.d('itn hit!');
            
            Sound.se(WHACK_S_ATTACK_ITN);
        });
        this.itn.on("bonus", function(e){
            var bonus = new Bonus(this.x, this.y);
			_this.frontLayer.addChild(bonus);
            Sound.se(WHACK_S_ATTACK_BONUS);
            _this.time.second += 60 * 1000;
        });
        this.bugLayer.addChild(this.itn);

        this.info(0);
    },

    L: 1,
    L_MAX: 10,
    T: 0,
    C: 0,
    D_MAX: 11,
    V_MAX: 6,
    S_MIN: 0.5,
    S_MAX: 3,
            
    onenterframe: function()
	{
	    if( ! this.active ) return;

	    if( this.age % game.fps === 0 ) return;

        //Log.d('bug check');

        //console.log('itn:'+this.itn.active+' r:'+Math.random());
        if( !this.itn.active && Math.random() < 0.0005 ) {
            this.itn.show(10, 20);
        }

        // ---------

        //var BNC = this.L < this.L_MAX ? this.L * this.L_MAX : 100;
        //var BNL = this.L * (this.L + 1) / 2 * this.L_MAX - ((this.L - 10) * (this.L - 9) / 2 * this.L_MAX) * (this.L > this.L_MAX);
        var L = this.L >= this.L_MAX ? this.L_MAX : L;
        //var B = this.numOfBug;
        var P = 1.1 - this.L / 10;
        //if( P < L ) P = this.L / 10;
        var r = Math.random();

        if( r < P ) {
            
            //Log.d('bug P ' + P);
            
            var holes = [];
            this.bugLayer.childNodes.forEach(function(obj){
                if( obj.tag != null && !obj.active ) holes.push(obj);
            });
            
            var D = this.L < this.V_MAX ? this.L : this.V_MAX

//Log.d('D_MAX: '+ this.D_MAX +' h:'+ holes.length +' D: '+ D + ' L:' + this.L);
            
            if( this.D_MAX - holes.length > D ) return;
            
            
            var K = Bug.TYPE_BAGU;
            var Ks = {1: 60, 2: 30, 3: 10};

            var K_MAX = 0;
            this.data.types.forEach(function(v, k) { K_MAX += Ks[v]; });
            var r = Math.random();
            var tmp = 0;
            this.data.types.forEach(function(v, k) {
                if( r > tmp ) K = v;
                tmp += Ks[v] / K_MAX;
            });

            //Log.d('bug K ' + K);
            
            var S = this.S_MIN + Math.random() * (this.S_MAX - this.S_MIN) * (this.L < 10 ? (10 - this.L) / 9 : .1);
    
            //Log.d('bug S ' + S);

            var pos = Math.floor(Math.random() * holes.length);
            holes[pos].show(K, S);
        }

	},
	
	knockdownBug: function()
	{
        this.numOfBug++;
        this.bug.text = this.numOfBug;
        
        this.time.second += 1 * 1000;
                
	    
	    var BNL = this.L * (this.L + 1) / 2 * this.L_MAX - ((this.L - 10) * (this.L - 9) / 2 * this.L_MAX) * (this.L > this.L_MAX);
	    if( BNL == this.numOfBug ) {
	        this.L++;
	        this.level.text = this.L;
	        var levelup = new ShadowLabel("LEVEL UP!");
	        levelup.font = "50px 'Noto Sans CJK JP'";
	        levelup.moveTo(SCREEN_W, 300);
	        levelup.tl
	            .moveTo(-levelup.width, 300, getTime(2000))
	            .then(function(){
	                this.tl.removeFromScene();
	            });
            this.bgLayer.addChild(levelup);
            Sound.se(WHACK_S_LEVELUP);
	    }
	}

});

enchant.whack.Battle = enchant.Class.create(enchant.Scene, 
{
	initialize: function() 
	{
	    Log.d('call whack Battle.');
	    
        enchant.Scene.call(this);

        this.data = StageData['battle'];

        Sound.init(WHACK_S_BGM_BATTLE);
    },
    onenterframe: function()
	{
	    if( ! this.active ) return;

	    if( this.age % game.fps === 0 ) return;

        //Log.d('bug check');
	}
});

