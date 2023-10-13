<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ countProducts }} товара
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-bind:priceFrom.sync="filterPriceFrom"
        v-bind:priceTo.sync="filterPriceTo"
        v-bind:colorIds.sync="filterColorValues"
        v-bind:categoryId.sync="filterCategoryId"
        v-bind:seasonIds.sync="filterSeasonValues"
        v-bind:materialIds.sync="filterMaterialValues"
        v-on:reset="paginate(1)"
      />

      <section class="catalog">
        <div v-if="productsLoadingFailed" class="content__info">
          Ошибка при загрузке каталога
          <a class="error__link" v-on:click.prevent="loadProducts">Попробовать ещё раз</a>
        </div>
        <div v-if="productsLoading"><div class="loader-heart"><div></div></div></div>
        <ProductsList v-bind:products="products"/>
        <BasePagination
          v-bind:count="countProducts"
          v-model="page"
          v-bind:per-page="productsPerPage"
        />
      
      </section>
    </div>
  </main>
</template>

<script>
import ProductsList from '@/components/ProductsList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import { API_BASE_URL } from '@/config.js';
import axios from 'axios';

export default {
  components: {
    ProductsList,
    BasePagination,
    ProductFilter,
  },
  data() {
    return {
      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false,

      page: 1,
      productsPerPage: 9,

      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorValues: [],
      filterMaterialValues: [],
      filterSeasonValues: [],
    };
  },
  computed: {
    products() {
      return this.productsData ? this.productsData.items : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    }
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;

      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products`, {
            params: {
              categoryId: this.filterCategoryId,
              materialIds: this.filterMaterialValues,
              seasonIds: this.filterSeasonValues,
              colorIds: this.filterColorValues,
              page: this.page,
              limit: this.productsPerPage,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
            },
          })
          .then((response) => { this.productsData = response.data; })
          .catch(() => { this.productsLoadingFailed = true; })
          .finally(() => { this.productsLoading = false; });
      }, 0);
    },
    paginate(newPage) {
      this.page = newPage;
    }
  },
  created() {
    this.loadProducts();
  },
  watch: {
    'this.$route.params.categoryId': {
      handler() {
        this.loadProducts();
      },
      immediate: true,
    },
    page() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterColorValues() {
      this.loadProducts();
    },
    filterSeasonValues() {
      this.loadProducts();
    },
    filterMaterialValues() {
      this.loadProducts();
    }
  },
}
</script>

<style>
  .error__link {
    color: #e02d71;
    border-bottom: 2px dashed transparent;
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
  }
  .error__link:hover {
    color: #000;
  }
</style>
