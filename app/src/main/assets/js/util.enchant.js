var BG                  = "img/bg.png";
var FONT_ITARIC         = "img/font_itaric.png";
var WHACK_I_BUG         = "img/whack_bug.png";
var WHACK_I_ITN         = "img/whack_itn.png";
var WHACK_I_STRESS      = "img/whack_stress.png";
var WHACK_I_POP			= "img/whack_pop.png";

enchant.util = { assets: [
	BG,
	FONT_ITARIC,
	WHACK_I_BUG,
	WHACK_I_ITN,
	WHACK_I_STRESS,
	WHACK_I_POP, 
] };

enchant.util.getTime = function(millisec) 
{
	return millisec / 1000 * FPS * 5;
}

enchant.util.Bg = enchant.Class.create(enchant.Sprite, 
{
    initialize: function(frame) 
    {
    	enchant.Sprite.call(this, SCREEN_W, SCREEN_H);
		this.image = enchant.Game.instance.assets[BG];
		this.frame = frame;
    }
});
enchant.util.Bg.TITLE = 0;
enchant.util.Bg.WHACK = 1;
enchant.util.Bg.OFFICE = 2;
enchant.util.Bg.TRAIN = 3;
enchant.util.Bg.HOME = 4;
enchant.util.Bg.AGGREGATE = 5;


enchant.util.CustomLabel = enchant.Class.create(enchant.Sprite, 
{
	initialize: function(x, y, small) 
	{
        enchant.Sprite.call(this, 0, 0);
        this.x = x;
        this.y = y;
		this.fontWidth = 40;
		this.fontHeight = 70;
		this._color = [255,255,255,255];
		this.small = 0;
		if( small ) this.small = 1;

		this.ow = 0;
		this.oh = 0;
	},

	setText: function(txt) 
	{
        var i, charCode, charPos, charRow, offset;
		this._text = txt;

		if( ! this.width ) {
        	this.width = Math.min(this.fontWidth * this.text.length, enchant.Game.instance.width);
		}
        this.height = this.fontHeight;

        if( this.width != this.ow || this.height != this.oh ) {
            this.ow = this.width;
            this.oh = this.height;
            this.image = null;
            this.image = new enchant.Surface(this.width, this.height);
        }
        this.image.context.clearRect(0, 0, this.width, this.height);

		if( this.textAlign ) {
			if( this.textAlign.toLowerCase() == "right" ) {
				offset = this.width - this.text.length * this.fontWidth;
			} else if( this.textAlign.toLowerCase() == "center" ) {
				offset = (this.width - this.text.length * this.fontWidth) / 2;
			}
		} else {
			offset = 0;
		}

        for (i = 0; i < this.text.length; i++) {
            charCode = this.text.charCodeAt(i);
            if (charCode >= 46 && charCode <= 58) {
                charPos = charCode - 46;
            } 
            else {
                charPos = 0;
            }
            
            if( this.small ) {
            	charRow = 1;
            } else {
	            if( i >= 6 ) {
	            	charRow = 1;
	            } else {
	            	charRow = 0;
	            }
            }
            
            this.image.draw(enchant.Game.instance.assets[FONT_ITARIC],
                charPos * this.fontWidth,	charRow * this.fontHeight, 
                this.fontWidth,				this.fontHeight,
                offset + i * this.fontWidth, 0,
                this.fontWidth,				this.fontHeight);

        }
                
        // for (var i = 0; i < this.fontHeight; i++){
        //     for (var j = 0; j < this.fontWidth; j++){
        //         var color = this.image.getPixel(j, i);
        //     	if( color[3] == 0 ) continue;
        //         var r = this._color[0];
        //         var g = this._color[1];
        //         var b = this._color[2];
        //         var a = color[3];
        //         this.image.setPixel(j, i, r, g, b, a);
        //     }
        // }
    },
    text: {
        get: function() {
            return this._text;
        },
        set: function(txt) {
            this.setText(String(txt));
        }
    },
    color: {
        get: function() {
            return this._color;
        },
        set: function(r, g, b, a) {
            this._color = [r, g, b];
        }
    }

});

