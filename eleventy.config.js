export default function(eleventyConfig) {
  // Seus arquivos e pastas que o Eleventy deve ignorar e apenas copiar
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("music-player");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("mugen/**/*.zip");
};