window.fn = {};

// Captions for post images.
(fn.captions = function() {
  $('#post .body p img')
  .parent()
  .contents()
  .filter(function() {
    return this.nodeType == 3; // Node.TEXT_NODE
  })
  .replaceWith(function() {
    return $('<div/>', {
      'class': 'caption',
      'text': $.trim(this.data)
    });
  });
})();

// Time ago.
(fn.ago = function() {
  $('.date').text(function(i, val) {
    return moment(val).fromNow();
  });
})();

// Search.
(function() {
  var el = $('#search'),
      visible = false;
  
  el.find('.close').on('click', function() {
    el.removeClass('visible');
    visible = false;
  });

  window.onkeypress = function(evt) {
    var input = evt.target.tagName.match(/input/i);
    switch(evt.which) {
      // Q.
      case 113:
        if (!input) {
          el.toggleClass('visible');
          visible = !visible;
          if (visible) {
            setTimeout(function() {
              el.find('input').focus();
            }, 250);
          }
        }
        break;
      // Enter.
      case 13:
        if (input) {
          var q = encodeURIComponent(
            evt.target.value
            .replace(/ +/g, '-')
            .toLowerCase()
          );
          if (q.length) {
            window.location.href = '/search.html?q=' + q;
          }
        }
        break;
    }
  };
})();