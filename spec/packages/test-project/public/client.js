var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// ../../Repo/isoq/node_modules/.pnpm/@einheit+path-resolve@1.2.0/node_modules/@einheit/path-resolve/index.js
var require_path_resolve = __commonJS({
  "../../Repo/isoq/node_modules/.pnpm/@einheit+path-resolve@1.2.0/node_modules/@einheit/path-resolve/index.js"(exports, module) {
    "use strict";
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
      for (var i4 = 0; i4 <= path.length; ++i4) {
        if (i4 < path.length) {
          code = path.charCodeAt(i4);
        } else if (code === SLASH) {
          break;
        } else {
          code = SLASH;
        }
        if (code === SLASH) {
          if (lastSlash === i4 - 1 || dots === 1) {
          } else if (lastSlash !== i4 - 1 && dots === 2) {
            if (res.length < 2 || !isAboveRoot || res.charCodeAt(res.length - 1) !== DOT || res.charCodeAt(res.length - 2) !== DOT) {
              if (res.length > 2) {
                var start = res.length - 1;
                var j5 = start;
                for (; j5 >= 0; --j5) {
                  if (res.charCodeAt(j5) === SLASH) {
                    break;
                  }
                }
                if (j5 !== start) {
                  res = j5 === -1 ? "" : res.slice(0, j5);
                  lastSlash = i4;
                  dots = 0;
                  isAboveRoot = false;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSlash = i4;
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
            var slice = path.slice(lastSlash + 1, i4);
            if (res.length > 0) {
              res += "/" + slice;
            } else {
              res = slice;
            }
            isAboveRoot = false;
          }
          lastSlash = i4;
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
      for (var i4 = paths.length - 1; i4 >= -1 && !resolvedAbsolute; i4--) {
        var path = void 0;
        if (i4 >= 0) {
          path = paths[i4];
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

// ../../Repo/qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/lib/SqlString.js
var require_SqlString = __commonJS({
  "../../Repo/qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/lib/SqlString.js"(exports) {
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
        for (var i4 = 0; i4 < val.length; i4++) {
          sql += (i4 === 0 ? "" : ", ") + SqlString.escapeId(val[i4], forbidQualified);
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
      for (var i4 = 0; i4 < array.length; i4++) {
        var val = array[i4];
        if (Array.isArray(val)) {
          sql += (i4 === 0 ? "" : ", ") + "(" + SqlString.arrayToList(val, timeZone) + ")";
        } else {
          sql += (i4 === 0 ? "" : ", ") + SqlString.escape(val, true, timeZone);
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

// ../../Repo/qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/index.js
var require_sqlstring_sqlite = __commonJS({
  "../../Repo/qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/index.js"(exports, module) {
    module.exports = require_SqlString();
  }
});

// ../../Repo/qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/lib/SqlString.js
var require_SqlString2 = __commonJS({
  "../../Repo/qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/lib/SqlString.js"(exports) {
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
        for (var i4 = 0; i4 < val.length; i4++) {
          sql += (i4 === 0 ? "" : ", ") + SqlString.escapeId(val[i4], forbidQualified);
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
      for (var i4 = 0; i4 < array.length; i4++) {
        var val = array[i4];
        if (Array.isArray(val)) {
          sql += (i4 === 0 ? "" : ", ") + "(" + SqlString.arrayToList(val, timeZone) + ")";
        } else {
          sql += (i4 === 0 ? "" : ", ") + SqlString.escape(val, true, timeZone);
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

// ../../Repo/qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/index.js
var require_sqlstring = __commonJS({
  "../../Repo/qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/index.js"(exports, module) {
    module.exports = require_SqlString2();
  }
});

// ../../Repo/isoq/node_modules/.pnpm/preact@10.26.9/node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var w = Array.isArray;
function d(n2, l3) {
  for (var u4 in l3)
    n2[u4] = l3[u4];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l3, u4, t3) {
  var i4, r3, o3, e3 = {};
  for (o3 in u4)
    "key" == o3 ? i4 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps)
    for (o3 in l3.defaultProps)
      void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
  return m(l3, e3, i4, r3, null);
}
function m(n2, t3, i4, r3, o3) {
  var e3 = { type: n2, props: t3, key: i4, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
  return null == o3 && null != l.vnode && l.vnode(e3), e3;
}
function k(n2) {
  return n2.children;
}
function x(n2, l3) {
  this.props = n2, this.context = l3;
}
function S(n2, l3) {
  if (null == l3)
    return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++)
    if (null != (u4 = n2.__k[l3]) && null != u4.__e)
      return u4.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
      if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
        n2.__e = n2.__c.base = u4.__e;
        break;
      }
    return C(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
}
function $() {
  for (var n2, u4, t3, r3, o3, f4, c3, s3 = 1; i.length; )
    i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, o3 = (r3 = (u4 = n2).__v).__e, f4 = [], c3 = [], u4.__P && ((t3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(t3), O(u4.__P, t3, r3, u4.__n, u4.__P.namespaceURI, 32 & r3.__u ? [o3] : null, f4, null == o3 ? S(r3) : o3, !!(32 & r3.__u), c3), t3.__v = r3.__v, t3.__.__k[t3.__i] = t3, z(f4, t3, c3), t3.__e != o3 && C(t3)));
  $.__r = 0;
}
function I(n2, l3, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, y3, w3, d3, g5, _3 = t3 && t3.__k || v, m3 = l3.length;
  for (f4 = P(u4, l3, _3, f4, m3), a3 = 0; a3 < m3; a3++)
    null != (y3 = u4.__k[a3]) && (h3 = -1 == y3.__i ? p : _3[y3.__i] || p, y3.__i = a3, g5 = O(n2, y3, h3, i4, r3, o3, e3, f4, c3, s3), w3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && q(h3.ref, null, y3), s3.push(y3.ref, y3.__c || w3, y3)), null == d3 && null != w3 && (d3 = w3), 4 & y3.__u || h3.__k === y3.__k ? f4 = A(y3, f4, n2) : "function" == typeof y3.type && void 0 !== g5 ? f4 = g5 : w3 && (f4 = w3.nextSibling), y3.__u &= -7);
  return u4.__e = d3, f4;
}
function P(n2, l3, u4, t3, i4) {
  var r3, o3, e3, f4, c3, s3 = u4.length, a3 = s3, h3 = 0;
  for (n2.__k = new Array(i4), r3 = 0; r3 < i4; r3++)
    null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f4 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : w(o3) ? m(k, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = L(o3, u4, f4, a3)) && (a3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i4 > s3 ? h3-- : i4 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (a3)
    for (r3 = 0; r3 < s3; r3++)
      null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), B(e3, e3));
  return t3;
}
function A(n2, l3, u4) {
  var t3, i4;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i4 = 0; t3 && i4 < t3.length; i4++)
      t3[i4] && (t3[i4].__ = n2, l3 = A(t3[i4], l3, u4));
    return l3;
  }
  n2.__e != l3 && (l3 && n2.type && !u4.contains(l3) && (l3 = S(n2)), u4.insertBefore(n2.__e, l3 || null), l3 = n2.__e);
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function H(n2, l3) {
  return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (w(n2) ? n2.some(function(n3) {
    H(n3, l3);
  }) : l3.push(n2)), l3;
}
function L(n2, l3, u4, t3) {
  var i4, r3, o3 = n2.key, e3 = n2.type, f4 = l3[u4];
  if (null === f4 && null == n2.key || f4 && o3 == f4.key && e3 == f4.type && 0 == (2 & f4.__u))
    return u4;
  if (t3 > (null != f4 && 0 == (2 & f4.__u) ? 1 : 0))
    for (i4 = u4 - 1, r3 = u4 + 1; i4 >= 0 || r3 < l3.length; ) {
      if (i4 >= 0) {
        if ((f4 = l3[i4]) && 0 == (2 & f4.__u) && o3 == f4.key && e3 == f4.type)
          return i4;
        i4--;
      }
      if (r3 < l3.length) {
        if ((f4 = l3[r3]) && 0 == (2 & f4.__u) && o3 == f4.key && e3 == f4.type)
          return r3;
        r3++;
      }
    }
  return -1;
}
function T(n2, l3, u4) {
  "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || y.test(l3) ? u4 : u4 + "px";
}
function j(n2, l3, u4, t3, i4) {
  var r3, o3;
  n:
    if ("style" == l3)
      if ("string" == typeof u4)
        n2.style.cssText = u4;
      else {
        if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3)
          for (l3 in t3)
            u4 && l3 in u4 || T(n2.style, l3, "");
        if (u4)
          for (l3 in u4)
            t3 && u4[l3] == t3[l3] || T(n2.style, l3, u4[l3]);
      }
    else if ("o" == l3[0] && "n" == l3[1])
      r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
    else {
      if ("http://www.w3.org/2000/svg" == i4)
        l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2)
        try {
          n2[l3] = null == u4 ? "" : u4;
          break n;
        } catch (n3) {
        }
      "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
    }
}
function F(n2) {
  return function(u4) {
    if (this.l) {
      var t3 = this.l[u4.type + n2];
      if (null == u4.t)
        u4.t = c++;
      else if (u4.t < t3.u)
        return;
      return t3(l.event ? l.event(u4) : u4);
    }
  };
}
function O(n2, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, p3, v3, y3, _3, m3, b2, S2, C4, M2, $2, P5, A5, H4, L2, T5, j5 = u4.type;
  if (null != u4.constructor)
    return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (a3 = l.__b) && a3(u4);
  n:
    if ("function" == typeof j5)
      try {
        if (b2 = u4.props, S2 = "prototype" in j5 && j5.prototype.render, C4 = (a3 = j5.contextType) && i4[a3.__c], M2 = a3 ? C4 ? C4.props.value : a3.__ : i4, t3.__c ? m3 = (h3 = u4.__c = t3.__c).__ = h3.__E : (S2 ? u4.__c = h3 = new j5(b2, M2) : (u4.__c = h3 = new x(b2, M2), h3.constructor = j5, h3.render = D), C4 && C4.sub(h3), h3.props = b2, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i4, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j5.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, j5.getDerivedStateFromProps(b2, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u4, p3)
          S2 && null == j5.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
        else {
          if (S2 && null == j5.getDerivedStateFromProps && b2 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b2, M2), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b2, h3.__s, M2) || u4.__v == t3.__v) {
            for (u4.__v != t3.__v && (h3.props = b2, h3.state = h3.__s, h3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
              n3 && (n3.__ = u4);
            }), $2 = 0; $2 < h3._sb.length; $2++)
              h3.__h.push(h3._sb[$2]);
            h3._sb = [], h3.__h.length && e3.push(h3);
            break n;
          }
          null != h3.componentWillUpdate && h3.componentWillUpdate(b2, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
            h3.componentDidUpdate(v3, y3, _3);
          });
        }
        if (h3.context = M2, h3.props = b2, h3.__P = n2, h3.__e = false, P5 = l.__r, A5 = 0, S2) {
          for (h3.state = h3.__s, h3.__d = false, P5 && P5(u4), a3 = h3.render(h3.props, h3.state, h3.context), H4 = 0; H4 < h3._sb.length; H4++)
            h3.__h.push(h3._sb[H4]);
          h3._sb = [];
        } else
          do {
            h3.__d = false, P5 && P5(u4), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
          } while (h3.__d && ++A5 < 25);
        h3.state = h3.__s, null != h3.getChildContext && (i4 = d(d({}, i4), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_3 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = N(a3.props.children)), f4 = I(n2, w(L2) ? L2 : [L2], u4, t3, i4, r3, o3, e3, f4, c3, s3), h3.base = u4.__e, u4.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
      } catch (n3) {
        if (u4.__v = null, c3 || null != o3)
          if (n3.then) {
            for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; )
              f4 = f4.nextSibling;
            o3[o3.indexOf(f4)] = null, u4.__e = f4;
          } else
            for (T5 = o3.length; T5--; )
              g(o3[T5]);
        else
          u4.__e = t3.__e, u4.__k = t3.__k;
        l.__e(n3, u4, t3);
      }
    else
      null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = V(t3.__e, u4, t3, i4, r3, o3, e3, c3, s3);
  return (a3 = l.diffed) && a3(u4), 128 & u4.__u ? void 0 : f4;
}
function z(n2, u4, t3) {
  for (var i4 = 0; i4 < t3.length; i4++)
    q(t3[i4], t3[++i4], t3[++i4]);
  l.__c && l.__c(u4, n2), n2.some(function(u5) {
    try {
      n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
        n3.call(u5);
      });
    } catch (n3) {
      l.__e(n3, u5.__v);
    }
  });
}
function N(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w(n2) ? n2.map(N) : d({}, n2);
}
function V(u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, v3, y3, d3, _3, m3, b2 = i4.props, k3 = t3.props, x4 = t3.type;
  if ("svg" == x4 ? o3 = "http://www.w3.org/2000/svg" : "math" == x4 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (a3 = 0; a3 < e3.length; a3++)
      if ((d3 = e3[a3]) && "setAttribute" in d3 == !!x4 && (x4 ? d3.localName == x4 : 3 == d3.nodeType)) {
        u4 = d3, e3[a3] = null;
        break;
      }
  }
  if (null == u4) {
    if (null == x4)
      return document.createTextNode(k3);
    u4 = document.createElementNS(o3, x4, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x4)
    b2 === k3 || c3 && u4.data == k3 || (u4.data = k3);
  else {
    if (e3 = e3 && n.call(u4.childNodes), b2 = i4.props || p, !c3 && null != e3)
      for (b2 = {}, a3 = 0; a3 < u4.attributes.length; a3++)
        b2[(d3 = u4.attributes[a3]).name] = d3.value;
    for (a3 in b2)
      if (d3 = b2[a3], "children" == a3)
        ;
      else if ("dangerouslySetInnerHTML" == a3)
        v3 = d3;
      else if (!(a3 in k3)) {
        if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3)
          continue;
        j(u4, a3, null, d3, o3);
      }
    for (a3 in k3)
      d3 = k3[a3], "children" == a3 ? y3 = d3 : "dangerouslySetInnerHTML" == a3 ? h3 = d3 : "value" == a3 ? _3 = d3 : "checked" == a3 ? m3 = d3 : c3 && "function" != typeof d3 || b2[a3] === d3 || j(u4, a3, d3, b2[a3], o3);
    if (h3)
      c3 || v3 && (h3.__html == v3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
    else if (v3 && (u4.innerHTML = ""), I("template" == t3.type ? u4.content : u4, w(y3) ? y3 : [y3], t3, i4, r3, "foreignObject" == x4 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i4.__k && S(i4, 0), c3, s3), null != e3)
      for (a3 = e3.length; a3--; )
        g(e3[a3]);
    c3 || (a3 = "value", "progress" == x4 && null == _3 ? u4.removeAttribute("value") : null != _3 && (_3 !== u4[a3] || "progress" == x4 && !_3 || "option" == x4 && _3 != b2[a3]) && j(u4, a3, _3, b2[a3], o3), a3 = "checked", null != m3 && m3 != u4[a3] && j(u4, a3, m3, b2[a3], o3));
  }
  return u4;
}
function q(n2, u4, t3) {
  try {
    if ("function" == typeof n2) {
      var i4 = "function" == typeof n2.__u;
      i4 && n2.__u(), i4 && null == u4 || (n2.__u = n2(u4));
    } else
      n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function B(n2, u4, t3) {
  var i4, r3;
  if (l.unmount && l.unmount(n2), (i4 = n2.ref) && (i4.current && i4.current != n2.__e || q(i4, null, u4)), null != (i4 = n2.__c)) {
    if (i4.componentWillUnmount)
      try {
        i4.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u4);
      }
    i4.base = i4.__P = null;
  }
  if (i4 = n2.__k)
    for (r3 = 0; r3 < i4.length; r3++)
      i4[r3] && B(i4[r3], u4, t3 || "function" != typeof n2.type);
  t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function D(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function E(u4, t3, i4) {
  var r3, o3, e3, f4;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i4) ? null : i4 && i4.__k || t3.__k, e3 = [], f4 = [], O(t3, u4 = (!r3 && i4 || t3).__k = _(k, null, [u4]), o3 || p, p, t3.namespaceURI, !r3 && i4 ? [i4] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i4 ? i4 : o3 ? o3.__e : t3.firstChild, r3, f4), z(e3, u4, f4);
}
function G(n2, l3) {
  E(n2, l3, G);
}
function K(n2) {
  function l3(n3) {
    var u4, t3;
    return this.getChildContext || (u4 = /* @__PURE__ */ new Set(), (t3 = {})[l3.__c] = this, this.getChildContext = function() {
      return t3;
    }, this.componentWillUnmount = function() {
      u4 = null;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value != n4.value && u4.forEach(function(n5) {
        n5.__e = true, M(n5);
      });
    }, this.sub = function(n4) {
      u4.add(n4);
      var l4 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u4 && u4.delete(n4), l4 && l4.call(n4);
      };
    }), n3.children;
  }
  return l3.__c = "__cC" + h++, l3.__ = n2, l3.Provider = l3.__l = (l3.Consumer = function(n3, l4) {
    return n3.children(l4);
  }).contextType = l3, l3;
}
n = v.slice, l = { __e: function(n2, l3, u4, t3) {
  for (var i4, r3, o3; l3 = l3.__; )
    if ((i4 = l3.__c) && !i4.__)
      try {
        if ((r3 = i4.constructor) && null != r3.getDerivedStateFromError && (i4.setState(r3.getDerivedStateFromError(n2)), o3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n2, t3 || {}), o3 = i4.__d), o3)
          return i4.__E = i4;
      } catch (l4) {
        n2 = l4;
      }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && null == n2.constructor;
}, x.prototype.setState = function(n2, l3) {
  var u4;
  u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u4), this.props)), n2 && d(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;

// ../../Repo/isoq/node_modules/.pnpm/preact@10.26.9/node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
}
function d2(n2) {
  return o2 = 1, h2(D2, n2);
}
function h2(n2, u4, i4) {
  var o3 = p2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i4 ? i4(u4) : D2(void 0, u4), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.__f)) {
    var f4 = function(n3, t3, r3) {
      if (!o3.__c.__H)
        return true;
      var u5 = o3.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u5.every(function(n4) {
        return !n4.__N;
      }))
        return !c3 || c3.call(this, n3, t3, r3);
      var i5 = o3.__c.props !== n3;
      return u5.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i5 = true);
        }
      }), c3 && c3.call(this, n3, t3, r3) || i5;
    };
    r2.__f = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u5 = c3;
        c3 = void 0, f4(n3, t3, r3), c3 = u5;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f4;
  }
  return o3.__N || o3.__;
}
function y2(n2, u4) {
  var i4 = p2(t2++, 3);
  !c2.__s && C2(i4.__H, u4) && (i4.__ = n2, i4.u = u4, r2.__H.__h.push(i4));
}
function _2(n2, u4) {
  var i4 = p2(t2++, 4);
  !c2.__s && C2(i4.__H, u4) && (i4.__ = n2, i4.u = u4, r2.__h.push(i4));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function T2(n2, r3) {
  var u4 = p2(t2++, 7);
  return C2(u4.__H, r3) && (u4.__ = n2(), u4.__H = r3, u4.__h = n2), u4.__;
}
function q2(n2, t3) {
  return o2 = 8, T2(function() {
    return n2;
  }, t3);
}
function x2(n2) {
  var u4 = r2.context[n2.__c], i4 = p2(t2++, 9);
  return i4.c = n2, u4 ? (null == i4.__ && (i4.__ = true, u4.sub(r2)), u4.props.value) : n2.__;
}
function P2(n2, t3) {
  c2.useDebugValue && c2.useDebugValue(t3 ? t3(n2) : n2);
}
function j2() {
  for (var n2; n2 = f2.shift(); )
    if (n2.__P && n2.__H)
      try {
        n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
      } catch (t3) {
        n2.__H.__h = [], c2.__e(t3, n2.__v);
      }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i4 = (r2 = n2.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i4.__h.forEach(z2), i4.__h.forEach(B2), i4.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u4 = setTimeout(r3, 35);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u4 = n2.__c;
  "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
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

// ../../Repo/isoq/node_modules/.pnpm/preact@10.26.9/node_modules/preact/compat/dist/compat.module.js
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
  var e3 = t3(), r3 = d2({ t: { __: e3, u: t3 } }), u4 = r3[0].t, o3 = r3[1];
  return _2(function() {
    u4.__ = e3, u4.u = t3, x3(u4) && o3({ t: u4 });
  }, [n2, e3, t3]), y2(function() {
    return x3(u4) && o3({ t: u4 }), n2(function() {
      x3(u4) && o3({ t: u4 });
    });
  }, [n2]), e3;
}
function x3(n2) {
  var t3, e3, r3 = n2.u, u4 = n2.__;
  try {
    var o3 = r3();
    return !((t3 = u4) === (e3 = o3) && (0 !== t3 || 1 / t3 == 1 / e3) || t3 != t3 && e3 != e3);
  } catch (n3) {
    return true;
  }
}
function N2(n2, t3) {
  this.props = n2, this.context = t3;
}
(N2.prototype = new x()).isPureReactComponent = true, N2.prototype.shouldComponentUpdate = function(n2, t3) {
  return E2(this.props, n2) || E2(this.state, t3);
};
var T3 = l.__b;
l.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T3 && T3(n2);
};
var A3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
var F3 = l.__e;
l.__e = function(n2, t3, e3, r3) {
  if (n2.then) {
    for (var u4, o3 = t3; o3 = o3.__; )
      if ((u4 = o3.__c) && u4.__c)
        return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u4.__c(n2, t3);
  }
  F3(n2, t3, e3, r3);
};
var U = l.unmount;
function V2(n2, t3, e3) {
  return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
    "function" == typeof n3.__c && n3.__c();
  }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
    return V2(n3, t3, e3);
  })), n2;
}
function W(n2, t3, e3) {
  return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
    return W(n3, t3, e3);
  }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
}
function P3() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j3(n2) {
  var t3 = n2.__.__c;
  return t3 && t3.__a && t3.__a(n2);
}
function B3() {
  this.i = null, this.l = null;
}
l.unmount = function(n2) {
  var t3 = n2.__c;
  t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), U && U(n2);
}, (P3.prototype = new x()).__c = function(n2, t3) {
  var e3 = t3.__c, r3 = this;
  null == r3.o && (r3.o = []), r3.o.push(e3);
  var u4 = j3(r3.__v), o3 = false, i4 = function() {
    o3 || (o3 = true, e3.__R = null, u4 ? u4(l3) : l3());
  };
  e3.__R = i4;
  var l3 = function() {
    if (!--r3.__u) {
      if (r3.state.__a) {
        var n3 = r3.state.__a;
        r3.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
      }
      var t4;
      for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); )
        t4.forceUpdate();
    }
  };
  r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i4, i4);
}, P3.prototype.componentWillUnmount = function() {
  this.o = [];
}, P3.prototype.render = function(n2, e3) {
  if (this.__b) {
    if (this.__v.__k) {
      var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
      this.__v.__k[0] = V2(this.__b, r3, o3.__O = o3.__P);
    }
    this.__b = null;
  }
  var i4 = e3.__a && _(k, null, n2.fallback);
  return i4 && (i4.__u &= -33), [_(k, null, e3.__a ? null : n2.children), i4];
};
var H2 = function(n2, t3, e3) {
  if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size))
    for (e3 = n2.i; e3; ) {
      for (; e3.length > 3; )
        e3.pop()();
      if (e3[1] < e3[0])
        break;
      n2.i = e3 = e3[2];
    }
};
(B3.prototype = new x()).__a = function(n2) {
  var t3 = this, e3 = j3(t3.__v), r3 = t3.l.get(n2);
  return r3[0]++, function(u4) {
    var o3 = function() {
      t3.props.revealOrder ? (r3.push(u4), H2(t3, n2, r3)) : u4();
    };
    e3 ? e3(o3) : o3();
  };
}, B3.prototype.render = function(n2) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t3 = H(n2.children);
  n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
  for (var e3 = t3.length; e3--; )
    this.l.set(t3[e3], this.i = [1, 0, this.i]);
  return n2.children;
}, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
  var n2 = this;
  this.l.forEach(function(t3, e3) {
    H2(n2, e3, t3);
  });
};
var q3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
var G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
var J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
var K2 = /[A-Z0-9]/g;
var Q = "undefined" != typeof document;
var X = function(n2) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
};
x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
  Object.defineProperty(x.prototype, t3, { configurable: true, get: function() {
    return this["UNSAFE_" + t3];
  }, set: function(n2) {
    Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
  } });
});
var en = l.event;
function rn() {
}
function un() {
  return this.cancelBubble;
}
function on() {
  return this.defaultPrevented;
}
l.event = function(n2) {
  return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
};
var ln;
var cn = { enumerable: false, configurable: true, get: function() {
  return this.class;
} };
var fn = l.vnode;
l.vnode = function(n2) {
  "string" == typeof n2.type && function(n3) {
    var t3 = n3.props, e3 = n3.type, u4 = {}, o3 = -1 === e3.indexOf("-");
    for (var i4 in t3) {
      var l3 = t3[i4];
      if (!("value" === i4 && "defaultValue" in t3 && null == l3 || Q && "children" === i4 && "noscript" === e3 || "class" === i4 || "className" === i4)) {
        var c3 = i4.toLowerCase();
        "defaultValue" === i4 && "value" in t3 && null == t3.value ? i4 = "value" : "download" === i4 && true === l3 ? l3 = "" : "translate" === c3 && "no" === l3 ? l3 = false : "o" === c3[0] && "n" === c3[1] ? "ondoubleclick" === c3 ? i4 = "ondblclick" : "onchange" !== c3 || "input" !== e3 && "textarea" !== e3 || X(t3.type) ? "onfocus" === c3 ? i4 = "onfocusin" : "onblur" === c3 ? i4 = "onfocusout" : J2.test(i4) && (i4 = c3) : c3 = i4 = "oninput" : o3 && G2.test(i4) ? i4 = i4.replace(K2, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === c3 && u4[i4 = c3] && (i4 = "oninputCapture"), u4[i4] = l3;
      }
    }
    "select" == e3 && u4.multiple && Array.isArray(u4.value) && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = -1 != u4.value.indexOf(n4.props.value);
    })), "select" == e3 && null != u4.defaultValue && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = u4.multiple ? -1 != u4.defaultValue.indexOf(n4.props.value) : u4.defaultValue == n4.props.value;
    })), t3.class && !t3.className ? (u4.class = t3.class, Object.defineProperty(u4, "className", cn)) : (t3.className && !t3.class || t3.class && t3.className) && (u4.class = u4.className = t3.className), n3.props = u4;
  }(n2), n2.$$typeof = q3, fn && fn(n2);
};
var an = l.__r;
l.__r = function(n2) {
  an && an(n2), ln = n2.__c;
};
var sn = l.diffed;
l.diffed = function(n2) {
  sn && sn(n2);
  var t3 = n2.props, e3 = n2.__e;
  null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), ln = null;
};

