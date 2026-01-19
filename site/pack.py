ALLOWED = ["-", "_", ".", "!", "~", "*", "'", "(", ")"]
ESCAPE = {
    " ": "%20",
    "\"": "%22",
    "$": "%24",
    "+": "%2B",
    ",": "%2C",
    "/": "%2F",
    ":": "%3A",
    ";": "%3B",
    "=": "%3D",
    ">": "%3E",
    "?": "%3F",
    "[": "%5B",
    "\\": "%5C",
    "]": "%5D",
    "^": "%5E",
    "_": "%5F",
    "`": "%60",
    "{": "%7B",
    "|": "%7C",
    "}": "%7D",

}

with open("./bookmarklet/script.min.js", "r") as f:
    js_file = f.read()

unencoded = "(function(){" + js_file.strip() + "})();"
encoded = ""

for char in unencoded:
    if char.isalnum() or char in ALLOWED:
        encoded += char
    else:
        encoded += ESCAPE[char]

bookmarklet = "javascript:" + encoded

with open("./bookmarklet/template.html", "r") as f:
    html_file = f.read()

formatted = html_file.format(href=bookmarklet)

with open("./bookmarklet/bookmarklet.js", "w") as f:
    f.write(bookmarklet)

with open("./bookmarklet/index.html", "w") as f:
    f.write(formatted)

