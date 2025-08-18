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

// ../isoq/node_modules/.pnpm/@jridgewell+resolve-uri@3.1.2/node_modules/@jridgewell/resolve-uri/dist/resolve-uri.umd.js
var require_resolve_uri_umd = __commonJS({
  "../isoq/node_modules/.pnpm/@jridgewell+resolve-uri@3.1.2/node_modules/@jridgewell/resolve-uri/dist/resolve-uri.umd.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.resolveURI = factory());
    })(exports, (function() {
      "use strict";
      const schemeRegex = /^[\w+.-]+:\/\//;
      const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
      const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
      function isAbsoluteUrl(input) {
        return schemeRegex.test(input);
      }
      function isSchemeRelativeUrl(input) {
        return input.startsWith("//");
      }
      function isAbsolutePath(input) {
        return input.startsWith("/");
      }
      function isFileUrl(input) {
        return input.startsWith("file:");
      }
      function isRelative(input) {
        return /^[.?#]/.test(input);
      }
      function parseAbsoluteUrl(input) {
        const match = urlRegex.exec(input);
        return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
      }
      function parseFileUrl(input) {
        const match = fileRegex.exec(input);
        const path2 = match[2];
        return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path2) ? path2 : "/" + path2, match[3] || "", match[4] || "");
      }
      function makeUrl(scheme, user, host, port, path2, query, hash) {
        return {
          scheme,
          user,
          host,
          port,
          path: path2,
          query,
          hash,
          type: 7
        };
      }
      function parseUrl(input) {
        if (isSchemeRelativeUrl(input)) {
          const url2 = parseAbsoluteUrl("http:" + input);
          url2.scheme = "";
          url2.type = 6;
          return url2;
        }
        if (isAbsolutePath(input)) {
          const url2 = parseAbsoluteUrl("http://foo.com" + input);
          url2.scheme = "";
          url2.host = "";
          url2.type = 5;
          return url2;
        }
        if (isFileUrl(input))
          return parseFileUrl(input);
        if (isAbsoluteUrl(input))
          return parseAbsoluteUrl(input);
        const url = parseAbsoluteUrl("http://foo.com/" + input);
        url.scheme = "";
        url.host = "";
        url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
        return url;
      }
      function stripPathFilename(path2) {
        if (path2.endsWith("/.."))
          return path2;
        const index = path2.lastIndexOf("/");
        return path2.slice(0, index + 1);
      }
      function mergePaths(url, base) {
        normalizePath(base, base.type);
        if (url.path === "/") {
          url.path = base.path;
        } else {
          url.path = stripPathFilename(base.path) + url.path;
        }
      }
      function normalizePath(url, type) {
        const rel = type <= 4;
        const pieces = url.path.split("/");
        let pointer = 1;
        let positive = 0;
        let addTrailingSlash = false;
        for (let i4 = 1; i4 < pieces.length; i4++) {
          const piece = pieces[i4];
          if (!piece) {
            addTrailingSlash = true;
            continue;
          }
          addTrailingSlash = false;
          if (piece === ".")
            continue;
          if (piece === "..") {
            if (positive) {
              addTrailingSlash = true;
              positive--;
              pointer--;
            } else if (rel) {
              pieces[pointer++] = piece;
            }
            continue;
          }
          pieces[pointer++] = piece;
          positive++;
        }
        let path2 = "";
        for (let i4 = 1; i4 < pointer; i4++) {
          path2 += "/" + pieces[i4];
        }
        if (!path2 || addTrailingSlash && !path2.endsWith("/..")) {
          path2 += "/";
        }
        url.path = path2;
      }
      function resolve(input, base) {
        if (!input && !base)
          return "";
        const url = parseUrl(input);
        let inputType = url.type;
        if (base && inputType !== 7) {
          const baseUrl = parseUrl(base);
          const baseType = baseUrl.type;
          switch (inputType) {
            case 1:
              url.hash = baseUrl.hash;
            // fall through
            case 2:
              url.query = baseUrl.query;
            // fall through
            case 3:
            case 4:
              mergePaths(url, baseUrl);
            // fall through
            case 5:
              url.user = baseUrl.user;
              url.host = baseUrl.host;
              url.port = baseUrl.port;
            // fall through
            case 6:
              url.scheme = baseUrl.scheme;
          }
          if (baseType > inputType)
            inputType = baseType;
        }
        normalizePath(url, inputType);
        const queryHash = url.query + url.hash;
        switch (inputType) {
          // This is impossible, because of the empty checks at the start of the function.
          // case UrlType.Empty:
          case 2:
          case 3:
            return queryHash;
          case 4: {
            const path2 = url.path.slice(1);
            if (!path2)
              return queryHash || ".";
            if (isRelative(base || input) && !isRelative(path2)) {
              return "./" + path2 + queryHash;
            }
            return path2 + queryHash;
          }
          case 5:
            return url.path + queryHash;
          default:
            return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
        }
      }
      return resolve;
    }));
  }
});

