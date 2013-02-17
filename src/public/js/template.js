(function() {
  this.JST || (this.JST = {});
  this.JST["template"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<span class="rb-close">close</span>\n<div class="rb-content">\n    <div class="wrap">\n        <h3>');
      
        __out.push(__sanitize(this.title));
      
        __out.push('</h3>\n\n        ');
      
        if (this.github) {
          __out.push('\n            <a href="');
          __out.push(__sanitize(this.github));
          __out.push('" target="_blank" class="github">');
          __out.push(__sanitize(this.github));
          __out.push('</a>\n        ');
        }
      
        __out.push('\n\n        <div class="scroll-pane">');
      
        __out.push(this.body);
      
        __out.push('</div>\n    </div>\n    ');
      
        if (this.image) {
          __out.push('\n        <img src="');
          __out.push(this.image);
          __out.push('" />\n    ');
        }
      
        __out.push('\n</div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
