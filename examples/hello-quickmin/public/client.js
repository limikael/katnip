var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../isoq/node_modules/preact/dist/preact.module.js
function d(n2, l3) {
  for (var u3 in l3)
    n2[u3] = l3[u3];
  return n2;
}
function w(n2) {
  var l3 = n2.parentNode;
  l3 && l3.removeChild(n2);
}
function _(l3, u3, t3) {
  var i3, o3, r3, f3 = {};
  for (r3 in u3)
    "key" == r3 ? i3 = u3[r3] : "ref" == r3 ? o3 = u3[r3] : f3[r3] = u3[r3];
  if (arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps)
    for (r3 in l3.defaultProps)
      void 0 === f3[r3] && (f3[r3] = l3.defaultProps[r3]);
  return g(l3, f3, i3, o3, null);
}
function g(n2, t3, i3, o3, r3) {
  var f3 = { type: n2, props: t3, key: i3, ref: o3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r3 ? ++u : r3, __i: -1, __u: 0 };
  return null == r3 && null != l.vnode && l.vnode(f3), f3;
}
function k(n2) {
  return n2.children;
}
function b(n2, l3) {
  this.props = n2, this.context = l3;
}
function x(n2, l3) {
  if (null == l3)
    return n2.__ ? x(n2.__, n2.__i + 1) : null;
  for (var u3; l3 < n2.__k.length; l3++)
    if (null != (u3 = n2.__k[l3]) && null != u3.__e)
      return u3.__e;
  return "function" == typeof n2.type ? x(n2) : null;
}
function C(n2) {
  var l3, u3;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
      if (null != (u3 = n2.__k[l3]) && null != u3.__e) {
        n2.__e = n2.__c.base = u3.__e;
        break;
      }
    return C(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !P.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(P);
}
function P() {
  var n2, u3, t3, o3, r3, e3, c3, s3;
  for (i.sort(f); n2 = i.shift(); )
    n2.__d && (u3 = i.length, o3 = void 0, e3 = (r3 = (t3 = n2).__v).__e, c3 = [], s3 = [], t3.__P && ((o3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(o3), O(t3.__P, o3, r3, t3.__n, t3.__P.namespaceURI, 32 & r3.__u ? [e3] : null, c3, null == e3 ? x(r3) : e3, !!(32 & r3.__u), s3), o3.__v = r3.__v, o3.__.__k[o3.__i] = o3, j(c3, o3, s3), o3.__e != e3 && C(o3)), i.length > u3 && i.sort(f));
  P.__r = 0;
}
function S(n2, l3, u3, t3, i3, o3, r3, f3, e3, c3, s3) {
  var a3, v3, y3, d3, w4, _3 = t3 && t3.__k || p, g4 = l3.length;
  for (u3.__d = e3, $(u3, l3, _3), e3 = u3.__d, a3 = 0; a3 < g4; a3++)
    null != (y3 = u3.__k[a3]) && "boolean" != typeof y3 && "function" != typeof y3 && (v3 = -1 === y3.__i ? h : _3[y3.__i] || h, y3.__i = a3, O(n2, y3, v3, i3, o3, r3, f3, e3, c3, s3), d3 = y3.__e, y3.ref && v3.ref != y3.ref && (v3.ref && N(v3.ref, null, y3), s3.push(y3.ref, y3.__c || d3, y3)), null == w4 && null != d3 && (w4 = d3), 65536 & y3.__u || v3.__k === y3.__k ? (e3 && !e3.isConnected && (e3 = x(v3)), e3 = I(y3, e3, n2)) : "function" == typeof y3.type && void 0 !== y3.__d ? e3 = y3.__d : d3 && (e3 = d3.nextSibling), y3.__d = void 0, y3.__u &= -196609);
  u3.__d = e3, u3.__e = w4;
}
function $(n2, l3, u3) {
  var t3, i3, o3, r3, f3, e3 = l3.length, c3 = u3.length, s3 = c3, a3 = 0;
  for (n2.__k = [], t3 = 0; t3 < e3; t3++)
    r3 = t3 + a3, null != (i3 = n2.__k[t3] = null == (i3 = l3[t3]) || "boolean" == typeof i3 || "function" == typeof i3 ? null : "string" == typeof i3 || "number" == typeof i3 || "bigint" == typeof i3 || i3.constructor == String ? g(null, i3, null, null, null) : y(i3) ? g(k, { children: i3 }, null, null, null) : void 0 === i3.constructor && i3.__b > 0 ? g(i3.type, i3.props, i3.key, i3.ref ? i3.ref : null, i3.__v) : i3) ? (i3.__ = n2, i3.__b = n2.__b + 1, f3 = L(i3, u3, r3, s3), i3.__i = f3, o3 = null, -1 !== f3 && (s3--, (o3 = u3[f3]) && (o3.__u |= 131072)), null == o3 || null === o3.__v ? (-1 == f3 && a3--, "function" != typeof i3.type && (i3.__u |= 65536)) : f3 !== r3 && (f3 === r3 + 1 ? a3++ : f3 > r3 ? s3 > e3 - r3 ? a3 += f3 - r3 : a3-- : f3 < r3 ? f3 == r3 - 1 && (a3 = f3 - r3) : a3 = 0, f3 !== t3 + a3 && (i3.__u |= 65536))) : (o3 = u3[r3]) && null == o3.key && o3.__e && 0 == (131072 & o3.__u) && (o3.__e == n2.__d && (n2.__d = x(o3)), V(o3, o3, false), u3[r3] = null, s3--);
  if (s3)
    for (t3 = 0; t3 < c3; t3++)
      null != (o3 = u3[t3]) && 0 == (131072 & o3.__u) && (o3.__e == n2.__d && (n2.__d = x(o3)), V(o3, o3));
}
function I(n2, l3, u3) {
  var t3, i3;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i3 = 0; t3 && i3 < t3.length; i3++)
      t3[i3] && (t3[i3].__ = n2, l3 = I(t3[i3], l3, u3));
    return l3;
  }
  n2.__e != l3 && (u3.insertBefore(n2.__e, l3 || null), l3 = n2.__e);
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 === l3.nodeType);
  return l3;
}
function H(n2, l3) {
  return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (y(n2) ? n2.some(function(n3) {
    H(n3, l3);
  }) : l3.push(n2)), l3;
}
function L(n2, l3, u3, t3) {
  var i3 = n2.key, o3 = n2.type, r3 = u3 - 1, f3 = u3 + 1, e3 = l3[u3];
  if (null === e3 || e3 && i3 == e3.key && o3 === e3.type && 0 == (131072 & e3.__u))
    return u3;
  if (t3 > (null != e3 && 0 == (131072 & e3.__u) ? 1 : 0))
    for (; r3 >= 0 || f3 < l3.length; ) {
      if (r3 >= 0) {
        if ((e3 = l3[r3]) && 0 == (131072 & e3.__u) && i3 == e3.key && o3 === e3.type)
          return r3;
        r3--;
      }
      if (f3 < l3.length) {
        if ((e3 = l3[f3]) && 0 == (131072 & e3.__u) && i3 == e3.key && o3 === e3.type)
          return f3;
        f3++;
      }
    }
  return -1;
}
function T(n2, l3, u3) {
  "-" === l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || v.test(l3) ? u3 : u3 + "px";
}
function A(n2, l3, u3, t3, i3) {
  var o3;
  n:
    if ("style" === l3)
      if ("string" == typeof u3)
        n2.style.cssText = u3;
      else {
        if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3)
          for (l3 in t3)
            u3 && l3 in u3 || T(n2.style, l3, "");
        if (u3)
          for (l3 in u3)
            t3 && u3[l3] === t3[l3] || T(n2.style, l3, u3[l3]);
      }
    else if ("o" === l3[0] && "n" === l3[1])
      o3 = l3 !== (l3 = l3.replace(/(PointerCapture)$|Capture$/i, "$1")), l3 = l3.toLowerCase() in n2 || "onFocusOut" === l3 || "onFocusIn" === l3 ? l3.toLowerCase().slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + o3] = u3, u3 ? t3 ? u3.u = t3.u : (u3.u = e, n2.addEventListener(l3, o3 ? s : c, o3)) : n2.removeEventListener(l3, o3 ? s : c, o3);
    else {
      if ("http://www.w3.org/2000/svg" == i3)
        l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && l3 in n2)
        try {
          n2[l3] = null == u3 ? "" : u3;
          break n;
        } catch (n3) {
        }
      "function" == typeof u3 || (null == u3 || false === u3 && "-" !== l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, u3));
    }
}
function F(n2) {
  return function(u3) {
    if (this.l) {
      var t3 = this.l[u3.type + n2];
      if (null == u3.t)
        u3.t = e++;
      else if (u3.t < t3.u)
        return;
      return t3(l.event ? l.event(u3) : u3);
    }
  };
}
function O(n2, u3, t3, i3, o3, r3, f3, e3, c3, s3) {
  var a3, h3, p3, v3, w4, _3, g4, m3, x3, C4, M3, P3, $3, I2, H3, L3 = u3.type;
  if (void 0 !== u3.constructor)
    return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), r3 = [e3 = u3.__e = t3.__e]), (a3 = l.__b) && a3(u3);
  n:
    if ("function" == typeof L3)
      try {
        if (m3 = u3.props, x3 = (a3 = L3.contextType) && i3[a3.__c], C4 = a3 ? x3 ? x3.props.value : a3.__ : i3, t3.__c ? g4 = (h3 = u3.__c = t3.__c).__ = h3.__E : ("prototype" in L3 && L3.prototype.render ? u3.__c = h3 = new L3(m3, C4) : (u3.__c = h3 = new b(m3, C4), h3.constructor = L3, h3.render = q), x3 && x3.sub(h3), h3.props = m3, h3.state || (h3.state = {}), h3.context = C4, h3.__n = i3, p3 = h3.__d = true, h3.__h = [], h3._sb = []), null == h3.__s && (h3.__s = h3.state), null != L3.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, L3.getDerivedStateFromProps(m3, h3.__s))), v3 = h3.props, w4 = h3.state, h3.__v = u3, p3)
          null == L3.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
        else {
          if (null == L3.getDerivedStateFromProps && m3 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(m3, C4), !h3.__e && (null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(m3, h3.__s, C4) || u3.__v === t3.__v)) {
            for (u3.__v !== t3.__v && (h3.props = m3, h3.state = h3.__s, h3.__d = false), u3.__e = t3.__e, u3.__k = t3.__k, u3.__k.forEach(function(n3) {
              n3 && (n3.__ = u3);
            }), M3 = 0; M3 < h3._sb.length; M3++)
              h3.__h.push(h3._sb[M3]);
            h3._sb = [], h3.__h.length && f3.push(h3);
            break n;
          }
          null != h3.componentWillUpdate && h3.componentWillUpdate(m3, h3.__s, C4), null != h3.componentDidUpdate && h3.__h.push(function() {
            h3.componentDidUpdate(v3, w4, _3);
          });
        }
        if (h3.context = C4, h3.props = m3, h3.__P = n2, h3.__e = false, P3 = l.__r, $3 = 0, "prototype" in L3 && L3.prototype.render) {
          for (h3.state = h3.__s, h3.__d = false, P3 && P3(u3), a3 = h3.render(h3.props, h3.state, h3.context), I2 = 0; I2 < h3._sb.length; I2++)
            h3.__h.push(h3._sb[I2]);
          h3._sb = [];
        } else
          do {
            h3.__d = false, P3 && P3(u3), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
          } while (h3.__d && ++$3 < 25);
        h3.state = h3.__s, null != h3.getChildContext && (i3 = d(d({}, i3), h3.getChildContext())), p3 || null == h3.getSnapshotBeforeUpdate || (_3 = h3.getSnapshotBeforeUpdate(v3, w4)), S(n2, y(H3 = null != a3 && a3.type === k && null == a3.key ? a3.props.children : a3) ? H3 : [H3], u3, t3, i3, o3, r3, f3, e3, c3, s3), h3.base = u3.__e, u3.__u &= -161, h3.__h.length && f3.push(h3), g4 && (h3.__E = h3.__ = null);
      } catch (n3) {
        u3.__v = null, c3 || null != r3 ? (u3.__e = e3, u3.__u |= c3 ? 160 : 32, r3[r3.indexOf(e3)] = null) : (u3.__e = t3.__e, u3.__k = t3.__k), l.__e(n3, u3, t3);
      }
    else
      null == r3 && u3.__v === t3.__v ? (u3.__k = t3.__k, u3.__e = t3.__e) : u3.__e = z(t3.__e, u3, t3, i3, o3, r3, f3, c3, s3);
  (a3 = l.diffed) && a3(u3);
}
function j(n2, u3, t3) {
  u3.__d = void 0;
  for (var i3 = 0; i3 < t3.length; i3++)
    N(t3[i3], t3[++i3], t3[++i3]);
  l.__c && l.__c(u3, n2), n2.some(function(u4) {
    try {
      n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
        n3.call(u4);
      });
    } catch (n3) {
      l.__e(n3, u4.__v);
    }
  });
}
function z(l3, u3, t3, i3, o3, r3, f3, e3, c3) {
  var s3, a3, p3, v3, d3, _3, g4, m3 = t3.props, k3 = u3.props, b2 = u3.type;
  if ("svg" === b2 ? o3 = "http://www.w3.org/2000/svg" : "math" === b2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != r3) {
    for (s3 = 0; s3 < r3.length; s3++)
      if ((d3 = r3[s3]) && "setAttribute" in d3 == !!b2 && (b2 ? d3.localName === b2 : 3 === d3.nodeType)) {
        l3 = d3, r3[s3] = null;
        break;
      }
  }
  if (null == l3) {
    if (null === b2)
      return document.createTextNode(k3);
    l3 = document.createElementNS(o3, b2, k3.is && k3), r3 = null, e3 = false;
  }
  if (null === b2)
    m3 === k3 || e3 && l3.data === k3 || (l3.data = k3);
  else {
    if (r3 = r3 && n.call(l3.childNodes), m3 = t3.props || h, !e3 && null != r3)
      for (m3 = {}, s3 = 0; s3 < l3.attributes.length; s3++)
        m3[(d3 = l3.attributes[s3]).name] = d3.value;
    for (s3 in m3)
      if (d3 = m3[s3], "children" == s3)
        ;
      else if ("dangerouslySetInnerHTML" == s3)
        p3 = d3;
      else if ("key" !== s3 && !(s3 in k3)) {
        if ("value" == s3 && "defaultValue" in k3 || "checked" == s3 && "defaultChecked" in k3)
          continue;
        A(l3, s3, null, d3, o3);
      }
    for (s3 in k3)
      d3 = k3[s3], "children" == s3 ? v3 = d3 : "dangerouslySetInnerHTML" == s3 ? a3 = d3 : "value" == s3 ? _3 = d3 : "checked" == s3 ? g4 = d3 : "key" === s3 || e3 && "function" != typeof d3 || m3[s3] === d3 || A(l3, s3, d3, m3[s3], o3);
    if (a3)
      e3 || p3 && (a3.__html === p3.__html || a3.__html === l3.innerHTML) || (l3.innerHTML = a3.__html), u3.__k = [];
    else if (p3 && (l3.innerHTML = ""), S(l3, y(v3) ? v3 : [v3], u3, t3, i3, "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : o3, r3, f3, r3 ? r3[0] : t3.__k && x(t3, 0), e3, c3), null != r3)
      for (s3 = r3.length; s3--; )
        null != r3[s3] && w(r3[s3]);
    e3 || (s3 = "value", void 0 !== _3 && (_3 !== l3[s3] || "progress" === b2 && !_3 || "option" === b2 && _3 !== m3[s3]) && A(l3, s3, _3, m3[s3], o3), s3 = "checked", void 0 !== g4 && g4 !== l3[s3] && A(l3, s3, g4, m3[s3], o3));
  }
  return l3;
}
function N(n2, u3, t3) {
  try {
    "function" == typeof n2 ? n2(u3) : n2.current = u3;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function V(n2, u3, t3) {
  var i3, o3;
  if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current !== n2.__e || N(i3, null, u3)), null != (i3 = n2.__c)) {
    if (i3.componentWillUnmount)
      try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
    i3.base = i3.__P = null;
  }
  if (i3 = n2.__k)
    for (o3 = 0; o3 < i3.length; o3++)
      i3[o3] && V(i3[o3], u3, t3 || "function" != typeof n2.type);
  t3 || null == n2.__e || w(n2.__e), n2.__c = n2.__ = n2.__e = n2.__d = void 0;
}
function q(n2, l3, u3) {
  return this.constructor(n2, u3);
}
function B(u3, t3, i3) {
  var o3, r3, f3, e3;
  l.__ && l.__(u3, t3), r3 = (o3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, f3 = [], e3 = [], O(t3, u3 = (!o3 && i3 || t3).__k = _(k, null, [u3]), r3 || h, h, t3.namespaceURI, !o3 && i3 ? [i3] : r3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, f3, !o3 && i3 ? i3 : r3 ? r3.__e : t3.firstChild, o3, e3), j(f3, u3, e3);
}
function D(n2, l3) {
  B(n2, l3, D);
}
function G(n2, l3) {
  var u3 = { __c: l3 = "__cC" + a++, __: n2, Consumer: function(n3, l4) {
    return n3.children(l4);
  }, Provider: function(n3) {
    var u4, t3;
    return this.getChildContext || (u4 = [], (t3 = {})[l3] = this, this.getChildContext = function() {
      return t3;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value !== n4.value && u4.some(function(n5) {
        n5.__e = true, M(n5);
      });
    }, this.sub = function(n4) {
      u4.push(n4);
      var l4 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u4.splice(u4.indexOf(n4), 1), l4 && l4.call(n4);
      };
    }), n3.children;
  } };
  return u3.Provider.__ = u3.Consumer.contextType = u3;
}
var n, l, u, t, i, o, r, f, e, c, s, a, h, p, v, y;
var init_preact_module = __esm({
  "../../../isoq/node_modules/preact/dist/preact.module.js"() {
    init_preact_shim();
    h = {};
    p = [];
    v = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
    y = Array.isArray;
    n = p.slice, l = { __e: function(n2, l3, u3, t3) {
      for (var i3, o3, r3; l3 = l3.__; )
        if ((i3 = l3.__c) && !i3.__)
          try {
            if ((o3 = i3.constructor) && null != o3.getDerivedStateFromError && (i3.setState(o3.getDerivedStateFromError(n2)), r3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), r3 = i3.__d), r3)
              return i3.__E = i3;
          } catch (l4) {
            n2 = l4;
          }
      throw n2;
    } }, u = 0, t = function(n2) {
      return null != n2 && null == n2.constructor;
    }, b.prototype.setState = function(n2, l3) {
      var u3;
      u3 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u3), this.props)), n2 && d(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
    }, b.prototype.forceUpdate = function(n2) {
      this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
    }, b.prototype.render = k, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n2, l3) {
      return n2.__v.__b - l3.__v.__b;
    }, P.__r = 0, e = 0, c = F(false), s = F(true), a = 0;
  }
});

