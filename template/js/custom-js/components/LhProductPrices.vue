<script>
// Preços da página do produto: mesma lógica do APrices do tema, com o valor no Pix em destaque.
import APrices from '@ecomplus/storefront-components/src/js/APrices.js'
import PixLogo from './PixLogo.vue'

export default {
  ...APrices,
  name: 'LhProductPrices',

  components: {
    ...APrices.components,
    PixLogo
  },

  computed: {
    ...APrices.computed,

    hasPaymentDiscount () {
      return typeof this.priceWithDiscount === 'number' && this.priceWithDiscount < this.price
    },

    isPix () {
      return /pix/i.test(this.discountLabel || '')
    },

    savings () {
      const from = this.comparePrice || this.price
      return this.hasPaymentDiscount ? from - this.priceWithDiscount : from - this.price
    }
  }
}
</script>

<template>
  <div class="prices lh-pprices">
    <s v-if="comparePrice" class="lh-pprices__compare">De {{ formatMoney(comparePrice) }}</s>

    <div class="lh-pprices__main">
      <small v-if="hasVariedPrices" class="lh-pprices__from">{{ i19asOf }}</small>
      <span class="lh-pprices__value">{{ formatMoney(hasPaymentDiscount ? priceWithDiscount : price) }}</span>
      <span v-if="hasPaymentDiscount" class="lh-pprices__pix">
        <pix-logo v-if="isPix" :size="20"/>
        {{ isPix ? 'no Pix' : discountLabel }}
      </span>
    </div>

    <p class="lh-pprices__card">
      <template v-if="hasPaymentDiscount">ou {{ formatMoney(price) }}</template>
      <template v-if="installmentsNumber > 1 && installmentValue">
        {{ hasPaymentDiscount ? 'em até' : 'ou' }} {{ installmentsNumber }}x de {{ formatMoney(installmentValue) }}{{ monthlyInterest ? '' : ' sem juros' }}
      </template>
      <template v-else-if="hasPaymentDiscount">no cartão</template>
    </p>

    <p v-if="savings >= 0.01" class="lh-pprices__save">
      Você economiza {{ formatMoney(savings) }}{{ hasPaymentDiscount && isPix ? ' pagando no Pix' : '' }}
    </p>
  </div>
</template>
