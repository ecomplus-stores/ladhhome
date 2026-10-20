<script>
// Forma de pagamento na aba "Pagamento" da página do produto: mesma lógica do PaymentOption do tema
// (desconto e parcelas vêm do meio de pagamento), no visual do preview: Pix em destaque e
// cartão com a melhor parcela sem juros e "Ver todas as parcelas".
import PaymentOption from '@ecomplus/storefront-components/src/js/PaymentOption.js'
import PixLogo from './PixLogo.vue'

export default {
  ...PaymentOption,
  name: 'LhPaymentOption',

  components: {
    PixLogo
  },

  data () {
    return {
      showInstallments: false
    }
  },

  computed: {
    ...PaymentOption.computed,

    methodCode () {
      return (this.paymentGateway.payment_method && this.paymentGateway.payment_method.code) || ''
    },

    isPix () {
      return /pix/i.test(this.paymentGateway.label || '') ||
        /pix/i.test((this.paymentGateway.payment_method && this.paymentGateway.payment_method.name) || '')
    },

    isCard () {
      return this.methodCode === 'credit_card'
    },

    isBillet () {
      return this.methodCode === 'banking_billet'
    },

    title () {
      if (this.isPix) return 'Pix'
      if (this.isCard) return 'Cartão de crédito'
      if (this.isBillet) return 'Boleto'
      return this.paymentGateway.label
    },

    // maior número de parcelas sem juros
    bestInstallment () {
      const options = (this.installmentOptions || []).filter(({ tax }) => !tax)
      return options.length ? options[options.length - 1] : null
    },

    subtitle () {
      if (this.isPix) return 'Aprovação na hora'
      if (this.bestInstallment) {
        return `até ${this.bestInstallment.number}x de ${this.formatMoney(this.bestInstallment.value)} sem juros`
      }
      return this.paymentGateway.text || ''
    }
  }
}
</script>

<template>
  <div
    class="lh-pay"
    :class="{ 'lh-pay--pix': isPix || discount }"
  >
    <div class="lh-pay__row">
      <span class="lh-pay__ic">
        <pix-logo v-if="isPix" :size="24"/>
        <svg v-else-if="isBillet" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7v10M7 7v10M11 7v10M14 7v10M17 7v10M20 7v10"/></svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"/><path d="M3 10l18 0"/><path d="M7 15l.01 0"/><path d="M11 15l2 0"/></svg>
      </span>
      <div class="lh-pay__tx">
        <b>{{ title }}</b>
        <small v-if="subtitle">{{ subtitle }}</small>
      </div>
      <strong v-if="price" class="lh-pay__price">
        {{ formatMoney(priceWithDiscount) }}
        <small v-if="discount && discount.apply_at !== 'freight'">
          <template v-if="discount.type === 'percentage'">{{ discount.value }}% off</template>
          <template v-else>{{ formatMoney(discount.value) }} off</template>
        </small>
      </strong>
    </div>

    <template v-if="installmentOptions && installmentOptions.length">
      <button
        type="button"
        class="lh-pay__more"
        :aria-expanded="showInstallments ? 'true' : 'false'"
        @click="showInstallments = !showInstallments"
      >
        Ver todas as parcelas
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" :style="showInstallments ? 'transform: rotate(180deg)' : null"><path d="M6 9l6 6l6 -6"/></svg>
      </button>
      <ul v-show="showInstallments" class="lh-pay__list">
        <li>
          <span>1x {{ i19interestFree }}</span>
          <b>{{ formatMoney(price) }}</b>
        </li>
        <li v-for="option in installmentOptions" :key="option.number">
          <span>{{ option.number }}x {{ option.tax ? 'com juros' : i19interestFree }}</span>
          <b>{{ formatMoney(option.value) }}</b>
        </li>
      </ul>
    </template>
  </div>
</template>