// ../isoq/node_modules/.pnpm/path-browserify@1.0.1/node_modules/path-browserify/index.js
var require_path_browserify = __commonJS({
  "../isoq/node_modules/.pnpm/path-browserify@1.0.1/node_modules/path-browserify/index.js"(exports, module) {
    "use strict";
    function assertPath(path2) {
      if (typeof path2 !== "string") {
        throw new TypeError("Path must be a string. Received " + JSON.stringify(path2));
      }
    }
    function normalizeStringPosix(path2, allowAboveRoot) {
      var res = "";
      var lastSegmentLength = 0;
      var lastSlash = -1;
      var dots = 0;
      var code;
      for (var i4 = 0; i4 <= path2.length; ++i4) {
        if (i4 < path2.length)
          code = path2.charCodeAt(i4);
        else if (code === 47)
          break;
        else
          code = 47;
        if (code === 47) {
          if (lastSlash === i4 - 1 || dots === 1) {
          } else if (lastSlash !== i4 - 1 && dots === 2) {
            if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
              if (res.length > 2) {
                var lastSlashIndex = res.lastIndexOf("/");
                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = "";
                    lastSegmentLength = 0;
                  } else {
                    res = res.slice(0, lastSlashIndex);
                    lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                  }
                  lastSlash = i4;
                  dots = 0;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i4;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0)
                res += "/..";
              else
                res = "..";
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0)
              res += "/" + path2.slice(lastSlash + 1, i4);
            else
              res = path2.slice(lastSlash + 1, i4);
            lastSegmentLength = i4 - lastSlash - 1;
          }
          lastSlash = i4;
          dots = 0;
        } else if (code === 46 && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    function _format(sep, pathObject) {
      var dir = pathObject.dir || pathObject.root;
      var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    var posix = {
      // path.resolve([from ...], to)
      resolve: function resolve() {
        var resolvedPath = "";
        var resolvedAbsolute = false;
        var cwd;
        for (var i4 = arguments.length - 1; i4 >= -1 && !resolvedAbsolute; i4--) {
          var path2;
          if (i4 >= 0)
            path2 = arguments[i4];
          else {
            if (cwd === void 0)
              cwd = process.cwd();
            path2 = cwd;
          }
          assertPath(path2);
          if (path2.length === 0) {
            continue;
          }
          resolvedPath = path2 + "/" + resolvedPath;
          resolvedAbsolute = path2.charCodeAt(0) === 47;
        }
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
          if (resolvedPath.length > 0)
            return "/" + resolvedPath;
          else
            return "/";
        } else if (resolvedPath.length > 0) {
          return resolvedPath;
        } else {
          return ".";
        }
      },
      normalize: function normalize2(path2) {
        assertPath(path2);
        if (path2.length === 0) return ".";
        var isAbsolute = path2.charCodeAt(0) === 47;
        var trailingSeparator = path2.charCodeAt(path2.length - 1) === 47;
        path2 = normalizeStringPosix(path2, !isAbsolute);
        if (path2.length === 0 && !isAbsolute) path2 = ".";
        if (path2.length > 0 && trailingSeparator) path2 += "/";
        if (isAbsolute) return "/" + path2;
        return path2;
      },
      isAbsolute: function isAbsolute(path2) {
        assertPath(path2);
        return path2.length > 0 && path2.charCodeAt(0) === 47;
      },
      join: function join() {
        if (arguments.length === 0)
          return ".";
        var joined;
        for (var i4 = 0; i4 < arguments.length; ++i4) {
          var arg = arguments[i4];
          assertPath(arg);
          if (arg.length > 0) {
            if (joined === void 0)
              joined = arg;
            else
              joined += "/" + arg;
          }
        }
        if (joined === void 0)
          return ".";
        return posix.normalize(joined);
      },
      relative: function relative(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to) return "";
        from = posix.resolve(from);
        to = posix.resolve(to);
        if (from === to) return "";
        var fromStart = 1;
        for (; fromStart < from.length; ++fromStart) {
          if (from.charCodeAt(fromStart) !== 47)
            break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        var toStart = 1;
        for (; toStart < to.length; ++toStart) {
          if (to.charCodeAt(toStart) !== 47)
            break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i4 = 0;
        for (; i4 <= length; ++i4) {
          if (i4 === length) {
            if (toLen > length) {
              if (to.charCodeAt(toStart + i4) === 47) {
                return to.slice(toStart + i4 + 1);
              } else if (i4 === 0) {
                return to.slice(toStart + i4);
              }
            } else if (fromLen > length) {
              if (from.charCodeAt(fromStart + i4) === 47) {
                lastCommonSep = i4;
              } else if (i4 === 0) {
                lastCommonSep = 0;
              }
            }
            break;
          }
          var fromCode = from.charCodeAt(fromStart + i4);
          var toCode = to.charCodeAt(toStart + i4);
          if (fromCode !== toCode)
            break;
          else if (fromCode === 47)
            lastCommonSep = i4;
        }
        var out = "";
        for (i4 = fromStart + lastCommonSep + 1; i4 <= fromEnd; ++i4) {
          if (i4 === fromEnd || from.charCodeAt(i4) === 47) {
            if (out.length === 0)
              out += "..";
            else
              out += "/..";
          }
        }
        if (out.length > 0)
          return out + to.slice(toStart + lastCommonSep);
        else {
          toStart += lastCommonSep;
          if (to.charCodeAt(toStart) === 47)
            ++toStart;
          return to.slice(toStart);
        }
      },
      _makeLong: function _makeLong(path2) {
        return path2;
      },
      dirname: function dirname(path2) {
        assertPath(path2);
        if (path2.length === 0) return ".";
        var code = path2.charCodeAt(0);
        var hasRoot = code === 47;
        var end = -1;
        var matchedSlash = true;
        for (var i4 = path2.length - 1; i4 >= 1; --i4) {
          code = path2.charCodeAt(i4);
          if (code === 47) {
            if (!matchedSlash) {
              end = i4;
              break;
            }
          } else {
            matchedSlash = false;
          }
        }
        if (end === -1) return hasRoot ? "/" : ".";
        if (hasRoot && end === 1) return "//";
        return path2.slice(0, end);
      },
      basename: function basename(path2, ext) {
        if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
        assertPath(path2);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i4;
        if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
          if (ext.length === path2.length && ext === path2) return "";
          var extIdx = ext.length - 1;
          var firstNonSlashEnd = -1;
          for (i4 = path2.length - 1; i4 >= 0; --i4) {
            var code = path2.charCodeAt(i4);
            if (code === 47) {
              if (!matchedSlash) {
                start = i4 + 1;
                break;
              }
            } else {
              if (firstNonSlashEnd === -1) {
                matchedSlash = false;
                firstNonSlashEnd = i4 + 1;
              }
              if (extIdx >= 0) {
                if (code === ext.charCodeAt(extIdx)) {
                  if (--extIdx === -1) {
                    end = i4;
                  }
                } else {
                  extIdx = -1;
                  end = firstNonSlashEnd;
                }
              }
            }
          }
          if (start === end) end = firstNonSlashEnd;
          else if (end === -1) end = path2.length;
          return path2.slice(start, end);
        } else {
          for (i4 = path2.length - 1; i4 >= 0; --i4) {
            if (path2.charCodeAt(i4) === 47) {
              if (!matchedSlash) {
                start = i4 + 1;
                break;
              }
            } else if (end === -1) {
              matchedSlash = false;
              end = i4 + 1;
            }
          }
          if (end === -1) return "";
          return path2.slice(start, end);
        }
      },
      extname: function extname(path2) {
        assertPath(path2);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var preDotState = 0;
        for (var i4 = path2.length - 1; i4 >= 0; --i4) {
          var code = path2.charCodeAt(i4);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i4 + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i4 + 1;
          }
          if (code === 46) {
            if (startDot === -1)
              startDot = i4;
            else if (preDotState !== 1)
              preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          return "";
        }
        return path2.slice(startDot, end);
      },
      format: function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
          throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        }
        return _format("/", pathObject);
      },
      parse: function parse3(path2) {
        assertPath(path2);
        var ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path2.length === 0) return ret;
        var code = path2.charCodeAt(0);
        var isAbsolute = code === 47;
        var start;
        if (isAbsolute) {
          ret.root = "/";
          start = 1;
        } else {
          start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i4 = path2.length - 1;
        var preDotState = 0;
        for (; i4 >= start; --i4) {
          code = path2.charCodeAt(i4);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i4 + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i4 + 1;
          }
          if (code === 46) {
            if (startDot === -1) startDot = i4;
            else if (preDotState !== 1) preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          if (end !== -1) {
            if (startPart === 0 && isAbsolute) ret.base = ret.name = path2.slice(1, end);
            else ret.base = ret.name = path2.slice(startPart, end);
          }
        } else {
          if (startPart === 0 && isAbsolute) {
            ret.name = path2.slice(1, startDot);
            ret.base = path2.slice(1, end);
          } else {
            ret.name = path2.slice(startPart, startDot);
            ret.base = path2.slice(startPart, end);
          }
          ret.ext = path2.slice(startDot, end);
        }
        if (startPart > 0) ret.dir = path2.slice(0, startPart - 1);
        else if (isAbsolute) ret.dir = "/";
        return ret;
      },
      sep: "/",
      delimiter: ":",
      win32: null,
      posix: null
    };
    posix.posix = posix;
    module.exports = posix;
  }
});

