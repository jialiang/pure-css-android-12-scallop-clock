let boldText = "";
let normalText = "";

const subsets = [
  { name: "Google-Sans-Display-Bold", text: "" },
  { name: "Google-Sans-Text-Regular", text: "" },
];

Array.from(document.querySelectorAll("body *")).forEach((elem) => {
  if (elem.tagName === "SCRIPT") return;
  if (elem.childElementCount > 0) return;

  const text = elem.textContent.replaceAll("\n", "");

  if (!text) return;

  const style = getComputedStyle(elem);
  const weight = style.getPropertyValue("font-weight");

  if (weight === "700") subsets[0].text += text;
  if (weight === "400") subsets[1].text += text;
});

subsets
  .map((subset, index) => {
    subset.text = Array.from(new Set(subset.text.split("")))
      .sort()
      .join("");

    return subset;
  })
  .forEach((subset) => {
    const command = [
      "pyftsubset ",
      `./${subset.name}.woff2`,
      `--text="${subset.text}"`,
      "--no-ignore-missing-unicodes",
      `--output-file=./${subset.name}.subset.woff2`,
      "--flavor=woff2",
      "--with-zopfli",
      "--harfbuzz-repacker",
    ].join(" ");

    console.log(command);
  });
