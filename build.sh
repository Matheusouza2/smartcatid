#!/bin/bash

cd ./android && ./gradlew assembleDebug

cd ../ && npx serve android/app/build/outputs/apk/debug/

#Build EAS
#eas build --platform android --profile preview