// タイムリミットラベル
enchant.util.TimeLabel = enchant.Class.create(enchant.util.CustomLabel, 
{
	initialize: function(x, y, second) 
	{
        enchant.util.CustomLabel.call(this, x, y, second);
		this.oldtime = 0;
		this.warning = false;
		this._second = second;
		this._active = false;
	},
	onenterframe: function()
	{
		if( this._active ) {
			var nowtime = new Date() / 1;
			this.second -= nowtime - this.oldtime;
			this.oldtime = nowtime;

			if(this.second <= 0) {
			    this.stop();
			    this.second = 0;
			    this.nowtime = this.starttime;
			    this.dispatchEvent(new Event("timeover"));
			} else if (!this.warning && this.second < Whack.WARNING_LIMIT) {
				this.warning = true;
				this.dispatchEvent(new Event("warning"));
			}
		}
		this.setText();
	},


	setText: function()
	{
	    var txt = enchant.util.msec2time(this.second);

	    enchant.util.CustomLabel.prototype.setText.call(this, txt);
	},
	start: function() 
	{
		this._active = true;
		this.oldtime = new Date() / 1;
	},
	stop: function() 
	{
		this._active = false;
	},
	second: {
		get: function() {
			return this._second;
		},
		set: function(second){
			if( this._second < second && second > Whack.WARNING_LIMIT + 5)
				this.dispatchEvent(new Event("normal"));
			this._second = second;
			this.setText();
		}
	}
});

enchant.util.msec2time = function(millisecond) 
{
	var second = millisecond / 1000;
	if( second < 0 ) second = 0;

    var mil = ("0"+Math.floor(second * 100 % 100)).slice(-2);
    var sec = ("0"+Math.floor(second % 60)).slice(-2);
    var min = ("0"+Math.floor(second / 60)).slice(-2);
    return min + ":" + sec + "." + mil;
}

enchant.util.PutStamp = function(entity, x, y, ferverFlag) 
{
	Log.d('stamp!');
	
	var scale = ferverFlag ? 3 : 1;

	for( var i = 0; i < 10; i++ ) {
		var star = new Sprite(50, 50);
		star.image = enchant.Game.instance.assets[WHACK_I_STAR];
		star.x = x;
		star.y = y;
		var r = Math.random() * scale;
		star.scale(r, r);
		star.tl
			.tween({
				x: x + Math.random()*300-150-star.width/2 * scale, 
				y: y + Math.random()*300-150-star.height/2 * scale, 
				rotation: 90,
				time: 30, 
				opacity: 0, 
				easing: enchant.Easing.EXPO_EASEOUT
			})
			.then(function(){
				entity.removeChild(this);
			});	
		entity.addChild(star);
	}

};