// ../../../isoq/src/utils/preact-shim.js
var init_preact_shim = __esm({
  "../../../isoq/src/utils/preact-shim.js"() {
    init_preact_module();
    if (!globalThis.navigator)
      globalThis.navigator = {};
  }
});

// ../../../qql/node_modules/sqlstring-sqlite/lib/SqlString.js
var require_SqlString = __commonJS({
  "../../../qql/node_modules/sqlstring-sqlite/lib/SqlString.js"(exports) {
    init_preact_shim();
    var SqlString = exports;
    var ID_GLOBAL_REGEXP = /`/g;
    var QUAL_GLOBAL_REGEXP = /\./g;
    var CHARS_GLOBAL_REGEXP = /[']/g;
    var CHARS_ESCAPE_MAP = {
      "'": "''"
    };
    SqlString.escapeId = function escapeId(val, forbidQualified) {
      if (Array.isArray(val)) {
        var sql = "";
        for (var i3 = 0; i3 < val.length; i3++) {
          sql += (i3 === 0 ? "" : ", ") + SqlString.escapeId(val[i3], forbidQualified);
        }
        return sql;
      } else if (forbidQualified) {
        return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``") + "`";
      } else {
        return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``").replace(QUAL_GLOBAL_REGEXP, "`.`") + "`";
      }
    };
    SqlString.escape = function escape(val, stringifyObjects, timeZone) {
      if (val === void 0 || val === null) {
        return "NULL";
      }
      switch (typeof val) {
        case "boolean":
          return val ? "true" : "false";
        case "number":
          return val + "";
        case "object":
          if (val instanceof Date) {
            return SqlString.dateToString(val, timeZone || "local");
          } else if (Array.isArray(val)) {
            return SqlString.arrayToList(val, timeZone);
          } else if (Buffer.isBuffer(val)) {
            return SqlString.bufferToString(val);
          } else if (typeof val.toSqlString === "function") {
            return String(val.toSqlString());
          } else if (stringifyObjects) {
            return escapeString(val.toString());
          } else {
            return SqlString.objectToValues(val, timeZone);
          }
        default:
          return escapeString(val);
      }
    };
    SqlString.arrayToList = function arrayToList(array, timeZone) {
      var sql = "";
      for (var i3 = 0; i3 < array.length; i3++) {
        var val = array[i3];
        if (Array.isArray(val)) {
          sql += (i3 === 0 ? "" : ", ") + "(" + SqlString.arrayToList(val, timeZone) + ")";
        } else {
          sql += (i3 === 0 ? "" : ", ") + SqlString.escape(val, true, timeZone);
        }
      }
      return sql;
    };
    SqlString.format = function format(sql, values, stringifyObjects, timeZone) {
      if (values == null) {
        return sql;
      }
      if (!(values instanceof Array || Array.isArray(values))) {
        values = [values];
      }
      var chunkIndex = 0;
      var placeholdersRegex = /\?+/g;
      var result = "";
      var valuesIndex = 0;
      var match;
      while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
        var len = match[0].length;
        if (len > 2) {
          continue;
        }
        var value = len === 2 ? SqlString.escapeId(values[valuesIndex]) : SqlString.escape(values[valuesIndex], stringifyObjects, timeZone);
        result += sql.slice(chunkIndex, match.index) + value;
        chunkIndex = placeholdersRegex.lastIndex;
        valuesIndex++;
      }
      if (chunkIndex === 0) {
        return sql;
      }
      if (chunkIndex < sql.length) {
        return result + sql.slice(chunkIndex);
      }
      return result;
    };
    SqlString.dateToString = function dateToString(date, timeZone) {
      var dt = new Date(date);
      if (isNaN(dt.getTime())) {
        return "NULL";
      }
      var year;
      var month;
      var day;
      var hour;
      var minute;
      var second;
      var millisecond;
      if (timeZone === "local") {
        year = dt.getFullYear();
        month = dt.getMonth() + 1;
        day = dt.getDate();
        hour = dt.getHours();
        minute = dt.getMinutes();
        second = dt.getSeconds();
        millisecond = dt.getMilliseconds();
      } else {
        var tz = convertTimezone(timeZone);
        if (tz !== false && tz !== 0) {
          dt.setTime(dt.getTime() + tz * 6e4);
        }
        year = dt.getUTCFullYear();
        month = dt.getUTCMonth() + 1;
        day = dt.getUTCDate();
        hour = dt.getUTCHours();
        minute = dt.getUTCMinutes();
        second = dt.getUTCSeconds();
        millisecond = dt.getUTCMilliseconds();
      }
      var str = zeroPad(year, 4) + "-" + zeroPad(month, 2) + "-" + zeroPad(day, 2) + " " + zeroPad(hour, 2) + ":" + zeroPad(minute, 2) + ":" + zeroPad(second, 2) + "." + zeroPad(millisecond, 3);
      return escapeString(str);
    };
    SqlString.bufferToString = function bufferToString(buffer) {
      return "X" + escapeString(buffer.toString("hex"));
    };
    SqlString.objectToValues = function objectToValues(object, timeZone) {
      var sql = "";
      for (var key in object) {
        var val = object[key];
        if (typeof val === "function") {
          continue;
        }
        sql += (sql.length === 0 ? "" : ", ") + SqlString.escapeId(key) + " = " + SqlString.escape(val, true, timeZone);
      }
      return sql;
    };
    SqlString.raw = function raw(sql) {
      if (typeof sql !== "string") {
        throw new TypeError("argument sql must be a string");
      }
      return {
        toSqlString: function toSqlString() {
          return sql;
        }
      };
    };
    function escapeString(val) {
      var chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex = 0;
      var escapedVal = "";
      var match;
      while (match = CHARS_GLOBAL_REGEXP.exec(val)) {
        escapedVal += val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
        chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
      }
      if (chunkIndex === 0) {
        return "'" + val + "'";
      }
      if (chunkIndex < val.length) {
        return "'" + escapedVal + val.slice(chunkIndex) + "'";
      }
      return "'" + escapedVal + "'";
    }
    function zeroPad(number, length) {
      number = number.toString();
      while (number.length < length) {
        number = "0" + number;
      }
      return number;
    }
    function convertTimezone(tz) {
      if (tz === "Z") {
        return 0;
      }
      var m3 = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
      if (m3) {
        return (m3[1] === "-" ? -1 : 1) * (parseInt(m3[2], 10) + (m3[3] ? parseInt(m3[3], 10) : 0) / 60) * 60;
      }
      return false;
    }
  }
});

// ../../../qql/node_modules/sqlstring-sqlite/index.js
var require_sqlstring_sqlite = __commonJS({
  "../../../qql/node_modules/sqlstring-sqlite/index.js"(exports, module) {
    init_preact_shim();
    module.exports = require_SqlString();
  }
});

// ../../../qql/node_modules/sqlstring/lib/SqlString.js
var require_SqlString2 = __commonJS({
  "../../../qql/node_modules/sqlstring/lib/SqlString.js"(exports) {
    init_preact_shim();
    var SqlString = exports;
    var ID_GLOBAL_REGEXP = /`/g;
    var QUAL_GLOBAL_REGEXP = /\./g;
    var CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g;
    var CHARS_ESCAPE_MAP = {
      "\0": "\\0",
      "\b": "\\b",
      "	": "\\t",
      "\n": "\\n",
      "\r": "\\r",
      "": "\\Z",
      '"': '\\"',
      "'": "\\'",
      "\\": "\\\\"
    };
    SqlString.escapeId = function escapeId(val, forbidQualified) {
      if (Array.isArray(val)) {
        var sql = "";
        for (var i3 = 0; i3 < val.length; i3++) {
          sql += (i3 === 0 ? "" : ", ") + SqlString.escapeId(val[i3], forbidQualified);
        }
        return sql;
      } else if (forbidQualified) {
        return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``") + "`";
      } else {
        return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``").replace(QUAL_GLOBAL_REGEXP, "`.`") + "`";
      }
    };
    SqlString.escape = function escape(val, stringifyObjects, timeZone) {
      if (val === void 0 || val === null) {
        return "NULL";
      }
      switch (typeof val) {
        case "boolean":
          return val ? "true" : "false";
        case "number":
          return val + "";
        case "object":
          if (Object.prototype.toString.call(val) === "[object Date]") {
            return SqlString.dateToString(val, timeZone || "local");
          } else if (Array.isArray(val)) {
            return SqlString.arrayToList(val, timeZone);
          } else if (Buffer.isBuffer(val)) {
            return SqlString.bufferToString(val);
          } else if (typeof val.toSqlString === "function") {
            return String(val.toSqlString());
          } else if (stringifyObjects) {
            return escapeString(val.toString());
          } else {
            return SqlString.objectToValues(val, timeZone);
          }
        default:
          return escapeString(val);
      }
    };
    SqlString.arrayToList = function arrayToList(array, timeZone) {
      var sql = "";
      for (var i3 = 0; i3 < array.length; i3++) {
        var val = array[i3];
        if (Array.isArray(val)) {
          sql += (i3 === 0 ? "" : ", ") + "(" + SqlString.arrayToList(val, timeZone) + ")";
        } else {
          sql += (i3 === 0 ? "" : ", ") + SqlString.escape(val, true, timeZone);
        }
      }
      return sql;
    };
    SqlString.format = function format(sql, values, stringifyObjects, timeZone) {
      if (values == null) {
        return sql;
      }
      if (!Array.isArray(values)) {
        values = [values];
      }
      var chunkIndex = 0;
      var placeholdersRegex = /\?+/g;
      var result = "";
      var valuesIndex = 0;
      var match;
      while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
        var len = match[0].length;
        if (len > 2) {
          continue;
        }
        var value = len === 2 ? SqlString.escapeId(values[valuesIndex]) : SqlString.escape(values[valuesIndex], stringifyObjects, timeZone);
        result += sql.slice(chunkIndex, match.index) + value;
        chunkIndex = placeholdersRegex.lastIndex;
        valuesIndex++;
      }
      if (chunkIndex === 0) {
        return sql;
      }
      if (chunkIndex < sql.length) {
        return result + sql.slice(chunkIndex);
      }
      return result;
    };
    SqlString.dateToString = function dateToString(date, timeZone) {
      var dt = new Date(date);
      if (isNaN(dt.getTime())) {
        return "NULL";
      }
      var year;
      var month;
      var day;
      var hour;
      var minute;
      var second;
      var millisecond;
      if (timeZone === "local") {
        year = dt.getFullYear();
        month = dt.getMonth() + 1;
        day = dt.getDate();
        hour = dt.getHours();
        minute = dt.getMinutes();
        second = dt.getSeconds();
        millisecond = dt.getMilliseconds();
      } else {
        var tz = convertTimezone(timeZone);
        if (tz !== false && tz !== 0) {
          dt.setTime(dt.getTime() + tz * 6e4);
        }
        year = dt.getUTCFullYear();
        month = dt.getUTCMonth() + 1;
        day = dt.getUTCDate();
        hour = dt.getUTCHours();
        minute = dt.getUTCMinutes();
        second = dt.getUTCSeconds();
        millisecond = dt.getUTCMilliseconds();
      }
      var str = zeroPad(year, 4) + "-" + zeroPad(month, 2) + "-" + zeroPad(day, 2) + " " + zeroPad(hour, 2) + ":" + zeroPad(minute, 2) + ":" + zeroPad(second, 2) + "." + zeroPad(millisecond, 3);
      return escapeString(str);
    };
    SqlString.bufferToString = function bufferToString(buffer) {
      return "X" + escapeString(buffer.toString("hex"));
    };
    SqlString.objectToValues = function objectToValues(object, timeZone) {
      var sql = "";
      for (var key in object) {
        var val = object[key];
        if (typeof val === "function") {
          continue;
        }
        sql += (sql.length === 0 ? "" : ", ") + SqlString.escapeId(key) + " = " + SqlString.escape(val, true, timeZone);
      }
      return sql;
    };
    SqlString.raw = function raw(sql) {
      if (typeof sql !== "string") {
        throw new TypeError("argument sql must be a string");
      }
      return {
        toSqlString: function toSqlString() {
          return sql;
        }
      };
    };
    function escapeString(val) {
      var chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex = 0;
      var escapedVal = "";
      var match;
      while (match = CHARS_GLOBAL_REGEXP.exec(val)) {
        escapedVal += val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
        chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
      }
      if (chunkIndex === 0) {
        return "'" + val + "'";
      }
      if (chunkIndex < val.length) {
        return "'" + escapedVal + val.slice(chunkIndex) + "'";
      }
      return "'" + escapedVal + "'";
    }
    function zeroPad(number, length) {
      number = number.toString();
      while (number.length < length) {
        number = "0" + number;
      }
      return number;
    }
    function convertTimezone(tz) {
      if (tz === "Z") {
        return 0;
      }
      var m3 = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
      if (m3) {
        return (m3[1] === "-" ? -1 : 1) * (parseInt(m3[2], 10) + (m3[3] ? parseInt(m3[3], 10) : 0) / 60) * 60;
      }
      return false;
    }
  }
});

