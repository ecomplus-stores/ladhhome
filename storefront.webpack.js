// Ajustes do build da loja (mesclado pelo @ecomplus/storefront-framework).
const path = require('path')
const webpack = require('webpack')

// componentes do tema trocados pelas versões da Ladh Home, que reaproveitam a lógica original
const customDir = path.resolve(__dirname, 'template/js/custom-js/components')
const replacements = {
  'ProductCard.vue': 'ProductCard.vue', // card de produto: preço no Pix em destaque
  'TheProduct.vue': 'TheProduct.vue' // página do produto: preço no Pix, entrega e botão Comprar
}

module.exports = () => ({
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/(ProductCard|TheProduct)\.vue$/, resource => {
      if (resource.context && !resource.context.startsWith(customDir)) {
        const file = path.basename(resource.request)
        if (replacements[file]) {
          resource.request = path.join(customDir, replacements[file])
        }
      }
    })
  ]
})
