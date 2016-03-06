
/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'build',
    compile_dir: 'bin',

    /**
     * The environment settings are loaded here.
     * These settings should be kept in a private repository and the
     * environmentSettings.json file should be overwritten on private builds.
     *
     * The current environment is loaded into the current field.
     */
    build_configs: require("./environmentSettings.json"),

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
        jsunit: ['src/**/*.spec.js'],

        atpl: ['src/app/**/*.tpl.html'],
        ctpl: ['src/common/**/*.tpl.html', 'src/components/**/*.tpl.html'],

        html: ['src/index.html'],
        sass: ['src/sass/application.tpl.scss']
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
        jsWrapWithModule: [
            'vendor/momentjs/moment.js',
            'vendor/lodash/dist/lodash.js',

            'vendor/bowser/bowser.js',
            'vendor/humanize-duration/humanize-duration.js'
        ],
        js: [
            'vendor/jquery/dist/jquery.js',
            'vendor/angular/angular.js',

            'buildConfig/externalModule.js',


            // TODO: THIS IS TERRIBLE! REMOVE UI ASAP... OR AT LEAST ONLY INCLUDE RELEVANT COMPONENTS
            'vendor/jquery-ui/jquery-ui.js',

            // NOTE: bootstrap css imported in application.tpl.scss
            'vendor/sass-bootstrap/dist/js/bootstrap.js',
            'vendor/momentjs/moment.js',
            'vendor/angular-route/angular-route.js',
            'vendor/angular-resource/angular-resource.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js',

            // Don't know what depended on this - disabled because does not exist on disk or in bower
            //'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
            // TODO: the following line is dodgy and bloats the app
            'vendor/angular-ui-utils/ui-utils.js',
            'vendor/modernizr/modernizr.js',
            'vendor/lodash/dist/lodash.js',
            //'vendor/select2/select2.js',
            //'vendor/angular-ui-select2/src/select2.js'

            // This library is all split up - we are using the boneskull version atm,
            // but we started off using the deciphernic version
            'vendor/angular-tags/dist/angular-tags-0.3.1-tpls.js',

            'vendor/angular-sanitize/angular-sanitize.js',

            // draggabilly
            'vendor/classie/classie.js',
            'vendor/eventEmitter/EventEmitter.js',
            'vendor/eventie/eventie.js',
            'vendor/get-style-property/get-style-property.js',
            // get-size depends on get-style-property... it has to come after it
            'vendor/get-size/get-size.js',
            'vendor/draggabilly/draggabilly.js',

            'vendor/bowser/bowser.js',
            'vendor/angular-growl-v2/build/angular-growl.js',
            'vendor/angular-local-storage/dist/angular-local-storage.js',
            'vendor/humanize-duration/humanize-duration.js'

        ],
        css: [
            // NOTE: bootstrap css imported in application.tpl.scss

            'vendor/hint.css/hint.css',
            // TODO: remove bloat
            'vendor/jquery-ui/themes/redmond/jquery-ui.css',
            //'vendor/select2/select2-bootstrap.css',
            //'vendor/select2/select2.css'

            'vendor/angular-tags/dist/angular-tags-0.3.1.css',
            'vendor/angular-growl-v2/build/angular-growl.css'
        ],
        assets: [
            // jquery-ui is stoopid, special case
            function (template) {
                template.src = 'vendor/jquery-ui/themes/redmond/images/**';
                template.dest += "styles/images/";

                return template;
            }
        ]
    }
};