// ../../../qql/node_modules/sqlstring/index.js
var require_sqlstring = __commonJS({
  "../../../qql/node_modules/sqlstring/index.js"(exports, module) {
    init_preact_shim();
    module.exports = require_SqlString2();
  }
});

// ../../../isoq/node_modules/@einheit/path-resolve/index.js
var require_path_resolve = __commonJS({
  "../../../isoq/node_modules/@einheit/path-resolve/index.js"(exports, module) {
    "use strict";
    init_preact_shim();
    var SLASH = 47;
    var DOT = 46;
    var getCWD;
    if (typeof process !== "undefined" && typeof process.cwd !== "undefined") {
      getCWD = process.cwd;
    } else {
      getCWD = function() {
        var pathname = window.location.pathname;
        return pathname.slice(0, pathname.lastIndexOf("/") + 1);
      };
    }
    function normalizeStringPosix(path, allowAboveRoot) {
      var res = "";
      var lastSlash = -1;
      var dots = 0;
      var code = void 0;
      var isAboveRoot = false;
      for (var i3 = 0; i3 <= path.length; ++i3) {
        if (i3 < path.length) {
          code = path.charCodeAt(i3);
        } else if (code === SLASH) {
          break;
        } else {
          code = SLASH;
        }
        if (code === SLASH) {
          if (lastSlash === i3 - 1 || dots === 1) {
          } else if (lastSlash !== i3 - 1 && dots === 2) {
            if (res.length < 2 || !isAboveRoot || res.charCodeAt(res.length - 1) !== DOT || res.charCodeAt(res.length - 2) !== DOT) {
              if (res.length > 2) {
                var start = res.length - 1;
                var j3 = start;
                for (; j3 >= 0; --j3) {
                  if (res.charCodeAt(j3) === SLASH) {
                    break;
                  }
                }
                if (j3 !== start) {
                  res = j3 === -1 ? "" : res.slice(0, j3);
                  lastSlash = i3;
                  dots = 0;
                  isAboveRoot = false;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSlash = i3;
                dots = 0;
                isAboveRoot = false;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) {
                res += "/..";
              } else {
                res = "..";
              }
              isAboveRoot = true;
            }
          } else {
            var slice = path.slice(lastSlash + 1, i3);
            if (res.length > 0) {
              res += "/" + slice;
            } else {
              res = slice;
            }
            isAboveRoot = false;
          }
          lastSlash = i3;
          dots = 0;
        } else if (code === DOT && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    function resolvePath2() {
      var paths = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
      }
      var resolvedPath = "";
      var resolvedAbsolute = false;
      var cwd = void 0;
      for (var i3 = paths.length - 1; i3 >= -1 && !resolvedAbsolute; i3--) {
        var path = void 0;
        if (i3 >= 0) {
          path = paths[i3];
        } else {
          if (cwd === void 0) {
            cwd = getCWD();
          }
          path = cwd;
        }
        if (path.length === 0) {
          continue;
        }
        resolvedPath = path + "/" + resolvedPath;
        resolvedAbsolute = path.charCodeAt(0) === SLASH;
      }
      resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
      if (resolvedAbsolute) {
        return "/" + resolvedPath;
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    }
    module.exports = resolvePath2;
  }
});

// ../../../isoq/src/isoq/client.jsx
init_preact_shim();

// node_modules/.katnip/main.jsx
init_preact_shim();

// index.jsx
var hello_quickmin_exports = {};
__export(hello_quickmin_exports, {
  default: () => hello_quickmin_default
});
init_preact_shim();

// ../../packages/katnip-quickmin/react-exports.jsx
init_preact_shim();

// ../../../qql/src/lib/qql-react.jsx
init_preact_shim();

// ../../../isoq/node_modules/preact/compat/dist/compat.module.js
init_preact_shim();
init_preact_module();
init_preact_module();

// ../../../isoq/node_modules/preact/hooks/dist/hooks.module.js
init_preact_shim();
init_preact_module();
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = [];
var e2 = l;
var a2 = e2.__b;
var v2 = e2.__r;
var l2 = e2.diffed;
var m = e2.__c;
var s2 = e2.unmount;
var d2 = e2.__;
function h2(n2, t3) {
  e2.__h && e2.__h(r2, n2, o2 || t3), o2 = 0;
  var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u3.__.length && u3.__.push({ __V: c2 }), u3.__[n2];
}
function p2(n2) {
  return o2 = 1, y2(D2, n2);
}
function y2(n2, u3, i3) {
  var o3 = h2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : D2(void 0, u3), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.u)) {
    var f3 = function(n3, t3, r3) {
      if (!o3.__c.__H)
        return true;
      var u4 = o3.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u4.every(function(n4) {
        return !n4.__N;
      }))
        return !c3 || c3.call(this, n3, t3, r3);
      var i4 = false;
      return u4.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
        }
      }), !(!i4 && o3.__c.props === n3) && (!c3 || c3.call(this, n3, t3, r3));
    };
    r2.u = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u4 = c3;
        c3 = void 0, f3(n3, t3, r3), c3 = u4;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f3;
  }
  return o3.__N || o3.__;
}
function A2(n2, u3) {
  var i3 = h2(t2++, 4);
  !e2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.i = u3, r2.__h.push(i3));
}
function F2(n2) {
  return o2 = 5, q2(function() {
    return { current: n2 };
  }, []);
}
function q2(n2, r3) {
  var u3 = h2(t2++, 7);
  return C2(u3.__H, r3) ? (u3.__V = n2(), u3.i = r3, u3.__h = n2, u3.__V) : u3.__;
}
function P2(n2) {
  var u3 = r2.context[n2.__c], i3 = h2(t2++, 9);
  return i3.c = n2, u3 ? (null == i3.__ && (i3.__ = true, u3.sub(r2)), u3.props.value) : n2.__;
}
function j2() {
  for (var n2; n2 = f2.shift(); )
    if (n2.__P && n2.__H)
      try {
        n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
      } catch (t3) {
        n2.__H.__h = [], e2.__e(t3, n2.__v);
      }
}
e2.__b = function(n2) {
  r2 = null, a2 && a2(n2);
}, e2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), d2 && d2(n2, t3);
}, e2.__r = function(n2) {
  v2 && v2(n2), t2 = 0;
  var i3 = (r2 = n2.__c).__H;
  i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.__V = c2, n3.__N = n3.i = void 0;
  })) : (i3.__h.forEach(z2), i3.__h.forEach(B2), i3.__h = [], t2 = 0)), u2 = r2;
}, e2.diffed = function(n2) {
  l2 && l2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === e2.requestAnimationFrame || ((i2 = e2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.i && (n3.__H = n3.i), n3.__V !== c2 && (n3.__ = n3.__V), n3.i = void 0, n3.__V = c2;
  })), u2 = r2 = null;
}, e2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], e2.__e(r3, n3.__v);
    }
  }), m && m(n2, t3);
}, e2.unmount = function(n2) {
  s2 && s2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && e2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u3), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u3 = setTimeout(r3, 100);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u3 = n2.__c;
  "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// ../../../isoq/node_modules/preact/compat/dist/compat.module.js
