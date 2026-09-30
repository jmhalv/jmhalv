import datetime
import pathlib
import re
import sys

PURPLE = "#8250df"

lines = pathlib.Path("quotes.txt").read_text(encoding="utf-8").splitlines()
quotes = [l.strip() for l in lines if l.strip() and not l.lstrip().startswith("#")]
if not quotes:
    sys.exit("quotes.txt has no quotes")

quote = quotes[datetime.date.today().toordinal() % len(quotes)]

if "|" in quote:
    text, author = [p.strip() for p in quote.rsplit("|", 1)]
    message = f"{text} — {author}"
else:
    message = quote


def tex_escape(s):
    """Escape characters that have special meaning inside LaTeX \\text{}."""
    for ch, rep in [
        ("\\", r"\backslash "),
        ("{", r"\{"),
        ("}", r"\}"),
        ("$", r"\$"),
        ("#", r"\#"),
        ("%", r"\%"),
        ("&", r"\&"),
        ("_", r"\_"),
        ("^", r"\^{}"),
        ("~", r"\~{}"),
    ]:
        s = s.replace(ch, rep)
    return s


colored = "$\\color{" + PURPLE + "}{\\text{" + tex_escape(message) + "}}$"

readme = pathlib.Path("README.md")
content = readme.read_text(encoding="utf-8")
pattern = re.compile(r"(<!-- QUOTE:START -->).*?(<!-- QUOTE:END -->)", re.S)
if not pattern.search(content):
    sys.exit("QUOTE markers not found in README.md")

readme.write_text(
    pattern.sub(lambda m: f"{m.group(1)}{colored}{m.group(2)}", content),
    encoding="utf-8",
)
print(f"Updated: {message}")
