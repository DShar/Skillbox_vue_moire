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

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <div v-if="formOrderLoading" class="loader-heart"><div></div></div>
    <section v-else class="cart">
      <form class="cart__form form" action="#" method="POST" v-on:submit.prevent="order">
        <div v-if="formOrderLoading" class="heart_loader"><div></div></div>
        <div v-else class="cart__field">
          <div class="cart__data">
            <BaseFormText title="ФИО" v-bind:error="formError.name"
              v-model="formData.name" placeholder="Введите ваше полное имя"/>

            <BaseFormText title="Адрес доставки" v-bind:error="formError.address"
              v-model="formData.address" placeholder="Введите ваш адрес"/>

            <BaseFormText title="Телефон" v-bind:error="formError.phone"
              v-model="formData.phone" placeholder="Введите ваш телефон" type="tel" />

            <BaseFormText title="Email" v-bind:error="formError.email"
              v-model="formData.email" placeholder="Введите ваш Email" type="email"/>
            
            <BaseFormTextarea title="Комментарий к заказу" v-model="formData.comment"
              v-bind:error="formError.comment" placeholder="Ваши пожелания"/>

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <span style="color: #f00" v-if="formError.deliveryTypeId">{{ formError.deliveryTypeId }}</span>
            <ul class="cart__options options">
              <li class="options__item" v-for="delivery in deliveries" v-bind:key="delivery.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" 
                    v-model="formData.deliveryTypeId"
                    name="delivery" v-bind:value="delivery.id" v-on:change="loadPayments(delivery.id)">
                  <span class="options__value">
                    {{ delivery.title }} <b>{{ delivery.price }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <span style="color: #f00" v-if="formError.paymentTypeId">{{ formError.paymentTypeId }}</span>
            <span v-show="paymentTypes.length === 0">Пожалуйста, выберите способ доставки.</span>
            <div v-if="paymentTypesLoading" class="loader-heart"><div></div></div>
            <ul v-else class="cart__options options">
              <li class="options__item" v-for="paymentType in paymentTypes" v-bind:key="paymentType.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio"
                    v-model="formData.paymentTypeId"
                    name="pay" v-bind:value="paymentType.id">
                  <span class="options__value">
                    {{ paymentType.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderProduct v-for="(item, index)  in cartProductsDetails" v-bind:key="index"
              v-bind:item="item"/>
          </ul>
          
          <div class="cart__total">
            <p>Доставка: <b>{{ currentDeliveryPrice | numberFormat }}</b></p>
            <p>Итого: <b>{{ countProducts }}</b> товаров на сумму <b>{{ cartTotalPrice | numberFormat }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div v-if="formErrorMessage" class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }} 
            Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import OrderProduct from '@/components/OrderProduct.vue'; 

export default {
  components: {
    BaseFormText,
    BaseFormTextarea,
    OrderProduct,
  },
  filters: {
    numberFormat,
  },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',

      formOrderLoading: false,
      paymentTypesLoading: false,
    };
  },
  computed: {
    ...mapGetters(['countProducts', 'cartTotalPrice', 'cartProductsDetails']),
    deliveries() {
      return this.$store.state.deliveriesData ? this.$store.state.deliveriesData : [];
    },
    paymentTypes() {
      return this.$store.state.paymentTypeData ? this.$store.state.paymentTypeData : [];
    },
    currentDeliveryPrice() {
      if(this.formData.deliveryTypeId) {
        return this.deliveries.find((delivery) => delivery.id === this.formData.deliveryTypeId).price;
      }
      else {
        return 0;
      }
    },
  },
  methods: {
    ...mapActions(['resetCart', 'updateOrderInfo', 'loadDeliveries', 'loadPaymentTypes']),
    loadPayments(deliveryTypeId) {
      this.paymentTypesLoading = true;
      this.loadPaymentTypes(deliveryTypeId)
        .finally(() => { this.paymentTypesLoading = false;});
    },
    order() {
      this.formError = {};
      this.formOrderLoading = true;

      return axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
        },
        {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          this.updateOrderInfo(response.data);
          this.resetCart();
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        })
        .finally(() => {
          this.formOrderLoading = false;
        });
    },
  },
  created() {
    this.loadDeliveries();
  }
};
</script>