function g3(n2, t3) {
  for (var e3 in t3)
    n2[e3] = t3[e3];
  return n2;
}
function E2(n2, t3) {
  for (var e3 in n2)
    if ("__source" !== e3 && !(e3 in t3))
      return true;
  for (var r3 in t3)
    if ("__source" !== r3 && n2[r3] !== t3[r3])
      return true;
  return false;
}
function C3(n2, t3) {
  this.props = n2, this.context = t3;
}
(C3.prototype = new b()).isPureReactComponent = true, C3.prototype.shouldComponentUpdate = function(n2, t3) {
  return E2(this.props, n2) || E2(this.state, t3);
};
var R = l.__b;
l.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), R && R(n2);
};
var w3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
var M2 = l.__e;
l.__e = function(n2, t3, e3, r3) {
  if (n2.then) {
    for (var u3, o3 = t3; o3 = o3.__; )
      if ((u3 = o3.__c) && u3.__c)
        return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u3.__c(n2, t3);
  }
  M2(n2, t3, e3, r3);
};
var T3 = l.unmount;
function A3(n2, t3, e3) {
  return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
    "function" == typeof n3.__c && n3.__c();
  }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
    return A3(n3, t3, e3);
  })), n2;
}
function D3(n2, t3, e3) {
  return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
    return D3(n3, t3, e3);
  }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
}
function L2() {
  this.__u = 0, this.t = null, this.__b = null;
}
function O2(n2) {
  var t3 = n2.__.__c;
  return t3 && t3.__a && t3.__a(n2);
}
function U() {
  this.u = null, this.o = null;
}
l.unmount = function(n2) {
  var t3 = n2.__c;
  t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), T3 && T3(n2);
}, (L2.prototype = new b()).__c = function(n2, t3) {
  var e3 = t3.__c, r3 = this;
  null == r3.t && (r3.t = []), r3.t.push(e3);
  var u3 = O2(r3.__v), o3 = false, i3 = function() {
    o3 || (o3 = true, e3.__R = null, u3 ? u3(l3) : l3());
  };
  e3.__R = i3;
  var l3 = function() {
    if (!--r3.__u) {
      if (r3.state.__a) {
        var n3 = r3.state.__a;
        r3.__v.__k[0] = D3(n3, n3.__c.__P, n3.__c.__O);
      }
      var t4;
      for (r3.setState({ __a: r3.__b = null }); t4 = r3.t.pop(); )
        t4.forceUpdate();
    }
  };
  r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
}, L2.prototype.componentWillUnmount = function() {
  this.t = [];
}, L2.prototype.render = function(n2, e3) {
  if (this.__b) {
    if (this.__v.__k) {
      var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
      this.__v.__k[0] = A3(this.__b, r3, o3.__O = o3.__P);
    }
    this.__b = null;
  }
  var i3 = e3.__a && _(k, null, n2.fallback);
  return i3 && (i3.__u &= -33), [_(k, null, e3.__a ? null : n2.children), i3];
};
var V3 = function(n2, t3, e3) {
  if (++e3[1] === e3[0] && n2.o.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size))
    for (e3 = n2.u; e3; ) {
      for (; e3.length > 3; )
        e3.pop()();
      if (e3[1] < e3[0])
        break;
      n2.u = e3 = e3[2];
    }
};
(U.prototype = new b()).__a = function(n2) {
  var t3 = this, e3 = O2(t3.__v), r3 = t3.o.get(n2);
  return r3[0]++, function(u3) {
    var o3 = function() {
      t3.props.revealOrder ? (r3.push(u3), V3(t3, n2, r3)) : u3();
    };
    e3 ? e3(o3) : o3();
  };
}, U.prototype.render = function(n2) {
  this.u = null, this.o = /* @__PURE__ */ new Map();
  var t3 = H(n2.children);
  n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
  for (var e3 = t3.length; e3--; )
    this.o.set(t3[e3], this.u = [1, 0, this.u]);
  return n2.children;
}, U.prototype.componentDidUpdate = U.prototype.componentDidMount = function() {
  var n2 = this;
  this.o.forEach(function(t3, e3) {
    V3(n2, e3, t3);
  });
};
var z3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
var B3 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
var H2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
var Z = /[A-Z0-9]/g;
var Y = "undefined" != typeof document;
var $2 = function(n2) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
};
b.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
  Object.defineProperty(b.prototype, t3, { configurable: true, get: function() {
    return this["UNSAFE_" + t3];
  }, set: function(n2) {
    Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
  } });
});
var J = l.event;
function K() {
}
function Q() {
  return this.cancelBubble;
}
function X() {
  return this.defaultPrevented;
}
l.event = function(n2) {
  return J && (n2 = J(n2)), n2.persist = K, n2.isPropagationStopped = Q, n2.isDefaultPrevented = X, n2.nativeEvent = n2;
};
var nn;
var tn = { enumerable: false, configurable: true, get: function() {
  return this.class;
} };
var en = l.vnode;
l.vnode = function(n2) {
  "string" == typeof n2.type && function(n3) {
    var t3 = n3.props, e3 = n3.type, u3 = {};
    for (var o3 in t3) {
      var i3 = t3[o3];
      if (!("value" === o3 && "defaultValue" in t3 && null == i3 || Y && "children" === o3 && "noscript" === e3 || "class" === o3 || "className" === o3)) {
        var l3 = o3.toLowerCase();
        "defaultValue" === o3 && "value" in t3 && null == t3.value ? o3 = "value" : "download" === o3 && true === i3 ? i3 = "" : "translate" === l3 && "no" === i3 ? i3 = false : "ondoubleclick" === l3 ? o3 = "ondblclick" : "onchange" !== l3 || "input" !== e3 && "textarea" !== e3 || $2(t3.type) ? "onfocus" === l3 ? o3 = "onfocusin" : "onblur" === l3 ? o3 = "onfocusout" : H2.test(o3) ? o3 = l3 : -1 === e3.indexOf("-") && B3.test(o3) ? o3 = o3.replace(Z, "-$&").toLowerCase() : null === i3 && (i3 = void 0) : l3 = o3 = "oninput", "oninput" === l3 && u3[o3 = l3] && (o3 = "oninputCapture"), u3[o3] = i3;
      }
    }
    "select" == e3 && u3.multiple && Array.isArray(u3.value) && (u3.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = -1 != u3.value.indexOf(n4.props.value);
    })), "select" == e3 && null != u3.defaultValue && (u3.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = u3.multiple ? -1 != u3.defaultValue.indexOf(n4.props.value) : u3.defaultValue == n4.props.value;
    })), t3.class && !t3.className ? (u3.class = t3.class, Object.defineProperty(u3, "className", tn)) : (t3.className && !t3.class || t3.class && t3.className) && (u3.class = u3.className = t3.className), n3.props = u3;
  }(n2), n2.$$typeof = z3, en && en(n2);
};
var rn = l.__r;
l.__r = function(n2) {
  rn && rn(n2), nn = n2.__c;
};
var un = l.diffed;
l.diffed = function(n2) {
  un && un(n2);
  var t3 = n2.props, e3 = n2.__e;
  null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), nn = null;
};