// ../../Repo/qql/src/utils/js-util.js
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
  for (let i4 = 0; i4 < params.length; i4++) {
    if (isPlainObject(params[i4]))
      conf = { ...conf, ...params[i4] };
    else if (fields[i4])
      conf[fields[i4]] = params[i4];
  }
  return conf;
}
var CallableClass = class extends Function {
  constructor(f4) {
    return Object.setPrototypeOf(f4, new.target.prototype);
  }
};

// ../../Repo/qql/src/net/QqlClient.js
var QqlClient = class extends CallableClass {
  constructor(...args) {
    super((q5) => this.query(q5));
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

// ../../Repo/isoq/node_modules/.pnpm/preact@10.26.9/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e3, t3, n2, o3, i4, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3)
    for (c3 in p3 = {}, t3)
      "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i4, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps))
    for (c3 in a3)
      void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// ../../Repo/qql/src/lib/qql-react.jsx
var QqlContext = K();
function QqlProvider({ fetch: fetch2, url, children, qql }) {
  let ref = A2();
  if (!ref.current) {
    if (qql)
      ref.current = qql;
    else
      ref.current = createQqlClient({ fetch: fetch2, url });
  }
  return /* @__PURE__ */ u3(QqlContext.Provider, { value: ref.current, children });
}
function useQql() {
  return x2(QqlContext);
}

// ../../Repo/quickmin/node_modules/.pnpm/url-join@5.0.0/node_modules/url-join/lib/url-join.js
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
  for (var i4 = 0; i4 < strArray.length; i4++) {
    var component = strArray[i4];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i4 > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i4 < strArray.length - 1) {
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

// ../../Repo/quickmin/src/export/quickmin-api.js
var QuickminApi = class {
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
    console.log("getting current user...");
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

// ../../Repo/quickmin/node_modules/.pnpm/preact@10.26.9/node_modules/preact/compat/dist/compat.module.js
function g4(n2, t3) {
  for (var e3 in t3)
    n2[e3] = t3[e3];
  return n2;
}
function E3(n2, t3) {
  for (var e3 in n2)
    if ("__source" !== e3 && !(e3 in t3))
      return true;
  for (var r3 in t3)
    if ("__source" !== r3 && n2[r3] !== t3[r3])
      return true;
  return false;
}
function N3(n2, t3) {
  this.props = n2, this.context = t3;
}
(N3.prototype = new x()).isPureReactComponent = true, N3.prototype.shouldComponentUpdate = function(n2, t3) {
  return E3(this.props, n2) || E3(this.state, t3);
};
var T4 = l.__b;
l.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T4 && T4(n2);
};
var A4 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
var F4 = l.__e;
l.__e = function(n2, t3, e3, r3) {
  if (n2.then) {
    for (var u4, o3 = t3; o3 = o3.__; )
      if ((u4 = o3.__c) && u4.__c)
        return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u4.__c(n2, t3);
  }
  F4(n2, t3, e3, r3);
};
var U2 = l.unmount;
function V3(n2, t3, e3) {
  return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
    "function" == typeof n3.__c && n3.__c();
  }), n2.__c.__H = null), null != (n2 = g4({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
    return V3(n3, t3, e3);
  })), n2;
}
function W2(n2, t3, e3) {
  return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
    return W2(n3, t3, e3);
  }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
}
function P4() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j4(n2) {
  var t3 = n2.__.__c;
  return t3 && t3.__a && t3.__a(n2);
}
function B4() {
  this.i = null, this.l = null;
}
l.unmount = function(n2) {
  var t3 = n2.__c;
  t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), U2 && U2(n2);
}, (P4.prototype = new x()).__c = function(n2, t3) {
  var e3 = t3.__c, r3 = this;
  null == r3.o && (r3.o = []), r3.o.push(e3);
  var u4 = j4(r3.__v), o3 = false, i4 = function() {
    o3 || (o3 = true, e3.__R = null, u4 ? u4(l3) : l3());
  };
  e3.__R = i4;
  var l3 = function() {
    if (!--r3.__u) {
      if (r3.state.__a) {
        var n3 = r3.state.__a;
        r3.__v.__k[0] = W2(n3, n3.__c.__P, n3.__c.__O);
      }
      var t4;
      for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); )
        t4.forceUpdate();
    }
  };
  r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i4, i4);
}, P4.prototype.componentWillUnmount = function() {
  this.o = [];
}, P4.prototype.render = function(n2, e3) {
  if (this.__b) {
    if (this.__v.__k) {
      var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
      this.__v.__k[0] = V3(this.__b, r3, o3.__O = o3.__P);
    }
    this.__b = null;
  }
  var i4 = e3.__a && _(k, null, n2.fallback);
  return i4 && (i4.__u &= -33), [_(k, null, e3.__a ? null : n2.children), i4];
};
var H3 = function(n2, t3, e3) {
  if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size))
    for (e3 = n2.i; e3; ) {
      for (; e3.length > 3; )
        e3.pop()();
      if (e3[1] < e3[0])
        break;
      n2.i = e3 = e3[2];
    }
};
(B4.prototype = new x()).__a = function(n2) {
  var t3 = this, e3 = j4(t3.__v), r3 = t3.l.get(n2);
  return r3[0]++, function(u4) {
    var o3 = function() {
      t3.props.revealOrder ? (r3.push(u4), H3(t3, n2, r3)) : u4();
    };
    e3 ? e3(o3) : o3();
  };
}, B4.prototype.render = function(n2) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t3 = H(n2.children);
  n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
  for (var e3 = t3.length; e3--; )
    this.l.set(t3[e3], this.i = [1, 0, this.i]);
  return n2.children;
}, B4.prototype.componentDidUpdate = B4.prototype.componentDidMount = function() {
  var n2 = this;
  this.l.forEach(function(t3, e3) {
    H3(n2, e3, t3);
  });
};
var q4 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
var G3 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
var J3 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
var K3 = /[A-Z0-9]/g;
var Q2 = "undefined" != typeof document;
var X2 = function(n2) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
};
x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
  Object.defineProperty(x.prototype, t3, { configurable: true, get: function() {
    return this["UNSAFE_" + t3];
  }, set: function(n2) {
    Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
  } });
});
var en2 = l.event;
function rn2() {
}
function un2() {
  return this.cancelBubble;
}
function on2() {
  return this.defaultPrevented;
}
l.event = function(n2) {
  return en2 && (n2 = en2(n2)), n2.persist = rn2, n2.isPropagationStopped = un2, n2.isDefaultPrevented = on2, n2.nativeEvent = n2;
};
var ln2;
var cn2 = { enumerable: false, configurable: true, get: function() {
  return this.class;
} };
var fn2 = l.vnode;
l.vnode = function(n2) {
  "string" == typeof n2.type && function(n3) {
    var t3 = n3.props, e3 = n3.type, u4 = {}, o3 = -1 === e3.indexOf("-");
    for (var i4 in t3) {
      var l3 = t3[i4];
      if (!("value" === i4 && "defaultValue" in t3 && null == l3 || Q2 && "children" === i4 && "noscript" === e3 || "class" === i4 || "className" === i4)) {
        var c3 = i4.toLowerCase();
        "defaultValue" === i4 && "value" in t3 && null == t3.value ? i4 = "value" : "download" === i4 && true === l3 ? l3 = "" : "translate" === c3 && "no" === l3 ? l3 = false : "o" === c3[0] && "n" === c3[1] ? "ondoubleclick" === c3 ? i4 = "ondblclick" : "onchange" !== c3 || "input" !== e3 && "textarea" !== e3 || X2(t3.type) ? "onfocus" === c3 ? i4 = "onfocusin" : "onblur" === c3 ? i4 = "onfocusout" : J3.test(i4) && (i4 = c3) : c3 = i4 = "oninput" : o3 && G3.test(i4) ? i4 = i4.replace(K3, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === c3 && u4[i4 = c3] && (i4 = "oninputCapture"), u4[i4] = l3;
      }
    }
    "select" == e3 && u4.multiple && Array.isArray(u4.value) && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = -1 != u4.value.indexOf(n4.props.value);
    })), "select" == e3 && null != u4.defaultValue && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = u4.multiple ? -1 != u4.defaultValue.indexOf(n4.props.value) : u4.defaultValue == n4.props.value;
    })), t3.class && !t3.className ? (u4.class = t3.class, Object.defineProperty(u4, "className", cn2)) : (t3.className && !t3.class || t3.class && t3.className) && (u4.class = u4.className = t3.className), n3.props = u4;
  }(n2), n2.$$typeof = q4, fn2 && fn2(n2);
};
var an2 = l.__r;
l.__r = function(n2) {
  an2 && an2(n2), ln2 = n2.__c;
};
var sn2 = l.diffed;
l.diffed = function(n2) {
  sn2 && sn2(n2);
  var t3 = n2.props, e3 = n2.__e;
  null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), ln2 = null;
};

