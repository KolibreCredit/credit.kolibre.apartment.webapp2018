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
                    'www/agreement.html',
                    'www/agreement2.html',
                    'www/answer.html',
                    'www/anzhi.html',
                    'www/apply1.html',
                    'www/apply2.html',
                    'www/apply3.html',
                    'www/apply4.html',
                    'www/apply5.html',
                    'www/apply51.html',
                    'www/appointment2.html',
                    'www/baoji.html',
                    'www/baoxiu.html',
                    'www/baoxiu2.html',
                    'www/beijingyuju.html',
                    'www/bill.html',
                    'www/billView.html',
                    'www/boke.html',
                    'www/checkout.html',
                    'www/config.html',
                    'www/config1.html',
                    'www/config2.html',
                    'www/confirmTenant.html',
                    'www/confirmTenant1.html',
                    'www/confirmTenant2.html',
                    'www/contractResults.html',
                    'www/credit.html',
                    'www/default.html',
                    'www/detail2.html',
                    'www/detail21.html',
                    'www/editorMobile.html',
                    'www/editorMobile2.html',
                    'www/editorVerify.html',
                    'www/ehomey.html',
                    'www/ezhu.html',
                    'www/ezu.html',
                    'www/fuwu.html',
                    'www/goods.html',
                    'www/index.html',
                    'www/instalment.html',
                    'www/instalmentResults.html',
                    'www/kangdou.html',
                    'www/lease.html',
                    'www/lefull.html',
                    'www/list.html',
                    'www/list2.html',
                    'www/login.html',
                    'www/login2.html',
                    'www/login3.html',
                    'www/luhui.html',
                    'www/map.html',
                    'www/mikongjian.html',
                    'www/modou.html',
                    'www/mozu.html',
                    'www/nex.html',
                    'www/photo.html',
                    'www/precreate.html',
                    'www/qcode.html',
                    'www/qingcheng.html',
                    'www/qnh.html',
                    'www/recognitionface.html',
                    'www/register.html',
                    'www/reserve.html',
                    'www/resetPassword.html',
                    'www/settlement.html',
                    'www/suonatel.html',
                    'www/tousu.html',
                    'www/user.html',
                    'www/user1.html',
                    'www/verify.html',
                    'www/verify2.html',
                    'www/view.html',
                    'www/viewbaoji.html',
                    'www/viewbaoxiu.html',
                    'www/viewOrders.html',
                    'www/viewtousu.html',
                    'www/webpay.html',
                    'www/weilaiyu.html',
                    'www/xishe.html',
                    'www/yifangtiandi.html',
                    'www/yuanlai.html',
                    'www/yuju.html',
                    'www/zhongyu.html'
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
                        from: 'https://kc-talos.fengniaowu.com:4431',
                        to: 'https://kc-fengniaowu-talos.dev.kolibre.credit'
                    },
                    {
                        from: 'wx4a172ee460dacedd',
                        to: 'wxa74d300625108685'
                    },
                    {
                        from: 'https://m.fengniaowu.com/webpay.html?orderId={0}',
                        to: 'https://dev.fengniaowu.com/webpay.html?orderId={0}'
                    }
                ]
            },
            product: {
                src: ['www/script/constants.js'],
                overwrite: true,
                replacements: [
                    {
                        from: 'https://kc-fengniaowu-talos.dev.kolibre.credit',
                        to: 'https://kc-talos.fengniaowu.com:4431'
                    },
                    {
                        from: 'wxa74d300625108685',
                        to: 'wx4a172ee460dacedd'
                    },
                    {
                        from: 'https://dev.fengniaowu.com/webpay.html?orderId={0}',
                        to: 'https://m.fengniaowu.com/webpay.html?orderId={0}'
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