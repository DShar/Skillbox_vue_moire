<template>
    <li class="cart__item product">
        <div class="product__pic">
            <img v-bind:src="item.imageUrl" width="120" height="120" srcset="img/product-square-4@2x.jpg 2x" alt="Название товара">
        </div>
              <h3 class="product__title">
                {{ item.product.title }}
              </h3>
              <p class="product__info product__info--color">
                Цвет: 
                <span>
                  <i v-bind:style="{'background-color': selectedColor.color.code }"></i>
                  {{ selectedColor.color.title }}
                </span>
              </p>
              <p class="product__size">
                Размер: {{ item.size.title }}
              </p>
              <span class="product__code">
                Артикул: {{ item.product.id }}
              </span>

              <BaseCounter v-bind:value="item.quantity" v-on:change-quantity="changeAmount($event, item.cartProductId)"/>

        <b class="product__price">
            {{ (item.product.price * item.quantity) | numberFormat }} ₽
        </b>

        <button class="product__del button-del" type="button"
            aria-label="Удалить товар из корзины"
            v-on:click.prevent="deleteProduct({ cartProductId: item.cartProductId })">
            <svg width="20" height="20" fill="currentColor">
                <use xlink:href="#icon-close"></use>
            </svg>
        </button>
    </li>
</template>

<script>
import BaseCounter from '@/components/BaseCounter.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  props: ['item'],
  filters: {
    numberFormat,
  },
  components: {
    BaseCounter,
  },
  methods: {
    ...mapActions({ deleteProduct: 'deleteProductFromCart' }),
    changeAmount(value, cartProductId) {
      this.$store.dispatch('changeProductAmount', { cartProductId, newAmount: value });
    },
  },
  computed: {
    selectedColor() {
      return this.item.product.colors.find((c) => (c.color.id === this.item.colorId));
    },
  },
};
</script>

<style>
.product__size {
  grid-column: 3/3;
  grid-row: 2/3;
  font-size: 14px;
  line-height: 1;
  color: #737373;
}
</style>