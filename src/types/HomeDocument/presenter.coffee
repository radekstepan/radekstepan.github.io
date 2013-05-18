{ blað } = require 'blad'

class exports.HomeDocument extends blað.Type

    render: (done) ->
        # ROT13 the email address.
        @email = @email.replace(/[a-zA-Z]/g, (c) ->
            String.fromCharCode (if ((if c <= "Z" then 90 else 122)) >= (c = c.charCodeAt(0) + 13) then c else c - 26)
        ) if @email?

        # Get all the public projects.
        @projects = []
        for ch in @children(1) when ch.public and ch.type is 'ProjectDocument'
            # Remove clutter.
            ( delete ch[key] for key in [ 'body', 'image', 'github' ] )
            # Consolidate the categories.
            ch.categories = []
            for cat in [ 'all', 'js', 'html', 'prolog', 'python', 'php' ]
                if ch["category-#{cat}"] then ch.categories.push cat
            # Push it.
            @projects.push ch

        # Sort projects on the "date".
        @projects.sort (a, b) ->
            if a.date > b.date then -1
            else
                if a.date is b.date
                    a.title.localeCompare(b.title)
                else
                    1

        done @