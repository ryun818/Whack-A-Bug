package jp.ryun.android.whack_a_bug;

import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.PowerManager;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import com.google.android.gms.ads.*;
import com.google.android.gms.analytics.GoogleAnalytics;
import com.google.android.gms.analytics.HitBuilders;
import com.google.android.gms.analytics.Tracker;

import net.nend.android.NendAdView;

import java.util.HashMap;


public class MainActivity extends ActionBarActivity {
    private static final String TAG = MainActivity.class.getSimpleName();

    private LinearLayout mAdLayout;
    private AdView adView;
    private WebView wv;
    private NI ni;
    private Handler mHandler;
    private NendAdView mNendAdView;
    private boolean isAttached = true;


    public enum TrackerName {
        APP_TRACKER, // Tracker used only in this app.
        GLOBAL_TRACKER, // Tracker used by all the apps from a company. eg: roll-up tracking.
        ECOMMERCE_TRACKER, // Tracker used by all ecommerce transactions from a company.
    }

    HashMap<TrackerName, Tracker> mTrackers = new HashMap<TrackerName, Tracker>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_main);


        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        mHandler = new Handler();
        mAdLayout = (LinearLayout)findViewById(R.id.ad);



        Tracker t = getTracker(TrackerName.APP_TRACKER);
        t.setScreenName("run");
        t.send(new HitBuilders.AppViewBuilder().build());

//        adView = new AdView(this);
//        adView.setAdUnitId("ca-app-pub-0881576486407612/6973786689");
//        adView.setAdSize(AdSize.BANNER);
//
//        ((LinearLayout) findViewById(R.id.ad)).addView(adView);
//
//        AdRequest adRequest = new AdRequest.Builder().build();
//        adView.loadAd(adRequest);


        AudioManager manager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
        //int vol = manager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        int vol = manager.getStreamVolume(AudioManager.STREAM_MUSIC);
        manager.setStreamVolume(AudioManager.STREAM_MUSIC, (int)vol, 0);

        //640x960
//        Point size = new Point();
//        ((WindowManager)getSystemService(WINDOW_SERVICE)).getDefaultDisplay().getSize(size);
//
//        Log.d("unko", "w: " + findViewById(R.id.root).getLayoutParams().width +" "+ findViewById(R.id.root).getLayoutParams().height);
//
//Log.d("unko", "display: "+size.x+" x "+size.y);
//        float scale = size.x / 640;
//Log.d("unko", "scale: "+scale);
//        float height = scale * 760;
//Log.d("unko", "game: "+size.x+" x "+height);
//        float adHeight = size.y - 100 * scale - height;
//Log.d("unko", "ad height: "+adHeight);
//        ViewGroup.LayoutParams wlp = findViewById(R.id.webView).getLayoutParams();
//        wlp.height = (int)height;


        ((ImageView)findViewById(R.id.banner)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Uri uri = Uri.parse("https://store.line.me/stickershop/product/1095880/ja");
                Intent i = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(i);
            }
        });

        if(Build.VERSION.SDK_INT > 19) WebView.setWebContentsDebuggingEnabled(true);
        wv = (WebView) findViewById(R.id.webView);
        wv.getSettings().setJavaScriptEnabled(true);
        //wv.getSettings().setAllowFileAccess(true);
        wv.getSettings().setAllowFileAccessFromFileURLs(true);
        wv.getSettings().setAllowUniversalAccessFromFileURLs(true);
        wv.setWebChromeClient(new WebChromeClient() {
            public void onConsoleMessage(String message, int lineNumber, String sourceID) {
                Log.d("MyApplication", message + " -- From line "
                        + lineNumber + " of "
                        + sourceID);
            }

            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d("MyApplication", cm.message() + " -- From line "
                        + cm.lineNumber() + " of "
                        + cm.sourceId());
                return true;
            }
        });
        ni = new NI(this);
        wv.addJavascriptInterface(ni, "NI");

        wv.clearCache(true);
        wv.destroyDrawingCache();

        wv.loadUrl("file:///android_asset/index.html");
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG,"onResume");
        if(ni != null && ni.mp != null && !ni.mp.isPlaying()) ni.mp.start();

    }

    @Override
    public void onStop() {
        super.onStop();
        Log.d(TAG,"onStop");
        if(ni != null && ni.mp != null && ni.mp.isPlaying()) ni.mp.pause();
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    @Override
    protected void onPause() {
        super.onPause();
        // 繰り返し処理を停止
        mHandler.removeCallbacks(runnable);
    }

    private void doPost(){
        // 5秒ごとに削除と再表示を繰り返す
        mHandler.postDelayed(runnable, 30000);
    }

    /**
     * NendAdViewの削除、再表示処理
     */
    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            //if(isAttached){
                mAdLayout.removeView(mNendAdView);
            //    isAttached = false;
            //}else{
                mAdLayout.addView(mNendAdView);
            //    isAttached = true;
            //}
            doPost();
        }
    };

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);

        if( mNendAdView == null ) {

            int spotId;
            String apiKey;
            RelativeLayout rl = (RelativeLayout) findViewById(R.id.root);
            float s = (float)rl.getHeight() / (float)rl.getWidth();
            Log.d(TAG, "s: " + s);
            if (s >= 1.5) {
                spotId = 366947;
                apiKey = "327cd0f17f48d7a04ed93940decc33143ed02aaa";
            } else {
                spotId = 359540;
                apiKey = "7a46d8d83cf0c47c86ef1203516b1135d031e0ba";
            }
            mNendAdView = new NendAdView(getApplicationContext(), spotId, apiKey);

            mHandler.postDelayed(runnable, 0);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        wv.stopLoading();
        wv.setWebChromeClient(null);
        wv.setWebViewClient(null);
        unregisterForContextMenu(this.wv);
        wv.destroy();
        wv = null;
    }

    synchronized Tracker getTracker(TrackerName trackerId) {
        if (!mTrackers.containsKey(trackerId)) {

            GoogleAnalytics analytics = GoogleAnalytics.getInstance(this);
            Tracker t = (trackerId == TrackerName.APP_TRACKER) ? analytics.newTracker("UA-58783520-2")
                    : (trackerId == TrackerName.GLOBAL_TRACKER) ? analytics.newTracker(R.xml.global_tracker)
                    : analytics.newTracker(R.xml.global_tracker);
            mTrackers.put(trackerId, t);

        }
        return mTrackers.get(trackerId);
    }
}