// ../../../qql/src/net/QqlClient.js
init_preact_shim();

// ../../../qql/src/utils/js-util.js
init_preact_shim();
function objectifyArgs(params, fields) {
  function isPlainObject(value) {
    if (!value)
      return false;
    if (value.constructor === Object)
      return true;
    if (value.constructor.toString().includes("Object"))
      return true;
    return false;
  }
  let conf = {};
  for (let i3 = 0; i3 < params.length; i3++) {
    if (isPlainObject(params[i3]))
      conf = { ...conf, ...params[i3] };
    else if (fields[i3])
      conf[fields[i3]] = params[i3];
  }
  return conf;
}
var CallableClass = class extends Function {
  constructor(f3) {
    return Object.setPrototypeOf(f3, new.target.prototype);
  }
};

// ../../../qql/src/net/QqlClient.js
var QqlClient = class extends CallableClass {
  constructor(...args) {
    super((q3) => this.query(q3));
    let options = objectifyArgs(args, ["url"]);
    this.url = options.url;
    this.fetch = options.fetch;
    this.headers = options.headers;
    if (!this.fetch)
      this.fetch = globalThis.fetch.bind(globalThis);
  }
  query = async (query) => {
    let response = await this.fetch(this.url, {
      method: "POST",
      body: JSON.stringify(query),
      headers: this.headers
    });
    if (response.status < 200 || response.status >= 300)
      throw new Error(await response.text());
    return await response.json();
  };
};
function createQqlClient(...args) {
  return new QqlClient(...args);
}