// ../../Repo/quickmin/src/utils/js-util.js
async function responseAssert(response) {
  if (response.status >= 200 && response.status < 300)
    return;
  let e3 = new Error(await response.text());
  e3.status = response.status;
  throw e3;
}
function parseCookie(str) {
  return str.split(";").map((v3) => v3.split("=")).reduce((acc, v3) => {
    if (v3.length == 2)
      acc[decodeURIComponent(v3[0].trim())] = decodeURIComponent(v3[1].trim());
    return acc;
  }, {});
}
function clearCookie(name) {
  globalThis.window.document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// ../../Repo/quickmin/src/utils/react-util.jsx
function useConstructor(fn3) {
  let value = A2();
  let called = A2();
  if (!called.current) {
    called.current = true;
    value.current = fn3();
  }
  return value.current;
}

// ../../Repo/quickmin/src/export/quickmin-api-react.jsx
var QuickminState = class extends EventTarget {
  constructor({ fetch: fetch2, url, initialUser, quickminCookieName, apiKey, headers, authProviderInfo, children }) {
    super();
    if (!quickminCookieName)
      throw new Error("No quickmin cookie name provided!");
    this.fetch = fetch2;
    this.url = url;
    this.api = new QuickminApi({ fetch: fetch2, url, apiKey, headers });
    this.currentUser = initialUser;
    this.quickminCookieName = quickminCookieName;
    this.authProviderInfo = authProviderInfo;
    if (globalThis.window) {
      let cookies = parseCookie(globalThis.window.document.cookie);
      if (cookies.quickmin_login_error) {
        clearCookie("quickmin_login_error");
        this.loginError = new Error(cookies.quickmin_login_error);
      }
    }
  }
  logout() {
    clearCookie(this.quickminCookieName);
    this.currentUser = null;
    this.dispatchEvent(new Event("change"));
  }
  popLoginError() {
    let e3 = this.loginError;
    this.loginError = void 0;
    return e3;
  }
  async uploadFile(file) {
    return await this.api.uploadFile(file);
  }
  async getAuthUrls(referer, state = {}) {
    return await this.api.getAuthUrls(referer, state = {});
  }
  getAuthProviderByName(providerName) {
    for (let provider of this.authProviderInfo)
      if (provider.name == providerName)
        return provider;
  }
  async loginByProvider(providerName) {
    let provider = this.getAuthProviderByName(providerName);
    let loginUrl = new URL(provider.loginUrl);
    loginUrl.searchParams.set("state", JSON.stringify({
      provider: provider.name,
      referer: window.location.toString()
    }));
    window.location = loginUrl;
  }
  async login(args) {
    if (!args)
      return await this.loginByProvider(this.authProviderInfo[0].name);
    if (typeof args == "string")
      return await this.loginByProvider(args);
    try {
      let response = await this.api.fetch(urlJoin(this.api.url, "_login"), {
        method: "post",
        body: JSON.stringify({
          username: args.username,
          password: args.password
        })
      });
      await responseAssert(response);
      let responseBody = await response.json();
      if (!responseBody.user)
        throw new Error("Can't login with this user");
      window.document.cookie = this.quickminCookieName + "=" + responseBody.token + "; path=/";
      this.currentUser = responseBody.user;
      this.dispatchEvent(new Event("change"));
    } catch (e3) {
      this.loginError = e3;
      this.dispatchEvent(new Event("change"));
    }
  }
};
var QuickminContext = K();
function QuickminProvider({ children, quickminState, ...props }) {
  let qm = useConstructor(() => {
    if (quickminState)
      return quickminState;
    return new QuickminState(props);
  });
  return /* @__PURE__ */ u3(QuickminContext.Provider, { value: qm, children: /* @__PURE__ */ u3(
    QqlProvider,
    {
      fetch: qm.fetch,
      url: urlJoin(qm.url, "_qql"),
      children
    }
  ) });
}

// ../../Repo/isoq/src/isoq/IsoContext.js
var IsoContext = K();
function useIsoContext() {
  return x2(IsoContext);
}
var IsoContext_default = IsoContext;

// ../../Repo/isoq/src/components/Head.js
function Head({ children }) {
  let isoContext = useIsoContext();
  if (isoContext.isSsr())
    isoContext.headChildren.push(children);
  return _(k);
}

// ../../Repo/isoq/src/utils/js-util.js
function parseCookie2(str) {
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
function arrayRemove(array, item) {
  let index = array.indexOf(item);
  if (index >= 0)
    array.splice(index, 1);
  return array;
}

// ../../Repo/isoq/src/utils/react-util.js
function useEventListener(o3, ev, fn3) {
  _2(() => {
    o3.addEventListener(ev, fn3);
    return () => {
      o3.removeEventListener(ev, fn3);
    };
  }, [o3, ev, fn3]);
}
function useEventUpdate2(o3, ev) {
  let [_3, setDummyState] = d2();
  let forceUpdate = q2(() => setDummyState({}));
  useEventListener(o3, ev, forceUpdate);
}

// ../../Repo/isoq/src/components/useIsLoading.js
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

// ../../Repo/isoq/src/utils/preact-refid.js
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
  if (vnode.type === k && vnode.key == null) {
    return vnodePath(vnode.__);
  }
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

// ../../Repo/isoq/src/utils/iso-ref.js
var IsoRefContext = K();
var IsoRef = class {
  constructor(isoRefState, initialValue, options) {
    this.isoRefState = isoRefState;
    this.refCount = 0;
    this.current = initialValue;
    this.ids = [];
    this.shared = options.shared;
    if (this.shared === void 0)
      this.shared = true;
  }
  ref(id) {
    if (!this.ids.includes(id))
      this.ids.push(id);
  }
  unref(id) {
    arrayRemove(this.ids, id);
    if (!this.ids.length)
      this.isoRefState.scheduleSweep();
  }
};
var IsoRefState = class {
  constructor({ initialRefValues } = {}) {
    this.refs = {};
    this.sweepTimeout = null;
    this.sweepBlockIds = [];
    if (initialRefValues) {
      for (let k3 in initialRefValues)
        this.refs[k3] = new IsoRef(this, initialRefValues[k3], { shared: true });
    }
  }
  getRef(id, initialValue, options) {
    if (!this.refs[id]) {
      this.refs[id] = new IsoRef(this, initialValue, options);
      this.scheduleSweep();
    }
    return this.refs[id];
  }
  scheduleSweep() {
    if (!globalThis.window || this.sweepTimeout || this.sweepBlockIds.length)
      return;
    this.sweepTimeout = requestAnimationFrame(this.handleSweep);
  }
  handleSweep = () => {
    this.sweepTimeout = null;
    if (this.sweepBlockIds.length)
      return;
    for (let id in this.refs) {
      let ref = this.refs[id];
      if (!ref.ids.length) {
        delete this.refs[id];
      }
    }
  };
  refSweepBlock(id) {
    if (!this.sweepBlockIds.includes(id))
      this.sweepBlockIds.push(id);
  }
  unrefSweepBlock(id) {
    arrayRemove(this.sweepBlockIds, id);
    if (!this.sweepBlockIds.length)
      this.scheduleSweep();
  }
  getSharedRefValues() {
    let refValues = {};
    for (let k3 in this.refs)
      if (this.refs[k3].shared)
        refValues[k3] = this.refs[k3].current;
    return refValues;
  }
};
function IsoSuspense({ children, fallback }) {
  let isoRefState = x2(IsoRefContext);
  let refId = useRefId();
  function FallbackWrapper() {
    _2(() => {
      isoRefState.refSweepBlock(refId);
      return () => {
        isoRefState.unrefSweepBlock(refId);
      };
    }, []);
    return fallback;
  }
  return _(P3, { fallback: _(FallbackWrapper) }, children);
}
function useIsoRef(initialValue, options = {}) {
  if (typeof options == "boolean")
    options = { shared: options };
  let refId = useRefId();
  let isoRefState = x2(IsoRefContext);
  let ref = isoRefState.getRef(refId, initialValue, options);
  _2(() => {
    ref.ref(refId);
    return () => {
      ref.unref(refId);
    };
  }, []);
  return ref;
}

// ../../Repo/isoq/src/components/useIsoMemo.js
function useIsoMemo(asyncFn, deps = [], options = {}) {
  let loadingState = useLoadingState();
  let iso = useIsoContext();
  let [, forceUpdate] = d2({});
  let ref = useIsoRef({
    result: void 0,
    error: void 0,
    status: "idle",
    deps: void 0
  }, { shared: options.shared });
  let localRef = useIsoRef({
    promise: null,
    pendingNextRun: false,
    fn: void 0
  }, { shared: false });
  _2(() => {
    localRef.mounted = true;
    return () => {
      localRef.mounted = false;
    };
  });
  if (iso.isSsr() && options.server === false)
    return;
  localRef.current.fn = asyncFn;
  deps = JSON.stringify(deps);
  let depsChanged = ref.current.deps === void 0 || ref.current.deps != deps;
  if (depsChanged) {
    if (iso.hydration) {
      console.log("yep, hydration");
      setTimeout(() => forceUpdate({}), 0);
      return;
    }
    ref.current.deps = deps;
    if (ref.current.status === "pending") {
      localRef.current.pendingNextRun = true;
    } else {
      let run = function() {
        ref.current.status = "pending";
        localRef.current.pendingNextRun = false;
        localRef.current.promise = localRef.current.fn();
        localRef.current.promise.then((result) => {
          ref.current.result = result;
          ref.current.status = "success";
          if (localRef.mounted)
            forceUpdate({});
        }).catch((err) => {
          console.log("caught...");
          ref.current.error = err;
          ref.current.status = "error";
        }).finally(() => {
          if (localRef.current.pendingNextRun)
            run();
          else
            loadingState.updateCount(-1);
        });
      };
      loadingState.updateCount(1);
      run();
    }
  }
  if (ref.current.status === "pending") {
    if (localRef.mounted) {
      if (options.swr === false)
        return void 0;
      return ref.current.result;
    }
    throw localRef.current.promise;
  }
  if (ref.current.status === "error") {
    throw ref.current.error;
  }
  return ref.current.result;
}

// ../../Repo/isoq/node_modules/.pnpm/stacktrace-parser@0.1.11/node_modules/stacktrace-parser/dist/stack-trace-parser.esm.js
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
var chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|rsc|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
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
var winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|rsc|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
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
var geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|rsc|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
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

// ../../Repo/isoq/src/utils/SourceMapper.js
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

// ../../Repo/isoq/src/components/IsoErrorBoundary.js
var ErrorBoundaryComponent = class extends x {
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
var IsoErrorBoundaryContext = K();
function IsoErrorBoundary({ fallback, children, error }) {
  let iso = useIsoContext();
  let [currentError, setCurrentError] = d2(error);
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

// ../../Repo/isoq/src/components/router.jsx
var RouterContext = K();
var RouteContext = K();
var RouteMatchContext = K();
var RouterState = class extends EventTarget {
  constructor({ url }) {
    super();
    this.baseUrl = new URL(url).origin;
    this.committedUrl = new URL(url).toString();
    this.committedVersion = 1;
    this.nextVersion = 0;
    this.nextUrl = "";
    this.isSsr = !globalThis.window;
    if (!this.isSsr) {
      globalThis.window.addEventListener("popstate", (e3) => {
        this.setUrl(String(globalThis.window.location));
      });
    }
  }
  setUrl(url) {
    if (this.isSsr) {
      this.redirectUrl = url;
      return;
    }
    this.nextUrl = new URL(url, this.baseUrl).toString();
    if (this.nextVersion)
      this.nextVersion++;
    else
      this.nextVersion = this.committedVersion + 1;
    this.dispatchEvent(new Event("change"));
  }
  postNavScroll() {
    let win = globalThis.window;
    let u4 = new URL(this.committedUrl);
    let el;
    if (u4.hash) {
      let hash = u4.hash.replace("#", "");
      let els = win.document.getElementsByName(hash);
      if (els.length)
        el = els[0];
    }
    if (el)
      el.scrollIntoView({
        behavior: "smooth"
      });
    else
      win.scrollTo(0, 0);
  }
  commit() {
    this.committedUrl = this.nextUrl;
    this.committedVersion = this.nextVersion;
    this.nextVersion = null;
    this.nextUrl = null;
    this.dispatchEvent(new Event("change"));
    if (!this.isSsr) {
      let w3 = globalThis.window;
      if (w3.location != this.committedUrl) {
        w3.history.scrollRestoration = "manual";
        w3.history.pushState(null, null, this.committedUrl);
      }
      setTimeout(() => this.postNavScroll(), 0);
    }
  }
};
function CheckMount({ onMount, children }) {
  y2(() => {
    if (onMount)
      onMount();
  });
  return children;
}
function Router({ routerState, children }) {
  useEventUpdate2(routerState, "change");
  return /* @__PURE__ */ u3(RouterContext, { value: routerState, children: [
    /* @__PURE__ */ u3(IsoSuspense, { children: /* @__PURE__ */ u3("div", { style: { display: "contents" }, children: /* @__PURE__ */ u3(CheckMount, { children: /* @__PURE__ */ u3(RouteContext.Provider, { value: { url: routerState.committedUrl }, children }) }) }) }, "route-" + routerState.committedVersion),
    !!routerState.nextVersion && /* @__PURE__ */ u3(IsoSuspense, { children: /* @__PURE__ */ u3("div", { style: { display: "none" }, children: /* @__PURE__ */ u3(CheckMount, { onMount: () => routerState.commit(), children: /* @__PURE__ */ u3(RouteContext.Provider, { value: { url: routerState.nextUrl }, children }) }) }) }, "route-" + routerState.nextVersion)
  ] });
}

// node_modules/.pnpm/url-join@5.0.0/node_modules/url-join/lib/url-join.js
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
  for (var i4 = 0; i4 < strArray.length; i4++) {
    var component = strArray[i4];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i4 > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i4 < strArray.length - 1) {
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

// packages/katnip-quickmin/katnip-quickmin-isowrap.jsx
function QuickminWrapper({ quickminUser, quickminCookieName, authProviderInfo, children }) {
  let iso = useIsoContext();
  if (!iso.quickminState)
    iso.quickminState = new QuickminState({
      fetch: iso.fetch,
      url: "/admin",
      initialUser: quickminUser,
      authProviderInfo,
      quickminCookieName
    });
  return /* @__PURE__ */ u3(QuickminProvider, { quickminState: iso.quickminState, children });
}

// ../../Repo/fullstack-rpc/fullstack-rpc-client.js
var proxyMethodHandler = {
  get: (target, prop, _receiver) => {
    return async (...params) => {
      return await target.callMethod(prop, params);
    };
  }
};
var RpcClient = class {
  constructor({ fetch: fetch2, url, headers }) {
    if (!fetch2)
      fetch2 = globalThis.fetch.bind(globalThis);
    this.fetch = fetch2;
    this.url = url;
    this.proxy = new Proxy(this, proxyMethodHandler);
    this.headers = new Headers(headers);
    this.headers.set("content-type", "application/json");
  }
  async callMethod(method, params) {
    let response = await this.fetch(this.url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        method,
        params
      })
    });
    if (response.status < 200 || response.status >= 300)
      throw new Error(await response.text());
    return (await response.json()).result;
  }
};

// ../../Repo/fullstack-rpc/fullstack-rpc-react.jsx
var RpcContext = K();
function RpcProvider({ fetch: fetch2, url, children }) {
  let api = new RpcClient({ fetch: fetch2, url });
  return /* @__PURE__ */ u3(k, { children: /* @__PURE__ */ u3(RpcContext.Provider, { value: api, children }) });
}
function useRpc() {
  return x2(RpcContext).proxy;
}

// packages/katnip-rpc/katnip-rpc-isowrap.jsx
function RpcWrapper({ children }) {
  let iso = useIsoContext();
  return /* @__PURE__ */ u3(RpcProvider, { url: urlJoin2(iso.appPathname, "rpc"), fetch: iso.fetch, children });
}

// packages/katnip-tailwind/katnip-tailwind-isowrap.jsx
function TailwindWrapper({ children }) {
  return /* @__PURE__ */ u3(k, { children: [
    /* @__PURE__ */ u3(Head, { children: /* @__PURE__ */ u3("link", { href: "/index.css", rel: "stylesheet" }) }),
    /* @__PURE__ */ u3(k, { children })
  ] });
}

// filecontent:@wrappers
var wrappers_default = [QuickminWrapper, RpcWrapper, TailwindWrapper];

// node_modules/.pnpm/proxy-compare@3.0.1/node_modules/proxy-compare/dist/index.js
var TRACK_MEMO_SYMBOL = Symbol();
var GET_ORIGINAL_SYMBOL = Symbol();
var AFFECTED_PROPERTY = "a";
var IS_TARGET_COPIED_PROPERTY = "f";
var PROXY_PROPERTY = "p";
var PROXY_CACHE_PROPERTY = "c";
var TARGET_CACHE_PROPERTY = "t";
var HAS_KEY_PROPERTY = "h";
var ALL_OWN_KEYS_PROPERTY = "w";
var HAS_OWN_KEY_PROPERTY = "o";
var KEYS_PROPERTY = "k";
var newProxy = (target, handler) => new Proxy(target, handler);
var getProto = Object.getPrototypeOf;
var objectsToTrack = /* @__PURE__ */ new WeakMap();
var isObjectToTrack = (obj) => obj && (objectsToTrack.has(obj) ? objectsToTrack.get(obj) : getProto(obj) === Object.prototype || getProto(obj) === Array.prototype);
var isObject = (x4) => typeof x4 === "object" && x4 !== null;
var needsToCopyTargetObject = (obj) => Object.values(Object.getOwnPropertyDescriptors(obj)).some((descriptor) => !descriptor.configurable && !descriptor.writable);
var copyTargetObject = (obj) => {
  if (Array.isArray(obj)) {
    return Array.from(obj);
  }
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  Object.values(descriptors).forEach((desc) => {
    desc.configurable = true;
  });
  return Object.create(getProto(obj), descriptors);
};
var createProxyHandler = (origObj, isTargetCopied) => {
  const state = {
    [IS_TARGET_COPIED_PROPERTY]: isTargetCopied
  };
  let trackObject = false;
  const recordUsage = (type, key) => {
    if (!trackObject) {
      let used = state[AFFECTED_PROPERTY].get(origObj);
      if (!used) {
        used = {};
        state[AFFECTED_PROPERTY].set(origObj, used);
      }
      if (type === ALL_OWN_KEYS_PROPERTY) {
        used[ALL_OWN_KEYS_PROPERTY] = true;
      } else {
        let set = used[type];
        if (!set) {
          set = /* @__PURE__ */ new Set();
          used[type] = set;
        }
        set.add(key);
      }
    }
  };
  const recordObjectAsUsed = () => {
    trackObject = true;
    state[AFFECTED_PROPERTY].delete(origObj);
  };
  const handler = {
    get(target, key) {
      if (key === GET_ORIGINAL_SYMBOL) {
        return origObj;
      }
      recordUsage(KEYS_PROPERTY, key);
      return createProxy(Reflect.get(target, key), state[AFFECTED_PROPERTY], state[PROXY_CACHE_PROPERTY], state[TARGET_CACHE_PROPERTY]);
    },
    has(target, key) {
      if (key === TRACK_MEMO_SYMBOL) {
        recordObjectAsUsed();
        return true;
      }
      recordUsage(HAS_KEY_PROPERTY, key);
      return Reflect.has(target, key);
    },
    getOwnPropertyDescriptor(target, key) {
      recordUsage(HAS_OWN_KEY_PROPERTY, key);
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
    ownKeys(target) {
      recordUsage(ALL_OWN_KEYS_PROPERTY);
      return Reflect.ownKeys(target);
    }
  };
  if (isTargetCopied) {
    handler.set = handler.deleteProperty = () => false;
  }
  return [handler, state];
};
var getOriginalObject = (obj) => (
  // unwrap proxy
  obj[GET_ORIGINAL_SYMBOL] || // otherwise
  obj
);
var createProxy = (obj, affected, proxyCache2, targetCache2) => {
  if (!isObjectToTrack(obj))
    return obj;
  let targetAndCopied = targetCache2 && targetCache2.get(obj);
  if (!targetAndCopied) {
    const target2 = getOriginalObject(obj);
    if (needsToCopyTargetObject(target2)) {
      targetAndCopied = [target2, copyTargetObject(target2)];
    } else {
      targetAndCopied = [target2];
    }
    targetCache2 === null || targetCache2 === void 0 ? void 0 : targetCache2.set(obj, targetAndCopied);
  }
  const [target, copiedTarget] = targetAndCopied;
  let handlerAndState = proxyCache2 && proxyCache2.get(target);
  if (!handlerAndState || handlerAndState[1][IS_TARGET_COPIED_PROPERTY] !== !!copiedTarget) {
    handlerAndState = createProxyHandler(target, !!copiedTarget);
    handlerAndState[1][PROXY_PROPERTY] = newProxy(copiedTarget || target, handlerAndState[0]);
    if (proxyCache2) {
      proxyCache2.set(target, handlerAndState);
    }
  }
  handlerAndState[1][AFFECTED_PROPERTY] = affected;
  handlerAndState[1][PROXY_CACHE_PROPERTY] = proxyCache2;
  handlerAndState[1][TARGET_CACHE_PROPERTY] = targetCache2;
  return handlerAndState[1][PROXY_PROPERTY];
};
var isAllOwnKeysChanged = (prevObj, nextObj) => {
  const prevKeys = Reflect.ownKeys(prevObj);
  const nextKeys = Reflect.ownKeys(nextObj);
  return prevKeys.length !== nextKeys.length || prevKeys.some((k3, i4) => k3 !== nextKeys[i4]);
};
var isChanged = (prevObj, nextObj, affected, cache, isEqual = Object.is) => {
  if (isEqual(prevObj, nextObj)) {
    return false;
  }
  if (!isObject(prevObj) || !isObject(nextObj))
    return true;
  const used = affected.get(getOriginalObject(prevObj));
  if (!used)
    return true;
  if (cache) {
    const hit = cache.get(prevObj);
    if (hit === nextObj) {
      return false;
    }
    cache.set(prevObj, nextObj);
  }
  let changed = null;
  for (const key of used[HAS_KEY_PROPERTY] || []) {
    changed = Reflect.has(prevObj, key) !== Reflect.has(nextObj, key);
    if (changed)
      return changed;
  }
  if (used[ALL_OWN_KEYS_PROPERTY] === true) {
    changed = isAllOwnKeysChanged(prevObj, nextObj);
    if (changed)
      return changed;
  } else {
    for (const key of used[HAS_OWN_KEY_PROPERTY] || []) {
      const hasPrev = !!Reflect.getOwnPropertyDescriptor(prevObj, key);
      const hasNext = !!Reflect.getOwnPropertyDescriptor(nextObj, key);
      changed = hasPrev !== hasNext;
      if (changed)
        return changed;
    }
  }
  for (const key of used[KEYS_PROPERTY] || []) {
    changed = isChanged(prevObj[key], nextObj[key], affected, cache, isEqual);
    if (changed)
      return changed;
  }
  if (changed === null)
    throw new Error("invalid used");
  return changed;
};
var getUntracked = (obj) => {
  if (isObjectToTrack(obj)) {
    return obj[GET_ORIGINAL_SYMBOL] || null;
  }
  return null;
};
var markToTrack = (obj, mark = true) => {
  objectsToTrack.set(obj, mark);
};
var affectedToPathList = (obj, affected, onlyWithValues) => {
  const list = [];
  const seen = /* @__PURE__ */ new WeakSet();
  const walk = (x4, path) => {
    var _a, _b, _c;
    if (seen.has(x4)) {
      return;
    }
    if (isObject(x4)) {
      seen.add(x4);
    }
    const used = isObject(x4) && affected.get(getOriginalObject(x4));
    if (used) {
      (_a = used[HAS_KEY_PROPERTY]) === null || _a === void 0 ? void 0 : _a.forEach((key) => {
        const segment = `:has(${String(key)})`;
        list.push(path ? [...path, segment] : [segment]);
      });
      if (used[ALL_OWN_KEYS_PROPERTY] === true) {
        const segment = ":ownKeys";
        list.push(path ? [...path, segment] : [segment]);
      } else {
        (_b = used[HAS_OWN_KEY_PROPERTY]) === null || _b === void 0 ? void 0 : _b.forEach((key) => {
          const segment = `:hasOwn(${String(key)})`;
          list.push(path ? [...path, segment] : [segment]);
        });
      }
      (_c = used[KEYS_PROPERTY]) === null || _c === void 0 ? void 0 : _c.forEach((key) => {
        if (!onlyWithValues || "value" in (Object.getOwnPropertyDescriptor(x4, key) || {})) {
          walk(x4[key], path ? [...path, key] : [key]);
        }
      });
    } else if (path) {
      list.push(path);
    }
  };
  walk(obj);
  return list;
};

// node_modules/.pnpm/valtio@2.1.5/node_modules/valtio/esm/vanilla.mjs
var isObject2 = (x4) => typeof x4 === "object" && x4 !== null;
var canProxyDefault = (x4) => isObject2(x4) && !refSet.has(x4) && (Array.isArray(x4) || !(Symbol.iterator in x4)) && !(x4 instanceof WeakMap) && !(x4 instanceof WeakSet) && !(x4 instanceof Error) && !(x4 instanceof Number) && !(x4 instanceof Date) && !(x4 instanceof String) && !(x4 instanceof RegExp) && !(x4 instanceof ArrayBuffer) && !(x4 instanceof Promise);
var createSnapshotDefault = (target, version) => {
  const cache = snapCache.get(target);
  if ((cache == null ? void 0 : cache[0]) === version) {
    return cache[1];
  }
  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
  markToTrack(snap, true);
  snapCache.set(target, [version, snap]);
  Reflect.ownKeys(target).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(snap, key)) {
      return;
    }
    const value = Reflect.get(target, key);
    const { enumerable } = Reflect.getOwnPropertyDescriptor(
      target,
      key
    );
    const desc = {
      value,
      enumerable,
      // This is intentional to avoid copying with proxy-compare.
      // It's still non-writable, so it avoids assigning a value.
      configurable: true
    };
    if (refSet.has(value)) {
      markToTrack(value, false);
    } else if (proxyStateMap.has(value)) {
      const [target2, ensureVersion] = proxyStateMap.get(
        value
      );
      desc.value = createSnapshotDefault(target2, ensureVersion());
    }
    Object.defineProperty(snap, key, desc);
  });
  return Object.preventExtensions(snap);
};
var createHandlerDefault = (isInitializing, addPropListener, removePropListener, notifyUpdate) => ({
  deleteProperty(target, prop) {
    const prevValue = Reflect.get(target, prop);
    removePropListener(prop);
    const deleted = Reflect.deleteProperty(target, prop);
    if (deleted) {
      notifyUpdate(["delete", [prop], prevValue]);
    }
    return deleted;
  },
  set(target, prop, value, receiver) {
    const hasPrevValue = !isInitializing() && Reflect.has(target, prop);
    const prevValue = Reflect.get(target, prop, receiver);
    if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
      return true;
    }
    removePropListener(prop);
    if (isObject2(value)) {
      value = getUntracked(value) || value;
    }
    const nextValue = !proxyStateMap.has(value) && canProxy(value) ? proxy(value) : value;
    addPropListener(prop, nextValue);
    Reflect.set(target, prop, nextValue, receiver);
    notifyUpdate(["set", [prop], value, prevValue]);
    return true;
  }
});
var proxyStateMap = /* @__PURE__ */ new WeakMap();
var refSet = /* @__PURE__ */ new WeakSet();
var snapCache = /* @__PURE__ */ new WeakMap();
var versionHolder = [1, 1];
var proxyCache = /* @__PURE__ */ new WeakMap();
var objectIs = Object.is;
var newProxy2 = (target, handler) => new Proxy(target, handler);
var canProxy = canProxyDefault;
var createSnapshot = createSnapshotDefault;
var createHandler = createHandlerDefault;
function proxy(baseObject = {}) {
  if (!isObject2(baseObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(baseObject);
  if (found) {
    return found;
  }
  let version = versionHolder[0];
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  let checkVersion = versionHolder[1];
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion;
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion);
        if (propVersion > version) {
          version = propVersion;
        }
      });
    }
    return version;
  };
  const createPropListener = (prop) => (op, nextVersion) => {
    const newOp = [...op];
    newOp[1] = [prop, ...newOp[1]];
    notifyUpdate(newOp, nextVersion);
  };
  const propProxyStates = /* @__PURE__ */ new Map();
  const addPropListener = (prop, propValue) => {
    const propProxyState = !refSet.has(propValue) && proxyStateMap.get(propValue);
    if (propProxyState) {
      if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && propProxyStates.has(prop)) {
        throw new Error("prop listener already exists");
      }
      if (listeners.size) {
        const remove = propProxyState[2](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      } else {
        propProxyStates.set(prop, [propProxyState]);
      }
    }
  };
  const removePropListener = (prop) => {
    var _a;
    const entry = propProxyStates.get(prop);
    if (entry) {
      propProxyStates.delete(prop);
      (_a = entry[1]) == null ? void 0 : _a.call(entry);
    }
  };
  const addListener = (listener) => {
    listeners.add(listener);
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && prevRemove) {
          throw new Error("remove already exists");
        }
        const remove = propProxyState[2](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      });
    }
    const removeListener = () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove();
            propProxyStates.set(prop, [propProxyState]);
          }
        });
      }
    };
    return removeListener;
  };
  let initializing = true;
  const handler = createHandler(
    () => initializing,
    addPropListener,
    removePropListener,
    notifyUpdate
  );
  const proxyObject = newProxy2(baseObject, handler);
  proxyCache.set(baseObject, proxyObject);
  const proxyState = [baseObject, ensureVersion, addListener];
  proxyStateMap.set(proxyObject, proxyState);
  Reflect.ownKeys(baseObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(
      baseObject,
      key
    );
    if ("value" in desc && desc.writable) {
      proxyObject[key] = baseObject[key];
    }
  });
  initializing = false;
  return proxyObject;
}
function subscribe(proxyObject, callback, notifyInSync) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  let promise;
  const ops = [];
  const addListener = proxyState[2];
  let isListenerActive = false;
  const listener = (op) => {
    ops.push(op);
    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        if (isListenerActive) {
          callback(ops.splice(0));
        }
      });
    }
  };
  const removeListener = addListener(listener);
  isListenerActive = true;
  return () => {
    isListenerActive = false;
    removeListener();
  };
}
function snapshot(proxyObject) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  const [target, ensureVersion] = proxyState;
  return createSnapshot(target, ensureVersion());
}