// ../qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/lib/SqlString.js
var require_SqlString = __commonJS({
  "../qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/lib/SqlString.js"(exports) {
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

// ../qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/index.js
var require_sqlstring_sqlite = __commonJS({
  "../qql/node_modules/.pnpm/sqlstring-sqlite@0.1.1/node_modules/sqlstring-sqlite/index.js"(exports, module) {
    module.exports = require_SqlString();
  }
});

// ../qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/lib/SqlString.js
var require_SqlString2 = __commonJS({
  "../qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/lib/SqlString.js"(exports) {
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

// ../qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/index.js
var require_sqlstring = __commonJS({
  "../qql/node_modules/.pnpm/sqlstring@2.3.3/node_modules/sqlstring/index.js"(exports, module) {
    module.exports = require_SqlString2();
  }
});

// ../isoq/node_modules/.pnpm/preact@10.27.0/node_modules/preact/dist/preact.module.js
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
  for (var u4 in l3) n2[u4] = l3[u4];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l3, u4, t3) {
  var i4, r3, o3, e3 = {};
  for (o3 in u4) "key" == o3 ? i4 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
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
  if (null == l3) return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
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
  for (var n2, u4, t3, r3, o3, f4, c3, s3 = 1; i.length; ) i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, o3 = (r3 = (u4 = n2).__v).__e, f4 = [], c3 = [], u4.__P && ((t3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(t3), O(u4.__P, t3, r3, u4.__n, u4.__P.namespaceURI, 32 & r3.__u ? [o3] : null, f4, null == o3 ? S(r3) : o3, !!(32 & r3.__u), c3), t3.__v = r3.__v, t3.__.__k[t3.__i] = t3, N(f4, t3, c3), t3.__e != o3 && C(t3)));
  $.__r = 0;
}
function I(n2, l3, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, y3, w3, d3, g4, _3 = t3 && t3.__k || v, m3 = l3.length;
  for (f4 = P(u4, l3, _3, f4, m3), a3 = 0; a3 < m3; a3++) null != (y3 = u4.__k[a3]) && (h3 = -1 == y3.__i ? p : _3[y3.__i] || p, y3.__i = a3, g4 = O(n2, y3, h3, i4, r3, o3, e3, f4, c3, s3), w3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && B(h3.ref, null, y3), s3.push(y3.ref, y3.__c || w3, y3)), null == d3 && null != w3 && (d3 = w3), 4 & y3.__u || h3.__k === y3.__k ? f4 = A(y3, f4, n2) : "function" == typeof y3.type && void 0 !== g4 ? f4 = g4 : w3 && (f4 = w3.nextSibling), y3.__u &= -7);
  return u4.__e = d3, f4;
}
function P(n2, l3, u4, t3, i4) {
  var r3, o3, e3, f4, c3, s3 = u4.length, a3 = s3, h3 = 0;
  for (n2.__k = new Array(i4), r3 = 0; r3 < i4; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f4 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : w(o3) ? m(k, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = L(o3, u4, f4, a3)) && (a3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i4 > s3 ? h3-- : i4 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (a3) for (r3 = 0; r3 < s3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), D(e3, e3));
  return t3;
}
function A(n2, l3, u4) {
  var t3, i4;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i4 = 0; t3 && i4 < t3.length; i4++) t3[i4] && (t3[i4].__ = n2, l3 = A(t3[i4], l3, u4));
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
  var i4, r3, o3, e3 = n2.key, f4 = n2.type, c3 = l3[u4], s3 = null != c3 && 0 == (2 & c3.__u);
  if (null === c3 && null == n2.key || s3 && e3 == c3.key && f4 == c3.type) return u4;
  if (t3 > (s3 ? 1 : 0)) {
    for (i4 = u4 - 1, r3 = u4 + 1; i4 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i4 >= 0 ? i4-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f4 == c3.type) return o3;
  }
  return -1;
}
function T(n2, l3, u4) {
  "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || y.test(l3) ? u4 : u4 + "px";
}
function j(n2, l3, u4, t3, i4) {
  var r3, o3;
  n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
  else {
    if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || T(n2.style, l3, "");
    if (u4) for (l3 in u4) t3 && u4[l3] == t3[l3] || T(n2.style, l3, u4[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
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
      if (null == u4.t) u4.t = c++;
      else if (u4.t < t3.u) return;
      return t3(l.event ? l.event(u4) : u4);
    }
  };
}
function O(n2, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, p3, v3, y3, _3, m3, b2, S2, C4, M2, $2, P4, A5, H3, L2, T4, j4 = u4.type;
  if (null != u4.constructor) return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (a3 = l.__b) && a3(u4);
  n: if ("function" == typeof j4) try {
    if (b2 = u4.props, S2 = "prototype" in j4 && j4.prototype.render, C4 = (a3 = j4.contextType) && i4[a3.__c], M2 = a3 ? C4 ? C4.props.value : a3.__ : i4, t3.__c ? m3 = (h3 = u4.__c = t3.__c).__ = h3.__E : (S2 ? u4.__c = h3 = new j4(b2, M2) : (u4.__c = h3 = new x(b2, M2), h3.constructor = j4, h3.render = E), C4 && C4.sub(h3), h3.props = b2, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i4, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j4.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, j4.getDerivedStateFromProps(b2, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u4, p3) S2 && null == j4.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
    else {
      if (S2 && null == j4.getDerivedStateFromProps && b2 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b2, M2), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b2, h3.__s, M2) || u4.__v == t3.__v) {
        for (u4.__v != t3.__v && (h3.props = b2, h3.state = h3.__s, h3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
          n3 && (n3.__ = u4);
        }), $2 = 0; $2 < h3._sb.length; $2++) h3.__h.push(h3._sb[$2]);
        h3._sb = [], h3.__h.length && e3.push(h3);
        break n;
      }
      null != h3.componentWillUpdate && h3.componentWillUpdate(b2, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
        h3.componentDidUpdate(v3, y3, _3);
      });
    }
    if (h3.context = M2, h3.props = b2, h3.__P = n2, h3.__e = false, P4 = l.__r, A5 = 0, S2) {
      for (h3.state = h3.__s, h3.__d = false, P4 && P4(u4), a3 = h3.render(h3.props, h3.state, h3.context), H3 = 0; H3 < h3._sb.length; H3++) h3.__h.push(h3._sb[H3]);
      h3._sb = [];
    } else do {
      h3.__d = false, P4 && P4(u4), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
    } while (h3.__d && ++A5 < 25);
    h3.state = h3.__s, null != h3.getChildContext && (i4 = d(d({}, i4), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_3 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = V(a3.props.children)), f4 = I(n2, w(L2) ? L2 : [L2], u4, t3, i4, r3, o3, e3, f4, c3, s3), h3.base = u4.__e, u4.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
  } catch (n3) {
    if (u4.__v = null, c3 || null != o3) if (n3.then) {
      for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
      o3[o3.indexOf(f4)] = null, u4.__e = f4;
    } else {
      for (T4 = o3.length; T4--; ) g(o3[T4]);
      z(u4);
    }
    else u4.__e = t3.__e, u4.__k = t3.__k, n3.then || z(u4);
    l.__e(n3, u4, t3);
  }
  else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = q(t3.__e, u4, t3, i4, r3, o3, e3, c3, s3);
  return (a3 = l.diffed) && a3(u4), 128 & u4.__u ? void 0 : f4;
}
function z(n2) {
  n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z);
}
function N(n2, u4, t3) {
  for (var i4 = 0; i4 < t3.length; i4++) B(t3[i4], t3[++i4], t3[++i4]);
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
function V(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w(n2) ? n2.map(V) : d({}, n2);
}
function q(u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, v3, y3, d3, _3, m3, b2 = i4.props, k3 = t3.props, x4 = t3.type;
  if ("svg" == x4 ? o3 = "http://www.w3.org/2000/svg" : "math" == x4 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (a3 = 0; a3 < e3.length; a3++) if ((d3 = e3[a3]) && "setAttribute" in d3 == !!x4 && (x4 ? d3.localName == x4 : 3 == d3.nodeType)) {
      u4 = d3, e3[a3] = null;
      break;
    }
  }
  if (null == u4) {
    if (null == x4) return document.createTextNode(k3);
    u4 = document.createElementNS(o3, x4, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x4) b2 === k3 || c3 && u4.data == k3 || (u4.data = k3);
  else {
    if (e3 = e3 && n.call(u4.childNodes), b2 = i4.props || p, !c3 && null != e3) for (b2 = {}, a3 = 0; a3 < u4.attributes.length; a3++) b2[(d3 = u4.attributes[a3]).name] = d3.value;
    for (a3 in b2) if (d3 = b2[a3], "children" == a3) ;
    else if ("dangerouslySetInnerHTML" == a3) v3 = d3;
    else if (!(a3 in k3)) {
      if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
      j(u4, a3, null, d3, o3);
    }
    for (a3 in k3) d3 = k3[a3], "children" == a3 ? y3 = d3 : "dangerouslySetInnerHTML" == a3 ? h3 = d3 : "value" == a3 ? _3 = d3 : "checked" == a3 ? m3 = d3 : c3 && "function" != typeof d3 || b2[a3] === d3 || j(u4, a3, d3, b2[a3], o3);
    if (h3) c3 || v3 && (h3.__html == v3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
    else if (v3 && (u4.innerHTML = ""), I("template" == t3.type ? u4.content : u4, w(y3) ? y3 : [y3], t3, i4, r3, "foreignObject" == x4 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i4.__k && S(i4, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) g(e3[a3]);
    c3 || (a3 = "value", "progress" == x4 && null == _3 ? u4.removeAttribute("value") : null != _3 && (_3 !== u4[a3] || "progress" == x4 && !_3 || "option" == x4 && _3 != b2[a3]) && j(u4, a3, _3, b2[a3], o3), a3 = "checked", null != m3 && m3 != u4[a3] && j(u4, a3, m3, b2[a3], o3));
  }
  return u4;
}
function B(n2, u4, t3) {
  try {
    if ("function" == typeof n2) {
      var i4 = "function" == typeof n2.__u;
      i4 && n2.__u(), i4 && null == u4 || (n2.__u = n2(u4));
    } else n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function D(n2, u4, t3) {
  var i4, r3;
  if (l.unmount && l.unmount(n2), (i4 = n2.ref) && (i4.current && i4.current != n2.__e || B(i4, null, u4)), null != (i4 = n2.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u4);
    }
    i4.base = i4.__P = null;
  }
  if (i4 = n2.__k) for (r3 = 0; r3 < i4.length; r3++) i4[r3] && D(i4[r3], u4, t3 || "function" != typeof n2.type);
  t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function E(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function G(u4, t3, i4) {
  var r3, o3, e3, f4;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i4) ? null : i4 && i4.__k || t3.__k, e3 = [], f4 = [], O(t3, u4 = (!r3 && i4 || t3).__k = _(k, null, [u4]), o3 || p, p, t3.namespaceURI, !r3 && i4 ? [i4] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i4 ? i4 : o3 ? o3.__e : t3.firstChild, r3, f4), N(e3, u4, f4);
}
function J(n2, l3) {
  G(n2, l3, J);
}
function Q(n2) {
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
  for (var i4, r3, o3; l3 = l3.__; ) if ((i4 = l3.__c) && !i4.__) try {
    if ((r3 = i4.constructor) && null != r3.getDerivedStateFromError && (i4.setState(r3.getDerivedStateFromError(n2)), o3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n2, t3 || {}), o3 = i4.__d), o3) return i4.__E = i4;
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

// ../isoq/node_modules/.pnpm/preact@10.27.0/node_modules/preact/hooks/dist/hooks.module.js
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
      if (!o3.__c.__H) return true;
      var u5 = o3.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u5.every(function(n4) {
        return !n4.__N;
      })) return !c3 || c3.call(this, n3, t3, r3);
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
  for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
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

// ../isoq/node_modules/.pnpm/preact@10.27.0/node_modules/preact/compat/dist/compat.module.js
function g3(n2, t3) {
  for (var e3 in t3) n2[e3] = t3[e3];
  return n2;
}
function E2(n2, t3) {
  for (var e3 in n2) if ("__source" !== e3 && !(e3 in t3)) return true;
  for (var r3 in t3) if ("__source" !== r3 && n2[r3] !== t3[r3]) return true;
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
    for (var u4, o3 = t3; o3 = o3.__; ) if ((u4 = o3.__c) && u4.__c) return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u4.__c(n2, t3);
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
      for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); ) t4.forceUpdate();
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
  if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e3 = n2.i; e3; ) {
    for (; e3.length > 3; ) e3.pop()();
    if (e3[1] < e3[0]) break;
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
  for (var e3 = t3.length; e3--; ) this.l.set(t3[e3], this.i = [1, 0, this.i]);
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
var Q2 = "undefined" != typeof document;
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
  "string" == typeof n2.type && (function(n3) {
    var t3 = n3.props, e3 = n3.type, u4 = {}, o3 = -1 === e3.indexOf("-");
    for (var i4 in t3) {
      var l3 = t3[i4];
      if (!("value" === i4 && "defaultValue" in t3 && null == l3 || Q2 && "children" === i4 && "noscript" === e3 || "class" === i4 || "className" === i4)) {
        var c3 = i4.toLowerCase();
        "defaultValue" === i4 && "value" in t3 && null == t3.value ? i4 = "value" : "download" === i4 && true === l3 ? l3 = "" : "translate" === c3 && "no" === l3 ? l3 = false : "o" === c3[0] && "n" === c3[1] ? "ondoubleclick" === c3 ? i4 = "ondblclick" : "onchange" !== c3 || "input" !== e3 && "textarea" !== e3 || X(t3.type) ? "onfocus" === c3 ? i4 = "onfocusin" : "onblur" === c3 ? i4 = "onfocusout" : J2.test(i4) && (i4 = c3) : c3 = i4 = "oninput" : o3 && G2.test(i4) ? i4 = i4.replace(K2, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === c3 && u4[i4 = c3] && (i4 = "oninputCapture"), u4[i4] = l3;
      }
    }
    "select" == e3 && u4.multiple && Array.isArray(u4.value) && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = -1 != u4.value.indexOf(n4.props.value);
    })), "select" == e3 && null != u4.defaultValue && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = u4.multiple ? -1 != u4.defaultValue.indexOf(n4.props.value) : u4.defaultValue == n4.props.value;
    })), t3.class && !t3.className ? (u4.class = t3.class, Object.defineProperty(u4, "className", cn)) : (t3.className && !t3.class || t3.class && t3.className) && (u4.class = u4.className = t3.className), n3.props = u4;
  })(n2), n2.$$typeof = q3, fn && fn(n2);
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

// ../isoq/src/utils/preact-refid.js
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

// ../isoq/src/utils/js-util.js
function arrayRemove(array, item) {
  let index = array.indexOf(item);
  if (index >= 0)
    array.splice(index, 1);
  return array;
}

// ../isoq/src/components/iso-ref.js
var IsoRefContext = Q();
var IsoRef = class {
  constructor(isoRefState, initialValue, options2) {
    this.isoRefState = isoRefState;
    this.refCount = 0;
    this.current = initialValue;
    this.ids = [];
    this.shared = options2.shared;
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
  getRef(id, initialValue, options2) {
    if (!this.refs[id]) {
      this.refs[id] = new IsoRef(this, initialValue, options2);
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
function useIsoRef(initialValue, options2 = {}) {
  if (typeof options2 == "boolean")
    options2 = { shared: options2 };
  let refId = useRefId();
  let isoRefState = x2(IsoRefContext);
  let ref = isoRefState.getRef(refId, initialValue, options2);
  _2(() => {
    ref.ref(refId);
    return () => {
      ref.unref(refId);
    };
  }, []);
  return ref;
}

// ../isoq/src/utils/react-util.js
function useEventListener(o3, ev, fn2) {
  _2(() => {
    o3.addEventListener(ev, fn2);
    return () => {
      o3.removeEventListener(ev, fn2);
    };
  }, [o3, ev, fn2]);
}
function useEventUpdate(o3, ev) {
  let [_3, setDummyState] = d2();
  let forceUpdate = q2(() => setDummyState({}));
  useEventListener(o3, ev, forceUpdate);
}

// ../isoq/node_modules/.pnpm/preact@10.27.0/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e3, t3, n2, o3, i4, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i4, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// ../isoq/src/components/router.jsx
var RouterContext = Q();
var RouteContext = Q();
var RouteMatchContext = Q();
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
  useEventUpdate(routerState, "change");
  return /* @__PURE__ */ u3(RouterContext.Provider, { value: routerState, children: [
    /* @__PURE__ */ u3(IsoSuspense, { children: /* @__PURE__ */ u3("div", { style: { display: "contents" }, children: /* @__PURE__ */ u3(CheckMount, { children: /* @__PURE__ */ u3(RouteContext.Provider, { value: { url: routerState.committedUrl }, children }) }) }) }, "route-" + routerState.committedVersion),
    !!routerState.nextVersion && /* @__PURE__ */ u3(IsoSuspense, { children: /* @__PURE__ */ u3("div", { style: { display: "none" }, children: /* @__PURE__ */ u3(CheckMount, { onMount: () => routerState.commit(), children: /* @__PURE__ */ u3(RouteContext.Provider, { value: { url: routerState.nextUrl }, children }) }) }) }, "route-" + routerState.nextVersion)
  ] });
}

// ../isoq/src/components/IsoErrorBoundary.jsx
function DefaultErrorFallback({ error }) {
  let [showNoisy, setShowNoisy] = d2();
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
    boxSizing: "border-box"
  };
  let aStyle = {
    marginLeft: "40px",
    textDecoration: "underline",
    cursor: "pointer"
  };
  return /* @__PURE__ */ u3("div", { style, children: [
    /* @__PURE__ */ u3("div", { children: String(error) }),
    error.stackFrames && /* @__PURE__ */ u3(k, { children: [
      error.stackFrames.filter((f4) => showNoisy || !f4.noisy).map(
        (f4) => /* @__PURE__ */ u3("div", { style: { marginLeft: "40px" }, children: [
          "at ",
          f4.file,
          ":",
          f4.line,
          ":",
          f4.column,
          f4.name ? ` (in ${f4.name})` : ""
        ] })
      ),
      !showNoisy && error.stackFrames.filter((f4) => f4.noisy).length > 0 && /* @__PURE__ */ u3("a", { style: aStyle, onClick: () => setShowNoisy(true), children: "more..." })
    ] })
  ] });
}
var ErrorBoundary = class extends x {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }
  render(_3, state) {
    if (state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
};
function IsoErrorBoundary({ fallback, children }) {
  let [error, setError] = d2();
  let iso = useIsoContext();
  iso.errorFallback = fallback;
  async function handleError(e3) {
    let tmpError = new Error();
    tmpError.name = e3.name;
    tmpError.message = e3.message;
    setError(tmpError);
    await iso.processError(e3);
    setError(e3);
  }
  let Fallback = fallback;
  if (error)
    return /* @__PURE__ */ u3(Fallback, { error });
  return /* @__PURE__ */ u3(ErrorBoundary, { onError: handleError, children });
}

// ../isoq/node_modules/.pnpm/stacktrace-parser@0.1.11/node_modules/stacktrace-parser/dist/stack-trace-parser.esm.js
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

// ../isoq/node_modules/.pnpm/@jridgewell+sourcemap-codec@1.5.5/node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i4 = 0; i4 < chars.length; i4++) {
  const c3 = chars.charCodeAt(i4);
  intToChar[i4] = c3;
  charToInt[c3] = i4;
}
function decodeInteger(reader, relative) {
  let value = 0;
  let shift = 0;
  let integer = 0;
  do {
    const c3 = reader.next();
    integer = charToInt[c3];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);
  const shouldNegate = value & 1;
  value >>>= 1;
  if (shouldNegate) {
    value = -2147483648 | -value;
  }
  return relative + value;
}
function hasMoreVlq(reader, max) {
  if (reader.pos >= max) return false;
  return reader.peek() !== comma;
}
var bufLength = 1024 * 16;
var StringReader = class {
  constructor(buffer) {
    this.pos = 0;
    this.buffer = buffer;
  }
  next() {
    return this.buffer.charCodeAt(this.pos++);
  }
  peek() {
    return this.buffer.charCodeAt(this.pos);
  }
  indexOf(char) {
    const { buffer, pos } = this;
    const idx = buffer.indexOf(char, pos);
    return idx === -1 ? buffer.length : idx;
  }
};
function decode(mappings) {
  const { length } = mappings;
  const reader = new StringReader(mappings);
  const decoded = [];
  let genColumn = 0;
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  do {
    const semi = reader.indexOf(";");
    const line = [];
    let sorted = true;
    let lastCol = 0;
    genColumn = 0;
    while (reader.pos < semi) {
      let seg;
      genColumn = decodeInteger(reader, genColumn);
      if (genColumn < lastCol) sorted = false;
      lastCol = genColumn;
      if (hasMoreVlq(reader, semi)) {
        sourcesIndex = decodeInteger(reader, sourcesIndex);
        sourceLine = decodeInteger(reader, sourceLine);
        sourceColumn = decodeInteger(reader, sourceColumn);
        if (hasMoreVlq(reader, semi)) {
          namesIndex = decodeInteger(reader, namesIndex);
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex];
        } else {
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn];
        }
      } else {
        seg = [genColumn];
      }
      line.push(seg);
      reader.pos++;
    }
    if (!sorted) sort(line);
    decoded.push(line);
    reader.pos = semi + 1;
  } while (reader.pos <= length);
  return decoded;
}
function sort(line) {
  line.sort(sortComparator);
}
function sortComparator(a3, b2) {
  return a3[0] - b2[0];
}

// ../isoq/node_modules/.pnpm/@jridgewell+trace-mapping@0.3.30/node_modules/@jridgewell/trace-mapping/dist/trace-mapping.mjs
var import_resolve_uri = __toESM(require_resolve_uri_umd(), 1);
function stripFilename(path2) {
  if (!path2) return "";
  const index = path2.lastIndexOf("/");
  return path2.slice(0, index + 1);
}
function resolver(mapUrl, sourceRoot) {
  const from = stripFilename(mapUrl);
  const prefix = sourceRoot ? sourceRoot + "/" : "";
  return (source) => (0, import_resolve_uri.default)(prefix + (source || ""), from);
}
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;
function maybeSort(mappings, owned) {
  const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
  if (unsortedIndex === mappings.length) return mappings;
  if (!owned) mappings = mappings.slice();
  for (let i4 = unsortedIndex; i4 < mappings.length; i4 = nextUnsortedSegmentLine(mappings, i4 + 1)) {
    mappings[i4] = sortSegments(mappings[i4], owned);
  }
  return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
  for (let i4 = start; i4 < mappings.length; i4++) {
    if (!isSorted(mappings[i4])) return i4;
  }
  return mappings.length;
}
function isSorted(line) {
  for (let j4 = 1; j4 < line.length; j4++) {
    if (line[j4][COLUMN] < line[j4 - 1][COLUMN]) {
      return false;
    }
  }
  return true;
}
function sortSegments(line, owned) {
  if (!owned) line = line.slice();
  return line.sort(sortComparator2);
}
function sortComparator2(a3, b2) {
  return a3[COLUMN] - b2[COLUMN];
}
var found = false;
function binarySearch(haystack, needle, low, high) {
  while (low <= high) {
    const mid = low + (high - low >> 1);
    const cmp = haystack[mid][COLUMN] - needle;
    if (cmp === 0) {
      found = true;
      return mid;
    }
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  found = false;
  return low - 1;
}
function upperBound(haystack, needle, index) {
  for (let i4 = index + 1; i4 < haystack.length; index = i4++) {
    if (haystack[i4][COLUMN] !== needle) break;
  }
  return index;
}
function lowerBound(haystack, needle, index) {
  for (let i4 = index - 1; i4 >= 0; index = i4--) {
    if (haystack[i4][COLUMN] !== needle) break;
  }
  return index;
}
function memoizedState() {
  return {
    lastKey: -1,
    lastNeedle: -1,
    lastIndex: -1
  };
}
function memoizedBinarySearch(haystack, needle, state, key) {
  const { lastKey, lastNeedle, lastIndex } = state;
  let low = 0;
  let high = haystack.length - 1;
  if (key === lastKey) {
    if (needle === lastNeedle) {
      found = lastIndex !== -1 && haystack[lastIndex][COLUMN] === needle;
      return lastIndex;
    }
    if (needle >= lastNeedle) {
      low = lastIndex === -1 ? 0 : lastIndex;
    } else {
      high = lastIndex;
    }
  }
  state.lastKey = key;
  state.lastNeedle = needle;
  return state.lastIndex = binarySearch(haystack, needle, low, high);
}
function parse2(map) {
  return typeof map === "string" ? JSON.parse(map) : map;
}
var LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
var COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
var LEAST_UPPER_BOUND = -1;
var GREATEST_LOWER_BOUND = 1;
var TraceMap = class {
  constructor(map, mapUrl) {
    const isString = typeof map === "string";
    if (!isString && map._decodedMemo) return map;
    const parsed = parse2(map);
    const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
    this.version = version;
    this.file = file;
    this.names = names || [];
    this.sourceRoot = sourceRoot;
    this.sources = sources;
    this.sourcesContent = sourcesContent;
    this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
    const resolve = resolver(mapUrl, sourceRoot);
    this.resolvedSources = sources.map(resolve);
    const { mappings } = parsed;
    if (typeof mappings === "string") {
      this._encoded = mappings;
      this._decoded = void 0;
    } else if (Array.isArray(mappings)) {
      this._encoded = void 0;
      this._decoded = maybeSort(mappings, isString);
    } else if (parsed.sections) {
      throw new Error(`TraceMap passed sectioned source map, please use FlattenMap export instead`);
    } else {
      throw new Error(`invalid source map: ${JSON.stringify(parsed)}`);
    }
    this._decodedMemo = memoizedState();
    this._bySources = void 0;
    this._bySourceMemos = void 0;
  }
};
function cast(map) {
  return map;
}
function decodedMappings(map) {
  var _a;
  return (_a = cast(map))._decoded || (_a._decoded = decode(cast(map)._encoded));
}
function originalPositionFor(map, needle) {
  let { line, column, bias } = needle;
  line--;
  if (line < 0) throw new Error(LINE_GTR_ZERO);
  if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
  const decoded = decodedMappings(map);
  if (line >= decoded.length) return OMapping(null, null, null, null);
  const segments = decoded[line];
  const index = traceSegmentInternal(
    segments,
    cast(map)._decodedMemo,
    line,
    column,
    bias || GREATEST_LOWER_BOUND
  );
  if (index === -1) return OMapping(null, null, null, null);
  const segment = segments[index];
  if (segment.length === 1) return OMapping(null, null, null, null);
  const { names, resolvedSources } = map;
  return OMapping(
    resolvedSources[segment[SOURCES_INDEX]],
    segment[SOURCE_LINE] + 1,
    segment[SOURCE_COLUMN],
    segment.length === 5 ? names[segment[NAMES_INDEX]] : null
  );
}
function OMapping(source, line, column, name) {
  return { source, line, column, name };
}
function traceSegmentInternal(segments, memo, line, column, bias) {
  let index = memoizedBinarySearch(segments, column, memo, line);
  if (found) {
    index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
  } else if (bias === LEAST_UPPER_BOUND) index++;
  if (index === -1 || index === segments.length) return -1;
  return index;
}

// ../isoq/src/utils/error-util.js
var import_path_browserify = __toESM(require_path_browserify(), 1);
var fileUrlToPath = (url) => decodeURIComponent(new URL(url).pathname).replace(/^\/([a-zA-Z]:)/, "$1");
function extractSourceMap(source) {
  let match = source.match(/\/\/# sourceMappingURL=data:application\/json[^,]+base64,([A-Za-z0-9+/=]+)/);
  if (!match)
    return;
  let mapJson = JSON.parse(atob(match[1]));
  return mapJson;
}
async function errorCreateStackFrames({ stack, fs, sourceRoot, sourcemap }) {
  let thrownFrames = parse(stack);
  let fileNames = [...new Set(thrownFrames.map((f4) => f4.file))];
  let traceMaps = {};
  if (sourcemap) {
    for (let fn2 of fileNames) {
      let fileContent;
      if (fn2.startsWith("file://"))
        fileContent = await fs.promises.readFile(fileUrlToPath(fn2), "utf8");
      if (fn2.startsWith("http://") || fn2.startsWith("https://"))
        fileContent = await (await fetch(fn2)).text();
      if (fileContent) {
        let sourceMap = extractSourceMap(fileContent);
        if (sourceMap)
          traceMaps[fn2] = new TraceMap(sourceMap);
      }
    }
  }
  let frames = [];
  for (let thrown of thrownFrames) {
    let frame = {
      thrown
    };
    if (traceMaps[thrown.file]) {
      frame.orig = originalPositionFor(traceMaps[thrown.file], {
        line: thrown.lineNumber,
        column: thrown.column
      });
      if (frame.orig && frame.orig.source) {
        frame.line = frame.orig.line;
        frame.column = frame.orig.column;
        frame.name = frame.orig.name;
        if (sourceRoot)
          frame.file = import_path_browserify.default.relative(sourceRoot, frame.orig.source);
        else
          frame.file = frame.orig.source;
        if (frame.orig.source.includes("node_modules") || frame.file.startsWith(".."))
          frame.noisy = true;
      }
    }
    if (!frame.orig || !frame.orig.source) {
      frame.file = frame.thrown.file;
      frame.name = frame.thrown.methodName;
      frame.line = frame.thrown.lineNumber;
      frame.column = frame.thrown.column;
    }
    frames.push(frame);
  }
  return frames;
}

// ../isoq/src/components/IsoContext.jsx
var IsoState = class {
  constructor({ refs, props, url, localFetch, sourceRoot, sourcemap, fs, request } = {}) {
    this.isoRefState = new IsoRefState({ initialRefValues: refs });
    this.routerState = new RouterState({ url });
    this.url = url;
    this.props = props;
    this.headChildren = [];
    this.localFetch = localFetch;
    this.errorFallback = DefaultErrorFallback;
    this.sourceRoot = sourceRoot;
    this.sourcemap = sourcemap;
    this.fs = fs;
    this.request = request;
  }
  isSsr() {
    return !globalThis.window;
  }
  getData() {
    return {
      refs: this.isoRefState.getSharedRefValues(),
      props: this.props
    };
  }
  fetch = async (url, options2 = {}) => {
    if (this.isSsr() && url.startsWith("/") && this.localFetch) {
      url = new URL(this.request.url).origin + url;
      let request = new Request(url.toString(), options2);
      if (this.request.headers.get("cookie"))
        request.headers.set("cookie", this.request.headers.get("cookie"));
      let localFetchResponse = await this.localFetch(request);
      if (localFetchResponse.status != 200) {
        console.log("****** local fetch failed");
      }
      return localFetchResponse;
    }
    if (url.startsWith("/"))
      url = new URL(this.url).origin + url;
    return await globalThis.fetch(url, options2);
  };
  async processError(error) {
    error.stackFrames = await errorCreateStackFrames({
      stack: error.stack,
      sourceRoot: this.sourceRoot,
      sourcemap: this.sourcemap,
      fs: this.fs
    });
  }
};
var IsoContext = Q();
function useIsoContext() {
  return x2(IsoContext);
}
function IsoContextProvider({ isoState, children }) {
  return /* @__PURE__ */ u3(IsoContext.Provider, { value: isoState, children: /* @__PURE__ */ u3(IsoErrorBoundary, { fallback: DefaultErrorFallback, children: /* @__PURE__ */ u3(IsoRefContext.Provider, { value: isoState.isoRefState, children: /* @__PURE__ */ u3(Router, { routerState: isoState.routerState, children }) }) }) });
}

// ../isoq/src/components/Head.jsx
function Head({ children }) {
  let isoContext = useIsoContext();
  if (isoContext.isSsr())
    isoContext.headChildren.push(children);
  return /* @__PURE__ */ u3(k, {});
}

// ../isoq/src/components/useIsLoading.jsx
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
    return (() => {
      if (resolved)
        return;
      resolved = true;
      this.updateCount(-1);
    });
  }
};
function useLoadingState() {
  let iso = useIsoContext();
  if (!iso.loadingState)
    iso.loadingState = new LoadingState();
  return iso.loadingState;
}

// ../isoq/src/components/useIsoMemo.jsx
function useIsoMemo(asyncFn, deps = [], options2 = {}) {
  let loadingState = useLoadingState();
  let iso = useIsoContext();
  let [, forceUpdate] = d2({});
  let ref = useIsoRef({
    result: void 0,
    error: void 0,
    status: "idle",
    deps: void 0
  }, { shared: options2.shared });
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
  if (iso.isSsr() && options2.server === false)
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
      if (options2.swr === false)
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

// ../isoq/node_modules/.pnpm/preact-render-to-string@6.5.13_preact@10.27.0/node_modules/preact-render-to-string/dist/index.module.js
var E3 = Array.isArray;

// ../qql/src/utils/js-util.js
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

// ../qql/src/net/QqlClient.js
var QqlClient = class extends CallableClass {
  constructor(...args) {
    super((q4) => this.query(q4));
    let options2 = objectifyArgs(args, ["url"]);
    this.url = options2.url;
    this.fetch = options2.fetch;
    this.headers = options2.headers;
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

// ../qql/src/lib/qql-react.jsx
var QqlContext = Q();
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

// ../quickmin/node_modules/.pnpm/url-join@5.0.0/node_modules/url-join/lib/url-join.js
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

// ../quickmin/src/export/quickmin-api.js
var QuickminApi = class {
  constructor(options2 = {}) {
    this.fetch = globalThis.fetch.bind(globalThis);
    if (options2.fetch)
      this.fetch = options2.fetch;
    this.url = options2.url;
    if (!this.url)
      throw new Error("Need url for QuickminApi");
    this.headers = new Headers();
    if (options2.headers)
      this.headers = options2.headers;
    if (options2.apiKey)
      this.headers.set("x-api-key", options2.apiKey);
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

// ../quickmin/src/utils/js-util.js
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

// ../quickmin/src/utils/react-util.jsx
function useConstructor(fn2) {
  let value = A2();
  let called = A2();
  if (!called.current) {
    called.current = true;
    value.current = fn2();
  }
  return value.current;
}

// ../quickmin/src/export/quickmin-api-react.jsx
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
var QuickminContext = Q();
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

// ../fullstack-rpc/fullstack-rpc-client.js
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

// ../fullstack-rpc/fullstack-rpc-react.jsx
var RpcContext = Q();
function RpcProvider({ fetch: fetch2, url, children }) {
  let api = new RpcClient({ fetch: fetch2, url });
  return /* @__PURE__ */ u3(k, { children: /* @__PURE__ */ u3(RpcContext.Provider, { value: api, children }) });
}
function useRpc() {
  return x2(RpcContext).proxy;
}

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
  const walk = (x4, path2) => {
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
        list.push(path2 ? [...path2, segment] : [segment]);
      });
      if (used[ALL_OWN_KEYS_PROPERTY] === true) {
        const segment = ":ownKeys";
        list.push(path2 ? [...path2, segment] : [segment]);
      } else {
        (_b = used[HAS_OWN_KEY_PROPERTY]) === null || _b === void 0 ? void 0 : _b.forEach((key) => {
          const segment = `:hasOwn(${String(key)})`;
          list.push(path2 ? [...path2, segment] : [segment]);
        });
      }
      (_c = used[KEYS_PROPERTY]) === null || _c === void 0 ? void 0 : _c.forEach((key) => {
        if (!onlyWithValues || "value" in (Object.getOwnPropertyDescriptor(x4, key) || {})) {
          walk(x4[key], path2 ? [...path2, key] : [key]);
        }
      });
    } else if (path2) {
      list.push(path2);
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
  const found2 = proxyCache.get(baseObject);
  if (found2) {
    return found2;
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
function useSnapshot(proxyObject, options2) {
  const notifyInSync = options2 == null ? void 0 : options2.sync;
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

// ../qql/src/drivers/QqlDriverBase.js
var import_sqlstring_sqlite = __toESM(require_sqlstring_sqlite(), 1);
var import_sqlstring = __toESM(require_sqlstring(), 1);

// ../qql/src/drivers/QqlDriverSqlite.js
var import_sqlstring_sqlite2 = __toESM(require_sqlstring_sqlite(), 1);

// ../qql/src/drivers/QqlDriverSqlJs.js
var import_sqlstring_sqlite3 = __toESM(require_sqlstring_sqlite(), 1);

// ../qql/src/qql/Qql.js
var import_sqlstring2 = __toESM(require_sqlstring(), 1);

// ../qql/src/lib/qql-hydrate.js
function appendFunction(target, name, fn2) {
  Object.defineProperty(target, name, {
    enumeratable: false,
    value: fn2
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

// packages/katnip-quickmin/katnip-quickmin-isowrap.jsx
function QuickminWrapper({ quickminUser, quickminCookieName, authProviderInfo, children }) {
  let iso = useIsoContext();
  if (!quickminCookieName)
    return children;
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

// packages/katnip-rpc/katnip-rpc-isowrap.jsx
function RpcWrapper({ children }) {
  let iso = useIsoContext();
  return /* @__PURE__ */ u3(RpcProvider, { url: "/rpc", fetch: iso.fetch, children });
}

// packages/katnip-tailwind/katnip-tailwind-isowrap.jsx
function TailwindWrapper({ children }) {
  return /* @__PURE__ */ u3(k, { children: [
    /* @__PURE__ */ u3(Head, { children: /* @__PURE__ */ u3("link", { href: "/index.css", rel: "stylesheet" }) }),
    /* @__PURE__ */ u3(k, { children })
  ] });
}

// spec/packages/test-project/.target/client.jsx
var __wrappers = [QuickminWrapper, RpcWrapper, TailwindWrapper];
var options = {};
function createIsoState2(isoStateParams) {
  return new IsoState({
    sourceRoot: options.sourceRoot,
    sourcemap: options.sourcemap,
    ...isoStateParams
  });
}
function Element({ isoState }) {
  let content = /* @__PURE__ */ u3(isomain_default, { ...isoState.props });
  for (let W2 of [...__wrappers].reverse())
    content = /* @__PURE__ */ u3(W2, { ...isoState.props, children: content });
  return /* @__PURE__ */ u3(IsoContextProvider, { isoState, children: content });
}
if (globalThis.window && globalThis.window.__iso) {
  let isoState = createIsoState2({
    refs: globalThis.window.__iso.refs,
    props: globalThis.window.__iso.props,
    url: globalThis.window.location
  });
  let element = /* @__PURE__ */ u3(Element, { isoState });
  J(element, globalThis.window.document.getElementById("isoq"));
}
