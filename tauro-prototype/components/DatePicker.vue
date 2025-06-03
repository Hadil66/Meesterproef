<template>
  <VDatePicker v-model="date" mode="date" />

</template>

<script setup>
import { DatePicker as VDatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { ref } from 'vue';
const date = ref(new Date());
</script>

<style scoped lang="scss">
  .vc-highlight-content-solid, .vc-blue {
    background-color: $primary-colour !important;
  }
</style>