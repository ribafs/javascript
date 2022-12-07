# Android Studio

Download

https://developer.android.com/studio

Para 64 bit

sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386

Descompacte

Para instalar execute

android-studio/bin/studio.sh

export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk

Add the Android SDK command-line directories to PATH. Each directory corresponds to the category of command-line tool.

## avdmanager, sdkmanager
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin

## adb, logcat
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools

## emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator

https://ionicframework.com/docs/developing/android

ionic capacitor add android

ionic cordova prepare android

ionic capacitor copy android

Live reload
ionic capacitor run android -l --host=YOUR_IP_ADDRESS

ionic cordova run android -l

Criar chave

keytool -list -v \
-alias androiddebugkey -keystore ~/.android/debug.keystore (Na senha teclar enter)