// node_modules/.pnpm/valtio@2.1.5/node_modules/valtio/esm/react.mjs
var useAffectedDebugValue = (state, affected) => {
  const pathList = A2(void 0);
  y2(() => {
    pathList.current = affectedToPathList(state, affected, true);
  });
  P2(pathList.current);
};
var condUseAffectedDebugValue = useAffectedDebugValue;
var targetCache = /* @__PURE__ */ new WeakMap();
function useSnapshot(proxyObject, options) {
  const notifyInSync = options == null ? void 0 : options.sync;
  const affected = T2(
    () => proxyObject && /* @__PURE__ */ new WeakMap(),
    [proxyObject]
  );
  const lastSnapshot = A2(void 0);
  let inRender = true;
  const currSnapshot = C3(
    q2(
      (callback) => {
        const unsub = subscribe(proxyObject, callback, notifyInSync);
        callback();
        return unsub;
      },
      [proxyObject, notifyInSync]
    ),
    () => {
      const nextSnapshot = snapshot(proxyObject);
      try {
        if (!inRender && lastSnapshot.current && !isChanged(
          lastSnapshot.current,
          nextSnapshot,
          affected,
          /* @__PURE__ */ new WeakMap()
        )) {
          return lastSnapshot.current;
        }
      } catch (e3) {
      }
      return nextSnapshot;
    },
    () => snapshot(proxyObject)
  );
  inRender = false;
  _2(() => {
    lastSnapshot.current = currSnapshot;
  });
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production") {
    condUseAffectedDebugValue(currSnapshot, affected);
  }
  const proxyCache2 = T2(() => /* @__PURE__ */ new WeakMap(), []);
  return createProxy(currSnapshot, affected, proxyCache2, targetCache);
}

