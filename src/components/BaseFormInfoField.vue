<template>
  <li class="dictionary__item">
    <span class="dictionary__key">
       {{ title }}
    </span>
    <span class="dictionary__value">
      {{ value }}
    </span>
  </li>
</template>

<script>
export default {
  props: ['title', 'value'],
};
</script>