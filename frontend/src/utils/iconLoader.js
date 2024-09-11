// src/iconLoader.js
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const brawlerIcons = importAll(require.context('../brawlerIcons', false, /\.(png|webp)$/));
  
export default brawlerIcons;