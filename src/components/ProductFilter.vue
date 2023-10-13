<template>
    <aside class="filter">
        <form class="filter__form form" action="#" method="get" v-on:submit.prevent="submit">
          <fieldset class="form__block">
            <legend class="form__legend">Цена</legend>
            <label class="form__label form__label--price">
              <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
              <span class="form__value">От</span>
            </label>
            <label class="form__label form__label--price">
              <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
              <span class="form__value">До</span>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Категория</legend>
            <label class="form__label form__label--select">
              <select class="form__select"
                      type="text"
                      name="category"
                      v-model.number="currentCategoryId">
                <option value="0">Все категории</option>
                <option
                    v-bind:value="category.id"
                    v-for="category in categories"
                    v-bind:key="category.id">
                    {{ category.title }}
                </option>
              </select>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Цвет</legend>
            <ul class="colors">
              <li class="colors__item" v-for="color in colors" v-bind:key="color.id">
                <label class="colors__label">
                  <input
                    class="colors__radio sr-only"
                    type="checkbox"
                    name="color"
                    v-bind:value="color.id"
                    checked=""
                    v-model="currentColorValue"
                  />
                  <span class="colors__value" v-bind:style="{'background-color': color.code}">
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Материал</legend>
            <ul class="check-list">          
              <li class="check-list__item" v-for="material in materials" v-bind:key="material.id">
                <label class="check-list__label">
                  <input class="check-list__check sr-only"
                        type="checkbox"
                        checked=""
                        v-bind:value="material.id"
                        v-model="currentMaterialValue">
                  <span class="check-list__desc">
                    {{ material.title }}
                    <span>({{ material.productsCount }})</span>
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Коллекция</legend>
            <ul class="check-list">
              <li class="check-list__item" v-for="season in seasons" v-bind:key="season.id">
                <label class="check-list__label">
                  <input class="check-list__check sr-only"
                        type="checkbox"
                        checked=""
                        v-bind:value="season.id"
                        v-model="currentSeasonValue">
                  <span class="check-list__desc">
                    {{ season.title }} 
                    <span>( {{ season.productsCount }} )</span>
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <button class="filter__submit button button--primery" type="submit">
            Применить
          </button>
          <button class="filter__reset button button--second" type="button" v-on:click="reset" v-if="filterValueChanged">
            Сбросить
          </button>
        </form>
    </aside>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
    data() {
        return {
            categoriesData: null,
            colorsData: null,
            materialsData: null,
            seasonsData: null,

            currentPriceFrom: 0,
            currentPriceTo: 0,
            currentCategoryId: this.$route.params.categoryId !== 'not-found' ? this.$route.params.categoryId : 0,
            currentColorValue: [],
            currentSeasonValue: [],
            currentMaterialValue: [],

            filterValueChanged: false,
        }
    },
    props: ['priceFrom', 'priceTo', 'categoryId', 'colorIds', 'seasonIds', 'materialIds'],
    watch: {
      priceFrom(value) {
        this.currentPriceFrom = value;
      },
      priceTo(value) {
        this.currentPriceTo = value;
      },
      categoryId(value) {
        this.currentCategoryId = value;
      },
      colorIds(values) {
        this.currentColorValue = values;
      },
      seasonIds(values) {
        this.currentSeasonValue = values;
      },
      materialIds(values) {
        this.currentMaterialValue = values;
      },
      'this.$route.params.categoryId': {
        handler() {
          if(this.$route.params.categoryId !== 'not-found' && this.$route.params.categoryId !== 0) {
            this.filterValueChanged = true;
            this.currentCategoryId = this.$route.params.categoryId;
          }
          else {
            this.currentCategoryId = 0;
          }

          //Применяем фильтр при изменении категории
          this.$emit('update:categoryId', this.currentCategoryId);
        },
        immediate: true,
      },
    },
    computed: {
        categories() {
            return this.categoriesData ? this.categoriesData.items : [];
        },
        colors() {
            return this.colorsData ? this.colorsData.items : [];
        },
        materials() {
            return this.materialsData ? this.materialsData.items : [];
        },
        seasons() {
            return this.seasonsData ? this.seasonsData.items : [];
        },
    },
    methods: {
        loadCategories() {
            return axios
                .get(`${API_BASE_URL}/api/productCategories`)
                .then((response) => {
                this.categoriesData = response.data;
                });
        },
        loadColors() {
            return axios
                .get(`${API_BASE_URL}/api/colors`)
                .then((response) => {
                this.colorsData = response.data;
                });
        },
        loadMaterials() {
            return axios
                .get(`${API_BASE_URL}/api/materials`)
                .then((response) => {
                this.materialsData = response.data;
                });
        },
        loadSeasons() {
            return axios
                .get(`${API_BASE_URL}/api/seasons`)
                .then((response) => {
                this.seasonsData = response.data;
                });
        },
        submit() {
          this.filterValueChanged = true;

          this.$emit('update:priceFrom', this.currentPriceFrom);
          this.$emit('update:priceTo', this.currentPriceTo);
          this.$emit('update:categoryId', this.currentCategoryId);
          this.$emit('update:colorIds', this.currentColorValue);
          this.$emit('update:materialIds', this.currentMaterialValue);
          this.$emit('update:seasonIds', this.currentSeasonValue);
        },
        reset() {
          this.filterValueChanged = false;

          this.$emit('update:priceFrom', 0);
          this.$emit('update:priceTo', 0);
          this.$emit('update:categoryId', 0);
          this.$emit('update:colorIds', []);
          this.$emit('update:materialIds', []);
          this.$emit('update:seasonIds', []);
          
          //Сбросить страницу, если переключалась
          this.$emit('reset');
        }
    },
    created() {
        this.loadCategories();
        this.loadColors();
        this.loadMaterials();
        this.loadSeasons();
    }
}
</script>