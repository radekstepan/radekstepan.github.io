{ blað } = require 'blad'

class exports.HomeDocument extends blað.Type

    render: (done) ->
        # Get all the public projects.
        @projects = []
        for ch in @children(1) when ch.public?
            # Make sure we match on type.
            if ch.type is 'ProjectDocument'
                # Remove clutter.
                ( delete ch[key] for key in [ 'body', 'image', 'github' ] )
                # Consolidate the categories.
                ch.categories = []
                for cat in [ 'all', 'js', 'html', 'python', 'php' ]
                    if ch["category-#{cat}"] then ch.categories.push cat
                # Push it.
                @projects.push ch

        done @