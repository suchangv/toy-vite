const express = require("express");
const path = require("path");
const fs = require("fs");
const { build, transformSync } = require("esbuild");

const app = express();

const demoPath = path.resolve(__dirname, "../demo");

async function prebuild() {
  // 读取 demo 中所有的依赖
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(demoPath, "./package.json")).toString()
  );
  const dependencies = Object.keys(pkg.dependencies).map((id) =>
    path.resolve(demoPath, "./node_modules", id)
  );

  // 使用 esbuild 打包
  await build({
    absWorkingDir: process.cwd(),
    entryPoints: dependencies,
    format: "esm", // 输出格式为 ESM
    bundle: true, // 打包成 bundle
    splitting: true,
    outdir: path.resolve(demoPath, "./node_modules", ".toyvite"),
  });
}

function transformJs(content) {
  const regex = /from\s*"(.+)"/g;
  content = content.replace(regex, `from "/node_modules/$1"`);

  content = transformSync(content, {
    jsx: "transform",
    loader: "jsx",
  }).code;

  return content;
}

async function main() {
  await prebuild();

  app.use((req, res) => {
    const { url } = req;

    if (url.startsWith("/node_modules")) {
      res.type("js");
      const name = url.substr(url.lastIndexOf("/") + 1);
      let content = fs
        .readFileSync(
          path.resolve(
            demoPath,
            "./node_modules/.toyvite/",
            name.endsWith(".js") ? name : name + ".js"
          )
        )
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
}

main();
