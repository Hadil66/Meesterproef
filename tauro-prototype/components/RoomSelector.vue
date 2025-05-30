<template>
    <div class="room-selector-container">
      <div
        v-for="ruimte in props.ruimtes"
        :key="ruimte.id"
        class="room-card"
        :class="{ 'is-selected': props.modelValue === ruimte.id }"
        @click="selectRoom(ruimte.id)"
        tabindex="0"
        @keydown.enter="selectRoom(ruimte.id)"
        @keydown.space="selectRoom(ruimte.id)"
        role="button"
        :aria-pressed="props.modelValue === ruimte.id"
        :aria-label="`Select room ${ruimte.name}`"
      >
      <NuxtImg src="/images/meetingroom.webp"
          :alt="ruimte.name + ' afbeelding'"
          class="room-card-image"
        />
        <div class="room-card-text room-card-name">
          {{ ruimte.name }}
        </div>
        <div class="room-card-text room-card-capacity">
          Max: {{ ruimte.capacity }} pers.
        </div>
      </div>
      <div v-if="props.ruimtes.length === 0" class="no-rooms-message">
        Geen ruimtes om te selecteren.
      </div>
    </div>
  </template>
  
  <script setup>  
  const props = defineProps({
    ruimtes: { type: Array, required: true },
    modelValue: { type: [Number, String], default: null },
  });
  const emit = defineEmits(["update:modelValue"]);
  
  const selectRoom = (id) => {
    emit("update:modelValue", id);
  };
  </script>
  
  <style lang="scss" scoped>
  .room-selector-container {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-medium;
    padding: $spacing-extra-small 0;
    justify-content: flex-start;
  }
  
  .room-card {
    width: 140px;
    height: 190px;
    background-color: $gray-100;
    border: 1px solid $border-colour;
    border-radius: $border-radius;
    cursor: pointer;
    transition: all 0.25s ease-in-out;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
      border-color: color.scale($border-colour, $lightness: -10%);
    }
  
    &:focus-visible { 
      outline: 2px solid $primary-colour;
      outline-offset: 2px;
    }
  
    &.is-selected {
      background-color: $primary-colour;
      color: $text-colour-on-primary;
      border-color: $primary-colour;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      transform: translateY(-2px);
  
      .room-card-name, .room-card-capacity {
          color: $text-colour-on-primary;
      }
    }
  
    &-image {
      width: 100%;
      height: 120px;
      object-fit: cover;
      background-color: $gray-50;
    }
  
    &-text {
      padding: $spacing-extra-small math.div($spacing-extra-small, 2);
      line-height: 1.3;
    }
  
    &-name {
      font-weight: 500;
      font-size: 0.9rem;
      margin-top: math.div($spacing-extra-small, 2);
      color: $text-colour;
    }
  
    &-capacity {
      font-size: $font-size-tiny;
      color: $text-colour-muted;
    }
  }
  
  .no-rooms-message {
    width: 100%;
    text-align: center;
    padding: $spacing-medium;
    color: $text-colour-muted;
  }
  </style>