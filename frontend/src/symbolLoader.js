// src/iconLoader.js
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const symbols = importAll(require.context('./symbols', false, /\.(png|svg)$/));

export default symbols;