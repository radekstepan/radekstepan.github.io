# # Handle window resize (when looking at a detail).
# $event = $.event
# resizeTimeout = undefined
# $special = $event.special.debouncedresize =
#     setup: -> $(this).on 'resize', $special.handler
#     teardown: -> $(this).off 'resize', $special.handler
#     handler: (event, execAsap) ->
#         context = this
#         args = arguments
#         dispatch = ->
#             event.type = 'debouncedresize'
#             $event.dispatch.apply context, args
#         clearTimeout resizeTimeout if resizeTimeout
#         (if execAsap then dispatch() else resizeTimeout = setTimeout(dispatch, $special.threshold))
#     threshold: 50

getItemLayoutProp = (item) ->
    scrollT = $(window).scrollTop()
    scrollL = $(window).scrollLeft()
    itemOffset = item.offset()
    left: itemOffset.left - scrollL
    top: itemOffset.top - scrollT
    width: item.outerWidth()
    height: item.outerHeight()

getWindowSize = ->
    $('body').css 'overflow-y', 'hidden'
    w = $(window).width()
    h = $(window).height()
    $('body').css 'overflow-y', 'auto'    if @current is -1
    width: w
    height: h

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
        @items = $('#rb-grid > li')

        @transEndEventName = @transitions[Modernizr.prefixed('transition')]
        @winsize = getWindowSize()

        # Apply fittext plugin.
        @items.find('div.rb-content > div span').fitText(0.3).end().find('span.rb-city').fitText(0.5)
        
        # jScrollPane.
        $('.scroll-pane').jScrollPane()

        # Init events.
        @items.each @initEvent

        # # On window resize.
        # $(window).on 'debouncedresize', =>
        #     @winsize = getWindowSize()
        #     if @current isnt -1
        #         @items.eq(@current).children('div.rb-overlay')
        #         .css('clip', "rect(0px #{@winsize.width}px #{@winsize.height}px 0px)")

        # Init category handling.
        $('nav#categories a').click @switchCategory
    
    switchCategory: (e) ->
        # Reset all current categories.
        $('nav#categories a').removeClass('current')

        # Add class to our category.
        (t = $(e.target)).addClass('current')

        # Get the new category.
        cat = t.attr('data-category')

        $('ul#rb-grid li').each (i, el) ->
            el = $(el)
            if cat in el.attr('data-category').split(',')
                el.removeClass('disabled')
            else
                el.addClass('disabled')

    initEvent: (i, el) =>
        item = $(el)
        
        # On open.
        item.on 'click', (e) => @onOpen item, e

        # On close.
        item.find('span.rb-close').on 'click', => @onClose item
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

        overlay = item.children('div.rb-overlay')
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

        overlay = item.children('div.rb-overlay')
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
                ), 25

        else
            overlay.css 'z-index', -1
            # We closed.
            item.data 'isExpanded', false
            @finished = true

@App = App