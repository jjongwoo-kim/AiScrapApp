package com.aiscrapapp

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.aiscrapapp.MainApplication

class MainActivity : ReactActivity() {

    companion object {
        // 공유 데이터를 임시 저장할 전역 변수
        var lastSharedText: String? = null
    }

    override fun getMainComponentName(): String? {
        return "AiScrapApp" // 프로젝트 이름에 맞게 변경
    }

    // 앱이 cold start일 때 초기 props로 공유 데이터를 전달
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        android.util.Log.d("MainActivity", "cold start 시작됨")
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun getLaunchOptions(): Bundle? {
                val initialProps = Bundle()
                if (intent != null) {
                    // 공유 인텐트 조건 체크
                    if (intent.action == Intent.ACTION_SEND && intent.type == "text/plain") {
                        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
                        if (!sharedText.isNullOrEmpty()) {
                            initialProps.putString("sharedUrl", sharedText)
                            lastSharedText = sharedText
                            android.util.Log.d("MainActivity", "공유 URL 전달됨: $sharedText")
                        } else {
                            initialProps.putString("sharedUrl", "https://www.example.com")
                            android.util.Log.d("MainActivity", "공유 URL 없음. 기본 URL 전달됨")
                        }
                    } else {
                        // 인텐트 조건이 일치하지 않으면 URL이 있으면 전달하고, 없으면 기본 URL
                        val possibleUrl = intent.getStringExtra(Intent.EXTRA_TEXT)
                        if (!possibleUrl.isNullOrEmpty() && possibleUrl.startsWith("http")) {
                            initialProps.putString("sharedUrl", possibleUrl)
                            lastSharedText = possibleUrl
                            android.util.Log.d("MainActivity", "공유 인텐트 조건 불일치하지만 URL 있음: $possibleUrl")
                        } else {
                            initialProps.putString("sharedUrl", "https://www.example.com")
                            android.util.Log.d("MainActivity", "인텐트 조건 불일치, URL 없음 -> 기본 URL 전달됨")
                        }
                    }
                } else {
                    // intent가 null인 경우에도 기본 URL 전달
                    initialProps.putString("sharedUrl", "https://www.example.com")
                    android.util.Log.d("MainActivity", "intent가 null -> 기본 URL 전달됨")
                }
                return initialProps
            }
        }
    }

    // 앱이 실행 중일 때 공유 인텐트가 들어오면 onNewIntent()가 호출됨
    override fun onNewIntent(intent: Intent?) {
        android.util.Log.d("MainActivity", "word start 시작인가?")
        super.onNewIntent(intent)
        setIntent(intent)
        // (테스트용) Toast 메시지로 onNewIntent 호출 확인
        Toast.makeText(this, "onNewIntent 호출됨", Toast.LENGTH_SHORT).show()
        intent?.let { newIntent: Intent ->
            if (newIntent.action == Intent.ACTION_SEND && newIntent.type == "text/plain") {
                val sharedText = newIntent.getStringExtra(Intent.EXTRA_TEXT)
                if (!sharedText.isNullOrEmpty()) {
                    lastSharedText = sharedText // 전역 변수에 저장
                    val reactInstanceManager = (application as MainApplication)
                        .reactNativeHost
                        .reactInstanceManager
                    val currentContext = reactInstanceManager.currentReactContext
                    if (currentContext == null) {
                        android.util.Log.d("MainActivity", "reactContext가 null 입니다. 이벤트 리스너 등록")
                        reactInstanceManager.addReactInstanceEventListener(object :
                            com.facebook.react.ReactInstanceManager.ReactInstanceEventListener {
                            override fun onReactContextInitialized(context: com.facebook.react.bridge.ReactContext) {
                                android.util.Log.d("MainActivity", "ReactContext 초기화됨. 이벤트 전송 시도: $sharedText")
                                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                                    .emit("onShareReceived", sharedText)
                                android.util.Log.d("MainActivity", "onShareReceived 이벤트 emit됨 (지연): $sharedText")
                                reactInstanceManager.removeReactInstanceEventListener(this)
                            }
                        })
                    } else {
                        currentContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                            .emit("onShareReceived", sharedText)
                        android.util.Log.d("MainActivity", "onShareReceived 이벤트 바로 emit됨: $sharedText")
                    }
                }
            }
        }
    }
}