// ../../../qql/src/lib/qql-react.jsx
var QqlContext = G();
function QqlProvider({ fetch: fetch2, url, children, qql }) {
  let ref = F2();
  if (!ref.current) {
    if (qql)
      ref.current = qql;
    else
      ref.current = createQqlClient({ fetch: fetch2, url });
  }
  return /* @__PURE__ */ _(QqlContext.Provider, { value: ref.current }, children);
}
function useQql() {
  return P2(QqlContext);
}

// ../../../qql/src/lib/exports.js
init_preact_shim();

// ../../../qql/src/drivers/QqlDriverBase.js
init_preact_shim();
var import_sqlstring_sqlite = __toESM(require_sqlstring_sqlite(), 1);
var import_sqlstring = __toESM(require_sqlstring(), 1);

// ../../../qql/src/drivers/QqlDriverSqlite.js
init_preact_shim();
var import_sqlstring_sqlite2 = __toESM(require_sqlstring_sqlite(), 1);

// ../../../qql/src/drivers/QqlDriverSqlJs.js
init_preact_shim();
var import_sqlstring_sqlite3 = __toESM(require_sqlstring_sqlite(), 1);

// ../../../qql/src/lib/qql-util.js
init_preact_shim();

// ../../../qql/src/drivers/QqlDriverSqlExec.js
init_preact_shim();

// ../../../qql/src/net/QqlRestServer.js
init_preact_shim();

// ../../../qql/src/net/QqlServer.js
init_preact_shim();

// ../../../qql/src/qql/Qql.js
init_preact_shim();

// ../../../qql/src/qql/Table.js
init_preact_shim();

// ../../../qql/src/qql/Field.js
init_preact_shim();

// ../../../qql/src/qql/Qql.js
var import_sqlstring2 = __toESM(require_sqlstring(), 1);

// ../../../qql/src/qql/QqlAnalysis.js
init_preact_shim();

// ../../../qql/src/qql/QqlEnv.js
init_preact_shim();

// ../../../quickmin-api/src/quickmin-api-react.jsx
init_preact_shim();

// ../../../quickmin-api/src/quickmin-api.js
init_preact_shim();

// ../../../quickmin-api/src/react-util.jsx
init_preact_shim();

// ../../../quickmin-api/src/quickmin-api-react.jsx
var QuickminApiContext = G();
var QuickminUserContext = G();

// ../../../quickmin/src/export/quickmin-api-react.js
init_preact_shim();

// ../../../quickmin/node_modules/quickmin-api/src/quickmin-api-react.jsx
init_preact_shim();

// ../../../quickmin/node_modules/quickmin-api/src/quickmin-api.js
init_preact_shim();

// ../../../quickmin/node_modules/url-join/lib/url-join.js
init_preact_shim();
function normalize(strArray) {
  var resultArray = [];
  if (strArray.length === 0) {
    return "";
  }
  if (typeof strArray[0] !== "string") {
    throw new TypeError("Url must be a string. Received " + strArray[0]);
  }
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    var first = strArray.shift();
    strArray[0] = first + strArray[0];
  }
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
  }
  for (var i3 = 0; i3 < strArray.length; i3++) {
    var component = strArray[i3];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i3 > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i3 < strArray.length - 1) {
      component = component.replace(/[\/]+$/, "");
    } else {
      component = component.replace(/[\/]+$/, "/");
    }
    resultArray.push(component);
  }
  var str = resultArray.join("/");
  str = str.replace(/\/(\?|&|#[^!])/g, "$1");
  var parts = str.split("?");
  str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
  return str;
}
function urlJoin() {
  var input;
  if (typeof arguments[0] === "object") {
    input = arguments[0];
  } else {
    input = [].slice.call(arguments);
  }
  return normalize(input);
}

// ../../../quickmin/node_modules/quickmin-api/src/quickmin-api.js
var QuickminApi2 = class {
  constructor(options = {}) {
    this.fetch = globalThis.fetch.bind(globalThis);
    if (options.fetch)
      this.fetch = options.fetch;
    this.url = options.url;
    if (!this.url)
      throw new Error("Need url for QuickminApi");
    this.headers = new Headers();
    if (options.headers)
      this.headers = options.headers;
    if (options.apiKey)
      this.headers.set("x-api-key", options.apiKey);
  }
  setApiKey(apiKey) {
    this.headers.set("x-api-key", apiKey);
  }
  setHeader(header, value) {
    this.headers.set(header, value);
  }
  async getCurrentUser() {
    let response = await this.fetch(urlJoin(this.url, "_getCurrentUser"));
    let reply = await response.json();
    return reply;
  }
  async findMany(table, query = {}) {
    let url = urlJoin(this.url, table) + "?filter=" + JSON.stringify(query);
    let resultsResponse = await this.fetch(url, {
      headers: this.headers
    });
    let results = await resultsResponse.json();
    return results;
  }
  async findOne(table, query = {}) {
    let results = await this.findMany(table, query);
    return results[0];
  }
  async getAuthUrls(referer, state = {}) {
    let response = await this.fetch(urlJoin(this.url, "_authUrls"), {
      method: "post",
      body: JSON.stringify({
        ...state,
        referer: referer.toString()
      })
    });
    return await response.json();
  }
  async insert(tableName, data) {
    let h3 = new Headers(this.headers);
    h3.set("content-type", "application/json");
    let response = await this.fetch(urlJoin(this.url, tableName), {
      method: "POST",
      body: JSON.stringify(data),
      headers: h3
    });
    if (response.status != 200)
      throw new Error(await response.text());
    return await response.json();
  }
  async update(tableName, id, data) {
    let h3 = new Headers(this.headers);
    h3.set("content-type", "application/json");
    let response = await this.fetch(urlJoin(this.url, tableName, String(id)), {
      method: "PUT",
      body: JSON.stringify(data),
      headers: h3
    });
    if (response.status != 200)
      throw new Error(await response.text());
    return await response.json();
  }
  async delete(tableName, id) {
    let response = await this.fetch(urlJoin(this.url, tableName, String(id)), {
      method: "DELETE",
      headers: new Headers(this.headers)
    });
    if (response.status != 200)
      throw new Error(await response.text());
    return await response.json();
  }
  async uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    let uploadResponse = await fetch(urlJoin(this.url, "_upload"), {
      method: "post",
      body: formData,
      headers: new Headers(this.headers)
    });
    if (uploadResponse.status < 200 || uploadResponse.status >= 300)
      throw new Error(await uploadResponse.text());
    let uploadResult = await uploadResponse.json();
    return uploadResult.file;
  }
};

// ../../../quickmin/node_modules/quickmin-api/src/react-util.jsx
init_preact_shim();
function useConstructor2(fn) {
  let value = F2();
  let called = F2();
  if (!called.current) {
    called.current = true;
    value.current = fn();
  }
  return value.current;
}

// ../../../quickmin/node_modules/quickmin-api/src/quickmin-api-react.jsx
var QuickminApiContext2 = G();
function QuickminApiProvider({ fetch: fetch2, url, apiKey, headers, children }) {
  let api = new QuickminApi2({ fetch: fetch2, url, apiKey, headers });
  return /* @__PURE__ */ _(QuickminApiContext2.Provider, { value: api }, children);
}
var QuickminUserState = class extends EventTarget {
  constructor(initialUser, quickminCookieName) {
    super();
    if (!quickminCookieName)
      throw new Error("No quickmin cookie name provided!");
    this.currentUser = initialUser;
    this.quickminCookieName = quickminCookieName;
  }
  logout() {
    window.document.cookie = this.quickminCookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.currentUser = null;
    this.dispatchEvent(new Event("change"));
  }
};
var QuickminUserContext2 = G();
function QuickminUserProvider({ initialUser, quickminCookieName, children }) {
  let quickminUserState = useConstructor2(() => new QuickminUserState(initialUser, quickminCookieName));
  return /* @__PURE__ */ _(QuickminUserContext2.Provider, { value: quickminUserState }, children);
}

// ../../../isoq/src/main/main.js
init_preact_shim();

// ../../../isoq/src/components/Head.js
init_preact_shim();

// ../../../isoq/src/isoq/IsoContext.js
init_preact_shim();
var IsoContext = G();
function useIsoContext() {
  return P2(IsoContext);
}
var IsoContext_default = IsoContext;

// ../../../isoq/src/utils/js-util.js
init_preact_shim();
function jsonEq2(a3, b2) {
  return JSON.stringify(a3) == JSON.stringify(b2);
}
function parseCookie(str) {
  if (!str)
    return {};
  return str.split(";").map((v3) => v3.split("=")).reduce((acc, v3) => {
    if (v3.length == 2)
      acc[decodeURIComponent(v3[0].trim())] = decodeURIComponent(v3[1].trim());
    return acc;
  }, {});
}
function stringifyCookie(key, value, options = {}) {
  let s3 = encodeURIComponent(key) + "=" + encodeURIComponent(value) + ";";
  if (options.expires)
    s3 += "expires=" + new Date(options.expires).toUTCString() + ";";
  if (options.path)
    s3 += "path=" + options.path + ";";
  else
    s3 += "path=/;";
  return s3;
}

// ../../../isoq/src/components/useIsoMemo.js
init_preact_shim();