enchant.util.Bug = enchant.Class.create(enchant.Sprite,
{
	
	initialize: function(x, y) 
    {
    	enchant.Sprite.call(this, 120, 160);
		this.image = enchant.Game.instance.assets[WHACK_I_BUG];
    	this.x = x;
    	this.y = y;
    	this.active = false;
    	this.type = Bug.TYPE_BAGU;
		this.tag = null;
		this.touchEvent = null;
	    this.vector = 0;
	    this._pause = false;
    },

    show: function(type, sec)
    {
    	Log.d('bug show');
    	this.type = type;
    	this.period = sec * 1000;
    	this.active = true;
    	this.vector = 1;
    	this.showTime = new Date/1;
    },
    hide: function()
    {
    	Log.d('bug hide');
		this.active = false;
		this.startX = null;
		this.startY = null;
		this.startTime = null;
		this.pauseTime = null;
		this.frame = 0;
		this.vector = 0;
		this.type = Bug.TYPE_BAGU;
		this.touchEvent = null;
    },
    
    onenterframe: function()
    {
    	if( this._pause ) return;
//Log.d('bug tag = ' + this.tag+ ' t = '+ this.type +' f = '+ this.frame +' v = '+ this.vector);
		if( this.frame == 0 ) {
			if( this.vector == -1 ) {
				this.hide();
				this.dispatchEvent(new Event("miss2"));
			}
		} else {
			if( this.type == Bug.TYPE_BAGO && this.startTime && new Date/1 - this.startTime > 200) {
				Log.d("bug onenterframe. " + this.tag);
				var event = new Event("hit");
				event.x = this.touchEvent.x;
				event.y = this.touchEvent.y;
				this.dispatchEvent(event);
				this.hide();
			}
			if( this.frame == 4 ) {
				if( new Date/1 - this.showTime > this.period ) {
					this.vector = -1;
				} else {
					this.vector = 0;
				}
			}
		}
		this.frame += this.vector;
	},
	
	ontouchstart: function(e)
	{
		Log.d("bug ontouchstart. " + this.tag);
		
		this.touchEvent = e;
		
		switch(this.type){
			case Bug.TYPE_BAGU:
				break;
			case Bug.TYPE_BAGA:
				break;
			case Bug.TYPE_BAGO:
				this.startTime = new Date/1;
				break;
		}

	},
	ontouchmove: function(e)
	{
		Log.d("bug ontouchmove. " + this.tag);
		
		if( this.type == Bug.TYPE_BAGA ) {
			if( this.touchEvent && Math.abs(this.touchEvent.x - e.x) < this.width && this.touchEvent.y - e.y > this.height / 3 ) {
				if( !this.active ) {
					this.touchEvent.type = "miss5";
					this.dispatchEvent(this.touchEvent);
				} else {
					this.touchEvent.type = "hit";
					this.dispatchEvent(this.touchEvent);
					this.hide();
				}
				this.touchEvent = null;
				// e.target.touchEnabled = false;
				// e.target.touchEvent = null;
			}
		}
	},
	ontouchend: function(e)
	{
		Log.d("bug ontouchend. " + this.tag);
		
		if( this.touchEvent == null ) {
			return;
		} else if( !this.active ) {
//			e.type = "miss5";
			this.dispatchEvent(new Event("miss5"));
		} else {
			switch( this.type ) {
				case Bug.TYPE_BAGU:
				    if( this.x < e.x && this.x + this.width > e.x && this.y < e.y && this.y + this.height > e.y ) {
                        this.hide();
                        var event = new Event("hit");
                        event.x = e.x;
                        event.y = e.y;
                        this.dispatchEvent(event);
					}
					break;
                case Bug.TYPE_BAGA:
                    this.touchEvent = null;
					break;
				case Bug.TYPE_BAGO:
					this.startTime = false;
					break;
			}
		}
	},
	
	frame: {
		get: function() {
			return this._frame % 6;
		},
        set: function(frame) {
        	frame = frame + (this.type-1) * 6;
            if (this._frame === frame || (frame instanceof Array && this._deepCompareToPreviousFrame(frame))) {
                return;
            }
            if (frame instanceof Array) {
                this._frameSequence = frame.slice();
                this._originalFrameSequence = frame.slice();
                this._rotateFrameSequence();
            } else {
                this._frameSequence = [];
                this._frame = frame;
                this._computeFramePosition();
            }
        }
	},
	pause: function(){
		this._pause = true;
		this.pauseTime = new Date/1;
	},
	resume: function(){
		this._pause = false;
		this.period += new Date/1 - this.pauseTime;
		this.pauseTime = null;
	}
});
enchant.util.Bug.TYPE_BAGU = 1;
enchant.util.Bug.TYPE_BAGA = 2;
enchant.util.Bug.TYPE_BAGO = 3;

