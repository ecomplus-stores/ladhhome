<script>
// Card de produto da Ladh Home: mesma lógica do card padrão do tema,
// com preço no Pix em destaque, selo de desconto, "Entrega hoje em SP" e botão Comprar verde.
import ProductCard from '@ecomplus/storefront-components/src/js/ProductCard.js'
import LhCardPrices from './LhCardPrices.vue'

export default {
  ...ProductCard,
  components: {
    ...ProductCard.components,
    LhCardPrices
  },

  computed: {
    ...ProductCard.computed,

    // mesma regra do "Chegará hoje" da página do produto (product-block.ejs):
    // dia útil até 12h55 chega hoje; depois, amanhã; sábado, na segunda-feira
    lhDeliveryLabel () {
      const now = new Date()
      const cutoff = new Date()
      cutoff.setHours(12, 55, 0, 0)
      const day = now.getDay()
      if (day >= 1 && day <= 5 && now < cutoff) {
        return 'Hoje em SP'
      }
      return day === 6 ? 'Segunda em SP' : 'Amanhã em SP'
    }
  }
}
</script>

<template lang="html" src="./ProductCard.html"></template>
