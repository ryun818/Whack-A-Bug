package jp.ryun.android.whack_a_bug;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

import net.nend.android.NendAdInterstitial;
import net.nend.android.NendAdInterstitial.NendAdInterstitialClickType;
import net.nend.android.NendAdInterstitial.NendAdInterstitialShowResult;
import net.nend.android.NendAdInterstitial.NendAdInterstitialStatusCode;
import net.nend.android.NendAdInterstitial.OnCompletionListener;

public class Interstitial
        implements NendAdInterstitial.OnClickListener, OnCompletionListener {
    
    private String TAG = Interstitial.this.getClass().getSimpleName();
    private Handler mHandler = new Handler();
    private Activity act;
    
    public Interstitial(Activity act) {

        Log.d(TAG, "Interstitial");

        this.act = act;

        NendAdInterstitial.loadAd(act.getApplicationContext(), "0192693f7fdde59a8959149725b9c984cc601567", 365095);
        //NendAdInterstitial.loadAd(act.getApplicationContext(), "8c278673ac6f676dae60a1f56d16dad122e23516", 213206); // test
        // 必要に応じて広告取得結果通知を受けとる
        NendAdInterstitial.setListener(this);
        

        // 表示結果が返却される
        //NendAdInterstitialShowResult result = NendAdInterstitial.showAd(act);
//
//        // 表示結果に応じて処理を行う
//        switch (result) {
//        case AD_SHOW_SUCCESS:
//            break;
//        case AD_SHOW_ALREADY:
//            break;
//        case AD_FREQUENCY_NOT_RECHABLE:
//            break;
//        case AD_REQUEST_INCOMPLETE:
//            break;
//        case AD_LOAD_INCOMPLETE:
//            break;
//        case AD_DOWNLOAD_INCOMPLETE:
//            break;
//        default:
//            break;
//        }
//        // 広告表示結果をログに出力
//        Log.d(TAG, result.name());
//
//        // 30秒後に広告を閉じる
//        mHandler.postDelayed(new Runnable() {
//                         @Override
//                         public void run() {
//                NendAdInterstitial.dismissAd();
//        }
//    }, 30000);
    }
    
    /**
     * インタースティシャル広告クリック通知
     */
    @Override
    public void onClick(NendAdInterstitialClickType clickType) {
        Log.d(TAG, clickType.name());

        // クリックに応じて処理行う
        switch (clickType) {
        case CLOSE:
            //NendAdInterstitial.dismissAd();
            NendAdInterstitial.setListener(null);
            break;
        case DOWNLOAD:
            break;
        default :
            break;
        }
    }
    
    /**
     * 広告受信通知
     */
    @Override
    public void onCompletion(NendAdInterstitialStatusCode statusCode) {
        Log.d(TAG, statusCode.name());

        // 受信結果に応じて処理を行う
        switch (statusCode) {
        case SUCCESS:
            NendAdInterstitialShowResult result = NendAdInterstitial.showAd(act, this);
            break;
        case FAILED_AD_DOWNLOAD:
            break;
        case INVALID_RESPONSE_TYPE:
            break;
        case FAILED_AD_INCOMPLETE:
            break;
        case FAILED_AD_REQUEST:
            break;
        default:
            break;
        }
    }
}