enchant.util.Itn = enchant.Class.create(enchant.Sprite,
{
	
	initialize: function(x, y) 
    {
    	enchant.Sprite.call(this, 220, 120);
		this.image = enchant.Game.instance.assets[WHACK_I_ITN];
    	this.x = x;
    	this.y = y;
    	this.active = false;
		this.tag = null;
	    this.vector = 0;
	    this.hp = 0;
		this.showTime = null;
	    this.pauseTime = null;
    	this.period = 0;
    },

    show: function(hp, sec)
    {
        Log.d('itn show. hp:'+hp+' sec:'+sec);

    	this.period = sec * 1000;
    	this.active = true;
    	this.vector = 1;
    	this.showTime = new Date/1;
    	this.hp = hp;
    },
    hide: function()
    {
        Log.d('itn hide. hp:'+this.hp);

    	this.period = 0;
		this.active = false;
		this.vector = 0;
		this.showTime = null;
		this.hp = 0;
		this.frame = 0;
    },
    
    onenterframe: function(e)
    {
		if( this.frame == 0 ) {
			if( this.vector == -1 ) {
				this.hide();
//				this.dispatchEvent(new Event("miss2"));
			}
		} else if( this.frame == 4 ) {
			if( new Date/1 - this.showTime > this.period ) {
				this.vector = -1;
			} else {
			    this.vector = 0;
			}
		} else if( this.frame == 5 ) {
			if( new Date/1 - this.pauseTime > 200 ) {
				this.vector = -1;
				this.pauseTime = null;
			}
		}
		this.frame += this.vector;

	},
	
	ontouchstart: function(e)
	{
		console.log("itn ontouchstart. " + this.hp);
		
		//this.touchEvent = e;
		
		if ( this.active ) {
			if ( this.hp > 0 ) {
				this.frame = 5;
                this.pauseTime = new Date/1;
				this.hp -= 1;
				this.dispatchEvent(new Event("hit"));
			} else {
				this.hide();
				this.dispatchEvent(new Event("bonus"));
			}
		}
	},
	pause: function()
	{
		this.active = false;
		this.pauseTime = new Date/1;
	},
	resume: function()
	{
		this.active = true;
		this.period += new Date/1 - this.pauseTime;
		this.pauseTime = null;
	}
});

enchant.util.Stress = enchant.Class.create(enchant.Sprite,
{
	PERIOD: 15 * 1000,
	CS: 1.0,
	
	initialize: function(x, y) 
    {
    	enchant.Sprite.call(this, 160, 220);
		this.image = enchant.Game.instance.assets[WHACK_I_STRESS];
    	this.x = x;
    	this.y = y;
		this.touchEvent = null;
	    this.vector = 0;
	    this.gauge = 0;
	    this.ferver = false;
    },

    add: function(point)
    {
    	if( ! this.ferver ) {
	    	this.gauge += point * this.CS;
	    	
	    	Log.d("stress gauge " + this.gauge);
	    	
	    	if( this.gauge >= 100 ) this.start();
	    	else this.frame = Math.ceil(this.gauge / 10);
    	}
    },
    start: function()
    {
    	this.ferver = true;
    	this.vector = 1;
    	this.showTime = new Date/1;
    	this.frame = 11;
    	
		this.dispatchEvent(new Event('ferver'));
    },
    end: function()
    {
    	this.ferver = false;
		this.vector = 0;
		this.showTime = null;
		this.frame = 0;
		this.gauge = 0;
		
		this.dispatchEvent(new Event('end'));
    },
    
    onenterframe: function(e)
    {
    	if( this.showTime ) {
    		if( new Date/1 - this.showTime > this.PERIOD ) {
    			this.end();
    		} else {
				if( this.frame == 11 ) {
					this.vector = 1;
				} else if( this.frame == 12 ) {
					this.vector = -1;
				}
    		}
    	}
		this.frame += this.vector;
	}
});

