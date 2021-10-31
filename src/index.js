const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const demoPath = path.resolve(__dirname, "../demo");

function transformJs(content) {
  const regex = /from\s*"(.+)"/g;
  content = content.replace(regex, `from "/node_modules/$1"`);

  content = require("@babel/core").transformSync(content, {
    plugins: [
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "h",
        },
      ],
    ],
  }).code;

  return content;
}

app.use((req, res) => {
  const { url } = req;

  if (url.startsWith("/node_modules")) {
    res.type("js");
    const pkg = JSON.parse(
      fs
        .readFileSync(path.resolve(demoPath, "." + url, "./package.json"))
        .toString()
    );
    const mainPath = pkg.module;
    let content = fs
      .readFileSync(path.resolve(demoPath, "." + url, mainPath))
      .toString();
    content = transformJs(content);
    res.send(content);
    return;
  }

  let content = fs.readFileSync(path.resolve(demoPath, "." + url)).toString();

  if (url.endsWith("html")) {
    res.type("html");
  } else if (url.endsWith("js")) {
    res.type("js");
    content = transformJs(content);
  }
  res.send(content);
});

app.listen(8000);
console.log("http://localhost:8000/index.html");
