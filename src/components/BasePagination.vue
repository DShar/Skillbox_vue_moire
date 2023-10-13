<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
        <a class="pagination__link pagination__link--arrow" href="#"
           v-bind:class="{'pagination__link--disabled' : page === 1}"
           aria-label="Предыдущая страница" v-on:click.prevent="paginate(page - 1)">
            <svg width="8" height="14" fill="currentColor">
              <use xlink:href="#icon-arrow-left"></use>
            </svg>
        </a>
    </li>
    <li class="pagination__item" v-for="pageNum in countPages" v-bind:key="pageNum">
        <a class="pagination__link pagination__link--current" href="#"
           v-on:click.prevent="paginate(pageNum)">
          {{ pageNum }}
        </a>
    </li>
    <li class="pagination__item">
        <a class="pagination__link pagination__link--arrow" href="#" 
           v-bind:class="{'pagination__link--disabled' : page === this.countPages}"
           aria-label="Следующая страница" v-on:click.prevent="paginate(page + 1)">
          <svg width="8" height="14" fill="currentColor">
            <use xlink:href="#icon-arrow-right"></use>
          </svg>
        </a>
    </li>
  </ul>
</template>

<script>
export default {
    model: {
    prop: 'page',
    event: 'paginate',
  },
  props: ['page', 'count', 'perPage'],
  methods: {
    paginate(newValue) {
        this.$emit('paginate', newValue);
    }
  },
  computed: {
    countPages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
};
</script>
