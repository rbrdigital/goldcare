const fs = require("fs");
const glob = require("glob");

const files = glob.sync("src/**/*.{tsx,ts}");
let bad = [];

for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  if (t.includes("PageContainer") && /p-6|px-6/.test(t.replace(/[\s\S]*PageContainer[\s\S]*?<\/PageContainer>/, ""))) {
    bad.push(f);
  }
}

if (bad.length) {
  console.error("Double padding inside PageContainer:\n" + bad.join("\n"));
  process.exit(1);
}