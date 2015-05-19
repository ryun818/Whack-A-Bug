var AGGREGATE_I_STRING  = "img/aggregate_string.png";
var AGGREGATE_I_SNS     = "img/aggregate_sns.png";
var AGGREGATE_S_POSITION= "sound/aggregate_position.mp3";
var AGGREGATE_S_HISCORE = "sound/aggregate_hiscore.mp3";

enchant.aggregate = { assets:[
    AGGREGATE_I_STRING,
    AGGREGATE_I_SNS
] };

if( navigator.userAgent.search(/Android/) == -1 ){
    enchant.whack.assets.push(
        AGGREGATE_S_POSITION,
        AGGREGATE_S_HISCORE
    );
} else {
    enchant.util.Sound.initSe(AGGREGATE_S_POSITION);
    enchant.util.Sound.initSe(AGGREGATE_S_HISCORE);
}

// -----------------------------------------------------------------------------
enchant.aggregate.Aggregate = enchant.Class.create(enchant.Scene, 
{
	initialize: function() 
	{
// game.score['stage1'] = 120000;
// game.score['stage2'] = 10000;
// game.score['stage3'] = 20000;
// game.score['stage4'] = 170000;
// game.score['stage5'] = 80000;
// game.score['endless'] = 100;
// game.score['maxchain'] = 50;

        enchant.Scene.call(this);

	    Log.d('call aggregate.');

        var bg = new Bg(Bg.AGGREGATE);
        this.addChild(bg);
    
//        var surface = new Surface(SCREEN_W, SCREEN_H);
//        surface.context.beginPath();
//        surface.context.arc(50, 50, 45, 0, Math.PI*2, false);
//        surface.context.fillStyle = "yellow";
//        surface.context.fill();
//        for(var i = 0; i <= 10; i++) {
//
//        	var sprite = new Sprite(SCREEN_W, SCREEN_H);
//        	sprite.image = surface;
//        	sprite.on(Event.ENTER_FRAME, function(){
//        	    if( this.age % game.fps != 0 ) return;
//
//        	    if( this.y < 1) {
//        	        this.x = SCREEN_W * Math.random();
//        	        this._x = this.x;
//        	        this.y = SCREEN_H * Math.random();
//                	this.r = 1 + Math.random() * 2;
//                	this.scale(this.r, this.r);
//        	    }
//        	    this.y -= this.r;
//        	    this.x = this._x + Math.cos(Math.PI / 180 * (this.y % 360)) * this.r;
////        	    var s = this.r * (this.y / SCREEN_H);
////           	    this.scale(s, s);
//        	});
//        	this.addChild(sprite);
//        }
        
        var result = new Sprite(260, 60);
        result.image = game.assets[AGGREGATE_I_STRING];
        result.moveTo((SCREEN_W - result.width) / 2, 50);
        this.addChild(result);
        
        var shadowline = new Surface(SCREEN_W, 5);
//        shadowline.context.beginPath();
        shadowline.context.fillStyle = "white";
        shadowline.context.fillRect(0, 0, SCREEN_W , 3);
        shadowline.context.shadowOffsetX = 2;
        shadowline.context.shadowOffsetY = 2;
        var line = new Sprite(SCREEN_W, 5);
        line.image = shadowline;
        line.moveTo(0, 480);
        this.addChild(line);

        this.total = new ShadowLabel("0");
        this.total.x = 130;
        this.total.y = 510;
        this.total.font = "46px 'Noto Sans CJK JP'";
        this.total.textAlign = "right";
        this.addChild(this.total);

        var point = new Sprite(260, 60);
        point.image = game.assets[AGGREGATE_I_STRING];
        point.frame = 6;
        point.moveTo(450, 510);
        this.addChild(point);
        
	},
	
	finish: function(key)
	{

	    var score = parseInt(this.total.text);
	    var hiscore = parseInt(System.loadScore(key));
	    
        if( score > hiscore ) {
            System.saveScore(key, score);

            var hiscoreImg = new Sprite(260, 60);
            hiscoreImg.image = game.assets[AGGREGATE_I_STRING];
            hiscoreImg.frame = 8;
            hiscoreImg.x = (SCREEN_W - hiscoreImg.width) / 2;
            hiscoreImg.y = SCREEN_H - hiscoreImg.height - 100;
            hiscoreImg.scale(10, 10);
            hiscoreImg.tl
                .tween({
                    rotation: 350, 
                    scaleX: 1.5,
                    scaleY: 1.5,
                    time: enchant.util.getTime(500),
                    easing: enchant.Easing.BOUNCE_EASEOUT
                })
                .and()
                .then(function(){
                    Sound.se(AGGREGATE_S_HISCORE);
                });
            this.addChild(hiscoreImg);
            
            this.on(Event.ENTER_FRAME, function(){
                var r = Math.random() > .5 ? 255 : 0;
                var g = Math.random() > .5 ? 255 : 0;
                var b = Math.random() > .5 ? 255 : 0;
                this.total.color = "rgb("+r+","+g+","+b+")";
            });
        }


        var _this = this;
        
        this.on(Event.TOUCH_START, function(e) {
            this.clearEventListener(Event.TOUCH_START);
            
            var message = (key == HISCORE_STORY ? "ストーリー" : "エンドレス")
                +"モードで "+score+" 点とりました。";
            

//            var facebook = new Sprite(SCREEN_W, 100);
//            facebook.image = game.assets[AGGREGATE_I_SNS];
//            facebook.frame = 0;
//            facebook.y = (SCREEN_H - 400) / 2 + 0;
//            facebook.on(Event.TOUCH_START, function(){
//                System.facebook(message);
//            });
//            this.addChild(facebook);


            var twitter = new Sprite(SCREEN_W, 100);
            var end = new Sprite(SCREEN_W, 100);

            twitter.image = game.assets[AGGREGATE_I_SNS];
            twitter.frame = 1;
            twitter.y = (SCREEN_H - 400) / 2 + 100;
            twitter.on(Event.TOUCH_START, function(e){
                if( this.beforeTouch != null && Math.abs(this.beforeTouch.x - e.x) < 2 && Math.abs(this.beforeTouch.y - e.y) < 2 ) return;
                this.beforeTouch = e;
                twitter.visible = false;
                end.visible = false;
                setTimeout(function(){
                    System.saveImage();
                    twitter.visible = true;
                    end.visible = true;
                    System.twitter(message);
                }, 200);
            });
            this.addChild(twitter);

//            var gmail = new Entity();
//            gmail.width = SCREEN_W;
//            gmail.height = 100;
//            gmail.y = sns.y + 200;
//            gmail.opacity = 0;
//            gmail.on(Event.TOUCH_START, function(){
//                System.gmail(message);
//            });
//            this.addChild(gmail);

            end.image = game.assets[AGGREGATE_I_SNS];
            end.frame = 3;
            end.y = (SCREEN_H - 400) / 2 + 200;
            end.on(Event.TOUCH_START, function(e){
                if( this.beforeTouch != null && Math.abs(this.beforeTouch.x - e.x) < 2 && Math.abs(this.beforeTouch.y - e.y) < 2 ) return;
                this.beforeTouch = e;

                if( game.mode == MODE_AGGREGATE_ENDLESS ) System.openReview();

                blackLayer(_this).tl
                    .fadeIn(enchant.util.getTime(1000))
                    .then(function(){
                        game.stage = 1;
                        game.mode = MODE_TITLE;
                        game.rootScene.dispatchEvent(new Event('ChangeMode'));                        
                    });
            });
            this.addChild(end);
        });
	}
});


