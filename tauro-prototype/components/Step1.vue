<template>
    <div class="step-1-container">
      <h2 class="stepper-title">Stap 1: Kies Ruimte, Datum & Tijd</h2>
  
      <div class="content-grid">
        <!-- NO ROOMS AVAILABLE -->
        <div
          v-if="!props.isLoadingParent && props.ruimtes.length === 0 && !props.isLoadingTimes"
          class="info-alert-box"
        >
          <div class="info-alert">
            Geen vergaderruimtes beschikbaar in {{ props.cityName || 'de geselecteerde stad' }}.
          </div>
        </div>
  
        <!-- Room SELECTION -->
        <div v-else-if="!props.isLoadingParent || props.ruimtes.length > 0" class="room-selection-section">
          <h3 class="section-title">{{ roomSelectionTitle }}</h3>
          <RoomSelector
            :ruimtes="props.ruimtes"
            v-model="localSelectedRoomId"
          />
        </div>
  
        <div v-if="localSelectedRoomId" class="details-date-time-grid">
          <div class="grid-columns">
            <!-- CHOSEN ROOM DETAILS -->
            <div class="grid-column">
              <h3 class="section-title">Gekozen Ruimte Details</h3>
              <RoomDetails
                v-if="selectedRoomObject"
                :selected-room-object="selectedRoomObject"
              />
            </div>
  
            <!-- DATE PICKER-->
            <div class="grid-column">
              <h3 class="section-title">Selecteer Datum</h3>
              <DatePicker
                v-model="localSelectedDate"
                :allowed-dates="allowedDates"
                :disabled="!selectedRoomObject"
                :min-date="props.todayDateString"
              />
            </div>
  
            <!-- TIME SLOT SELECTION -->
            <div class="grid-column">
              <h3 class="section-title">Selecteer Tijd(en)</h3>
              <TimeSlotPicker
                :selected-date="localSelectedDate"
                :formatted-selected-date-short="formattedSelectedDateShort"
                :static-possible-time-slots="props.staticPossibleTimeSlots"
                :booked-slots="bookedSlotsForSelectedDate"
                v-model="localTimeSelection"
                :is-loading-times="props.isLoadingTimes"
                :all-times-booked-for-date="allTimesBookedForDate"
                :is-time-slot-booked="isTimeSlotBooked"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, watch } from "vue";
  import RoomSelector from "./RoomSelector.vue";
  import RoomDetails from "./RoomDetails.vue";
  import DatePicker from "./DatePicker.vue";
  import TimeSlotPicker from "./TimeSlotPicker.vue";
  
  const props = defineProps({
    ruimtes: { type: Array, default: () => [] },
    allBookingsFromApi: { type: Array, default: () => [] },
    isLoadingParent: { type: Boolean, default: false },
    isLoadingTimes: { type: Boolean, default: false },
    todayDateString: { type: String, required: true },
    staticPossibleTimeSlots: { type: Array, required: true },
    selectedRoomId: { type: [Number, String], default: null },
    selectedDateProp: { type: [Date, String, null], default: null },
    timeSelectionProp: { type: Array, default: () => [] },
    cityName: { type: String, default: '' },
  });
  
  const roomSelectionTitle = computed(() => {
    return `Kies een vergaderruimte in ${props.cityName }`;
  });
  
  const emit = defineEmits([
    "update:selectedRoomId",
    "update:selectedDateProp",
    "update:timeSelectionProp",
  ]);
  
  const localSelectedRoomId = computed({
    get: () => props.selectedRoomId,
    set: (value) => emit("update:selectedRoomId", value),
  });
  
  const localSelectedDate = computed({
    get: () =>
      props.selectedDateProp
        ? props.selectedDateProp instanceof Date
          ? props.selectedDateProp
          : new Date(props.selectedDateProp)
        : null,
    set: (value) => emit("update:selectedDateProp", value),
  });
  
  const localTimeSelection = computed({
    get: () => props.timeSelectionProp,
    set: (value) => emit("update:timeSelectionProp", value),
  });
  
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
  
  const selectedRoomObject = computed(() => {
    if (localSelectedRoomId.value === null || !props.ruimtes.length) return null;
    const findId = Number(localSelectedRoomId.value); 
    return props.ruimtes.find((ruimte) => ruimte.id === findId);
  });
  
  const bookingsForSelectedRoom = computed(() => {
    if (!selectedRoomObject.value || !props.allBookingsFromApi.length) return [];
    return props.allBookingsFromApi.filter(
      (b) => String(b.roomId) === String(selectedRoomObject.value.id)
    );
  });
  
  const bookedSlotsForSelectedDate = computed(() => {
    const dateStr = formatDateISO(localSelectedDate.value);
    if (!selectedRoomObject.value || !dateStr || !bookingsForSelectedRoom.value.length)
      return [];
    const bookingForDate = bookingsForSelectedRoom.value.find((b) => b.date === dateStr);
    return bookingForDate ? bookingForDate.times : [];
  });
  
  const allTimesBookedForDate = computed(() => {
    if (
      !selectedRoomObject.value ||
      !localSelectedDate.value ||
      props.staticPossibleTimeSlots.length === 0
    )
      return false;
    // Ensure all static time slots are present in booked slots
    return props.staticPossibleTimeSlots.every(slot => bookedSlotsForSelectedDate.value.includes(slot));
  });
  
  const fullyBookedDatesForSelectedRoom = computed(() => {
    const bookedDates = new Set();
    if (!selectedRoomObject.value || !bookingsForSelectedRoom.value.length)
      return bookedDates;
  
    const bookingsByDate = {};
    bookingsForSelectedRoom.value.forEach((booking) => {
      if (!bookingsByDate[booking.date]) bookingsByDate[booking.date] = new Set();
      (booking.times || []).forEach((time) => bookingsByDate[booking.date].add(time));
    });
  
    for (const date in bookingsByDate) {
      if (props.staticPossibleTimeSlots.every(slot => bookingsByDate[date].has(slot))) {
        bookedDates.add(date);
      }
    }
    return bookedDates;
  });

  const formattedSelectedDateShort = computed(() => {
    if (!localSelectedDate.value) return "";
    const date = localSelectedDate.value instanceof Date ? localSelectedDate.value : new Date(localSelectedDate.value);
    if (isNaN(date.getTime())) return "Ongeldige datum";
    return date.toLocaleDateString("nl-NL", { month: "long", day: "numeric" });
  });
  
  const isTimeSlotBooked = (time) => bookedSlotsForSelectedDate.value.includes(time);
  const allowedDates = (dateValue) => {
    const date = new Date(dateValue);
    date.setHours(0, 0, 0, 0); 
    const today = new Date(props.todayDateString);
    today.setHours(0, 0, 0, 0); 
    //   AVAILABLE DATES TO SELECT
    if (date < today) return false; 
  
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
      if (isWeekend) return false; 
    
  
    const dateStr = formatDateISO(date);
      if (fullyBookedDatesForSelectedRoom.value.has(dateStr)) return false;
    
  
    return true;
  };
  
  watch(
    () => props.selectedRoomId,
    (newId, oldId) => {
      if (newId !== oldId) {
        emit("update:selectedDateProp", null);
        emit("update:timeSelectionProp", []);
      }
    }
  );
  
  watch(
    () => props.selectedDateProp,
    (newDate, oldDate) => {
      const newDateStr = newDate ? formatDateISO(newDate) : null;
      const oldDateStr = oldDate ? formatDateISO(oldDate) : null;
      if (newDateStr !== oldDateStr) {
        emit("update:timeSelectionProp", []);
      }
    }
  );
  </script>
  
  <style lang="scss" scoped>
  .step-1-container {
    padding: $spacing-medium 0;
  }
  
  .stepper-title {
    font-size: $font-size-large;
    font-weight: $bold;
    color: $text-colour-emphasis;
    margin-bottom: $spacing-medium;
    text-align: center;
  }
  
  .content-grid {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
  }
  
  .info-alert-box,
  .room-selection-section {
    width: 100%;
  }
  
  .info-alert {
  @include message-box(
    $padding: $spacing,
    $bg-color: $info-colour-light,
    $text-color: $text-colour,
    $border: 1px solid color.scale($info-colour-light, $lightness: -10%),
    $radius: $border-radius,
    $align: center
  );
}
  
  .section-title {
    font-size: 1.1rem;
    font-weight: $bold;
    color: $text-colour;
    margin-bottom: $spacing;
  }
  
  .section-divider {
    border: 0;
    border-top: 1px solid $border-colour;
    margin: $spacing-medium 0; 
  }
  
  .details-date-time-grid {
    width: 100%;
  }
  
  .grid-columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-medium;
  
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr); 
    }
  }
  </style>