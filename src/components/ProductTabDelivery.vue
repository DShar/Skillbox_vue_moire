<template>
    <div class="item__content">
          <h4 v-for="delivery in deliveries" v-bind:key="delivery.id">
            {{ delivery.title }} : {{ delivery.price }} ₽
          </h4>
        </div>
</template>

<script>

export default {
    props: ['deliveries'],
}
</script>