// ../../Repo/qql/src/drivers/QqlDriverBase.js
var import_sqlstring_sqlite = __toESM(require_sqlstring_sqlite(), 1);
var import_sqlstring = __toESM(require_sqlstring(), 1);

// ../../Repo/qql/src/drivers/QqlDriverSqlite.js
var import_sqlstring_sqlite2 = __toESM(require_sqlstring_sqlite(), 1);

// ../../Repo/qql/src/drivers/QqlDriverSqlJs.js
var import_sqlstring_sqlite3 = __toESM(require_sqlstring_sqlite(), 1);

// ../../Repo/qql/src/qql/Qql.js
var import_sqlstring2 = __toESM(require_sqlstring(), 1);

// ../../Repo/qql/src/lib/qql-hydrate.js
function appendFunction(target, name, fn3) {
  Object.defineProperty(target, name, {
    enumeratable: false,
    value: fn3
  });
}
function qqlHydrateOne({ qql, data, parentArray, parentObject, oneFrom, where, include, objectFactory, via }) {
  let pkFieldName = "id";
  if (!include)
    include = {};
  function getDataFieldNames() {
    let fns = [];
    for (let fid in data) {
      if (fid != pkFieldName && !Object.keys(include).includes(fid))
        fns.push(fid);
    }
    return fns;
  }
  let fieldNames = getDataFieldNames();
  async function insert() {
    function pushToParent() {
      data.__tmp_id = crypto.randomUUID();
      let parentIndex = parentArray.findIndex((d3) => d3.__tmp_id == data.__tmp_id);
      if (parentIndex < 0)
        parentArray.push(data);
      delete data.__tmp_id;
    }
    fieldNames = getDataFieldNames();
    let set = Object.fromEntries(fieldNames.map((f4) => [f4, data[f4]]));
    if (via) {
      let parentPk = parentObject[pkFieldName];
      if (!parentPk) {
        pushToParent();
        return;
      }
      set[via] = parentPk;
      data[via] = parentPk;
    }
    let insertedId = await qql({
      insertInto: oneFrom,
      set
    });
    data[pkFieldName] = insertedId;
    for (let includeField in include)
      await data[includeField].saveNewChildren();
    pushToParent();
  }
  async function save() {
    if (data[pkFieldName]) {
      let set = Object.fromEntries(fieldNames.map((f4) => [f4, data[f4]]));
      await qql({
        update: oneFrom,
        set,
        where: { [pkFieldName]: data[pkFieldName] }
      });
    } else {
      await insert();
    }
  }
  appendFunction(data, "save", save);
  async function saveIfNew() {
    if (!data[pkFieldName])
      await insert();
  }
  appendFunction(data, "saveIfNew", saveIfNew);
  async function deleteItem() {
    if (data[pkFieldName]) {
      await qql({
        deleteFrom: oneFrom,
        where: { [pkFieldName]: data[pkFieldName] }
      });
    }
    if (parentArray) {
      data.__tmp_id = crypto.randomUUID();
      let parentIndex = parentArray.findIndex((d3) => d3.__tmp_id == data.__tmp_id);
      if (parentIndex >= 0)
        parentArray.splice(parentIndex, 1);
    }
  }
  appendFunction(data, "delete", deleteItem);
  for (let includeField in include) {
    let includeQuery = include[includeField];
    if (includeQuery.manyFrom) {
      qqlHydrateMany({
        qql,
        objectFactory,
        data: data[includeField],
        parentObject: data,
        ...includeQuery
      });
    } else if (includeQuery.oneFrom) {
      if (data[includeField]) {
        qqlHydrateOne({
          qql,
          objectFactory,
          data: data[includeField],
          ...includeQuery
        });
      }
    } else {
      throw new Error("Strange include query");
    }
  }
}
function qqlHydrateMany({ qql, data, manyFrom, where, include, via, objectFactory, parentObject }) {
  if (!objectFactory)
    objectFactory = () => new Object();
  for (let item of data) {
    qqlHydrateOne({
      qql,
      data: item,
      oneFrom: manyFrom,
      where,
      include,
      objectFactory,
      parentArray: data,
      parentObject,
      via
    });
  }
  function newItem() {
    if (parentObject && !via)
      throw new Error("Need via to create object on parent");
    let newObject = objectFactory();
    if (where) {
      for (let k3 in where)
        newObject[k3] = where[k3];
    }
    for (let k3 in include)
      newObject[k3] = [];
    qqlHydrateOne({
      qql,
      data: newObject,
      parentArray: data,
      parentObject,
      oneFrom: manyFrom,
      where,
      include,
      objectFactory,
      via
    });
    return newObject;
  }
  appendFunction(data, "new", newItem);
  async function saveNewChildren() {
    for (let item of data)
      await item.saveIfNew();
  }
  appendFunction(data, "saveNewChildren", saveNewChildren);
}
function qqlHydrateData(args) {
  if (args.oneFrom)
    qqlHydrateOne(args);
  else if (args.manyFrom)
    qqlHydrateMany(args);
  else
    throw new Error("unknown query for hydration");
}

