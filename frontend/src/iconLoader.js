// src/iconLoader.js
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const icons = importAll(require.context('./icons', false, /\.(png|webp)$/));
  
export default icons;