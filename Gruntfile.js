module.exports = function(grunt) {
    grunt.initConfig({
        alloy: {
            android: {
                options: {
                    command:  'compile',
                    noColors: false,
                    config: 'platform=android'
                }
            },

            ios: {
                options: {
                    command:  'compile',
                    noColors: false,
                    config: 'platform=ios'
                }
            }
        },

        clean: {
            project: {
                src: [
                    "app/",
                    "build/",
                    "Resources/"
                ]
            },
            assets: {
                src: [
                    "iTunesConnect.png",
                    "GooglePlay.png",
                    "platform/**",
                    "app/assets/images",
                    "app/assets/iphone/**/*.png", "app/assets/iphone/**/*.jpg",
                    "!app/assets/iphone/images/*@3x.png", "!app/assets/iphone/images/*@3x.jpg",
                    "app/assets/android/images", "app/assets/android/**/*.png", "app/assets/android/**/*.jpg",
                    "!app/assets/android", "!app/assets/android/appicon.png",
                    "app/assets/iphone/iTunesArtwork",
                    "!app/assets/iphone/iTunesArtwork@2x",
                    "!app/assets/android/fonts/*",
                    "!app/assets/iphone/fonts/*"
                ]
            }
        },

        coffee: {
            options: {
                bare: true,
                sourceMap: false
            },
            compile: {
                files: [{
                    expand: true,
                    src: ["**/*.coffee"],
                    cwd: "src/",
                    dest: "app/",
                    ext: ".js"
                }]
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            all: {
                tasks: ['watch:precompile', 'watch:copy', 'watch:alloy_ios', 'watch:alloy_android', 'watch:ti_all']
            },
            ios: {
                tasks: ['watch:precompile', 'watch:copy', 'watch:alloy_ios', 'watch:ti_ios']
            },
            android: {
                tasks: ['watch:precompile', 'watch:copy', 'watch:alloy_android', 'watch:ti_android']
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: ["**/*.!(coffee|ltss)"],
                    cwd: 'src/',
                    dest: 'app/'
                }]
            }
        },

        ltss: {
            compile: {
                files: [{
                    expand: true,
                    src: ['**/*.ltss','!**/includes/**'],
                    cwd: 'src/styles',
                    dest: 'app/styles',
                    ext: '.tss'
                }]
            }
        },

        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            iphone6: {
                command: "titanium build -p ios -S 6.1 -Y iphone"
            },
            iphone7: {
                command: "titanium build -p ios -S 7.1 -Y iphone"
            },
            ipad6: {
                command: "titanium build -p ios -S 6.1 -Y ipad"
            },
            ipad7: {
                command: "titanium build -p ios -S 7.1 -Y ipad"
            },
            icons: {
                command: "ticons icons"
            },
            splashes: {
                command: "ticons -a splashes `pwd`/app/assets/splash-2024x2024.jpg --no-nine"
            },
            assets: {
                command: "ticons -a assets"
            }
        },

        tishadow: {
            options: {
                update: false,
            },
            run_android: {
                command: 'run',
                options: {
                    locale: 'en',
                    platform: 'android',
                    skipAlloyCompile: true
                }
            },
            run_ios:{
                command: 'run',
                options: {
                    locale: 'en',
                    platform: 'ios',
                    skipAlloyCompile: true
                }
            },
            run: {
                command: 'run',
                options: {
                    locale: 'en',
                    skipAlloyCompile: true
                }
            },
            spec_android: {
                command: 'spec',
                options: {
                    update: false,
                    platform: ['android'],
                }
            },
            spec_ios:{
                command: 'spec',
                options: {
                    update: false,
                    platform: ['ios'],
                }
            },
            clear: {
                command: 'clear',
                options: {}
            }
        },

        watch: {
            options: {
                spawn: false
            },

            copy: {
                files: ["src/**/*.xml", "src/**/*.tss", "src/**/*.js"],
                tasks: ['copy']
            },
            precompile: {
                files: ["src/**/*.ltss", "src/**/*.coffee"],
                tasks: ['build']
            },

            alloy_ios: {
                files: ["app/config.json", "app/**/*.js", "app/**/*.xml", "app/**/*.tss", "app/widgets/**/*.js", "app/widgets/**/*.tss", "app/widgets/**/*.xml"],
                tasks: ['alloy:ios']
            },
            ti_ios: {
                files: ["tiapp.xml", "i18n/**", "Resources/**"],
                tasks: ['tishadow:run_ios']
            },

            alloy_android: {
                files: ["app/config.json", "app/**/*.js", "app/**/*.xml", "app/**/*.tss", "app/widgets/**/*.js", "app/widgets/**/*.tss", "app/widgets/**/*.xml"],
                tasks: ['alloy:android']
            },
            ti_android: {
                files: ["tiapp.xml", "i18n/**", "Resources/**"],
                tasks: ['tishadow:run_android']
            },

            ti_all: {
                files: ["tiapp.xml", "i18n/**", "Resources/**"],
                tasks: ['tishadow:run']
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', 'build');
    grunt.registerTask('build', ['coffee', 'ltss']);
    grunt.registerTask('ticons', ['shell:icons', 'shell:splashes', 'shell:assets']);

    grunt.registerTask('dev_ios', ['build', 'copy', 'alloy:ios', 'tishadow:run_ios', 'concurrent:ios']);
    grunt.registerTask('dev_android', ['build', 'copy', 'alloy:android', 'tishadow:run_android', 'concurrent:android']);
    grunt.registerTask('dev_all', ['build', 'copy', 'alloy:android', 'alloy:ios', 'tishadow:run', 'concurrent:all']);

    // titanium cli tasks
    ['iphone6','iphone7','ipad6','ipad7','appstore','adhoc','playstore'].forEach(function(target) {
        grunt.registerTask(target, ['build','shell:'+target]);
    });

    // only modify changed file
    grunt.event.on('watch', function(action, filepath, target) {
        var newPath, o;
        o = {};

        if (filepath.indexOf('app/') === 0) {
            // restricts alloy compilation to changed files only
            grunt.config.set('alloy.ios.options.config', 'platform=ios,file=' + filepath);
            grunt.config.set('alloy.android.options.config', 'platform=android,file=' + filepath);
        } else if (filepath.indexOf('src/') === 0) {
            newPath = filepath.replace('src/', 'app/');
            if (filepath.match(/.coffee$/)) {
                newPath = newPath.replace('.coffee', '.js');
                o[newPath] = [filepath];
                grunt.config.set(["coffee", "compile", "files"], o);
                grunt.config.set(["ltss", "compile", "files"], []);
            } else if (filepath.match(/.ltss$/)) {
                newPath = newPath.replace('.ltss', '.tss');
                o[newPath] = [filepath];
                grunt.config.set(["ltss", "compile", "files"], o);
                return grunt.config.set(["coffee", "compile", "files"], []);
            } else {
                o[newPath] = [filepath];
                return grunt.config.set(["copy", "dist", "files"], o);
            }
        }
    });
};
