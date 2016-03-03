var tpl = function (_swig,_ctx,_filters,_utils,_fn
/**/) {
  var _ext = _swig.extensions,
    _output = "";
_output += "<ul id=\"posts\">\n  ";
(function () {
  var __l = (((typeof _ctx.related !== "undefined" && _ctx.related !== null) ? ((typeof _ctx.related !== "undefined" && _ctx.related !== null) ? _ctx.related : "") : ((typeof related !== "undefined" && related !== null) ? related : "")) !== null ? ((typeof _ctx.related !== "undefined" && _ctx.related !== null) ? ((typeof _ctx.related !== "undefined" && _ctx.related !== null) ? _ctx.related : "") : ((typeof related !== "undefined" && related !== null) ? related : "")) : "" )||(((typeof _ctx.posts !== "undefined" && _ctx.posts !== null) ? ((typeof _ctx.posts !== "undefined" && _ctx.posts !== null) ? _ctx.posts : "") : ((typeof posts !== "undefined" && posts !== null) ? posts : "")) !== null ? ((typeof _ctx.posts !== "undefined" && _ctx.posts !== null) ? ((typeof _ctx.posts !== "undefined" && _ctx.posts !== null) ? _ctx.posts : "") : ((typeof posts !== "undefined" && posts !== null) ? posts : "")) : "" ), __len = (_utils.isArray(__l) || typeof __l === "string") ? __l.length : _utils.keys(__l).length;
  if (!__l) { return; }
    var _ctx__loopcache08711438232567161 = { loop: _ctx.loop, post: _ctx.post, __k: _ctx.__k };
    _ctx.loop = { first: false, index: 1, index0: 0, revindex: __len, revindex0: __len - 1, length: __len, last: false };
  _utils.each(__l, function (post, __k) {
    _ctx.post = post;
    _ctx.__k = __k;
    _ctx.loop.key = __k;
    _ctx.loop.first = (_ctx.loop.index0 === 0);
    _ctx.loop.last = (_ctx.loop.revindex0 === 0);
    _output += "\n    <li>\n      <h2><a href=\"/";
_output += _filters["e"]((((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.path !== undefined && _ctx.post.path !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.path !== undefined && _ctx.post.path !== null) ? _ctx.post.path : "") : ((typeof post !== "undefined" && post !== null && post.path !== undefined && post.path !== null) ? post.path : "")) !== null ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.path !== undefined && _ctx.post.path !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.path !== undefined && _ctx.post.path !== null) ? _ctx.post.path : "") : ((typeof post !== "undefined" && post !== null && post.path !== undefined && post.path !== null) ? post.path : "")) : "" ));
_output += "\" style=\"color:";
_output += _filters["e"]((((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.color !== undefined && _ctx.post.color !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.color !== undefined && _ctx.post.color !== null) ? _ctx.post.color : "") : ((typeof post !== "undefined" && post !== null && post.color !== undefined && post.color !== null) ? post.color : "")) !== null ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.color !== undefined && _ctx.post.color !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.color !== undefined && _ctx.post.color !== null) ? _ctx.post.color : "") : ((typeof post !== "undefined" && post !== null && post.color !== undefined && post.color !== null) ? post.color : "")) : "" ));
_output += "\">";
_output += _filters["e"]((((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.title !== undefined && _ctx.post.title !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.title !== undefined && _ctx.post.title !== null) ? _ctx.post.title : "") : ((typeof post !== "undefined" && post !== null && post.title !== undefined && post.title !== null) ? post.title : "")) !== null ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.title !== undefined && _ctx.post.title !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.title !== undefined && _ctx.post.title !== null) ? _ctx.post.title : "") : ((typeof post !== "undefined" && post !== null && post.title !== undefined && post.title !== null) ? post.title : "")) : "" ));
_output += "</a></h2>\n      <div class=\"date\">";
_output += _filters["e"](_filters["date"]((((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.date !== undefined && _ctx.post.date !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.date !== undefined && _ctx.post.date !== null) ? _ctx.post.date : "") : ((typeof post !== "undefined" && post !== null && post.date !== undefined && post.date !== null) ? post.date : "")) !== null ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.date !== undefined && _ctx.post.date !== null) ? ((typeof _ctx.post !== "undefined" && _ctx.post !== null && _ctx.post.date !== undefined && _ctx.post.date !== null) ? _ctx.post.date : "") : ((typeof post !== "undefined" && post !== null && post.date !== undefined && post.date !== null) ? post.date : "")) : "" ), 'Y-m-d'));
_output += "</div>\n    </li>\n  ";
    _ctx.loop.index += 1; _ctx.loop.index0 += 1; _ctx.loop.revindex -= 1; _ctx.loop.revindex0 -= 1;
  });
  _ctx.loop = _ctx__loopcache08711438232567161.loop;
  _ctx.post = _ctx__loopcache08711438232567161.post;
  _ctx.__k = _ctx__loopcache08711438232567161.__k;
  _ctx__loopcache08711438232567161 = undefined;
})();
_output += "\n</ul>";

  return _output;

};
