# Handle window resize (when looking at a detail).
$event = $.event
resizeTimeout = undefined
$special = $event.special.debouncedresize =
    setup: -> $(this).on 'resize', $special.handler
    teardown: -> $(this).off 'resize', $special.handler
    handler: (event, execAsap) ->
        context = this
        args = arguments
        dispatch = ->
            event.type = 'debouncedresize'
            $event.dispatch.apply context, args
        clearTimeout resizeTimeout if resizeTimeout
        (if execAsap then dispatch() else resizeTimeout = setTimeout(dispatch, $special.threshold))
    threshold: 50

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

    initialize: ->
        @items = $('#rb-grid > li')

        @transEndEventName = @transitions[Modernizr.prefixed('transition')]
        @winsize = getWindowSize()

        # Apply fittext plugin.
        @items.find('div.rb-week > div span').fitText(0.3).end().find('span.rb-city').fitText(0.5)
        
        # Init events.
        @items.each @initEvent

        # On window resize.
        $(window).on 'debouncedresize', =>
            @winsize = getWindowSize()
            if @current isnt -1
                @items.eq(@current).children('div.rb-overlay')
                .css('clip', "rect(0px #{@winsize.width}px #{@winsize.height}px 0px)")
    
    initEvent: (i, el) =>
        item = $(el)
        overlay = item.children('div.rb-overlay')
        
        # On open.
        item.on 'click', =>
            # Do nothing if already expanded.
            return false if item.data('isExpanded')
            # Set as expanded.
            item.data 'isExpanded', true

            @current = item.index()

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
                overlay.on @transEndEventName, ->
                    overlay.off @transEndEventName
                    setTimeout (->
                        overlay.css(
                            clip: clipPropLast
                            transform: 'rotate(0deg)'
                        ).on @transEndEventName, ->
                            overlay.off @transEndEventName
                            $('body').css 'overflow-y', 'hidden'

                    ), 25

            else
                $('body').css 'overflow-y', 'hidden'

        # On close.
        item.find('span.rb-close').on 'click', =>
            $('body').css 'overflow-y', 'auto'
            
            layoutProp = getItemLayoutProp(item)
            clipPropFirst = "rect(#{layoutProp.top}px #{layoutProp.left + layoutProp.width}px #{layoutProp.top + layoutProp.height}px #{layoutProp.left}px)"
            clipPropLast = 'auto'
            
            # reset @current
            @current = -1
            overlay.css
                clip: (if Modernizr.csstransitions then clipPropFirst else clipPropLast)
                opacity: (if Modernizr.csstransitions then 1 else 0)
                pointerEvents: 'none'

            if Modernizr.csstransitions
                overlay.on @transEndEventName, =>
                    overlay.off @transEndEventName
                    setTimeout (=>
                        overlay.css('opacity', 0).on @transEndEventName, ->
                            overlay.off(@transEndEventName).css
                                clip: clipPropLast
                                zIndex: -1
                            # We closed.
                            item.data 'isExpanded', false
                    ), 25

            else
                overlay.css 'z-index', -1
                # We closed.
                item.data 'isExpanded', false

@App = App