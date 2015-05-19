package jp.ryun.android.whack_a_bug;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.PixelFormat;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Vibrator;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.text.format.DateFormat;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ryun on 2015/05/07.
 */
public class NI {
    private static final String TAG = NI.class.getSimpleName();
    private final int GMAIL_ID = 0;
    private final int LINE_ID = 1;
    private final int FACEBOOK_ID = 2;
    private final int TWITTER_ID = 3;
    private final String[] sharePackages = {
            "com.google.android.gm",
            "jp.naver.line.android",
            "com.facebook.katana",
            "com.twitter.android"
    };
    private Activity act;
    private Context ctx;
    private Handler h;
    private SoundPool sp;

    public NI(final Activity act) {
        this.act = act;
        this.ctx = act.getApplicationContext();
        h = new Handler();
        this.sp = new SoundPool(10, AudioManager.STREAM_MUSIC, 0);

    }

    @JavascriptInterface
    public void start() {
        Log.d(TAG, "start()");

        h.postDelayed(new Runnable() {
            @Override
            public void run() {
                act.findViewById(R.id.splash).setVisibility(View.GONE);
            }
        }, 1000);
    }

    @JavascriptInterface
    public void saveScore(String key, int value) {
        //ctx.getSharedPreferences("score_data", Context.MODE_PRIVATE).edit().putInt(key, value).commit();
        PreferenceManager.getDefaultSharedPreferences(ctx).edit().putInt(key, value).commit();
    }

    @JavascriptInterface
    public int loadScore(String key) {

        //return ctx.getSharedPreferences("score_data", Context.MODE_PRIVATE).getInt(key, 0);
        return PreferenceManager.getDefaultSharedPreferences(this.ctx).getInt(key, 0);
    }

    //        @JavascriptInterface
//        private void tweeting(String message) {
//            String tweet = "";
//            //String message = "エンドレスモードで 100,000,000 点とりました。\n" +
//            //        "称号：「ベテラン」";
//            String hashtag = "#いっと君のバグ潰し";
//            String url = "http://bit.ly/1tdot0d ";
//
//            try {
//                tweet = "http://twitter.com/intent/tweet?text="
//                        + URLEncoder.encode(message, "UTF-8")
//                        + "+"
//                        + URLEncoder.encode(hashtag, "UTF-8")
//                        + "&url="
//                        + URLEncoder.encode(url, "UTF-8");
//            } catch (UnsupportedEncodingException e) {
//
//                e.printStackTrace();
//            }
//            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(tweet));
//            startActivity(intent);
//        }
    @JavascriptInterface
    public void gmail(String message) {
        if(isShareAppInstall(GMAIL_ID)){
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:"));
            intent.setPackage(sharePackages[GMAIL_ID]);
            intent.putExtra(Intent.EXTRA_SUBJECT, "いっと君のバグ潰し");
            intent.putExtra(Intent.EXTRA_TEXT, buildMessage(message));
            ctx.startActivity(intent);
        }else{
            shareAppDl(GMAIL_ID);
        }
    }

