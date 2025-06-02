<template>
    <section class="city-selection">
      <h1>Vergaderlocaties in de randstad</h1>
      <ul class="city-selection-list" role="list">
        <li
          v-for="locatie in locaties"
          :key="locatie.value"
          class="city-selection-list-item"
          :class="{ 'active': selectedCityValue === locatie.value }"
          @click="selectLocation(locatie.value)"
          @keydown.enter="selectLocation(locatie.value)"
          @keydown.space.prevent="selectLocation(locatie.value)"
          role="listitem"
          tabindex="0"
        >
          {{ locatie.name }}
        </li>
      </ul>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const emit = defineEmits(['city-selected']);
  
  const locaties = ref([
    { name: 'Alphen a/d Rijn', value: 'Alphen a/d rijn' },
    { name: 'Amsterdam', value: 'Amsterdam' },
    { name: 'Delft', value: 'Delft' },
    { name: 'Den Haag', value: 'Den Haag' },
    { name: 'Heemstede', value: 'Heemstede' },
    { name: 'Oegstgeest', value: 'Oegstgeest' },
    { name: 'Rijswijk', value: 'Rijswijk' },
  ]);
  
  const selectedCityValue = ref(null);
  
  const selectLocation = (cityValue) => {
    selectedCityValue.value = cityValue;
    const selectedLocatieObject = locaties.value.find(currentLocation => currentLocation.value === cityValue);    if (selectedLocatieObject) {
      emit('city-selected', selectedLocatieObject);
    }
  };
  </script>
  
  <style scoped lang="scss">
  .city-selection {
    max-width: 960px;
    margin: 2em;
    padding: 2em;
  
    @media (min-width: 960px) {
      margin: 2em auto;
    }
  
    h1 {
      font-size: clamp(1.5625rem, 1.027rem + 2.2549vw, 3rem);
      padding: 0 $spacing-small;
      margin: 0 0 $spacing-medium 0;
      width: clamp(255px, 60%, 500px);
      font-weight: 200;
      }
  
    &-list {
      @include list-reset;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
  
      @media (min-width: 600px) {
        height: 15em;
      }
  
      @media (min-width: 850px) {
        height: 10em;
      }
    }
  
    &-list-item {
      padding: 0.5em 0.3em;
      font-size: math.div($font-size-large, 1.1);
      border-bottom: solid 1px $border-colour;
      width: 10em;
      cursor: pointer;
      transition: color 0.2s ease-in-out;
      color: $text-colour;
      @include on-hover-focus;
  
      &.active {
        color: $primary-colour;
      }
    }
  }
  </style>