// ../../../isoq/src/utils/react-util.js
init_preact_shim();
function useAsyncMemo(fn, deps = []) {
  let [val, setVal] = p2();
  let queueRef = F2();
  let runningRef = F2();
  q2(async () => {
    if (runningRef.current) {
      if (JSON.stringify(deps) != runningRef.current.deps) {
        queueRef.current = {
          deps: JSON.stringify(deps),
          fn
        };
      }
      return;
    }
    queueRef.current = {
      deps: JSON.stringify(deps),
      fn
    };
    while (queueRef.current) {
      runningRef.current = queueRef.current;
      queueRef.current = null;
      try {
        setVal(void 0);
        let res = await runningRef.current.fn();
        if (!queueRef.current)
          setVal(res);
      } catch (e3) {
        if (!queueRef.current)
          setVal(e3);
      }
      runningRef.current = null;
    }
  }, deps);
  return val;
}

// ../../../isoq/src/components/useIsoRef.js
init_preact_shim();

// ../../../isoq/src/components/useIsoId.js
init_preact_shim();

// ../../../isoq/src/utils/preact-refid.js
init_preact_shim();
init_preact_module();
var currentVNode;
var refIndex;
var includeFnames = false;
var oldRender = l.__r;
l.__r = (vnode) => {
  currentVNode = vnode;
  refIndex = 0;
  if (oldRender)
    oldRender(vnode);
};
function vnodePath(vnode) {
  if (!vnode)
    return "";
  let name = vnode.type;
  if (typeof name == "function") {
    if (includeFnames)
      name = name.name;
    else
      name = "C";
  }
  let key = vnode.key;
  if (!key) {
    if (vnode.__i >= 0)
      key = vnode.__i;
    else if (vnode.__ && vnode.__.__k)
      key = vnode.__.__k.indexOf(vnode);
    else
      key = 0;
    if (key < 0)
      console.log("warning: negative key in refid");
  }
  let parentPath = vnodePath(vnode.__);
  return parentPath + (parentPath ? "/" : "") + name + key;
}
function useRefId() {
  refIndex++;
  return vnodePath(currentVNode) + "#" + refIndex;
}

// ../../../isoq/src/components/useIsoId.js
function useIsoId() {
  let refId = useRefId();
  return refId;
}

// ../../../isoq/src/components/useIsoRef.js
function useIsoRef(initial, shared) {
  if (shared === void 0)
    shared = true;
  let id = useIsoId();
  let iso = useIsoContext();
  let actualRef = F2(initial);
  if (iso.isSsr()) {
    let ref = iso.getIsoRef(id, initial);
    ref.shared = shared;
    ref.id = id;
    return ref;
  } else {
    let cand = iso.getIsoRef(id);
    if (cand) {
      actualRef.current = cand.current;
      iso.markIsoRefStale(id);
    }
    actualRef.id = id;
    return actualRef;
  }
}

// ../../../isoq/src/components/useIsoBarrier.js
init_preact_shim();

// ../../../isoq/src/components/IsoSuspense.js
init_preact_shim();
var IsoSuspenseContext = G();

// ../../../isoq/src/components/useIsLoading.js
init_preact_shim();
var LoadingState = class extends EventTarget {
  constructor() {
    super();
    this.loaderCount = 0;
  }
  isLoading() {
    return this.loaderCount > 0;
  }
  updateCount(v3) {
    let loading = this.isLoading();
    this.loaderCount += v3;
    if (this.isLoading() != loading)
      this.dispatchEvent(new Event("loadingStateChange"));
  }
  createLoader() {
    let resolved = false;
    this.updateCount(1);
    return () => {
      if (resolved)
        return;
      resolved = true;
      this.updateCount(-1);
    };
  }
};
function useLoadingState() {
  let iso = useIsoContext();
  if (!iso.loadingState)
    iso.loadingState = new LoadingState();
  return iso.loadingState;
}

// ../../../isoq/src/components/useIsoBarrier.js
function useIsoBarrier() {
  let isoSuspenseContext = P2(IsoSuspenseContext);
  let loadingState = useLoadingState();
  let iso = useIsoContext();
  let id = useIsoId();
  let resolver = F2();
  let resolved = F2();
  A2(() => {
    if (!resolved.current) {
      if (!resolver.current) {
        let fns = [loadingState.createLoader()];
        if (isoSuspenseContext)
          fns.push(isoSuspenseContext.createBarrier());
        resolver.current = () => {
          for (let fn of fns)
            fn();
        };
      }
      return () => {
        if (resolver.current) {
          resolved.current = true;
          resolver.current();
        }
      };
    }
  }, []);
  let barrier = iso.getBarrier(id);
  return () => {
    barrier();
    resolved.current = true;
    if (resolver.current)
      resolver.current();
  };
}

// ../../../isoq/src/components/IsoErrorBoundary.js
init_preact_shim();

// ../../../isoq/src/utils/SourceMapper.js
init_preact_shim();

// ../../../isoq/node_modules/stacktrace-parser/dist/stack-trace-parser.esm.js
init_preact_shim();
var UNKNOWN_FUNCTION = "<unknown>";
function parse(stackString) {
  var lines = stackString.split("\n");
  return lines.reduce(function(stack, line) {
    var parseResult = parseChrome(line) || parseWinjs(line) || parseGecko(line) || parseNode(line) || parseJSC(line);
    if (parseResult) {
      stack.push(parseResult);
    }
    return stack;
  }, []);
}
var chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var chromeEvalRe = /\((\S*)(?::(\d+))(?::(\d+))\)/;
function parseChrome(line) {
  var parts = chromeRe.exec(line);
  if (!parts) {
    return null;
  }
  var isNative = parts[2] && parts[2].indexOf("native") === 0;
  var isEval = parts[2] && parts[2].indexOf("eval") === 0;
  var submatch = chromeEvalRe.exec(parts[2]);
  if (isEval && submatch != null) {
    parts[2] = submatch[1];
    parts[3] = submatch[2];
    parts[4] = submatch[3];
  }
  return {
    file: !isNative ? parts[2] : null,
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: isNative ? [parts[2]] : [],
    lineNumber: parts[3] ? +parts[3] : null,
    column: parts[4] ? +parts[4] : null
  };
}
var winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function parseWinjs(line) {
  var parts = winjsRe.exec(line);
  if (!parts) {
    return null;
  }
  return {
    file: parts[2],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[3],
    column: parts[4] ? +parts[4] : null
  };
}
var geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
var geckoEvalRe = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
function parseGecko(line) {
  var parts = geckoRe.exec(line);
  if (!parts) {
    return null;
  }
  var isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
  var submatch = geckoEvalRe.exec(parts[3]);
  if (isEval && submatch != null) {
    parts[3] = submatch[1];
    parts[4] = submatch[2];
    parts[5] = null;
  }
  return {
    file: parts[3],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: parts[2] ? parts[2].split(",") : [],
    lineNumber: parts[4] ? +parts[4] : null,
    column: parts[5] ? +parts[5] : null
  };
}
var javaScriptCoreRe = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
function parseJSC(line) {
  var parts = javaScriptCoreRe.exec(line);
  if (!parts) {
    return null;
  }
  return {
    file: parts[3],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[4],
    column: parts[5] ? +parts[5] : null
  };
}
var nodeRe = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function parseNode(line) {
  var parts = nodeRe.exec(line);
  if (!parts) {
    return null;
  }
  return {
    file: parts[2],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[3],
    column: parts[4] ? +parts[4] : null
  };
}

// ../../../isoq/src/utils/SourceMapper.js
var import_path_resolve = __toESM(require_path_resolve(), 1);
var SourceMapper = class {
  constructor() {
  }
  async transformError(error) {
    let sourceMapConsumer = await new this.SourceMapConsumer(this.map);
    let stack = parse(error.stack);
    let entryLines = [];
    for (let entry of stack) {
      let original = sourceMapConsumer.originalPositionFor({
        line: entry.lineNumber,
        column: entry.column
      });
      let sourceUrl = this.resolveSource(original.source);
      if (original.name) {
        entryLines.push(
          "    at " + original.name + " (" + sourceUrl + ":" + original.line + ":" + original.column + ")"
        );
      } else {
        entryLines.push(
          "    at " + sourceUrl + ":" + original.line + ":" + original.column
        );
      }
    }
    if (sourceMapConsumer.destroy)
      sourceMapConsumer.destroy();
    return {
      message: String(error),
      stack: String(error) + "\n" + entryLines.join("\n"),
      toString: () => error.toString()
    };
  }
  resolveSource(sourceName) {
    let resolvedSource = (0, import_path_resolve.default)(this.mapDir, sourceName);
    if (resolvedSource.startsWith("/"))
      return "file://" + resolvedSource;
    else
      return "file:///" + resolvedSource;
  }
};

// ../../../isoq/src/components/IsoErrorBoundary.js
var ErrorBoundaryComponent = class extends b {
  componentDidCatch(error, info) {
  }
  static getDerivedStateFromError(error) {
    console.error(error);
    return { error };
  }
  render() {
    let error;
    if (this.props.error)
      error = this.props.error;
    if (this.state.error)
      error = this.state.error;
    if (this.state.transformedError)
      error = this.state.transformedError;
    if (error) {
      if (!this.props.iso.isSsr() && !this.state.transformed && window.sourceMap) {
        this.setState({ transformed: true });
        (async () => {
          let mapper = new SourceMapper();
          let response = await fetch("/client.js.map", window.location);
          mapper.map = await response.json();
          mapper.SourceMapConsumer = window.sourceMap.SourceMapConsumer;
          mapper.mapDir = window.__sourcemapRoot;
          let transformedError = await mapper.transformError(error);
          this.setState({ transformedError });
        })();
      }
      return _(this.props.fallback, { error });
    }
    return this.props.children;
  }
};
var IsoErrorBoundaryContext = G();
function IsoErrorBoundary({ fallback, children, error }) {
  let iso = useIsoContext();
  let [currentError, setCurrentError] = p2(error);
  if (iso.isSsr())
    iso.setErrorFallback(fallback);
  return _(
    IsoErrorBoundaryContext.Provider,
    { value: setCurrentError },
    _(
      ErrorBoundaryComponent,
      {
        fallback,
        error: currentError,
        iso
      },
      children
    )
  );
}
function useIsoErrorBoundary() {
  let iso = useIsoContext();
  let throwError = P2(IsoErrorBoundaryContext);
  if (!throwError)
    return;
  return (e3) => {
    if (iso.isSsr()) {
      iso.setError(e3);
    }
    throwError(e3);
  };
}

