// Ajustes do build da loja (mesclado pelo @ecomplus/storefront-framework).
const path = require('path')
const webpack = require('webpack')

const customProductCard = path.resolve(__dirname, 'template/js/custom-js/components/ProductCard.vue')

module.exports = () => ({
  plugins: [
    // usa o card de produto da Ladh Home (preço no Pix em destaque) em vez do card padrão,
    // em todos os lugares que importam ProductCard.vue: vitrines, busca, recomendados, compre junto
    new webpack.NormalModuleReplacementPlugin(/ProductCard\.vue$/, resource => {
      if (resource.context && !resource.context.includes(`custom-js${path.sep}components`)) {
        resource.request = customProductCard
      }
    })
  ]
})
