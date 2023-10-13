<template>
<li class="catalog__item">
  <router-link v-bind:to="{name :'product', params: { id: product.id } }"
               class="catalog__pic">
    <img v-bind:src="imageUrl" v-bind:alt="product.title">
  </router-link>

            <h3 class="catalog__title">
              <router-link v-bind:to="{name:'product', params: { id: product.id }}">
                {{ product.title }}
              </router-link>
            </h3>

            <span class="catalog__price">
              {{ product.price | numberFormat }} ₽
            </span>

            <ul class="colors colors--black">
              <li class="colors__item" v-for="item in product.colors" v-bind:key="item.id">
                <label class="colors__label">
                  <input class="colors__radio sr-only" type="radio" name="color-1" v-bind:value="item.color.code"
                    v-on:change="changeColor(item.id)">
                  <span class="colors__value" v-bind:style="{'background-color': item.color.code}">
                  </span>
                </label>
              </li>
            </ul>
          </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { NULL_IMG_URL } from '@/config';

export default {
  props: ['product'],
  filters: {
    numberFormat,
  },
  data() {
    return {
      colorIndex: 0,
    };
  },
  methods: {
    changeColor(colorItemId) {
      this.colorIndex = this.product.colors.findIndex(item => item.id === colorItemId);
    }
  },
  computed: {
    imageUrl() {
      if(this.product.colors && this.product.colors.length > 0 && 
         this.product.colors[this.colorIndex].gallery) {
          return this.product.colors[this.colorIndex].gallery[0].file.url;
      }

      return NULL_IMG_URL;
    }
  }
};
</script>