enchant.util.Soul = enchant.Class.create(enchant.Sprite, 
{
    initialize: function(x, y) 
    {
    	enchant.Sprite.call(this, 120, 160);
    	this.x = x - 0;
    	this.y = y - 50;
		this.image = enchant.Game.instance.assets[WHACK_I_BUG];
		this.frame = 5;
		this._org_x = this.x;

		var count = 0;
		var TIME = 30;
		this.tl
			.repeat(function(){
				var vx = count * Math.cos(360 / TIME * count / 180 * Math.PI);
				this.opacity = 1 - count / TIME;
				count++;
                this.moveTo(this.org_x + vx, this.y - 1);
            }, TIME)
            .then(function(){
            	this.parentNode.removeChild(this);
//            	this.tl.removeFromScene();
            });
    },
    
	org_x: {
		get: function() {
			return this._org_x;
		},
		set: function(x){
			this._org_x = x;
		}
	}
});

enchant.util.Miss = enchant.Class.create(enchant.Sprite, 
{

    initialize: function(x, y, type) 
    {
    	enchant.Sprite.call(this, 120, 160);
    	this.x = x;
    	this.y = y;

		this.image = enchant.Game.instance.assets[WHACK_I_BUG];
		this.frame = type == Miss.TYPE_MISS2 ? 17 : 11;

		var count = 0;
		var TIME = 30;
		this.tl
			.repeat(function(){
				this.opacity = 1 - count / TIME;
				count++;
                this.moveTo(this.x, this.y - 1);
            }, TIME)
            .then(function(){
            	this.parentNode.removeChild(this);
            });
    }
});
enchant.util.Miss.TYPE_MISS2 = 2;
enchant.util.Miss.TYPE_MISS5 = 5;


enchant.util.Miss = enchant.Class.create(enchant.Sprite,
{

    initialize: function(x, y, type)
    {
    	enchant.Sprite.call(this, 120, 160);
    	this.x = x;
    	this.y = y;

		this.image = enchant.Game.instance.assets[WHACK_I_BUG];
		this.frame = type == Miss.TYPE_MISS2 ? 17 : 11;

		var count = 0;
		var TIME = 30;
		this.tl
			.repeat(function(){
				this.opacity = 1 - count / TIME;
				count++;
                this.moveTo(this.x, this.y - 1);
            }, TIME)
            .then(function(){
            	this.parentNode.removeChild(this);
            });
    }
});
enchant.util.Miss.TYPE_MISS2 = 2;
enchant.util.Miss.TYPE_MISS5 = 5;

enchant.util.Bonus = enchant.Class.create(enchant.Sprite, 
{
    initialize: function(x, y) 
    {
    	enchant.Sprite.call(this, 220, 120);
    	this.x = x;
    	this.y = y;

		this.image = enchant.Game.instance.assets[WHACK_I_ITN];
		this.frame = 6;

		var count = 0;
		var TIME = 30;
		this.tl
			.repeat(function(){
				this.opacity = 1 - count / TIME;
				count++;
                this.moveTo(this.x, this.y - 1);
            }, TIME)
            .then(function(){
            	this.parentNode.removeChild(this);
            });
    }
});


