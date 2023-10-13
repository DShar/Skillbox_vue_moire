<template>
  <ul class="catalog__list">
    <ProductItem v-for="item in products" v-bind:key="item.id"
                 v-bind:product="item"/>
  </ul>

        
</template>

<script>
import ProductItem from '@/components/ProductItem.vue';

export default {
  props: ['products'],
  components: {
    ProductItem,
  },
};
</script>
