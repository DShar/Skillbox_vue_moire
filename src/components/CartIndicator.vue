<template>
    <router-link class="header__cart" v-bind:to="{name: 'cart'}" aria-label="Корзина с товарами">
          <svg width="19" height="24" fill="currentColor">
            <use xlink:href="#icon-cart"></use>
          </svg>
          <span v-if="$store.state.cart.cartProductsLoading" class="loader-heart loader-heart__small"><div></div>
          </span>
          <span v-else class="header__count" aria-label="Количество товаров">
            {{ this.$store.getters.countProducts }}
          </span>
    </router-link>
</template>

<script>
export default {

};
</script>
