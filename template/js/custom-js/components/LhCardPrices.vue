<script>
// Preços do card: usa a lógica do APrices do tema (parcelas e desconto por forma de pagamento)
// e mostra o valor no Pix como preço principal.
import APrices from '@ecomplus/storefront-components/src/js/APrices.js'
import PixLogo from './PixLogo.vue'

export default {
  ...APrices,
  name: 'LhCardPrices',

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
  <div class="prices lh-prices">
    <s v-if="comparePrice" class="lh-prices__compare">{{ formatMoney(comparePrice) }}</s>
    <span v-else class="lh-prices__compare lh-prices__compare--empty">&nbsp;</span>

    <template v-if="hasPaymentDiscount">
      <div class="lh-prices__main">
        <small v-if="hasVariedPrices" class="lh-prices__from">{{ i19asOf }}</small>
        <span class="lh-prices__value">{{ formatMoney(priceWithDiscount) }}</span>
        <span class="lh-prices__pix">
          {{ isPix ? 'no Pix' : discountLabel }}
          <pix-logo v-if="isPix" :size="15"/>
        </span>
      </div>
      <p class="lh-prices__card">
        ou {{ formatMoney(price) }}
        <template v-if="installmentsNumber > 1 && installmentValue">
          em até {{ installmentsNumber }}x{{ monthlyInterest ? '' : ' sem juros' }}
        </template>
        <template v-else>no cartão</template>
      </p>
    </template>

    <template v-else>
      <div class="lh-prices__main">
        <small v-if="hasVariedPrices" class="lh-prices__from">{{ i19asOf }}</small>
        <span class="lh-prices__value">{{ formatMoney(price) }}</span>
      </div>
      <p class="lh-prices__card">
        <template v-if="installmentsNumber > 1 && installmentValue">
          ou {{ installmentsNumber }}x de {{ formatMoney(installmentValue) }}{{ monthlyInterest ? '' : ' sem juros' }}
        </template>
        <template v-else>&nbsp;</template>
      </p>
    </template>

    <p v-if="savings >= 0.01" class="lh-prices__save">Você economiza {{ formatMoney(savings) }}</p>
    <p v-else class="lh-prices__save lh-prices__save--empty">&nbsp;</p>
  </div>
</template>
