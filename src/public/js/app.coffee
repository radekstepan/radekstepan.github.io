getItemLayoutProp = (item) ->
    scrollT = $(window).scrollTop()
    scrollL = $(window).scrollLeft()
    itemOffset = item.offset()
    {
        'left': itemOffset.left - scrollL
        'top': itemOffset.top - scrollT
        'width': item.outerWidth()
        'height': item.outerHeight()
    }

getWindowSize = ->
    $('body').css 'overflow-y', 'hidden'
    w = $(window).width()
    h = $(window).height()
    $('body').css 'overflow-y', 'auto' if @current is -1
    {
        'width': w
        'height': h
    }

class App
    
    transitions:
        WebkitTransition: 'webkitTransitionEnd'
        MozTransition: 'transitionend'
        OTransition: 'oTransitionEnd'
        msTransition: 'MSTransitionEnd'
        transition: 'transitionend'

    current: -1

    finished: true

    initialize: ->
        @winsize = getWindowSize()

        # Calculate the height available to the grid.
        height = @winsize.height
        $('.notgrid').each (i, el) -> height -= $(el).outerHeight()

        # jScrollPane for the listing.
        (scroll = $('#main .main-scroll-pane')).css 'height', height
        scroll.jScrollPane()

        @items = $('#rb-grid > li')

        @transEndEventName = @transitions[Modernizr.prefixed('transition')]

        # Apply fittext plugin.
        @items.find('div.rb-content > div span').fitText(0.3).end().find('span.rb-city').fitText(0.5)

        # Init events.
        @items.each @initEvent

        # Init category handling.
        $('nav#categories a').click @switchCategory
    
    switchCategory: (e) =>
        # Reset all current categories.
        $('nav#categories a').removeClass('current')

        # Add class to our category.
        (t = $(e.target)).addClass('current')

        # Get the new category.
        cat = t.attr('data-category')

        @items.each (i, el) ->
            el = $(el)
            if cat in el.attr('data-category').split(',')
                el.removeClass('disabled').animate { 'opacity': 1 }, 500
            else
                el.addClass('disabled').animate { 'opacity': 0.1 }, 500

    initEvent: (i, el) =>
        item = $(el)
        
        # On open.
        item.on 'click', (e) =>
            @onOpen item, e

        # On close.
        $(document).keyup (e) => if e.keyCode is 27 then @onClose item

    onOpen: (item, e) =>
        # Are we clicking inside the content?
        return if $(e.target).closest('.rb-content').length

        # Do nothing if already expanded.
        return false if item.data('isExpanded')
        
        # Do nothing unless previous close animation finished.
        return false unless @finished

        # Do nothing if we are disabled.
        return false if item.hasClass 'disabled'

        # Set as expanded.
        item.data 'isExpanded', true

        @current = item.index()

        # Hide the URL.
        item.data 'url', (link = item.find('a.link')).attr('href')
        link.removeAttr 'href'

        # Have we loaded this object already?
        if item.data('isLoaded') then @showDetail item
        # Load the template first, then show detail.
        else @loadTemplate item, @showDetail

    showDetail: (item) =>
        overlay = item.find('.rb-overlay')
        layoutProp = getItemLayoutProp(item)
        clipPropFirst = "rect(#{layoutProp.top}px #{layoutProp.left + layoutProp.width}px #{layoutProp.top + layoutProp.height}px #{layoutProp.left}px)"
        clipPropLast = "rect(0px #{@winsize.width}px #{@winsize.height}px 0px)"

        overlay.css
            transformOrigin: "#{layoutProp.left}px #{layoutProp.top}px"
            clip: (if Modernizr.csstransitions then clipPropFirst else clipPropLast)
            transform: (if Modernizr.csstransitions then 'rotate(45deg)' else 'none')
            opacity: 1
            zIndex: 9999
            pointerEvents: 'auto'

        if Modernizr.csstransitions
            overlay.on @transEndEventName, =>
                overlay.off @transEndEventName
                setTimeout (=>
                    overlay.css(
                        clip: clipPropLast
                        transform: 'rotate(0deg)'
                    ).on @transEndEventName, =>
                        overlay.off @transEndEventName
                        $('body').css 'overflow-y', 'hidden'
                ), 25

        else
            $('body').css 'overflow-y', 'hidden'

    onClose: (item) =>
        $('body').css 'overflow-y', 'auto'
        
        layoutProp = getItemLayoutProp(item)
        clipPropFirst = "rect(#{layoutProp.top}px #{layoutProp.left + layoutProp.width}px #{layoutProp.top + layoutProp.height}px #{layoutProp.left}px)"
        clipPropLast = 'auto'
        
        # Reset.
        @current = -1

        overlay = item.find('.rb-overlay')
        overlay.css
            clip: (if Modernizr.csstransitions then clipPropFirst else clipPropLast)
            opacity: (if Modernizr.csstransitions then 1 else 0)
            pointerEvents: 'none'

        @finished = false
        if Modernizr.csstransitions
            overlay.on @transEndEventName, =>
                overlay.off @transEndEventName
                setTimeout (=>
                    overlay.css('opacity', 0).on @transEndEventName, =>
                        overlay.off(@transEndEventName).css
                            clip: clipPropLast
                            zIndex: -1
                        # We closed.
                        item.data 'isExpanded', false
                        @finished = true
                        # Show the URL.
                        item.find('a.link').attr('href', item.data('url'))
                ), 25

        else
            overlay.css 'z-index', -1
            # We closed.
            item.data 'isExpanded', false
            @finished = true
            # Show the URL.
            item.find('a.link').attr('href', item.data('url'))

    loadTemplate: (item, cb) =>
        overlay = item.find('.rb-overlay')
        url = item.data('url')

        # TODO: Show a loading sign.

        # Load the content.
        $.getJSON url, (data, textStatus, jqXHR) =>
            # Populate the item with the template.
            overlay.html html = window.JST.template data

            # Make all links open in external window.
            overlay.find('a:not(.github)').attr('target', '_blank')

            # jScrollPane.
            height = @winsize.height - 500
            if height < 100 then height = 100
            overlay.find('.scroll-pane').css('height', height).jScrollPane()

            # Attach on close handler.
            item.find('span.rb-close').click => @onClose item

            # Say this object is loaded.
            item.data 'isLoaded', true
            
            # TODO: Hide loading sign.
            
            # Say we are done.
            cb item

@App = App