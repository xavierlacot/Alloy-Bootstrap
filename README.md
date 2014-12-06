# Alloy Bootstrap


This is a Titanium Alloy bootstrap application with
 * [CoffeeScript](http://coffeescript.org/) is an attempt to expose the good parts of JavaScript in a simple way
 * [LTSS](https://github.com/dbankier/ltss) an Alloy tss pre-processor inspired by less
 * [TiCons](https://github.com/fokkezb/ticons-cli) to generate icons and splash screens
 * [TiShadow](https://github.com/dbankier/TiShadow) run tests or execute code snippets live across all running iOS and Android devices
 * [TiStealth](https://github.com/fokkezb/ti-stealth), a module to replace console log calls with NOOPs which can later be restored


## Prerequisites

First, this fork requires [a fork of Alloy which implements a faster Alloy selective compilation](https://github.com/xavierlacot/alloy/tree/feature/speedup-compile). Install it with:

```
$ npm install -g xavierlacot/alloy#feature/speedup-compile
```
Then, go on with this bootstrap's dependencies:

```
$ npm install tishadow grunt-cli
```
 * [Get started](http://tishadow.yydigital.com/getting%20started) with TiShadow
```
$ npm install -g ticons
```
 * [Get started](https://github.com/fokkezb/ticons-cli) with TiCons


## Rollbacking

Should you have any problem with the Alloy fork, you can rollback to the latest stable of Alloy using:

```
$ npm install -g alloy
```

## Installation

```sh
$ git clone git@github.com:vdesdoigts/alloy-bootstrap.git alloy-bootstrap
$ cd alloy-bootstrap
$ npm install
```

## Developement compilation commands

 * `grunt` - compiles the coffee and ltss files
 * `grunt ticons` - compiles icons, splashes and assets
 * `grunt dev_all` - compiles everything and cross-pushes to TiShadow android and iOS
 * `grunt [dev_android|dev_ios]` - auto compile and pushes with TiShadow
 * `grunt clean` - deletes all generated files

## Run on specifics devices

 * `grunt shell:iphone6`
 * `grunt shell:iphone7`
 * `grunt shell:ipad6`
 * `grunt shell:ipad7`


## Default configuration
 * TiCons assets - we use iOS 3@x high resolution intead of xxxhdpi android resolution
 * TiCons splashes - we use a 2024x2024 pixels image
 * Android custom theme at `platform/android/res/values/customtheme.xml`
    * hide ActionBar
    * add translucent property

## TiCons 0.7.0

 * Icons

    * Default behavior
    $ ticons icons
    `pwd`/app/assets/iphone/iTunesArtwork@2x
    iTunesArtwork@2x is a png image without ".png" extension. It must be in 2024x2024 pixels.

    * Generate specify icons for iOS
    $ ticons -a -p ios icons `pwd`/app/assets/iphone/iTunesArtwork@2x

    * Generate specify icons for Android
    $ ticons -a -p android icons `pwd`/app/assets/android/icon.png


 * Splashes

    * Default behavior
    $ ticons splashes
    /Users/vdesdoigts/Workspace/titanium/Alloy-Bootstrap/app/assets/iphone/Default-Portrait-736h@3x.png

    * Custom splash
    $ ticons -a splashes `pwd`/app/assets/splash-2024x2024.jpg --no-nine
    You can provide a 2024x2024 pixels image to create your splashes. Be careful to center your logo.


 * Assets

    * Default behavior
    $ ticons assets
    By default, TiCons will look for the best current resolution, at the moment is 'xxxhdpi' on `app/assets/android/images/`.
    If you dont't have or need this resolution, TiCons will automatically `Skipped higher dpi: android-res-xxxhdpi` and take the images at `app/assets/iphone/images/`.

    * Custom path example
    $ ticons -a assets `pwd`/app/assets/iphone/images/
    Sometimes we don't need the best resolution or we don't have the images.

### grunt clean task

 * If you use iOS 3@x high resolution, add this lines (by default):

    ```
    "!app/assets/iphone/images/*@3x.png",
    "!app/assets/iphone/images/*@3x.jpg",
    ```
 * If you use xxxhdpi default high resolution, add this lines instead:

    ```
    "!app/assets/android/images/xxxhdpi/*.png",
    "!app/assets/android/images/xxxhdpi/*.jpg",
    ```


### .gitignore config
@TODO