enchant.aggregate.Story = enchant.Class.create(enchant.aggregate.Aggregate, 
{
	initialize: function() 
	{
        enchant.aggregate.Aggregate.call(this);

	    Log.d('call aggregate story.');

        for(var i = 1; i <= 5; i++) {

            if( ! game.score['stage'+i] ) break;
            
            this.tl
                .then(function(i) { return function() {
                    Sound.se(AGGREGATE_S_POSITION);

                    var stage = new Sprite(260, 60);
                    stage.image = game.assets[AGGREGATE_I_STRING];
                    stage.frame = i;
                    stage.moveTo(100, 110 + i * stage.height);
                    this.addChild(stage);
                    
                    var second = game.score['stage'+i];
                    var time = enchant.util.msec2time(second);
                    var label = new ShadowLabel(time);
                    label.font = "40px 'Noto Sans CJK JP'";
                    label.moveTo(350, 120 + i * stage.height);
                    this.addChild(label);
                    
                    this.total.text = parseInt(this.total.text) + parseInt(second);
                }}(i))
                .delay(enchant.util.getTime(500));

        }
        
        this.tl.then(function(){
            this.finish(HISCORE_STORY);
        });
	}
});

enchant.aggregate.Endless = enchant.Class.create(enchant.aggregate.Aggregate, 
{
	initialize: function() 
	{
        enchant.aggregate.Aggregate.call(this);

	    Log.d('call aggregate endless.');

        this.tl
            .then(function() {
                Sound.se(AGGREGATE_S_POSITION);
                
                var stage = new Sprite(260, 60);
                stage.image = game.assets[AGGREGATE_I_STRING];
                stage.frame = 7;
                stage.moveTo(100, 110 + 2 * stage.height);
                this.addChild(stage);
                
                var count = game.score['endless'];
                var label = new ShadowLabel(count);
                label.font = "40px 'Noto Sans CJK JP'";
                label.textAlign = "right";
                label.width = 200;
                label.moveTo(350, 120 + 2 * stage.height);
                this.addChild(label);
                
                this.total.text = count * 100;
            })
            .delay(enchant.util.getTime(1000))
            .then(function(){
                Sound.se(AGGREGATE_S_POSITION);
                
                var stage = new Sprite(260, 60);
                stage.image = game.assets[AGGREGATE_I_STRING];
                stage.frame = 9;
                stage.moveTo(100, 110 + 4 * stage.height);
                this.addChild(stage);
                
                var chain = parseInt(game.score['maxchain']);
                var label = new ShadowLabel(chain);
                label.font = "40px 'Noto Sans CJK JP'";
                label.textAlign = "right";
                label.width = 200;
                label.moveTo(350, 120 + 4 * stage.height);
                this.addChild(label);
                
                this.total.text = parseInt(this.total.text) + chain * 1000;
            })
            .delay(enchant.util.getTime(500))
            .then(function(){
                this.finish(HISCORE_ENDLESS);
            });
	}
});