// src/mapLoader.js
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const mapData = importAll(require.context('./maps', false, /\.(png|webp)$/));
  
export default mapData;