"""Merge sibling text lines emitted by html2jsx into one string literal.

React SSR splits adjacent text into separate nodes ("Sarah M." + ", Dubai");
on separate JSX lines they'd be joined with a space, so join them exactly.
"""
import json, re, sys

RAW = re.compile(r"^[^<>{}]+$")
LIT = re.compile(r'^\{("(?:[^"\\]|\\.)*")\}$')

def text_of(line):
    s = line.strip()
    m = LIT.match(s)
    if m:
        return json.loads(m.group(1))
    if RAW.match(s) and not s.startswith(("//", "/*", "*")) and not s.endswith((";", ",", "(", ")", "=>")):
        return s
    return None

def process(src):
    lines = src.split("\n")
    out, i = [], 0
    while i < len(lines):
        t = text_of(lines[i])
        if t is None:
            out.append(lines[i]); i += 1; continue
        ind = len(lines[i]) - len(lines[i].lstrip())
        j, parts = i, []
        while j < len(lines):
            tj = text_of(lines[j])
            if tj is None or len(lines[j]) - len(lines[j].lstrip()) != ind:
                break
            parts.append(tj); j += 1
        if len(parts) > 1:
            merged = "".join(parts)
            if merged == merged.strip() and not re.search(r"[{}<>]", merged):
                out.append(" " * ind + merged)
            else:
                out.append(" " * ind + "{" + json.dumps(merged, ensure_ascii=False) + "}")
        else:
            out.append(lines[i])
        i = j
    return "\n".join(out)

if __name__ == "__main__":
    for f in sys.argv[1:]:
        s = open(f).read(); n = process(s)
        if n != s:
            open(f, "w").write(n); print("merged", f)
