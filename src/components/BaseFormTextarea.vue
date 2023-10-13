<template>
  <BaseFormField v-bind:title="title" v-bind:error="error">
    <textarea class="form__input form__input--area" v-model="dataValue"
                v-bind:placeholder="placeholder"></textarea>
    </BaseFormField>
</template>

<script>
import formMixin from '@/mixins/formMixin';

export default {
  mixins: [formMixin],
};
</script>