    @JavascriptInterface
    public void line(String message) {
        if(isShareAppInstall(LINE_ID)){
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_VIEW);
            intent.setData(Uri.parse("line://msg/text/" + buildMessage(message)));
            ctx.startActivity(intent);
        }else{
            shareAppDl(LINE_ID);
        }
    }

    @JavascriptInterface
    public void facebook(String message) {
        String wall = "";

        //https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fdekiru.net%2Farticle%2F3899%2F

        if(isShareAppInstall(FACEBOOK_ID)){
            Uri uri = Uri.parse("http://android.roof-balcony.com/");
            Intent i = new Intent(Intent.ACTION_VIEW,uri);
            ctx.startActivity(i);
//                Intent intent = new Intent();
//                intent.setAction(Intent.ACTION_SEND);
//                intent.setPackage(sharePackages[FACEBOOK_ID]);
//                intent.setType("text/plain");
//                //intent.putExtra( Intent.EXTRA_TEXT, buildMessage(message));
//                intent.putExtra( Intent.EXTRA_TEXT, wall);
//                startActivity(intent);
        }else{
            shareAppDl(FACEBOOK_ID);
        }
    }

    @JavascriptInterface
    public void twitter(String message) {
        Log.d(TAG, "twitter");

        String tweet = message + "\n\n"
                + "#いっと君のバグつぶし\n"
                + "http://itkun.net/game.html";

        if(isShareAppInstall(TWITTER_ID)){
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_SEND);
            intent.setPackage(sharePackages[TWITTER_ID]);
            intent.setType("image/png");
            //intent.putExtra(Intent.EXTRA_TEXT, buildMessage(message));
            intent.putExtra(Intent.EXTRA_TEXT, tweet);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            if(u != null) intent.putExtra(Intent.EXTRA_STREAM, u);
            ctx.startActivity(intent);
        }else{
            shareAppDl(TWITTER_ID);
        }
    }

    private Uri u = null;
    @JavascriptInterface
    public void saveImage(String data) {

                long dateTaken = System.currentTimeMillis();
                String name = DateFormat.format("yyyyMMddkkmmss", dateTaken).toString() + ".jpg";
                String filename = Environment.getExternalStorageDirectory().toString() + "/WhackABug/" + name;

                Log.d(TAG, filename);

                OutputStream output = null;

                try {
                    File file = new File(filename);
                    if (!file.getParentFile().exists()) file.getParentFile().mkdir();

                    output = new FileOutputStream(file);

                    Bitmap saveBitmap = null;

//            v.setDrawingCacheEnabled(true);
//            v.setDrawingCacheBackgroundColor(Color.WHITE);
//            saveBitmap = Bitmap.createBitmap(v.getDrawingCache());

                    //WebView wv = (WebView) act.findViewById(R.id.webView);

                    byte[] bytes = Base64.decode(data, Base64.DEFAULT);
                    saveBitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);

                    saveBitmap.compress(Bitmap.CompressFormat.JPEG, 100, output);
                    output.flush();
                } catch (IOException e) {
                    Toast.makeText(ctx, e.getMessage(), Toast.LENGTH_SHORT).show();
                    e.printStackTrace();
                } finally {
                    if (output != null) {
                        try {
                            output.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }

                ContentValues values = new ContentValues(7);
                values.put(MediaStore.Images.Media.TITLE, name);
                values.put(MediaStore.Images.Media.DISPLAY_NAME, filename);
                values.put(MediaStore.Images.Media.DATE_TAKEN, dateTaken);
                values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                values.put(MediaStore.Images.Media.DATA, filename);
                ContentResolver cr = ctx.getContentResolver();
                u = cr.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);

    }



    private String buildMessage(String message) {
        String tweet = "";
        //String message = "エンドレスモードで 100,000,000 点とりました。\n" +
        //        "称号：「ベテラン」";
        String hashtag = "#いっと君のバグつぶし";
        String url = "http://itkun.net/game.html";

        try {
            tweet = "http://twitter.com/intent/tweet?text="
                    + URLEncoder.encode(message, "UTF-8")
                    + "+"
                    + URLEncoder.encode(hashtag, "UTF-8")
                    + "&url="
                    + URLEncoder.encode(url, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return tweet;
    }

    private Boolean isShareAppInstall(int shareId) {
        try {
            PackageManager pm = ctx.getPackageManager();
            pm.getApplicationInfo(sharePackages[shareId], PackageManager.GET_META_DATA);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    // アプリが無かったのでGooglePalyに飛ばす
    private void shareAppDl(int shareId){
        Log.d(TAG, "shareAppDl ");
        Uri uri = Uri.parse("market://details?id="+sharePackages[shareId]);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        act.startActivity(intent);
    }


    public MediaPlayer mp;
    private String TITLE_S_BGM         = "sound/title_bgm.mp3";
    private String STORY_S_BGM         = "sound/story_bgm.mp3";
    private String WHACK_S_BGM         = "sound/whack_bgm.mp3";
    private String WHACK_S_BGM_FINAL   = "sound/whack_bgm_final.mp3";
    private String WHACK_S_BGM_ENDLESS = "sound/whack_bgm_endless.mp3";

    @JavascriptInterface
    public void init(String path) {
        try {
            mp = new MediaPlayer();
            AssetFileDescriptor afd = ctx.getAssets().openFd(path);
            mp.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            afd.close();
            mp.setLooping(true);
            mp.prepare();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @JavascriptInterface
    public void play() {
        if( ! mp.isPlaying() ) mp.start();
    }
    @JavascriptInterface
    public void pause() {
        mp.pause();
    }
    @JavascriptInterface
    public void resume() {
        if( ! mp.isPlaying() ) mp.start();
    }
    @JavascriptInterface
    public void stop() {
        mp.stop();
        mp.release();
        mp = null;
    }

    @JavascriptInterface
    public boolean isOnline() {
        NetworkInfo nInfo = ((ConnectivityManager)act.getSystemService(Context.CONNECTIVITY_SERVICE)).getActiveNetworkInfo();
        return nInfo != null && nInfo.isConnected();
    }

    @JavascriptInterface
    public void showAd() {
        new Interstitial(act);
    }

    @JavascriptInterface
    public void openReview() {
        final SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(act.getApplicationContext());

        if( !sp.getBoolean("review", false) ) {
            AlertDialog.Builder dialog = new AlertDialog.Builder(act);
            dialog.setTitle("m(_ _)m");
            dialog.setMessage("アプリの評価をしてチョンマゲ");
            dialog.setPositiveButton("評価する", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    sp.edit().putBoolean("review", true).commit();
                    Intent intent = new Intent(Intent.ACTION_VIEW,
                            Uri.parse("https://play.google.com/store/apps/developer?id=jp.ryun.android.whack_a_bug&amp;hl=ja"));
                    act.startActivity(intent);
                }
            });
            dialog.setNegativeButton("するかボケ", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {

                }
            });
            dialog.show();
        }
    }

    @JavascriptInterface
    public void vibration() {
        ((Vibrator)ctx.getSystemService(ctx.VIBRATOR_SERVICE)).vibrate(100);
    }

    @JavascriptInterface
    public void gotoSkipmore() {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://www.skipmore.com/app/"));
        act.startActivity(intent);
    }

    private Map<String, Integer> seMap = new HashMap<String, Integer>();
    @JavascriptInterface
    public void initSe(String path) {
        try {
            seMap.put(path, sp.load(ctx.getAssets().openFd(path), 1));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @JavascriptInterface
    public void se(String path) {
        sp.play(seMap.get(path), 1, 1, 0, 0, 1);
        //sp.unload(id);
        //sp.release();
    }
}
