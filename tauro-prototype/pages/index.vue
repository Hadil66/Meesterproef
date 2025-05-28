<template>
  <div>
    
      <CitySelection
        @city-selected="handleCitySelected"
      />

      <ReservationStepper
        v.if="currentCityFilterValue" 
        :selected-city-filter="currentCityFilterValue"
        :selected-city-display-name="currentCityDisplayName"
      />

    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CitySelection from '@/components/CitySelection.vue';    
import ReservationStepper from '@/components/ReservationStepper.vue';

const currentCityFilterValue = ref(null); 
const currentCityDisplayName = ref('');   

const handleCitySelected = (selectedLocatieObject) => {
  console.log("[pages/index.vue] Raw selectedLocatieObject from CitySelection:", JSON.parse(JSON.stringify(selectedLocatieObject)));

  if (selectedLocatieObject && typeof selectedLocatieObject.value === 'string' && typeof selectedLocatieObject.name === 'string') {
    currentCityFilterValue.value = selectedLocatieObject.value; 
    currentCityDisplayName.value = selectedLocatieObject.name;   
    console.log(`[pages/index.vue] currentCityFilterValue updated to: '${currentCityFilterValue.value}', currentCityDisplayName: '${currentCityDisplayName.value}'`);
  } else if (selectedLocatieObject === null) {
    console.log("[pages/index.vue] City selection reset.");
    currentCityFilterValue.value = null;
    currentCityDisplayName.value = '';
  }
  else {
    console.warn("[pages/index.vue] Received selectedLocatieObject is not in the expected format (missing value or name):", selectedLocatieObject);
 
  }
};
</script>
