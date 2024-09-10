// src/mapLoader.js
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const mapIcons = importAll(require.context('../mapIcons', false, /\.(png|webp)$/));
  
export default mapIcons;