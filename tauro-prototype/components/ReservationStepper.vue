<template>
  <div class="reservation-stepper-container">
    <!-- Loading State -->
    <div v-if="isLoading && !apiError" class="loading-indicator">
      <div class="spinner"></div>
      <p>Gegevens laden...</p>
    </div>

    <!-- API Error State -->
    <div v-if="apiError && currentStep !== 4" class="error-alert">
      {{ apiError }}
    </div>

    <!-- Stepper -->
    <div v-if="!isLoading && !apiError && selectedCityFilter" class="stepper">
      <div class="stepper-header">
        <div
          v-for="item in stepperDisplayItems"
          :key="item.value"
          class="stepper-header-item"
          :class="{
            active: currentStep === item.value,
            disabled: isStepDisabled(item.value),
          }"
          @click="!isStepDisabled(item.value) && goToStep(item.value)"
        >
          <span class="stepper-header-item-circle">{{ item.value }}</span>
          <span class="stepper-header-item-title">{{ item.title }}</span>
        </div>
      </div>

      <div class="stepper-content">
        <Step1
          v-if="currentStep === 1"
          :ruimtes="filteredRuimtes"
          :all-bookings-from-api="allBookingsFromApi"
          :is-loading-parent="isLoading"
          :is-loading-times="isLoadingTimes"
          :today-date-string="todayDateString"
          :static-possible-time-slots="staticPossibleTimeSlots"
          v-model:selected-room-id="selectedVergaderruimteId"
          v-model:selected-date-prop="selectedDate"
          v-model:time-selection-prop="timeSelection"
          :city-name="props.selectedCityDisplayName"
        />
        <Step2
          v-if="currentStep === 2"
          :selected-room-object="selectedRoomObject"
          :formatted-selected-date-long="formattedSelectedDateLong"
          :time-selection="timeSelection"
          :can-proceed="canProceedToStep2"
        />
        <Step3
          v-if="currentStep === 3"
          v-model:reservation-comment-prop="reservationComment"
          :is-submitting-booking="isSubmittingBooking"
          @submit-booking-requested="submitBooking"
        />
        <Step4
          v-if="currentStep === 4"
          :last-booking-details="lastBookingDetails"
          @new-reservation-requested="resetStepper"
        />
      </div>

      <div
        class="stepper-actions"
        :class="{ 'prev-invisible': currentStep === 1 && !isSubmittingBooking }"
      >
        <button
          v-if="currentStep !== 1 && !isSubmittingBooking"
          @click="prevStep"
          class="stepper-actions-button stepper-actions-button--prev"
        >
          Vorige
        </button>
        <button
          v-if="currentStep < 3"
          @click="nextStep"
          class="stepper-actions-button stepper-actions-button--next"
          :disabled="isNextButtonDisabled"
        >
          Volgende
        </button>
      </div>
      <!-- Message for no rooms -->
      <div
        v-if="
          initialLoadComplete &&
          filteredRuimtes.length === 0 &&
          selectedCityFilter
        "
        class="no-rooms-message"
      >
        Er zijn momenteel geen vergaderruimtes beschikbaar voor de geselecteerde
        stad.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import axios from "axios";

import Step1 from "./Step1.vue";
import Step2 from "./Step2.vue";
import Step3 from "./Step3.vue";
import Step4 from "./Step4.vue";

const props = defineProps({
  selectedCityFilter: {
    type: String,
    default: null,
  },
  selectedCityDisplayName: {
    type: String,
    default: "",
  },
});

const config = useRuntimeConfig();
const WORDPRESS_API_URL = config.public.wordpressApiUrl;

const currentStep = ref(1);
const ruimtes = ref([]);
const allBookingsFromApi = ref([]);
const selectedVergaderruimteId = ref(null);
const selectedDate = ref(null);
const timeSelection = ref([]);
const reservationComment = ref("");
const lastBookingDetails = ref(null);
const isLoading = ref(true);
const isLoadingTimes = ref(false);
const isSubmittingBooking = ref(false);
const apiError = ref(null);
const initialLoadComplete = ref(false);

const baseStepperItems = [
  { title: "Selecteer", value: 1 },
  { title: "Controleer", value: 2 },
  { title: "Reserveer", value: 3 },
];
const stepperDisplayItems = ref([...baseStepperItems]);

const staticPossibleTimeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const formatDateISO = (dateInput) => {
  if (!dateInput) return null;
  let date;
  try {
    date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return null;
  } catch (e) {
    return null;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayDateString = computed(() => formatDateISO(new Date()));

const filteredRuimtes = computed(() => {
  if (!props.selectedCityFilter) {
    return [];
  }
  if (!ruimtes.value || ruimtes.value.length === 0) {
    return [];
  }
  return ruimtes.value.filter(
    (room) =>
      room.city &&
      room.city.toLowerCase() === props.selectedCityFilter.toLowerCase()
  );
});

const fetchRooms = async () => {
  const targetUrl = `${WORDPRESS_API_URL}/wp/v2/vergaderruimtes?_embed&per_page=100`;
  try {
    const response = await axios.get(targetUrl);
    ruimtes.value = response.data.map((room) => ({
      id: room.id,
      name: room.acf?.room_name || room.title.rendered,
      description: room.content?.rendered || "Geen beschrijving beschikbaar.",
      capacity: room.acf?.room_capacity || 0,
      features: room.acf?.room_features || [],
      imageSrc: room._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
      city: room.acf?.city_name,
    }));
  } catch (error) {
    console.error(
      "Error fetching rooms:",
      error.response?.data || error.message || error
    );
    apiError.value = `Kon vergaderruimtes niet laden: ${error.message}.`;
    ruimtes.value = [];
  }
};

const fetchAllBookings = async () => {
  const targetUrl = `${WORDPRESS_API_URL}/wp/v2/reserveringen?per_page=100`;
  try {
    isLoadingTimes.value = true;
    const response = await axios.get(targetUrl);
    allBookingsFromApi.value = response.data.map((booking) => ({
      roomId: booking.acf?.booking_room_id,
      date: booking.acf?.booking_date,
      times: booking.acf?.booking_time_slots || [],
    }));
  } catch (error) {
    console.error(
      "Error fetching bookings:",
      error.response?.data || error.message || error
    );
    apiError.value = `Kon bestaande reserveringen niet laden: ${error.message}.`;
    allBookingsFromApi.value = [];
  } finally {
    isLoadingTimes.value = false;
  }
};

onMounted(async () => {
  isLoading.value = true;
  initialLoadComplete.value = false;
  apiError.value = null;

  if (
    !WORDPRESS_API_URL ||
    typeof WORDPRESS_API_URL !== "string" ||
    WORDPRESS_API_URL.trim() === ""
  ) {
    apiError.value = `API configuratie ontbreekt of is ongeldig. Controleer de WORDPRESS_API_URL instelling.`;
    isLoading.value = false;
    initialLoadComplete.value = true;
    console.error(
      "CRITICAL: WORDPRESS_API_URL is not configured correctly. Value:",
      JSON.stringify(WORDPRESS_API_URL)
    );
    return;
  }

  await fetchRooms();
  if (
    !apiError.value ||
    (apiError.value && !apiError.value.includes("vergaderruimtes"))
  ) {
    await fetchAllBookings();
  }
  isLoading.value = false;
  initialLoadComplete.value = true;
});

watch(
  () => props.selectedCityFilter,
  (newCitySlug, oldCitySlug) => {
    if (newCitySlug !== oldCitySlug) {
      selectedVergaderruimteId.value = null;
      selectedDate.value = null;
      timeSelection.value = [];
      reservationComment.value = "";
      if (currentStep.value !== 1 && currentStep.value !== 4) {
        currentStep.value = 1;
      }
      if (apiError.value) apiError.value = null;
    }
  }
);

watch(selectedVergaderruimteId, (newId, oldId) => {
  if (newId !== oldId && newId !== null) {
    if (props.selectedCityFilter) {
      selectedDate.value = null;
      timeSelection.value = [];
    }
  }
});

const selectedRoomObject = computed(() => {
  if (selectedVergaderruimteId.value === null || !filteredRuimtes.value.length)
    return null;
  return filteredRuimtes.value.find(
    (ruimte) => ruimte.id === selectedVergaderruimteId.value
  );
});

const formattedSelectedDateLong = computed(() => {
  if (!selectedDate.value) return "";
  const date =
    selectedDate.value instanceof Date
      ? selectedDate.value
      : new Date(selectedDate.value);
  if (isNaN(date.getTime())) return "Ongeldige datum";
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const canProceedToStep2 = computed(() => {
  return (
    selectedVergaderruimteId.value !== null &&
    selectedDate.value !== null &&
    timeSelection.value.length > 0
  );
});

const isNextButtonDisabled = computed(() => {
  if (isSubmittingBooking.value) return true;
  if (currentStep.value === 1 && !canProceedToStep2.value) return true;
  if (currentStep.value === 2 && !canProceedToStep2.value) return true;
  if (
    initialLoadComplete.value &&
    filteredRuimtes.value.length === 0 &&
    props.selectedCityFilter
  )
    return true;
  return false;
});

const isStepDisabled = (stepValue) => {
  if (isLoading.value || isSubmittingBooking.value) return true;
  if (
    initialLoadComplete.value &&
    filteredRuimtes.value.length === 0 &&
    props.selectedCityFilter &&
    stepValue !== 4
  )
    return true;
  if (stepValue === 2 && !canProceedToStep2.value) return true;
  if (stepValue === 3 && !canProceedToStep2.value) return true;
  if (stepValue === 4 && currentStep.value !== 4) return true;
  return false;
};

const goToStep = (stepValue) => {
  if (stepValue > 0 && stepValue <= stepperDisplayItems.value.length) {
    if (stepValue < currentStep.value) {
      currentStep.value = stepValue;
    } else if (stepValue === currentStep.value + 1) {
      if (currentStep.value === 1 && canProceedToStep2.value)
        currentStep.value = stepValue;
      else if (currentStep.value === 2 && canProceedToStep2.value)
        currentStep.value = stepValue;
    } else if (stepValue < 4 && stepValue < currentStep.value) {
      currentStep.value = stepValue;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1 && !isSubmittingBooking.value) {
    currentStep.value--;
  }
};

const nextStep = () => {
  if (currentStep.value < 3 && !isNextButtonDisabled.value) {
    currentStep.value++;
  }
};

const submitBooking = async () => {
  if (!canProceedToStep2.value) {
    alert("Selecteer aub een ruimte, datum en tijdslot(en) in Stap 1.");
    currentStep.value = 1;
    return;
  }
  isSubmittingBooking.value = true;
  apiError.value = null;

  if (!selectedRoomObject.value) {
    apiError.value = "Geselecteerde ruimte niet gevonden. Probeer opnieuw.";
    isSubmittingBooking.value = false;
    return;
  }

  const bookingPayload = {
    status: "publish",
    title: `Reservering voor ${
      selectedRoomObject.value.name
    } op ${formatDateISO(selectedDate.value)}`,
    acf: {
      booking_room_id: selectedRoomObject.value.id,
      booking_date: formatDateISO(selectedDate.value),
      booking_time_slots: [...timeSelection.value],
      booking_comment: reservationComment.value || "",
    },
  };

  console.log(
    "Submitting Booking Payload to Nuxt Server Route:",
    JSON.stringify(bookingPayload, null, 2)
  );

  try {
    const wordpressResponse = await $fetch("/api/submitBooking", {
      method: "POST",
      body: bookingPayload,
    });

    console.log("Booking successful, WordPress response:", wordpressResponse);

    lastBookingDetails.value = {
      roomId: selectedRoomObject.value.id,
      roomName: selectedRoomObject.value.name,
      date: formatDateISO(selectedDate.value),
      formattedDate: formattedSelectedDateLong.value,
      times: [...timeSelection.value],
      comment: reservationComment.value || "",
      isApiBooking: true,
    };
    await fetchAllBookings();
    currentStep.value = 4;
  } catch (error) {
    console.error(
      "Error submitting booking via Nuxt server route:",
      error.data || error.message || error
    );
    apiError.value = `Fout bij het maken van de reservering: ${
      error.data?.message ||
      error.data?.statusMessage ||
      error.message ||
      "Onbekende serverfout"
    }.`;
  } finally {
    isSubmittingBooking.value = false;
  }
};

const resetStepper = async () => {
  selectedVergaderruimteId.value = null;
  selectedDate.value = null;
  timeSelection.value = [];
  reservationComment.value = "";
  lastBookingDetails.value = null;
  currentStep.value = 1;
  apiError.value = null;
};

watch(currentStep, (newStep) => {
  const confirmationStepConfig = { title: "Bevestigd", value: 4 };
  const hasConfirmationStep = stepperDisplayItems.value.some(
    (item) => item.value === 4
  );

  if (newStep === 4 && !hasConfirmationStep) {
    stepperDisplayItems.value = [...baseStepperItems, confirmationStepConfig];
  } else if (newStep < 4 && hasConfirmationStep) {
    stepperDisplayItems.value = [...baseStepperItems];
  }
});
</script>

<style lang="scss" scoped>
.reservation-stepper-container {
  max-width: 1200px;
  margin: $spacing-medium auto;
  padding: $spacing-medium;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-large 0;
  p {
    margin-left: $spacing;
    font-size: $font-size-large;
    color: $text-colour-muted;
  }
  .spinner {
    border: 4px solid $gray-200;
    border-top: 4px solid $primary-colour;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-alert {
  background-color: #ffcdd2;
  color: #c62828;
  border: 1px solid #ef9a9a;
  padding: $spacing-medium;
  border-radius: $border-radius;
  margin: $spacing-medium 0;
  text-align: center;
}

.no-rooms-message {
  text-align: center;
  padding: $spacing-medium;
  color: $text-colour-muted;
  background-color: $background-colour-subtle;
  border-radius: $border-radius;
  margin-top: $spacing-medium;
}

.stepper {
  border: 1px solid $border-colour;
  border-radius: $border-radius;
  background-color: $background-colour;

  &-header {
    display: flex;
    justify-content: space-around;
    padding: $spacing-medium $spacing;
    border-bottom: 1px solid $border-colour;
    background-color: $background-colour-alt;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      text-align: center;
      color: $text-colour-muted;

      &-circle {
        width: math.div($spacing-medium * 3, 2);
        height: math.div($spacing-medium * 3, 2);
        border-radius: 50%;
        background-color: $gray-200;
        color: $text-colour-muted;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: math.div($spacing, 2);
        font-weight: $bold;
        transition: background-color 0.3s, color 0.3s;
      }

      &-title {
        font-size: $font-size-small;
      }

      &.active {
        color: $primary-colour;
        .stepper-header-item-circle {
          background-color: $primary-colour;
          color: $text-colour;
        }
      }

      &.completed {
        .stepper-header-item-circle {
          background-color: color.scale($primary-colour, $lightness: 25%);
          color: $text-colour-on-primary;
        }
        color: $text-colour-emphasis;
      }
      &.disabled {
        opacity: 0.6;
        .stepper-header-item-circle {
          background-color: $gray-100;
          color: $gray-400;
        }
        color: $gray-400;
      }

      &:not(.disabled):hover {
        .stepper-header-item-circle {
          background-color: color.scale($gray-200, $lightness: -10%);
        }
        &.active .stepper-header-item-circle {
          background-color: color.scale($primary-colour, $lightness: -10%);
        }
      }
    }
  }

  &-content {
    padding: $spacing-medium;
    min-height: 200px;
  }

  &-actions {
    display: flex;
    justify-content: space-between;
    padding: $spacing-medium;
    border-top: 1px solid $border-colour;

    &.prev-invisible {
      justify-content: flex-end;
    }

    &-button {
      padding: math.div($spacing, 2) $spacing;
      border: 1px solid $border-colour;
      border-radius: $border-radius;
      background-color: $background-colour;
      color: $text-colour;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;

      &:hover:not(:disabled) {
        background-color: $background-colour-hover;
      }

      &--next,
      &--prev {
        background-color: $primary-colour;
        color: $text-colour;
        border-color: $primary-colour;

        &:hover:not(:disabled) {
          background-color: color.scale($primary-colour, $lightness: -10%);
        }
      }

      &:disabled {
        background-color: $background-colour-disabled;
        color: $text-colour-disabled;
        border-color: $border-colour-subtle;
      }
    }
  }
}
</style>
