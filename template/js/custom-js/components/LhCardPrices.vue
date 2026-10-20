<script>
// Preços do card: usa a lógica do APrices do tema (parcelas e desconto por forma de pagamento)
// e mostra o valor no Pix como preço principal.
import APrices from '@ecomplus/storefront-components/src/js/APrices.js'

export default {
  ...APrices,
  name: 'LhCardPrices',

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
      <span class="lh-prices__pix">
          <svg v-if="isPix" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.283 18.36a3.505 3.505 0 0 0 2.493-1.032l3.6-3.6a.684.684 0 0 1 .946 0l3.613 3.613a3.504 3.504 0 0 0 2.493 1.032h.71l-4.56 4.56a3.647 3.647 0 0 1-5.156 0L4.85 18.36ZM18.428 5.627a3.505 3.505 0 0 0-2.493 1.032l-3.613 3.614a.67.67 0 0 1-.946 0l-3.6-3.6A3.505 3.505 0 0 0 5.283 5.64h-.434l4.573-4.572a3.646 3.646 0 0 1 5.156 0l4.559 4.559ZM1.068 9.422 3.79 6.699h1.492a2.483 2.483 0 0 1 1.744.722l3.6 3.6a1.73 1.73 0 0 0 2.443 0l3.614-3.613a2.482 2.482 0 0 1 1.744-.723h1.767l2.737 2.737a3.646 3.646 0 0 1 0 5.156l-2.736 2.736h-1.768a2.482 2.482 0 0 1-1.744-.722l-3.613-3.613a1.77 1.77 0 0 0-2.444 0l-3.6 3.6a2.483 2.483 0 0 1-1.744.722H3.791l-2.723-2.723a3.646 3.646 0 0 1 0-5.156"/></svg>
          {{ isPix ? 'à vista no Pix' : discountLabel }}
      </span>
      <div class="lh-prices__main">
        <small v-if="hasVariedPrices" class="lh-prices__from">{{ i19asOf }}</small>
        {{ formatMoney(priceWithDiscount) }}
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
      <span class="lh-prices__pix lh-prices__pix--empty">&nbsp;</span>
      <div class="lh-prices__main">
        <small v-if="hasVariedPrices" class="lh-prices__from">{{ i19asOf }}</small>
        {{ formatMoney(price) }}
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