enchant.util.ShadowLabel = enchant.Class.create(enchant.Group, 
{
	initialize: function(str) 
	{
        enchant.Group.call(this, arguments);
		
		this.shadowLabel = new Label(str);
		this.shadowLabel.moveTo(2, 2);
		this.shadowLabel.color = "black";
		this.addChild(this.shadowLabel);

		this.mainLabel = new Label(str);
		this.mainLabel.color = "white";
		this.addChild(this.mainLabel);
	},

	color: {
		get: function() {
			return this.mainLabel.color;
		},
		set: function(str){
			this.mainLabel.color = str;
		}
	},
	font: {
		get: function() {
			return this.mainLabel.font;
		},
		set: function(str){
			this.mainLabel.font = str;
			this.shadowLabel.font = str;
		}
	},
	width: {
		get: function() {
			return this.shadowLabel._boundWidth + Math.abs(this.shadowLabel.x);
		},
		set: function(value){
			this.mainLabel.width = value;
			this.shadowLabel.width = value;
		}
	},
	height: {
		get: function() {
			return this.shadowLabel._boundHeight + Math.abs(this.shadowLabel.y);
		},
		set: function(value){
			this.mainLabel.height = value;
			this.shadowLabel.height = value;
		}
	},
	text: {
		get: function() {
			return this.mainLabel.text;
		},
		set: function(str){
			this.mainLabel.text = str;
			this.shadowLabel.text = str;
		}
	},
	textAlign: {
		get: function() {
			return this.mainLabel.textAlign;
		},
		set: function(value){
			this.mainLabel.textAlign = value;
			this.shadowLabel.textAlign = value;
		}
	},
	shadowColor: {
		get: function() {
			return this.shadowLabel.color;
		},
		set: function(str){
			this.shadowLabel.color = str;
		}
	},
	shadowOffsetX: {
		get: function() {
			return this.shadowLabel.x;
		},
		set: function(value){
			this.shadowLabel.x = value;
		}
	},
	shadowOffsetY: {
		get: function() {
			return this.shadowLabel.y;
		},
		set: function(value){
			this.shadowLabel.y = value;
		}
	}
});


enchant.util.Chara = enchant.Class.create(enchant.Sprite, 
{
	
    initialize: function() 
    {
    	enchant.Sprite.call(this, 300, 550);
	
		this.image = enchant.Game.instance.assets[STORY_I_CHARA];
		this._type = 0;
		this._frame = 0;
    },
	type: {
		get: function() {
			return this._type;
		},
		set: function(value){
			this._type = value;
			this.frame = 0;
		}
	},
    frame: {
        get: function() {
            return this._frame % 3;
        },
        set: function(frame) {
        	frame = frame + (this.type - 1) * 3;
            if (this._frame === frame || (frame instanceof Array && this._deepCompareToPreviousFrame(frame))) {
                return;
            }
            if (frame instanceof Array) {
                this._frameSequence = frame.slice();
                this._originalFrameSequence = frame.slice();
                this._rotateFrameSequence();
            } else {
                this._frameSequence = [];
                this._frame = frame;
                this._computeFramePosition();
            }
        }
    }
});
enchant.util.Chara.TYPE_IT = 1;
enchant.util.Chara.TYPE_OT = 2;
enchant.util.Chara.TYPE_BJ = 3;
enchant.util.Chara.TYPE_TN = 4;

enchant.util.blackLayer = function(target) 
{
	var modal = new Entity();
    modal.width = SCREEN_W;
    modal.height = SCREEN_H;
    modal.opacity = 0;
    modal.backgroundColor = "black";
    target.addChild(modal);
    
    return modal;
}


enchant.util.WhackPop = enchant.Class.create(enchant.Sprite,
{
	
	initialize: function() 
    {
    	enchant.Sprite.call(this, 640, 300);
		this.image = enchant.Game.instance.assets[WHACK_I_POP];
    },

    moveCenter: function()
    {
    	this.moveTo((SCREEN_W-this.width)/2, (SCREEN_H-this.height)/2);
    }

});
enchant.util.WhackPop.MENU = 0;
enchant.util.WhackPop.READY = 1;
enchant.util.WhackPop.GO = 2;
enchant.util.WhackPop.STAGECLEAR = 3;
enchant.util.WhackPop.GAMEOVER = 4;
enchant.util.WhackPop.MAXIMUM = 5;


var Log =
{
    enable: true,
    i: function(message){ this.enable && console.log('I: '+message); },
    w: function(message){ this.enable && console.log('W: '+message); },
    e: function(message){ this.enable && console.log('E: '+message); },
    d: function(message){ this.enable && console.log('D: '+message); }
};