// src/utils/use-data.jsx
function useData(queryAndOptions, deps = []) {
  let { swr, ...query } = queryAndOptions;
  let qql = useQql();
  let data = useIsoMemo(() => query && qql(query), [query, ...deps], { swr });
  let ref = A2({});
  if (!ref.current.proxy || ref.current.data != data) {
    ref.current.data = data;
    if (ref.current.data) {
      ref.current.proxy = proxy(structuredClone(data));
      qqlHydrateData({
        qql,
        data: ref.current.proxy,
        objectFactory: () => proxy({}),
        ...query
      });
    } else {
      ref.current.proxy = void 0;
    }
  }
  useSnapshot(ref.current.proxy ? ref.current.proxy : proxy());
  return ref.current.proxy;
}

// spec/packages/test-project/src/isomain.jsx
function isomain_default() {
  let data = useData({ manyFrom: "pages" });
  let rpc = useRpc();
  let val = useIsoMemo(async () => rpc.test(123));
  return /* @__PURE__ */ u3("div", { class: "m-5", children: [
    "hello isoq, data=",
    JSON.stringify(data),
    " val=",
    val
  ] });
}

// ../../Repo/isoq/node_modules/.pnpm/url-join@5.0.0/node_modules/url-join/lib/url-join.js
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
  for (var i4 = 0; i4 < strArray.length; i4++) {
    var component = strArray[i4];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i4 > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i4 < strArray.length - 1) {
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

// ../../Repo/isoq/src/isoq/IsoqClient.js
var IsoqClient = class {
  constructor({ props, refs, appPathname, window: window2 }) {
    this.window = window2;
    this.refs = refs;
    this.props = props;
    this.appPathname = appPathname;
    if (window2.Request)
      this.req = new Request(this.window.location);
    this.cookieDispatcher = new EventTarget();
    this.undefRefs = [];
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
    let u4 = new URL(urlJoin3(this.appPathname, pathname), this.getUrl());
    return u4.toString();
  }
  getWindow() {
    return this.window;
  }
  /*redirect(url) {
  	this.window.location=url;
  }*/
  fetch = async (url, options = {}) => {
    if (url.startsWith("/"))
      url = new URL(this.req.url).origin + url;
    return await this.window.fetch(url, options);
  };
  getCookie(key) {
    let parsedCookie = parseCookie2(this.window.document.cookie);
    return parsedCookie[key];
  }
  setCookie(key, value, options = {}) {
    document.cookie = stringifyCookie(key, value, options);
    this.cookieDispatcher.dispatchEvent(new Event(key));
  }
};

// ../../Repo/isoq/src/isoq/DefaultErrorFallback.js
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

// ../../Repo/isoq/src/isoq/client.jsx
if (!window.__isoError && window.__iso) {
  let isoClient = new IsoqClient({ ...window.__iso, window });
  let content = /* @__PURE__ */ u3(isomain_default, { ...isoClient.props });
  for (let W3 of [...wrappers_default].reverse())
    content = /* @__PURE__ */ u3(W3, { ...isoClient.props, children: content });
  let isoRefState = new IsoRefState({ initialRefValues: window.__iso.refs });
  let routerState = new RouterState({ url: isoClient.getUrl(), iso: isoClient });
  content = /* @__PURE__ */ u3(IsoContext_default.Provider, { value: isoClient, children: /* @__PURE__ */ u3(IsoRefContext.Provider, { value: isoRefState, children: /* @__PURE__ */ u3(Router, { routerState, children: /* @__PURE__ */ u3(IsoErrorBoundary, { fallback: DefaultErrorFallback, children: content }) }) }) });
  isoClient.hydration = true;
  G(content, window.document.getElementById("isoq"));
  isoClient.hydration = false;
}
