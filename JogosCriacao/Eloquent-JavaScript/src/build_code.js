const fs = require("fs")
const PJSON = require("./pseudo_json")
const varify = require("./varify")

let file = process.argv[2]
let input = fs.readFileSync(file, "utf8")

let included = /\n```(.*?\bincludeCode:.*)\n([^]*?\n)```/g, m
let files = Object.create(null)
let defaultFile = "code/chapter/" + file.replace(".md", ".js")

while (m = included.exec(input)) {
  let [_, params, snippet] = m, directive = String(PJSON.parse(params).includeCode)
  let file = defaultFile
  snippet = varify(snippet.replace(/(\n|^)\s*\/\/ →.*\n/g, "$1"))
  if (directive.indexOf("strip_log") > -1)
    snippet = snippet.replace(/(\n|^)\s*console\.log\(.*\);\n/g, "$1")
  if (m = directive.match(/top_lines:\s*(\d+)/))
    snippet = snippet.split("\n").slice(0, Number(m[1])).join("\n") + "\n"
  if (m = directive.match(/(?:\s|^)>(\S+)/))
    file = m[1]
  if (file in files)
    files[file].push(snippet)
  else
    files[file] = [snippet]
}

for (let file in files)
  fs.writeFileSync(file, files[file].join("\n"), "utf8")
