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
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" v-bind:to="{name:'order'}">
            Оформление заказа
          </router-link>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <div v-if="orderInfoLoading" class="loader-heart"><div></div></div>
    <section v-else class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа. 
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <BaseFormInfoField title="Получатель" v-bind:value="orderInfo.name"/>
            <BaseFormInfoField title="Адрес доставки" v-bind:value="orderInfo.address"/>
            <BaseFormInfoField title="Телефон" v-bind:value="orderInfo.phone"/>
            <BaseFormInfoField title="Email" v-bind:value="orderInfo.email"/>
            <BaseFormInfoField title="PaymentType" v-bind:value="orderInfo.paymentType"/>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderProduct v-for="item in orderInfo.basket.items"  v-bind:key="item.product.id"
              v-bind:item="item"/>
          </ul>
          
          <div class="cart__total">
            <p>Доставка: <b>{{ orderInfo.deliveryType.price }}</b></p>
            <p>Итого: <b>{{ productsAmount }}</b> товара на сумму <b>{{ orderInfo.totalPrice | numberFormat }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import OrderProduct from '@/components/OrderProduct.vue';
import BaseFormInfoField from '@/components/BaseFormInfoField.vue';
export default {
  components: {
    OrderProduct,
    BaseFormInfoField,
  },
  filters: {
    numberFormat,
  },
  data() {
    return {
      orderInfoLoading: false,
    };
  },
  computed: {
    ...mapState({
      orderInfo: (state) => (state.orderInfo ? state.orderInfo : {}),
    }),
    productsAmount() {
      if (!this.orderInfo.basket) {
        return {};
      }

      return this.orderInfo.basket.items.length;
    },
  },
  created() {
    if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
      return;
    }

    this.orderInfoLoading = true;

    this.$store.dispatch('loadOrderInfo', this.$route.params.id)
      .finally(() => {
        this.orderInfoLoading = false;
      });
  },
    
}
</script>