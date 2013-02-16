// Generated by CoffeeScript 1.4.0
(function() {
  var App, getItemLayoutProp, getWindowSize,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  getItemLayoutProp = function(item) {
    var itemOffset, scrollL, scrollT;
    scrollT = $(window).scrollTop();
    scrollL = $(window).scrollLeft();
    itemOffset = item.offset();
    return {
      left: itemOffset.left - scrollL,
      top: itemOffset.top - scrollT,
      width: item.outerWidth(),
      height: item.outerHeight()
    };
  };

  getWindowSize = function() {
    var h, w;
    $('body').css('overflow-y', 'hidden');
    w = $(window).width();
    h = $(window).height();
    if (this.current === -1) {
      $('body').css('overflow-y', 'auto');
    }
    return {
      width: w,
      height: h
    };
  };

  App = (function() {

    function App() {
      this.initEvent = __bind(this.initEvent, this);

    }

    App.prototype.transitions = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd',
      msTransition: 'MSTransitionEnd',
      transition: 'transitionend'
    };

    App.prototype.current = -1;

    App.prototype.initialize = function() {
      this.items = $('#rb-grid > li');
      this.transEndEventName = this.transitions[Modernizr.prefixed('transition')];
      this.winsize = getWindowSize();
      this.items.find('div.rb-content > div span').fitText(0.3).end().find('span.rb-city').fitText(0.5);
      return this.items.each(this.initEvent);
    };

    App.prototype.initEvent = function(i, el) {
      var item, overlay,
        _this = this;
      item = $(el);
      overlay = item.children('div.rb-overlay');
      item.on('click', function(e) {
        var clipPropFirst, clipPropLast, layoutProp;
        if ($(e.target).closest('.rb-content').length) {
          return;
        }
        if (item.data('isExpanded')) {
          return false;
        }
        item.data('isExpanded', true);
        _this.current = item.index();
        layoutProp = getItemLayoutProp(item);
        clipPropFirst = "rect(" + layoutProp.top + "px " + (layoutProp.left + layoutProp.width) + "px " + (layoutProp.top + layoutProp.height) + "px " + layoutProp.left + "px)";
        clipPropLast = "rect(0px " + _this.winsize.width + "px " + _this.winsize.height + "px 0px)";
        overlay.css({
          transformOrigin: "" + layoutProp.left + "px " + layoutProp.top + "px",
          clip: (Modernizr.csstransitions ? clipPropFirst : clipPropLast),
          transform: (Modernizr.csstransitions ? 'rotate(45deg)' : 'none'),
          opacity: 1,
          zIndex: 9999,
          pointerEvents: 'auto'
        });
        if (Modernizr.csstransitions) {
          return overlay.on(_this.transEndEventName, function() {
            overlay.off(this.transEndEventName);
            return setTimeout((function() {
              return overlay.css({
                clip: clipPropLast,
                transform: 'rotate(0deg)'
              }).on(this.transEndEventName, function() {
                overlay.off(this.transEndEventName);
                return $('body').css('overflow-y', 'hidden');
              });
            }), 25);
          });
        } else {
          return $('body').css('overflow-y', 'hidden');
        }
      });
      return item.find('span.rb-close').on('click', function() {
        var clipPropFirst, clipPropLast, layoutProp;
        $('body').css('overflow-y', 'auto');
        layoutProp = getItemLayoutProp(item);
        clipPropFirst = "rect(" + layoutProp.top + "px " + (layoutProp.left + layoutProp.width) + "px " + (layoutProp.top + layoutProp.height) + "px " + layoutProp.left + "px)";
        clipPropLast = 'auto';
        _this.current = -1;
        overlay.css({
          clip: (Modernizr.csstransitions ? clipPropFirst : clipPropLast),
          opacity: (Modernizr.csstransitions ? 1 : 0),
          pointerEvents: 'none'
        });
        if (Modernizr.csstransitions) {
          return overlay.on(_this.transEndEventName, function() {
            overlay.off(_this.transEndEventName);
            return setTimeout((function() {
              return overlay.css('opacity', 0).on(_this.transEndEventName, function() {
                overlay.off(this.transEndEventName).css({
                  clip: clipPropLast,
                  zIndex: -1
                });
                return item.data('isExpanded', false);
              });
            }), 25);
          });
        } else {
          overlay.css('z-index', -1);
          return item.data('isExpanded', false);
        }
      });
    };

    return App;

  })();

  this.App = App;

}).call(this);
