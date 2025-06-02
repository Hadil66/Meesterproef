<template>
    <div
      v-if="
        props.selectedDate &&
        !props.isLoadingTimes &&
        props.staticPossibleTimeSlots.length > 0
      "
      class="time-list-container"
    >
      <h3 class="time-list-subheader">
        Beschikbare tijden op {{ props.formattedSelectedDateShort }}
      </h3>
      <ul class="time-list">
        <li
          v-for="time in props.staticPossibleTimeSlots"
          :key="time"
          class="time-list-item"
          :class="{
            'time-slot-booked': props.isTimeSlotBookedFn(time),
            'time-slot-selected': localTimeSelection.includes(time),
          }"
          :aria-disabled="props.isTimeSlotBookedFn(time)"
          @click="toggleTimeSelection(time)"
        >
          <span
            class="time-list-item-title"
            :class="{ 'booked-text': props.isTimeSlotBookedFn(time) }"
          >
            {{ time }}
          </span>
        </li>
      </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  selectedDate: { type: [Date, String, null] as PropType<Date | string | null>, default: null },
  formattedSelectedDateShort: { type: String, default: '' },
  staticPossibleTimeSlots: { type: Array as PropType<string[]>, required: true },
  modelValue: { type: Array as PropType<string[]>, default: () => [] },
  isLoadingTimes: { type: Boolean, default: false },
  isTimeSlotBookedFn: { type: Function as PropType<(time: string) => boolean>, required: true },
});

const emit = defineEmits(['update:modelValue']);

const localTimeSelection = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const toggleTimeSelection = (time: string) => {
  if (props.isTimeSlotBookedFn(time)) return;

  const newSelection = [...localTimeSelection.value];
  const index = newSelection.indexOf(time);
  if (index > -1) {
    newSelection.splice(index, 1);
  } else {
    newSelection.push(time);
  }
  localTimeSelection.value = newSelection;
};
</script>

<style scoped lang="scss">
.time-list-container {
  @include card-style(
    $padding: $spacing-extra-small );
  margin-top: $spacing-extra-small;
  width: 100%; 
}

.time-list-subheader {
  font-size: $font-size-small;
  font-weight: 600;
  color: $text-colour-emphasis;
  padding: $spacing-extra-small $spacing-extra-small $spacing-small;
  margin: 0;
}

.time-list {
  @include list-reset; 
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: $spacing-extra-small;
}

.time-list-item {
  border: 1px solid $background-colour-hover;
  border-radius: $border-radius / 2;
  padding: $spacing-extra-small $spacing-small;
  text-align: center;
  cursor: pointer;
  transition: background-color $transition-duration ease,
              border-color $transition-duration ease,
              opacity $transition-duration ease;
  user-select: none;

  &:not(.time-slot-booked):hover {
    background-color: $background-colour-hover;
  }

  &.time-slot-selected:not(.time-slot-booked) {
    background-color: $background-colour-selected;
    border-color: $primary-colour;
    font-weight: bold;

    .time-list-item-title {
        color: $primary-colour;
    }
  }

  &.time-slot-booked {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: $background-colour-disabled;

    .time-list-item-title.booked-text {
      text-decoration: line-through;
      color: $text-colour-disabled;
    }
  }
}

.time-list-item-title {
  display: block;
  font-size: $font-size-small;
  color: $text-colour;
}
</style>