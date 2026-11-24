"""Convert server-rendered HTML fragments into JSX.

Used once to port the reference markup into React components; the output
is then hand-edited (data-driven lists, client behaviours, links).
"""
import json
import re
from urllib.parse import unquote

import html5lib
from bs4 import BeautifulSoup, Comment, NavigableString, Tag

ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "maxlength": "maxLength", "minlength": "minLength", "inputmode": "inputMode",
    "autocomplete": "autoComplete", "novalidate": "noValidate", "readonly": "readOnly",
    "autoplay": "autoPlay", "playsinline": "playsInline", "crossorigin": "crossOrigin",
    "srcset": "srcSet", "colspan": "colSpan", "rowspan": "rowSpan", "datetime": "dateTime",
    "enterkeyhint": "enterKeyHint", "spellcheck": "spellCheck", "contenteditable": "contentEditable",
    "allowfullscreen": "allowFullScreen", "frameborder": "frameBorder", "referrerpolicy": "referrerPolicy",
    "fetchpriority": "fetchPriority", "xlink:href": "xlinkHref", "xml:space": "xmlSpace",
    "accept-charset": "acceptCharset", "http-equiv": "httpEquiv", "autofocus": "autoFocus",
    "popovertarget": "popoverTarget", "enctype": "encType",
}
BOOL_ATTRS = {"hidden", "required", "open", "noValidate", "readOnly", "autoPlay", "muted", "loop",
              "playsInline", "controls", "disabled", "allowFullScreen", "autoFocus", "multiple",
              "checked", "selected", "inert", "defer", "async", "reversed"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source",
        "track", "wbr"}
DROP_IMG = {"srcset", "sizes", "decoding", "data-nimg", "loading", "fetchpriority"}


def camel(name: str) -> str:
    if name.startswith("--"):
        return name
    if name.startswith("-webkit-"):
        name = "Webkit-" + name[8:]
    elif name.startswith("-moz-"):
        name = "Moz-" + name[5:]
    return re.sub(r"-([a-zA-Z])", lambda m: m.group(1).upper(), name)


def split_css(style: str):
    decls, buf, depth, quote = [], "", 0, None
    for ch in style:
        if quote:
            buf += ch
            if ch == quote:
                quote = None
            continue
        if ch in "\"'":
            quote = ch
        elif ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == ";" and depth == 0:
            decls.append(buf)
            buf = ""
        else:
            buf += ch
    if buf.strip():
        decls.append(buf)
    out = {}
    for d in decls:
        if ":" not in d:
            continue
        k, v = d.split(":", 1)
        out[camel(k.strip())] = v.strip()
    return out


def media_src(src: str) -> str:
    m = re.search(r"[?&]url=([^&]+)", src)
    return unquote(m.group(1)) if m else src


def js(v) -> str:
    return json.dumps(v, ensure_ascii=False)


def attrs_to_jsx(tag: Tag) -> str:
    parts = []
    is_svg_ctx = tag.name in SVG_TAGS
    for k, v in tag.attrs.items():
        if isinstance(v, list):
            v = " ".join(v)
        if tag.name == "img" and k in DROP_IMG:
            continue
        if tag.name == "img" and k == "src":
            v = media_src(v)
        if tag.name in ("video", "source") and k in ("src", "poster"):
            v = media_src(v)
        name = ATTR_MAP.get(k, k)
        if k.startswith(("aria-", "data-")):
            name = k
        elif ":" in k and k not in ATTR_MAP:
            name = camel(k.replace(":", "-"))
        elif "-" in k and is_svg_ctx:
            name = camel(k)
        if name == "style":
            parts.append("style={" + js(split_css(v)) + "}")
            continue
        if tag.name in ("input", "textarea", "select") and name == "value":
            if tag.get("type") not in ("submit", "button", "radio", "checkbox"):
                name = "defaultValue"
        if tag.name == "input" and name == "checked":
            parts.append("defaultChecked")
            continue
        if name in BOOL_ATTRS:
            if name == "hidden" and v == "until-found":
                parts.append('hidden="until-found"')
            else:
                parts.append(name)
            continue
        parts.append(f"{name}={js(v)}")
    return (" " + " ".join(parts)) if parts else ""


SVG_TAGS = {"svg", "path", "g", "image", "circle", "ellipse", "rect", "line", "polyline", "polygon",
            "defs", "clipPath", "clippath", "mask", "use", "text", "tspan", "linearGradient",
            "radialGradient", "stop", "pattern", "symbol", "filter", "feGaussianBlur",
            "feTurbulence", "feDisplacementMap", "feOffset", "feBlend", "feColorMatrix",
            "foreignObject", "title", "desc", "animate", "animateTransform", "textPath"}

SAFE_TEXT = re.compile(r"^[^{}<>]*$")


def text_jsx(s: str, pre: bool) -> str:
    if pre:
        return "{" + js(s) + "}"
    collapsed = re.sub(r"\s+", " ", s)
    if collapsed.strip() == "":
        return "{\" \"}" if collapsed else ""
    if collapsed != collapsed.strip() or not SAFE_TEXT.match(collapsed):
        return "{" + js(collapsed) + "}"
    return collapsed


def node_jsx(node, ind=0, pre=False) -> str:
    pad = "  " * ind
    if isinstance(node, Comment):
        return ""
    if isinstance(node, NavigableString):
        t = text_jsx(str(node), pre)
        return (pad + t) if t else ""
    if not isinstance(node, Tag):
        return ""
    if node.name in ("script", "noscript", "template", "link", "meta", "style"):
        return ""
    if node.name == "textarea":
        val = node.get_text()
        node.attrs["value"] = val
        return pad + f"<textarea{attrs_to_jsx(node)} />"
    a = attrs_to_jsx(node)
    if node.name in VOID:
        return pad + f"<{node.name}{a} />"
    kids = [k for k in node.children if not isinstance(k, Comment)]
    child_pre = pre or node.name == "pre"
    # whitespace-only text between block children is meaningless in JSX
    inner = []
    for k in kids:
        s = node_jsx(k, ind + 1, child_pre)
        if s.strip() == "{\" \"}" and isinstance(k, NavigableString):
            # keep a single space only when sandwiched between inline content
            prev, nxt = k.previous_sibling, k.next_sibling
            if prev is None or nxt is None:
                continue
        if s.strip():
            inner.append(s)
    if not inner:
        return pad + f"<{node.name}{a} />" if node.name != "textarea" else pad + f"<{node.name}{a}></{node.name}>"
    if len(inner) == 1 and "\n" not in inner[0] and len(inner[0]) < 100 and not isinstance(kids[0], Tag):
        return pad + f"<{node.name}{a}>{inner[0].strip()}</{node.name}>"
    return pad + f"<{node.name}{a}>\n" + "\n".join(inner) + "\n" + pad + f"</{node.name}>"


def parse(html: str) -> BeautifulSoup:
    return BeautifulSoup(html, "html5lib")


def to_jsx(el: Tag, ind=0) -> str:
    return node_jsx(el, ind)
