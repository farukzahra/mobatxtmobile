cordova build android --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore mobatxt.jks C:\vue_apps\mobatxtmobile\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk mobatxt
C:\Users\faruk\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign -v 4 C:\vue_apps\mobatxtmobile\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk C:\vue_apps\mobatxtmobile\platforms\android\app\build\outputs\apk\release\mobatxt.apk