// Generated by CoffeeScript 1.4.0
(function() {
  var App, getItemLayoutProp, getWindowSize,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
      this.loadTemplate = __bind(this.loadTemplate, this);

      this.onClose = __bind(this.onClose, this);

      this.showDetail = __bind(this.showDetail, this);

      this.onOpen = __bind(this.onOpen, this);

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

    App.prototype.finished = true;

    App.prototype.initialize = function() {
      this.items = $('#rb-grid > li');
      this.transEndEventName = this.transitions[Modernizr.prefixed('transition')];
      this.winsize = getWindowSize();
      this.items.find('div.rb-content > div span').fitText(0.3).end().find('span.rb-city').fitText(0.5);
      $('.scroll-pane').jScrollPane();
      this.items.each(this.initEvent);
      return $('nav#categories a').click(this.switchCategory);
    };

    App.prototype.switchCategory = function(e) {
      var cat, t;
      $('nav#categories a').removeClass('current');
      (t = $(e.target)).addClass('current');
      cat = t.attr('data-category');
      return $('ul#rb-grid li').each(function(i, el) {
        el = $(el);
        if (__indexOf.call(el.attr('data-category').split(','), cat) >= 0) {
          return el.removeClass('disabled').animate({
            'opacity': 1
          }, 500);
        } else {
          return el.addClass('disabled').animate({
            'opacity': 0.1
          }, 500);
        }
      });
    };

    App.prototype.initEvent = function(i, el) {
      var item,
        _this = this;
      item = $(el);
      item.on('click', function(e) {
        return _this.onOpen(item, e);
      });
      return $(document).keyup(function(e) {
        if (e.keyCode === 27) {
          return _this.onClose(item);
        }
      });
    };

    App.prototype.onOpen = function(item, e) {
      var link;
      if ($(e.target).closest('.rb-content').length) {
        return;
      }
      if (item.data('isExpanded')) {
        return false;
      }
      if (!this.finished) {
        return false;
      }
      if (item.hasClass('disabled')) {
        return false;
      }
      item.data('isExpanded', true);
      this.current = item.index();
      item.data('url', (link = item.find('a.link')).attr('href'));
      link.removeAttr('href');
      if (item.data('isLoaded')) {
        return this.showDetail(item);
      } else {
        return this.loadTemplate(item, this.showDetail);
      }
    };

    App.prototype.showDetail = function(item) {
      var clipPropFirst, clipPropLast, layoutProp, overlay,
        _this = this;
      overlay = item.find('.rb-overlay');
      layoutProp = getItemLayoutProp(item);
      clipPropFirst = "rect(" + layoutProp.top + "px " + (layoutProp.left + layoutProp.width) + "px " + (layoutProp.top + layoutProp.height) + "px " + layoutProp.left + "px)";
      clipPropLast = "rect(0px " + this.winsize.width + "px " + this.winsize.height + "px 0px)";
      overlay.css({
        transformOrigin: "" + layoutProp.left + "px " + layoutProp.top + "px",
        clip: (Modernizr.csstransitions ? clipPropFirst : clipPropLast),
        transform: (Modernizr.csstransitions ? 'rotate(45deg)' : 'none'),
        opacity: 1,
        zIndex: 9999,
        pointerEvents: 'auto'
      });
      if (Modernizr.csstransitions) {
        return overlay.on(this.transEndEventName, function() {
          overlay.off(_this.transEndEventName);
          return setTimeout((function() {
            return overlay.css({
              clip: clipPropLast,
              transform: 'rotate(0deg)'
            }).on(_this.transEndEventName, function() {
              overlay.off(_this.transEndEventName);
              return $('body').css('overflow-y', 'hidden');
            });
          }), 25);
        });
      } else {
        return $('body').css('overflow-y', 'hidden');
      }
    };

    App.prototype.onClose = function(item) {
      var clipPropFirst, clipPropLast, layoutProp, overlay,
        _this = this;
      $('body').css('overflow-y', 'auto');
      layoutProp = getItemLayoutProp(item);
      clipPropFirst = "rect(" + layoutProp.top + "px " + (layoutProp.left + layoutProp.width) + "px " + (layoutProp.top + layoutProp.height) + "px " + layoutProp.left + "px)";
      clipPropLast = 'auto';
      this.current = -1;
      overlay = item.find('.rb-overlay');
      overlay.css({
        clip: (Modernizr.csstransitions ? clipPropFirst : clipPropLast),
        opacity: (Modernizr.csstransitions ? 1 : 0),
        pointerEvents: 'none'
      });
      this.finished = false;
      if (Modernizr.csstransitions) {
        return overlay.on(this.transEndEventName, function() {
          overlay.off(_this.transEndEventName);
          return setTimeout((function() {
            return overlay.css('opacity', 0).on(_this.transEndEventName, function() {
              overlay.off(_this.transEndEventName).css({
                clip: clipPropLast,
                zIndex: -1
              });
              item.data('isExpanded', false);
              _this.finished = true;
              return item.find('a.link').attr('href', item.data('url'));
            });
          }), 25);
        });
      } else {
        overlay.css('z-index', -1);
        item.data('isExpanded', false);
        this.finished = true;
        return item.find('a.link').attr('href', item.data('url'));
      }
    };

    App.prototype.loadTemplate = function(item, cb) {
      var overlay, url,
        _this = this;
      overlay = item.find('.rb-overlay');
      url = item.data('url');
      return $.getJSON(url, function(data, textStatus, jqXHR) {
        var html;
        overlay.html(html = window.JST.template(data));
        item.find('span.rb-close').click(function() {
          return _this.onClose(item);
        });
        item.data('isLoaded', true);
        return cb(item);
      });
    };

    return App;

  })();

  this.App = App;

}).call(this);
