<template>
    <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" v-bind:to="{name:'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" v-bind:to="{name:'cart'}">
            Корзина
          </router-link>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          Количество товаров: {{ this.$store.getters.countProducts }}
        </span>
      </div>
    </div>
    <div v-if="this.$store.state.cart.cartProductsLoading"><div class="loader-heart"><div></div></div></div>
    <span v-else-if="this.$store.state.cart.cartLoadingFailed" class="content__info"> Произошла ошибка при загрузке корзины... </span>
    <section v-else class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartProduct v-for="(item, index)  in cartProductsDetails" v-bind:key="index"
              v-bind:item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ cartTotalPrice | numberFormat }} ₽</span>
          </p>

          <router-link v-show="countProducts" tag="button" v-bind:to="{name: 'order'}"
            class="cart__button button button--primery" type="submit">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters} from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import CartProduct from '@/components/CartProduct.vue';

export default {
  components: {
    CartProduct,
  },
  filters: {
    numberFormat,
  },
  computed: {
    ...mapGetters(['countProducts', 'cartTotalPrice', 'cartProductsDetails']),
  },
};
</script>