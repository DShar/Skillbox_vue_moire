<template>
    <BaseFormField v-bind:title="title" v-bind:error="error">
        <input class="form__input" v-bind:type="type" v-model="dataValue"
                v-bind:placeholder="placeholder">
    </BaseFormField>
</template>

<script>
import formMixin from '@/mixins/formMixin';

export default {
  mixins: [formMixin],
  props: {
    type: {
      default: 'text',
    },
  },
};
</script>