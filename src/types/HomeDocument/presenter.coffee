{ blað } = require 'blad'

class exports.HomeDocument extends blað.Type

    render: (done) ->
        # ROT13 the email address.
        @email = @email.replace(/[a-zA-Z]/g, (c) ->
            String.fromCharCode (if ((if c <= "Z" then 90 else 122)) >= (c = c.charCodeAt(0) + 13) then c else c - 26)
        ) if @email?

        # Get all the public projects.
        @projects = []
        for ch in @children(1) when ch.public?
            # Make sure we match on type.
            if ch.type is 'ProjectDocument'
                # Remove clutter.
                ( delete ch[key] for key in [ 'body', 'image', 'github' ] )
                # Consolidate the categories.
                ch.categories = []
                for cat in [ 'all', 'js', 'html', 'prolog', 'python', 'php' ]
                    if ch["category-#{cat}"] then ch.categories.push cat
                # Push it.
                @projects.push ch

        done @