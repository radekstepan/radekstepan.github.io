module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        stylus:
            compile:
                src: [
                    'css/style.styl'
                ]
                dest: 'css/style.css'

    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.registerTask('default', [
        'stylus'
    ])