// ../../../isoq/src/components/useIsoMemo.js
function useIsoMemo(fn, deps = []) {
  let iso = useIsoContext();
  let ref = useIsoRef();
  let barrier = useIsoBarrier();
  let throwError = useIsoErrorBoundary();
  if (iso.isSsr()) {
    if (ref.current)
      return ref.current.data;
    (async () => {
      try {
        ref.current = { deps };
        ref.current.data = await fn();
      } catch (e3) {
        console.log("caught error in useIsoMemo");
        console.error(e3);
        throwError(e3);
      }
      barrier();
    })();
  } else {
    let memoRes = useAsyncMemo(async () => {
      if (ref.current && jsonEq2(ref.current.deps, deps)) {
        barrier();
        return;
      }
      ref.current = null;
      let data = await fn();
      barrier();
      ref.current = {
        deps,
        data
      };
      return {};
    }, deps);
    if (memoRes instanceof Error) {
      throwError(memoRes);
      return;
    }
    if (ref.current && jsonEq2(ref.current.deps, deps)) {
      barrier();
      return ref.current.data;
    }
  }
}

// ../../../isoq/src/components/useIsoCookie.js
init_preact_shim();

// ../../../isoq/src/components/IsoModifyContext.js
init_preact_shim();

// index.jsx
function hello_quickmin_default() {
  let qql = useQql();
  let pages = useIsoMemo(() => qql({ manyFrom: "pages" }));
  if (!pages)
    return;
  return /* @__PURE__ */ _(k, null, "page titles:", /* @__PURE__ */ _("ul", null, pages.map(
    (page) => /* @__PURE__ */ _("li", null, page.title)
  )));
}

// ../../packages/katnip-quickmin/katnip-quickmin-isomain.jsx
var katnip_quickmin_isomain_exports = {};
__export(katnip_quickmin_isomain_exports, {
  Wrapper: () => Wrapper
});
init_preact_shim();

// ../../packages/katnip-quickmin/node_modules/url-join/lib/url-join.js
init_preact_shim();
function normalize2(strArray) {
  var resultArray = [];
  if (strArray.length === 0) {
    return "";
  }
  if (typeof strArray[0] !== "string") {
    throw new TypeError("Url must be a string. Received " + strArray[0]);
  }
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    var first = strArray.shift();
    strArray[0] = first + strArray[0];
  }
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
  }
  for (var i3 = 0; i3 < strArray.length; i3++) {
    var component = strArray[i3];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i3 > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i3 < strArray.length - 1) {
      component = component.replace(/[\/]+$/, "");
    } else {
      component = component.replace(/[\/]+$/, "/");
    }
    resultArray.push(component);
  }
  var str = resultArray.join("/");
  str = str.replace(/\/(\?|&|#[^!])/g, "$1");
  var parts = str.split("?");
  str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
  return str;
}
function urlJoin2() {
  var input;
  if (typeof arguments[0] === "object") {
    input = arguments[0];
  } else {
    input = [].slice.call(arguments);
  }
  return normalize2(input);
}

// ../../packages/katnip-quickmin/katnip-quickmin-isomain.jsx
Wrapper.priority = 5;
function Wrapper({ quickminUser, quickminCookieName, children }) {
  let iso = useIsoContext();
  let qqlRef = F2();
  if (!qqlRef.current) {
    qqlRef.current = createQqlClient({
      url: urlJoin2(iso.appPathname, "admin/_qql"),
      fetch: iso.fetch
    });
    iso.qql = qqlRef.current;
  }
  return /* @__PURE__ */ _(QqlProvider, { qql: qqlRef.current }, /* @__PURE__ */ _(QuickminApiProvider, { url: urlJoin2(iso.appPathname, "admin"), fetch: iso.fetch }, /* @__PURE__ */ _(
    QuickminUserProvider,
    {
      initialUser: quickminUser,
      quickminCookieName
    },
    children
  )));
}

// node_modules/.katnip/main.jsx
var isoqModules = [hello_quickmin_exports, katnip_quickmin_isomain_exports];
var mains = [];
for (let mod of isoqModules) {
  if (mod.default)
    mains.push(mod.default);
}
var wrappers = [];
for (let mod of isoqModules) {
  if (mod.Wrapper) {
    if (!mod.Wrapper.priority)
      mod.Wrapper.priority = 10;
    wrappers.push(mod.Wrapper);
  }
}
wrappers.sort((a3, b2) => b2.priority - a3.priority);
function main_default(props) {
  let main = [];
  for (let Main of mains)
    main.push(/* @__PURE__ */ _(Main, { ...props }));
  for (let Wrapper2 of wrappers)
    main = /* @__PURE__ */ _(Wrapper2, { ...props }, main);
  return /* @__PURE__ */ _(k, null, main);
}

// ../../../isoq/src/isoq/client-internals.js
init_preact_shim();

// ../../../isoq/src/isoq/IsoqClient.js
init_preact_shim();

// ../../../isoq/node_modules/url-join/lib/url-join.js
init_preact_shim();
function normalize3(strArray) {
  var resultArray = [];
  if (strArray.length === 0) {
    return "";
  }
  if (typeof strArray[0] !== "string") {
    throw new TypeError("Url must be a string. Received " + strArray[0]);
  }
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    var first = strArray.shift();
    strArray[0] = first + strArray[0];
  }
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
  }
  for (var i3 = 0; i3 < strArray.length; i3++) {
    var component = strArray[i3];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i3 > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i3 < strArray.length - 1) {
      component = component.replace(/[\/]+$/, "");
    } else {
      component = component.replace(/[\/]+$/, "/");
    }
    resultArray.push(component);
  }
  var str = resultArray.join("/");
  str = str.replace(/\/(\?|&|#[^!])/g, "$1");
  var parts = str.split("?");
  str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
  return str;
}
function urlJoin3() {
  var input;
  if (typeof arguments[0] === "object") {
    input = arguments[0];
  } else {
    input = [].slice.call(arguments);
  }
  return normalize3(input);
}

// ../../../isoq/src/isoq/IsoqClient.js
var IsoqClient = class {
  constructor({ props, refs, appPathname, window: window2 }) {
    this.window = window2;
    this.refs = refs;
    this.props = props;
    this.appPathname = appPathname;
    this.req = new Request(this.window.location);
    this.cookieDispatcher = new EventTarget();
    this.undefRefs = [];
  }
  getIsoRef(id) {
    if (this.hydration && !this.refs.hasOwnProperty(id))
      this.undefRefs.push(id);
    return this.refs[id];
  }
  markIsoRefStale(id) {
    delete this.refs[id];
  }
  isSsr() {
    return false;
  }
  getUrl() {
    return this.window.location;
  }
  getAppUrl(pathname) {
    if (!pathname)
      pathname = "";
    let u3 = new URL(urlJoin3(this.appPathname, pathname), this.getUrl());
    return u3.toString();
  }
  getWindow() {
    return this.window;
  }
  redirect(url) {
    this.window.location = url;
  }
  fetch = async (url, options = {}) => {
    if (url.startsWith("/"))
      url = new URL(this.req.url).origin + url;
    return await this.window.fetch(url, options);
  };
  getBarrier(id) {
    return () => {
    };
  }
  unresolveBarrier() {
  }
  getCookie(key) {
    let parsedCookie = parseCookie(this.window.document.cookie);
    return parsedCookie[key];
  }
  setCookie(key, value, options = {}) {
    document.cookie = stringifyCookie(key, value, options);
    this.cookieDispatcher.dispatchEvent(new Event(key));
  }
};

// ../../../isoq/src/isoq/DefaultErrorFallback.js
init_preact_shim();
function DefaultErrorFallback({ error }) {
  let style = {
    position: "fixed",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    zOrder: "100",
    backgroundColor: "#000000",
    color: "#ff0000",
    fontSize: "16px",
    fontFamily: "monospace",
    borderStyle: "solid",
    borderWidth: "0.5em",
    borderColor: "#ff0000",
    padding: "0.5em",
    boxSizing: "border-box",
    whiteSpace: "pre"
  };
  let message = error.toString();
  if (error.stack)
    message = error.stack;
  return _("div", { style }, message);
}

// ../../../isoq/src/isoq/client.jsx
if (!window.__isoError && window.__iso) {
  let isoClient = new IsoqClient({ ...window.__iso, window });
  let content = /* @__PURE__ */ _(IsoContext_default.Provider, { value: isoClient }, /* @__PURE__ */ _(IsoErrorBoundary, { fallback: DefaultErrorFallback }, /* @__PURE__ */ _(main_default, { ...isoClient.props })));
  isoClient.hydration = true;
  D(content, document.getElementById("isoq"));
  isoClient.hydration = false;
  if (isoClient.undefRefs.length) {
  }
  if (Object.keys(isoClient.refs).length) {
    console.log(
      "** Warning, unused refs: ",
      Object.keys(isoClient.refs)
    );
  }
}
