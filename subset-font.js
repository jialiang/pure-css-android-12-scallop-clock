import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { subsetFonts } from "font-subsetter";

// Static cuts of the Google Sans v14 variable font at two optical sizes.
// Text (opsz 17) is spaced for body copy.
// Google Sans (opsz 18) is tighter, for the date and heading.
const fileNames = { regular: "Google-Sans-Text-Regular", bold: "Google-Sans-Bold" };

// The music button's label once it's playing, which only the script sets.
const runtimeText = "Pause Music";

// The base64 of the first data URI after the google-sans-bold-start marker in index.html.
const inlinedBold = /(google-sans-bold-start.*?base64,)[^"]*/s;

const htmlPath = new URL("./index.html", import.meta.url);
const outputDirectory = new URL("./", import.meta.url);
const boldPath = new URL(`${fileNames.bold}.woff2`, outputDirectory);

const html = await fs.readFile(htmlPath, "utf8");

await subsetFonts({
  html,
  stylesheets: [html.match(/<style>([\s\S]*?)<\/style>/)[1]],
  families: { Sans: "google-sans" },
  fileName: ({ weight }) => fileNames[weight],
  extraCharacters: { [fileNames.regular]: runtimeText },
  sourceDirectory: fileURLToPath(new URL("./fonts/", import.meta.url)),
  outputDirectory: fileURLToPath(outputDirectory),
});

// Bold's WOFF2 is inlined
const boldBase64 = (await fs.readFile(boldPath)).toString("base64");

await fs.writeFile(
  htmlPath,
  html.replace(inlinedBold, (_, start) => start + boldBase64),
);

console.log("Done.");
