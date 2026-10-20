<script>
// Página do produto da Ladh Home: mesma lógica do componente do tema (TheProduct.js),
// com preço no Pix em destaque, caixa de entrega, botão Comprar verde, WhatsApp e selos de confiança.
import TheProduct from '@ecomplus/storefront-components/src/js/TheProduct.js'
import LhProductPrices from './LhProductPrices.vue'
import LhPaymentOption from './LhPaymentOption.vue'

export default {
  ...TheProduct,
  components: {
    ...TheProduct.components,
    LhProductPrices,
    LhPaymentOption
  },

  data () {
    return {
      ...TheProduct.data.call(this),
      lhNow: Date.now(),
      // aba aberta no bloco de frete e pagamento: 'ship' ou 'pay'
      lhTab: 'ship'
    }
  },

  computed: {
    ...TheProduct.computed,

    // mesma regra que a página já usava: dia útil até 12h55 chega hoje;
    // depois disso chega amanhã; sábado e domingo, na segunda-feira
    lhDelivery () {
      const now = new Date(this.lhNow)
      const day = now.getDay()
      const cutoff = new Date(now)
      cutoff.setHours(12, 55, 0, 0)
      const isWeekday = day >= 1 && day <= 5
      let target
      if (isWeekday && now < cutoff) {
        return { title: 'Chega hoje em São Paulo', ms: cutoff - now }
      }
      target = new Date(cutoff)
      target.setDate(target.getDate() + (day === 6 ? 2 : 1))
      const names = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
      const title = day === 6
        ? 'Chega segunda-feira em São Paulo'
        : `Chega amanhã, ${names[target.getDay()]}, em São Paulo`
      return { title, ms: target - now }
    },

    // formas de pagamento com desconto (Pix) primeiro, como no preview
    lhPaymentOptions () {
      const hasDiscount = gateway => Boolean(gateway.discount && gateway.discount.value > 0)
      const sortGateways = gateways => (gateways || []).concat()
        .sort((a, b) => hasDiscount(b) - hasDiscount(a))
      return this.paymentOptions
        .map(option => ({ ...option, payment_gateways: sortGateways(option.payment_gateways) }))
        .sort((a, b) => hasDiscount(b.payment_gateways[0] || {}) - hasDiscount(a.payment_gateways[0] || {}))
    },

    lhCountdown () {
      const min = Math.max(0, Math.floor(this.lhDelivery.ms / 60000))
      return `${Math.floor(min / 60)}h ${min % 60}min`
    },

    lhWhatsappUrl () {
      const phone = typeof window === 'object' && window.lhWhatsapp
      if (!phone) return null
      const text = `Olá! Tenho uma dúvida sobre o produto ${this.name || ''}`
      return `https://wa.me/55${phone}?text=${encodeURIComponent(text)}`
    }
  },

  mounted () {
    if (TheProduct.mounted) TheProduct.mounted.call(this)
    this.lhTimer = setInterval(() => { this.lhNow = Date.now() }, 30000)
  },

  beforeDestroy () {
    if (TheProduct.beforeDestroy) TheProduct.beforeDestroy.call(this)
    clearInterval(this.lhTimer)
  }
}
</script>

<template lang="html" src="./TheProduct.html"></template>
