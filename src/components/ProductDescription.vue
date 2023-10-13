<template>
    <div class="item__desc">
      <ul class="tabs">
          <li
            v-for="tab in tabs"
            v-bind:key="tab.name"
            class="tabs__item"
            v-on:click="currentTabName = tab.name">
                <a v-bind:class="['tabs__link', { 'tabs__link--current': currentTabName === tab.name }]">
                    {{ tab.title }}
                </a>
          </li>
        </ul>

      <component v-bind:is="currentTabComponent" class="item__content" v-bind="currentProperties"></component>
    </div>
</template>

<script>
import ProductTabInfo from '@/components/ProductTabInfo.vue';
import ProductTabDelivery from '@/components/ProductTabDelivery.vue';

export default {
    props: ['info', 'deliveries'],
    data() {
        return {
          currentTabName: "Info",
          tabs: [
                {title: 'Информация о товаре',
                name: 'Info'},
                {title: 'Доставка и возврат',
                name: 'Delivery'},
            ]
        }
    },
    components: {
        ProductTabInfo,
        ProductTabDelivery,
    },
    computed: {
        currentTabComponent() {
            return 'ProductTab' + this.currentTabName;
        },
        currentProperties() {
            if(this.currentTabName === 'Info') {
                return {content: this.info};
            }
            if(this.currentTabName === 'Delivery') {
                return { deliveries: this.deliveries};
            }
            else {
                return {};
            }
        }
    },
}
</script>