enchant.util.System = enchant.Class.create({
    initialize: function() {}
});
enchant.util.Sound = enchant.Class.create({
    initialize: function() {}
});

if( navigator.userAgent.search(/Android/) != -1 ){

	enchant.util.System.start = function(){	NI.start(); };
	enchant.util.System.saveScore = function(key, value){	NI.saveScore(key, value); };
	enchant.util.System.loadScore = function(key){ return NI.loadScore(key); };
	enchant.util.System.line	= function(message){ NI.line(message); };
	enchant.util.System.gmail	= function(message){ NI.gmail(message); };
	enchant.util.System.twitter	= function(message){ NI.twitter(message); };
	enchant.util.System.facebook= function(message){ NI.facebook(message); };

    enchant.util.System.openReview  = function(){ NI.openReview(); };
    enchant.util.System.showAd      = function(){ NI.showAd(); };
    enchant.util.System.vibration   = function(){ NI.vibration(); };
    enchant.util.System.isOnLine    = function(){ return NI.isOnline(); };
    enchant.util.System.gotoSkipmore= function(){ return NI.gotoSkipmore(); };
    enchant.util.System.saveImage   = function(){
//        var cv = document.getElementsByTagName('canvas')[0];
//        var canvas = document.createElement("canvas");
//        canvas.width = cv.width;
//        canvas.height = cv.height;
//        canvas.getContext("2d").drawImage(cv, 0, 0);
//        var data = canvas.toDataURL("image/jpeg").replace(/^[^,]+,/,'');
//        console.log(data);
        var data = document.getElementsByTagName('canvas')[0].toDataURL("image/jpeg").replace(/^[^,]+,/,'');
        NI.saveImage(data);
    };

    enchant.util.Sound.init     = function(path) { NI.init(path); };
    enchant.util.Sound.play     = function() { NI.play(); };
    enchant.util.Sound.pause    = function() { NI.pause(); };
    enchant.util.Sound.resume   = function() { NI.resume(); };
    enchant.util.Sound.stop     = function() { NI.stop(); };
    enchant.util.Sound.se       = function(path) { NI.se(path); };
    enchant.util.Sound.initSe   = function(path) { NI.initSe(path); };
} else {
	enchant.util.System.start = function(){ };
	enchant.util.System.saveScore = function(key, value){ localStorage.setItem(key, value); };
	enchant.util.System.loadScore = function(key){ return localStorage.getItem(key); };
	enchant.util.System.line	= function(message){};
	enchant.util.System.gmai	= function(message){};
	enchant.util.System.twitte	= function(message){ location.href = 'https://twitter.com/?lang=ja'; };
	enchant.util.System.facebook= function(message){ location.href = 'https://ja-jp.facebook.com/'; };

    enchant.util.System.openReview  = function(){ };
    enchant.util.System.showAd      = function(){ };
    enchant.util.System.vibration   = function(){ };
    enchant.util.System.isOnLine    = function(){ return navigator.onLine; };
    enchant.util.System.gotoSkipmore= function(){ location.href = 'http://www.skipmore.com/app/'; };
    enchant.util.System.saveImage   = function(){ };

    enchant.util.Sound.init     = function(path, scene) {
        scene.bgm = game.assets[path].clone();
    };
    enchant.util.Sound.play     = function(scene) {
        scene.bgm.play();
        if( scene.bgm.src ) scene.bgm.src.loop = true;
        scene.on(Event.ENTER_FRAME, function(){
            if( !scene.bgm.src ) scene.bgm.play();
        });
    };
    enchant.util.Sound.pause    = function(scene) { scene.bgm.pause(); };
    enchant.util.Sound.resume   = function(scene) { scene.bgm.play(); };
    enchant.util.Sound.stop     = function(scene) { scene.bgm.stop();scene.bgm = null;  };
    enchant.util.Sound.se       = function(path) { game.assets[path].play(); };
    enchant.util.Sound.initSe   = function(path) { };
}
