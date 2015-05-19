var POS_LX;
var POS_LY;
var POS_RX;
var POS_RY;

var STORY_I_MSG_FRAME   = "img/story_message_frame.png";
var STORY_I_CHARA       = "img/story_chara.png";
var STORY_S_BGM         = "sound/story_bgm.mp3";
var STORY_S_NEXT        = "sound/story_next.mp3";

enchant.story = { assets:[
    STORY_I_MSG_FRAME,
    STORY_I_CHARA
]};

if( navigator.userAgent.search(/Android/) == -1 ){
    enchant.story.assets.push(
        STORY_S_BGM,
        STORY_S_NEXT
    );
} else {
    enchant.util.Sound.initSe(STORY_S_NEXT);
}

enchant.story.Story = enchant.Class.create(enchant.Scene,
{
	initialize: function() 
	{
        enchant.Scene.call(this);

        Log.d('call story.');

        var pos = 0;
        
        var group = new Group();
        this.addChild(group);
        
        
        Sound.init(STORY_S_BGM, this);
        Sound.play(this);
    
        var bg = new Bg(Bg.OFFICE);
        group.addChild(bg);
        
        var chara1 = new Chara();
        chara1.visible = false;
        group.addChild(chara1);
        
        var chara2 = new Chara();
        chara2.visible = false;
        group.addChild(chara2);

        var frame = new Sprite(630, 209);
        frame.image = game.assets[STORY_I_MSG_FRAME];
        frame.x = 10;
        frame.y = 500;
        group.addChild(frame);
    
        var message = new ShadowLabel();
        message.font = "46px 'Noto Sans CJK JP'";
        message.x = 20;
        message.y = 510;
        message.width = 625;
        message.height = 300;
        group.addChild(message);

        POS_LX = (SCREEN_W / 2 - chara1.width) / 2;
        POS_LY = (SCREEN_H - chara1.height) / 2;
        POS_RX = SCREEN_W - chara1.width - POS_LX;
        POS_RY = (SCREEN_H - chara1.height) / 2;

        var _this = this;
        this.on(Event.TOUCH_START, function(e) {
            if( this.beforeTouch != null && Math.abs(this.beforeTouch.x - e.x) < 2 && Math.abs(this.beforeTouch.y - e.y) < 2 ) return;
            this.beforeTouch = e;

            Sound.se(STORY_S_NEXT);
            switch(game.stage){
                case 1: _this.stage1(pos, bg, chara1, chara2, message); break;
                case 2: _this.stage2(pos, bg, chara1, chara2, message); break;
                case 3: _this.stage3(pos, bg, chara1, chara2, message); break;
                case 4: _this.stage4(pos, bg, chara1, chara2, message); break;
                case 5: _this.stage5(pos, bg, chara1, chara2, message); break;
                case 6: _this.ending(pos, bg, chara1, chara2, message); break;
            }
            Log.d('pos: '+pos);
            pos++;
            return false;
        });
        this.dispatchEvent(new Event(Event.TOUCH_START));


        this.on(enchant.Event.EXIT, function(){
            ['bgm'].forEach(function(name){
                _this[name] = null;
             });
        });
	},
	
    stage1: function(pos, bg, chara1, chara2, message) 
    {
        var story = [
            function(){
                message.text = "-株式会社<br>ブラック・エンジニアリング-";
                
            },
            function() {
                chara1.type = Chara.TYPE_IT;
                chara1.x = POS_LX;
                chara1.y = POS_LY;
                chara1.visible = true;
                message.text = "いっと君<br>"
                    + "「ふぁ〜〜あぁ」";
            },
            function(){
                chara2.type = Chara.TYPE_OT;
                chara2.x = SCREEN_W;
                chara2.y = POS_RY;
                chara2.visible = true;
                chara2.tl.moveTo(POS_RX, POS_RY, getTime(500));
                message.text = "おつぼ姉<br>"
                    + "「あら随分と暇そうね」";   
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(POS_RX, POS_RY);
                message.text = "いっと君<br>"
                    + "「いやぁ、昨日の夜から朝方にかけてリリース作業をしていて」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「今、待機中なんですよ」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「あら、そうなの。";
            },
            function(){
                chara2.frame = 1;
                message.text += "じゃあやっぱり暇なのね」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「えっ？いやっ、暇というか待機中というか、十二時間ぶりの休憩中というか…」";
            },
            function(){
                chara2.frame = 0;
                message.text = "おつぼ姉<br>"
                    + "「ところで、隣の部署の山田君って知ってる？」";
            },
            function(){
                chara1.frame = 0;
                message.text = "いっと君<br>"
                    + "「あー、先月から派遣でやってきたプログラマーですよね」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「そう。その山田君、今朝入院しちゃったの」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「え！？何があったんですか？」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「それは言えないけど…、<br>あれほど病院で診察は受けるなって言っておいたのに…」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「困った子ねぇ」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（過労か…、それとも、うつ病になったか…）";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「まぁ、そういう事だからよろしくね」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「えっ？いやっ、えっ？";
            },
            function(){
                message.text += "何をですか？」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 0;
                message.text = "おつぼ姉<br>"
                    + "「さっきまでその山田君が書いたコードのチェックをしていたの」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「そしたらバグだらけだったのよ」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「…はぁ」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 0;
                message.text = "おつぼ姉<br>"
                    + "「今、隣の部署リソース不足で」"
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「バグを直せる人間がいないのよ」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「そこで丁度、暇そうにしている人をみつけて…」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「暇ではありません。休憩中なだけです」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「じゃ、今日中でいいから。";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 2;
                chara2.scaleX = -1;
                chara2.tl.moveBy(SCREEN_W, 0, getTime(500));
                message.text += "よろしくね〜」";
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(SCREEN_W, POS_RY);
                message.text = "いっと君<br>"
                    + "「ちょwwwおまwwww」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「…」";
            },  
            function(){
                message.text = "いっと君<br>"
                    + "（逆にバグ埋め込んでやろうかな…）";
            }
        ];
    
        if( pos < story.length ) {
            story[pos]();
        } else {
            if(game.mode != MODE_WHACK) {
                game.mode = MODE_WHACK;
                this.end();
            }
        }
    },
    
    stage2: function(pos, bg, chara1, chara2, message) 
    {
        var story = [
            function(){
                chara1.type = Chara.TYPE_IT;
                chara1.x = POS_LX;
                chara1.y = POS_LY;
                chara1.visible = true;
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「お、終わったー」";
            },
            function(){
                chara2.type = Chara.TYPE_OT;
                chara2.x = SCREEN_W;
                chara2.y = POS_RY;
                chara2.visible = true;
                chara2.tl.moveTo(POS_RX, POS_RY, getTime(500));
                message.text = "おつぼ姉<br>"
                    + "「あら、わりと早かったわね」";
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(POS_RX, POS_RY);
                message.text = "いっと君<br>"
                    + "「いやぁ、なかなか酷いコードでした」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「昨日の山田君の目、死んだ魚の様な目をしてたから…」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「しょうがないわね」";
            },
            function(){
                chara1.frame = 2;
                message.text = "いっと君<br>"
                    + "「（誰だよ…そこまで追い詰めた奴は…）」";
            },
            function(){
                chara1.frame = 0;
                message.text = "いっと君<br>"
                    + "「じゃぁ、今日は泊まりだったし」";
            },
            function(){
                chara1.scaleX = -1;
                message.text = "いっと君<br>"
                    + "「特に問題も起きてないみたいだから、早くあがろうかな！」";
            },
            function(){
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「おまちなさい」";
            },
            function(){
                chara1.scaleX = 1;
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「へっ！？」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「これ、なんだか、わかる？」";
            },
            function(){
                message.text = "バサッ";
            },
            function(){
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「…ん、これは先週、僕が書いたライブラリのソースコードですね」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「そうよ」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「あなた、一時的に保持しておく変数名に、なんていう名前を付けているのよっ！」";
            },
            function(){
                chara1.frame = 0;
                message.text = "いっと君<br>"
                    + "「HENA(変数A)ですけど」";
            },
            function(){
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「全て変数名を付け直しなさい」";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「えっ！えぇぇっ！？」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「（とは言っても、まぁリファクタリングすれば一発だし、すぐ終わるか）」";
            },
            function(){
                chara1.frame = 0;
                message.text = "おつぼ姉<br>"
                    + "「と、言いたいところだけど、」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「！？」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「とても部下思いの優しい私が、あなたの代わりに変数名変えてあげたわ」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「は、はぁ。ありがとうございます…」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「ただね、正しく動かなくなっちゃったの。」";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「！！！！！！！！！！！！！！」";
            },
            function(){
                chara1.frame = 1;
                chara1.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「だから直しておいてね」";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 2;
                chara2.scaleX = -1;
                chara2.tl.moveBy(SCREEN_W, 0, getTime(500));
                message.text = "おつぼ姉<br>"
                    + "「じゃ！」";
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(SCREEN_W, POS_RY);
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "（じゃ！じゃねーよっ！！）";
            }
        ];
    
        if( pos < story.length ) {
            story[pos]();
        } else {
            if(game.mode != MODE_WHACK) {
                game.mode = MODE_WHACK;
                this.end();
            }
        }
    },
    
    stage3: function(pos, bg, chara1, chara2, message) 
    {
        var story = [
            function(){
                chara1.type = Chara.TYPE_IT;
                chara1.x = POS_LX;
                chara1.y = POS_LY;
                chara1.frame = 1;
                chara1.visible = true;
                message.text = "いっと君<br>"
                    + "「…よし、コレで修正完了！」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（ったく…変数名だけ変えればいいものを）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（全然関係の無い、関数名まで変えやがって）";
            },
            function(){
                chara2.type = Chara.TYPE_OT;
                chara2.x = SCREEN_W;
                chara2.y = POS_RY;
                chara2.visible = true;
                chara2.tl.moveTo(POS_RX, POS_RY, getTime(500));
                message.text = "おつぼ姉<br>"
                    + "「あら、直ったの？」";
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(POS_RX, POS_RY);
                message.text = "いっと君<br>"
                    + "「…はい、なんとか」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "おつぼ姉<br>"
                    + "「さすが、いっと君。我が社のエースね」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「（お前が使えねーだけだっつーの）」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 0;
                message.text = "おつぼ姉<br>"
                    + "「あら、もうこんな時間ね」";
            },
            function(){
                message.text = "おつぼ姉<br>"
                    + "「今日はこれから『イケメンスイーツエンジニア』と合コンだから帰るわね」";
            },
            function(){
                chara1.frame = 1;
                chara2.scaleX = -1;
                chara2.frame = 2;
                chara2.tl.moveBy(SCREEN_W, 0, getTime(500));
                message.text = "おつぼ姉<br>"
                    + "「おつかれ〜」";
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(SCREEN_W, POS_RY);
                message.text = "いっと君<br>"
                    + "（何だその合コン…）";
            },
            function(){
                chara1.frame = 0;
                message.text = "いっと君<br>"
                    + "「…さて、今日はもうヘトヘトだから、そろそろ帰るかぁ」";
            },
            function(){
                message.text = "？？？<br>"
                    + "「ちょっと待つトン！」";
            },
            function(){
                chara2.type = Chara.TYPE_TN;
                chara2.scaleX = 1;
                chara2.frame = 0;
                chara2.x = SCREEN_W;
                chara2.y = POS_RY;
                chara2.visible = true;
                chara2.tl.moveTo(POS_RX, POS_RY, getTime(1000));
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(POS_RX, POS_RY);
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「今さっき、黒々商事の部長さんから電話があったトン！」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「えっ…、な、何があったんでしょうか…」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「今朝リリースしたプログラムに不具合があったみたいだトン！」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「ぐぬぬぬぬ」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっとん<br>"
                    + "「クリティカルなバグだから早急に直すよう言われたトン」";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「わ、わかりました。すぐ直します…」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "（ちゃんとテストしたはずなのに…おかしいな…）";
            },

        ];
    
        if( pos < story.length ) {
            story[pos]();
        } else {
            if(game.mode != MODE_WHACK) {
                game.mode = MODE_WHACK;
                this.end();
            }
        }
    },

    stage4: function(pos, bg, chara1, chara2, message) 
    {
        var story = [
            function(){
                chara1.type = Chara.TYPE_IT;
                chara1.x = POS_LX;
                chara1.y = POS_LY;
                chara1.frame = 1;
                chara1.visible = true;
                chara2.type = Chara.TYPE_TN;
                chara2.x = POS_RX;
                chara2.y = POS_RY;
                chara2.visible = true;
                message.text = "いっと君<br>"
                    + "「しゅ、修正しました…」";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「おつかれトン」";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "（本番環境のデータベースのインデックスの貼り忘れで、）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（アクセス集中に耐えられなくてフリーズとか…）";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "（ぜんぜん俺の担当部分じゃねーーーーーーし！！！！）";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「じゃあ先方に連絡するトン」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「お願いします。。」";
            },
            function(){
                chara2.frame = 2;
                message.text = "いっとん<br>"
                    + "「…あ、もしもし、お世話になります…」";
            },
            function(){
                chara1.frame = 2;
                message.text = "いっと君<br>"
                    + "（あぁー、もうだめだ…、眠いし、腹減ったし、いい加減帰る！）";
            },
            function(){
                chara1.frame = 0;
                chara1.scaleX = -1;
                message.text = "いっとん<br>"
                    + "「…はい、…えぇ、";
            },
            function(){
                message.text = "えぇっ！？」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "「！！？？」";
            },
            function(){
                chara1.frame = 2;
                message.text = "いっと君<br>"
                    + "（嫌な予感がする…）";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "（電話してる隙に帰ってしまおう…）";
            },
            function(){
                chara1.tl
                    .moveBy(-chara1.width / 2, 0, getTime(1000))
                    .then(function(){
                        chara2.frame = 1;
                        chara2.scaleX = 1;
                        message.text = "いっとん<br>"
                            + "「おい、待て小僧」";
                        
                    })
                    .moveBy(0, -50, getTime(200), enchant.Easing.EXPO_EASEOUT)
                    .moveBy(0, 50, getTime(200), enchant.Easing.EXPO_EASEIN);
            },
            function(){
                chara2.frame = 0;
                chara1.tl.clear();
                chara1.scaleX = 1;
                chara1.frame = 1;
                chara1.moveTo(-chara1.width / 2, POS_LY);
                chara1.tl.moveTo(POS_LX, POS_LY, getTime(500));
                message.text = "いっと君<br>"
                    + "「…は、はい」";
            },
            function(){
                chara1.frame = 0;
                chara1.tl.clear();
                chara1.moveTo(POS_LX, POS_LY);
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「管理画面でユーザー情報の変更が出来ないらしいトン」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「えっ、いや、そこは僕の担当ではないので…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（さっきのデータベースだって俺じゃないけど…）";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「でも他に今直せる人間がいないトン」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「えっ！？そんな、みんなまだ…」";
            },
            function(){
                chara1.frame = 2;
                message.text = "いっと君<br>"
                    + "（だっ、誰もいない…）";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「まぁ、そういうことだから宜しく頼むトン」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「グギギギ…」";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっとん<br>"
                    + "「ちなみに、」";
            },
            function(){
                chara1.frame = 0;
                message.text = "いっとん<br>"
                    + "「今日は結婚記念日なので先に帰るけど、先方への報告もよろしく頼むトン」";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 2;
                chara2.tl.moveBy(SCREEN_W, 0, getTime(1000));
                message.text = "いっとん<br>"
                    + "「じゃ、おつかれト〜ン」";
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(SCREEN_W, POS_RY);
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "（既婚者だったのかっ！？）";
            },
        ];
    
    
        if( pos < story.length ) {
            story[pos]();
        } else {
            if(game.mode != MODE_WHACK) {
                game.mode = MODE_WHACK;
                this.end();
            }
        }
    },
    
    stage5: function(pos, bg, chara1, chara2, message) 
    {
        var _this = this;
        var story = [
            function(){
                chara1.type = Chara.TYPE_IT;
                chara1.x = POS_LX;
                chara1.y = POS_LY;
                chara1.frame = 1;
                chara1.scaleX = -1;
                chara1.visible = true;
                message.text = "いっと君<br>"
                    + "「…はい";
            },
            function(){
                message.text += "、……はい";
            },
            function(){
                message.text += "、どうもすみませんでした」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「それでは、失礼いたします…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「ふぅ…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「…」";
            },
            function(){
                chara1.frame = 0;
                chara1.scaleX = 1;
                message.text = "いっと君<br>"
                    + "「…」";
            },
            function(){
                chara1.frame = 2;
                message.text = "いっと君<br>"
                    + "「がああああああああああぁぁぁぁあぁあぁぁぁあぁぁぁぁーーーーー！！！！！！」";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "（なんで俺がこんなことしなくちゃいけねぇーーーーんだよ！！ボケっ！！）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（しかも担当はもう帰ったっつーーーし！）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（直すの明日でもいーーんじゃねぇーーーーかコレ！！！）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（あの豚…ハメやがったな…クソっ！！）";
            },
            function(){
                chara1.frame = 2;
                message.text = "いっと君<br>"
                    + "（って、ヤバい…あと五分で終電じゃん！！）";
            },
            function(){
                chara1.frame = 1;
                message.text = "いっと君<br>"
                    + "（ギリ間に合うか…）";
            },
            function(){
                blackLayer(_this).tl
                    .fadeIn(getTime(1000))
                    .then(function(){
                        chara1.visible = false;
                        bg.frame = 3;
                        message.text = "";
                    })
                    .fadeOut(getTime(1000));
                    //.removeFromScene();
            },
            function(){
                _this.removeChild(_this.childNodes[_this.childNodes.length-1]);
                chara1.visible = false;
                bg.frame = 3;
                message.text = "-JR何喪島線 飛込駅-";
            },
            function(){
                chara2.type = Chara.TYPE_IT;
                chara2.frame = 2;
                chara2.moveTo(SCREEN_W, POS_RY);
                chara2.scaleX = -1;
                chara2.visible = true;
                chara2.tl.moveTo(POS_RX, POS_RY, getTime(2000));
                message.text = "いっと君<br>"
                    + "「…ぜぇ…ぜぇ…ぜぇ…ぜぇ」";
            },
            function(){
                chara2.frame = 1;
                chara2.tl.clear();
                chara2.moveTo(POS_RX, POS_RY);
                message.text = "いっと君<br>"
                    + "「ま、間に合った…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「これでやっと家に帰れる…」";
            },
            function(){
                chara2.frame = 0;
                message.text = "（プシューー）";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "（間一髪だった…）";
            },
            function(){
                chara2.frame = 0;
                message.text = "（ぐぅ〜〜〜〜〜）";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "（そういや、まだご飯食べてなかったな…）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（家に着いても、ご飯食べる気力あるかなぁ…）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（風呂にも入らずそのまま寝るか…）";
            },
            function(){
                chara2.frame = 0;
                message.text = "（ブルブルブルブル）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「ん？」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（じーちゃんからメールだ）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（めずらしいな、一体どうしたんだ？）";
            },
            function(){
                chara2.frame = 1;
                message.text = "From: バグ爺<br>"
                    + "『ワシ　キトク　スグカエレ』";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（…危篤のやつがメールなんて打てるかよ）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（あぁ、嫌な予感がする…）";
            },
            function(){
                blackLayer(_this).tl
                    .fadeIn(getTime(1000))
                    .then(function(){
                        chara1.visible = false;
                        chara2.visible = false;
                        bg.frame = 4;
                        message.text = "";
                    })
                    .fadeOut(getTime(1000))
                    .then(function(){
                        message.text = "-いっと君の自宅-";
                    });
                    //.removeFromScene();
            },
            function(){
                chara1.visible = false;
                bg.frame = 4;
                _this.removeChild(_this.childNodes[_this.childNodes.length-1]);
                chara2.x = SCREEN_W;
                chara2.y = POS_RY;
                chara2.scaleX =-1;
                chara2.visible = true;
                chara2.tl.moveTo(POS_RX, POS_RY, getTime(2000));
                message.text = "いっと君<br>"
                    + "「ただいまぁ…」";
            },
            function(){
                chara2.tl.clear();
                chara2.moveTo(POS_RX, POS_RY);
                message.text = "？？？<br>"
                    + "「おーい、こっちじゃーー」";
            },
            function(){
                chara2.scaleX = 1;
                message.text = "いっと君<br>"
                    + "「ん？じーちゃん、一体どーしたって…」";
            },
            function(){
                chara1.type = Chara.TYPE_BJ;
                chara1.frame = 2;
                chara1.x = POS_LX;
                chara1.y = POS_LY;
                chara1.visible = true;
                message.text = "バグ爺<br>"
                    + "「わしゃ〜もだめじゃ〜」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 1;
                chara2.scaleX = -1;
                message.text = "いっと君<br>"
                    + "「なっ、床一面に印刷したソースコードばらまいてなにしてるんだよ！」";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 0;
                message.text = "バグ爺<br>"
                    + "「バグが取れんのじゃあ…」";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "「だからってこんな…、まぁ、とにかく何があったんだよ！？」";
            },
            function(){
                chara1.frame = 0;
                chara2.frame = 0;
                message.text = "バグ爺<br>"
                    + "「それがのぅ」";
            },
            function(){
                message.text = "バグ爺<br>"
                    + "「ワシが開発した『スーパーミラクルファイヤー自動ドキュメント生成プログラム』が";
            },
            function(){
                message.text = "バグ爺<br>"
                    + "「1000行以上のソースコードを読み込ませると」";
            },
            function(){
                chara1.frame = 1;
                chara2.frame = 2;
                message.text = "バグ爺<br>"
                    + "「パソコンが爆発するらしいんじゃ」";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "（いったい何処の国に納品したんだよ…）";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 0;
                message.text = "バグ爺<br>"
                    + "「朝からコードを見なおしてるんじゃが、一向に改善されなくてのう」";
            },
            function(){
                chara2.frame = 1;
                message.text = "バグ爺<br>"
                    + "「しかも『明日までに直せなかったら、お前の命は無い』と、脅されてしまって…」";
            },
            function(){
                chara1.frame = 0;
                message.text = "いっと君<br>"
                    + "（老い先短いし、別にいいじゃねぇか…）";
            },
            function(){
                chara1.frame = 2;
                chara2.frame = 0;
                message.text = "バグ爺<br>"
                    + "「助けておくれ〜！いっとぉ〜〜！」";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "「わ、わかったよ爺ちゃん。手伝うよ…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（やっと寝れると思ったのに…）";
            },
            function(){
                chara2.frame = 2;
                message.text = "いっと君<br>"
                    + "（なんて日だっ！！！！）";
            }
        ];
    
        if( pos < story.length ) {
            story[pos]();
        } else {
            if(game.mode != MODE_WHACK) {
                game.mode = MODE_WHACK;
                this.end();
            }
        }
    },
    
    
    ending: function(pos, bg, chara1, chara2, message) 
    {
        var story = [
            function(){
                bg.frame = 4;
                chara1.type = Chara.TYPE_BJ;
                chara1.moveTo(POS_LX, POS_LY);
                chara1.visible = true;
                chara2.type = Chara.TYPE_IT;
                chara2.frame = 2;
                chara2.moveTo(POS_RX, POS_RY);
                chara2.scaleX = -1;
                chara2.visible = true;
                message.text = "いっと君<br>"
                    + "「…じーちゃん、…直したよ」";
            },
            function(){
                message.text = "バグ爺<br>"
                    + "「おおおおおぉ、さすが我が孫じゃあ！」";
            },
            function(){
                chara1.frame = 1;
                chara1.scaleX = -1;
                chara1.tl.moveTo(-chara1.width, POS_LY, getTime(2000));
                message.text = "バグ爺<br>"
                    + "「これで殺されずに済むわい！」";
            },
            function(){
                chara1.tl.clear();
                chara1.moveTo(-chara1.width, POS_LY);
                message.text = "いっと君<br>"
                    + "「…ははっ、よかったね、じーちゃん、ははっ…」";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "（なんでCPUのファンを止めるコードなんて入ってたんだ…？）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（じーちゃん以外にコード書いた奴がいるんじゃ…？）";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（いや、そもそも、パソコンが爆発とかありえないし…）";
            },
            function(){
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「じーちゃん、あのさぁ…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「あれ？じーちゃん？」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "（あのボケ爺いどこ行きやがった）";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "「…まぁいいや」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「とにかく、もう寝よう…」";
            },
            function(){
                chara2.scaleX = 1
                chara2.frame = 0;
                message.text = "いっと君<br>"
                    + "「…」";
            },
            function(){
                message.text = "ジリリリリリリリリッ！！！";
            },
            function(){
                chara2.frame = 1;
                message.text = "いっと君<br>"
                    + "「！！！？？？」";
            },
            function(){
                chara2.frame = 2;
                message.text = "いっと君<br>"
                    + "「はっ！？」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「会社に行く時間！！！？？？」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「…」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「……」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「………」";
            },
            function(){
                message.text = "いっと君<br>"
                    + "「俺も";
            },
            function(){
                chara2.tl.moveBy(SCREEN_W - chara1.x, 0, getTime(2000));
                message.text += "、病院に行こう…」";
            },
            function(){
                message.text = "-おしまい-";
            }
        ];

        if( pos < story.length ) {
            story[pos]();
        } else {
            if(game.mode != MODE_AGGREGATE_STORY) {
                game.mode = MODE_AGGREGATE_STORY;
                this.end();
            }
        }
    },
    
        
    end: function() 
    {
        Log.d("end story");

        var _this = this;

        blackLayer(this).tl
            .fadeIn(getTime(1500))
            .then(function() {
                Sound.stop(_this);
                game.rootScene.dispatchEvent(new Event('ChangeMode'));
            });

    }
});