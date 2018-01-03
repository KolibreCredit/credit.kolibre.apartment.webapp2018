'use strict';

module.exports = function (grunt) {
    grunt.file.preserveBOM = true;
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer: {
            options: {
                browsers: ['last 3 versions', 'ie 8', 'ie 9', '> 5% in CN']
            },
            app: {
                src: ['www/css/**/*.css', '!./www/css/**/*.min.css']
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commit: false,
                commitMessage: '%VERSION%',
                commitFiles: ['package.json'],
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        exec: {
            options: {
                stdout: true,
                stderr: true
            },
            npmInstall: {
                command: 'npm install'
            },
            npmUpdate: {
                command: 'npm update --save-dev'
            }
        },
        mbower: {
            copy: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                    copy: true,
                    install: false,
                    targetDir: './www/packages/'
                }
            },
            clean: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                    copy: false,
                    install: false,
                    targetDir: './www/packages/'
                }
            },
            install: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                    copy: true,
                    install: true,
                    targetDir: './www/packages/'
                }
            }
        },
        replace: {
            ver: {
                src: [
                    'www/answer.html',
                    'www/apply1.html',
                    'www/apply2.html',
                    'www/apply3.html',
                    'www/apply4.html',
                    'www/bill.html',
                    'www/bill2.html',
                    'www/boke.html',
                    'www/contractChange.html',
                    'www/credit.html',
                    'www/house.html',
                    'www/house1.html',
                    'www/house1boke.html',
                    'www/house1kangdou.html',
                    'www/house1nex.html',
                    'www/house1qiannianhui.html',
                    'www/house1yuju.html',
                    'www/house2.html',
                    'www/houseboke.html',
                    'www/housekangdou.html',
                    'www/housemozu.html',
                    'www/houseyuju.html',
                    'www/index.html',
                    'www/kangdou.html',
                    'www/lease.html',
                    'www/list.html',
                    'www/list2.html',
                    'www/login.html',
                    'www/loginv2.html',
                    'www/month.html',
                    'www/monthboke.html',
                    'www/monthkangdou.html',
                    'www/mozu.html',
                    'www/photo.html',
                    'www/register.html',
                    'www/resetPassword.html',
                    'www/user.html',
                    'www/verify.html',
                    'www/verify2.html',
                    'www/view.html',
                    'www/yuju.html'
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /ver=[0-9]{2}.[0-9]{1,2}.[0-9]{3}/g,
                        to: 'ver=<%= pkg.version %>'
                    }
                ]
            },
            test: {
                src: ['www/script/constants.js'],
                overwrite: true,
                replacements: [
                    {
                        from: 'http://server-apartment.kolibre.credit',
                        to: 'http://server-apartment.dev.kolibre.credit'
                    },
                    {
                        from: 'http://m.fengniaowu.com',
                        to: 'http://test.fengniaowu.com'
                    }
                ]
            },
            product: {
                src: ['www/script/constants.js'],
                overwrite: true,
                replacements: [
                    {
                        from: 'http://server-apartment.dev.kolibre.credit',
                        to: 'http://server-apartment.kolibre.credit'
                    },
                    {
                        from: 'http://test.fengniaowu.com',
                        to: 'http://m.fengniaowu.com'
                    }
                ]
            }
        },
        less: {
            build: {
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "www/css/base/moe-ui.less": "www/less/base/moe-ui.css"
                }
            }
        },
        jshint: {
            all: [
                'www/js/**/*.js'
            ],
            options: {
                browser: true,
                devel: true
            }
        },
        uglify: {
            main: {
                options: {
                    mangle: {
                        except: ["jquery", "lodash", "moment", "bootstrap"]
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: "dist/release/script",
                        src: "**/*.js",
                        dest: "dist/release/script"
                    },
                    {
                        expand: true,
                        cwd: "dist/test/script",
                        src: "**/*.js",
                        dest: "dist/test/script"
                    }
                ]
            }
        },
        watch: {
            less: {
                files: ['www/less/**/*.less'],
                tasks: ['less'],
                options: {livereload: false}
            },
            dev: {
                files: ['www/js/**/*.js'],
                tasks: ['dev']
            }
        },
        clean: {
            build: ['dist']
        },
        copy: {
            options: {
                timestamp: true
            },
            deploy: {
                expand: true,
                cwd: 'www/',
                src: ['**/*'],
                dest: 'dist/release/'
            },
            test: {
                expand: true,
                cwd: 'www/',
                src: ['**/*'],
                dest: 'dist/test/'
            }
        }
    });

    grunt.registerTask('default', ['watch:dev', 'watch:less']);
    grunt.registerTask('less', ['less:build']);

    grunt.registerTask('dev', ['dev-js']);
    grunt.registerTask('dev-js', ['jshint:all']);

    grunt.registerTask('prepare', ['exec:npmUpdate', 'mbower:clean', 'mbower:install']);

    grunt.registerTask('pre-dev-build', ['replace:dev']);
    grunt.registerTask('pre-test-build', ['replace:test']);
    grunt.registerTask('pre-product-build', ['replace:product']);

    grunt.registerTask('ver', ['bump', 'replace:ver']);
    grunt.registerTask('to-dev', ['pre-dev-build']);
    grunt.registerTask('to-test', ['pre-test-build']);
    grunt.registerTask('to-product', ['pre-product-build']);

    grunt.registerTask('build', ['dev', 'clean', 'ver', 'to-test', 'copy:test', 'to-product', 'copy:deploy', 'to-test']);
    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
    require('time-grunt')(grunt);
};