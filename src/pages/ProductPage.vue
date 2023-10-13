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
          <router-link class="breadcrumbs__link" v-bind:to="{name:'category', params: {categoryId: category.id }}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" v-bind:src="currentImageUrl" v-bind:alt="product.title">
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="(image, index) in imageGallery" v-bind:key="index">
            <a class="pics__link" v-bind:class="{ 'pics__link--current': index === currentImageIndex }"
              v-on:click.prevent="changeImage(index)">
              <img width="98" height="98" v-bind:src="image.file.url" v-bind:alt="product.title">
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" method="POST" v-on:submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <BaseCounter v-bind:value="quantity" v-on:change-quantity="changeQuantity($event)"/>
              
              <b class="item__price">
                {{ product.price | numberFormat }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="(item, index) in product.colors" v-bind:key="item.color.id">
                    <label class="colors__label">
                      <input class="colors__radio sr-only" type="radio" name="color-item" v-bind:checked="currentColorIndex === index"
                        v-on:change.prevent="changeColor(index)">
                      <span class="colors__value" v-bind:style="{'background-color': item.color.code}">
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>


              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="size" v-model="currentSizeId" v-on:change.prevent="notSelected = false">
                    <option v-bind:value="size.id" v-for="size in product.sizes" v-bind:key="size.id">{{ size.title }}</option>
                  </select>
                  <span class="form__error" v-if="notSelected">Укажите размер</span>
                </label>
              </fieldset>
            </div>
            
            <button class="item__button button button--primery" type="submit">
              В корзину
            </button>
          </form>         
            <span v-show="productAdded">
              Товар добавлен в корзину
            </span>
            <span v-show="productSending">
              Идёт добавление товара в корзину...
            </span>
            <span v-show="productAddingError" class="error_msg">
              Товар не добавлен, произошла ошибка...
            </span>
        </div>
      </div>

      <ProductDescription v-bind:info="productContent" v-bind:deliveries="deliveries"/>
      
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { mapActions } from 'vuex';
import { API_BASE_URL } from '@/config';
import { NULL_IMG_URL } from '@/config';
import BaseCounter from '@/components/BaseCounter.vue';
import ProductDescription from '@/components/ProductDescription.vue';

export default {
  components: {
    BaseCounter,
    ProductDescription,
  },
  data() {
    return {
      quantity: 1,
      currentColorIndex: 0,
      currentImageIndex: 0,
      currentSizeId: 0,
      notSelected: false,

      productData: null,
      productLoading: false,
      productLoadingError: false,

      productAdded: false,
      productSending: false,
      productAddingError: false,
    };
  },
  filters: {
    numberFormat
  },
  computed: {
    product() {
        return this.productData ? this.productData : {};
    },
    category() {
        return this.productData ? this.productData.category : {};
    },
    imageGallery() {
      return (this.product.colors && this.product.colors [this.currentColorIndex].gallery) ? 
            this.product.colors[this.currentColorIndex].gallery : [];
    },
    currentImageUrl() {
      if(this.imageGallery.length > 0) {
        return this.imageGallery[this.currentImageIndex].file.url;
      }
      else {
        return NULL_IMG_URL;
      }
    },
    productContent() {
      return this.product.content !== '' ? this.product.content : 'Нет информации о товаре.';
    },
    deliveries() {
      return this.$store.state.deliveriesData ? this.$store.state.deliveriesData : [];
    },
  },
  methods: {
    ...mapActions(['addProductToCart', 'loadDeliveries']),
    addToCart() {
      if(this.currentSizeId === 0) {
        this.notSelected = true;
        return;
      }

      this.productSending = true;

      this.addProductToCart({ productId: this.product.id, 
                              colorId: this.product.colors[this.currentColorIndex].color.id, 
                              sizeId: this.currentSizeId,  
                              quantity: this.quantity })
        .then(() => {
          this.productAdded = true;
        })
        .catch(() => {
          this.productAddingError = true;
          this.productAdded = false;
        })
        .finally(() => {
          this.productSending = false;
        });
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingError = false;

      return axios
        .get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((response) => { this.productData = response.data; })
        .catch(() => { this.productLoadingError = true; })
        .finally(() => { this.productLoading = false; });
    },
    changeQuantity(newValue) {
      this.quantity = newValue;
    },
    changeColor(newIndex) {
      this.currentColorIndex = newIndex;
    },
    changeImage(newIndex) {
      this.currentImageIndex = newIndex;
    },
  },
  watch: {
    'this.$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
  created() {
    this.loadDeliveries();
  }
}
</script>

<style>
  .error_msg {
    color: #e02d71;
    font-weight: bold;
  }
</style>