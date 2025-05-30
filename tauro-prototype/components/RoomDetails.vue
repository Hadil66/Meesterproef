<template>
    <div v-if="props.selectedRoomObject" class="room-details-card">
        <NuxtImg
      :src="props.selectedRoomObject.imageSrc || '/images/meetingroom.webp'" 
      :alt="`${props.selectedRoomObject.name || 'Vergaderruimte'} afbeelding`"
      class="room-details-image"
      loading="lazy"
    />
      <h4 class="room-details-title">
        {{ props.selectedRoomObject.name || 'N.v.t.' }}
      </h4>
      <div
        v-if="props.selectedRoomObject.description"
        class="room-details-text room-details-description"
        v-html="props.selectedRoomObject.description"
      ></div>
      <div v-else class="room-details-text room-details-description">
        Geen beschrijving beschikbaar.
      </div>
      <div class="room-details-text room-details-capacity">
        Capaciteit: <strong>{{ props.selectedRoomObject.capacity || 0 }} personen</strong>
      </div>
      <div
        class="room-details-text room-details-features"
        v-if="props.selectedRoomObject.features && props.selectedRoomObject.features.length"
      >
        Features: <strong>{{ props.selectedRoomObject.features.join(", ") }}</strong>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    selectedRoomObject: {
      type: Object,
      default: null,
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .room-details-card {
    border: 1px solid $border-colour;
    border-radius: $border-radius;
    padding: $spacing-small;
    margin-top: $spacing-extra-small;
    background-color: $background-colour;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  
  .room-details-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: $border-radius - 2px;
    margin-bottom: $spacing-small;
    border: 1px solid $border-colour-subtle;
  }
  
  .room-details-title {
    font-size: $font-size-large * 0.9; 
    text-align: center;
    margin-top: 0;
    margin-bottom: math.div($spacing-extra-small, 2);
    font-weight: 500;
    color: $text-colour-emphasis;
  }
  
  .room-details-text {
    font-size: 0.9rem;
    text-align: center;
    color: $text-colour;
    margin-bottom: math.div($spacing-extra-small, 2);
    line-height: 1.5;
  
    &:last-child {
      margin-bottom: 0;
    }

  }
  
  .room-details-description {
    :deep(p) {
      margin-bottom: $spacing-extra-small;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .no-room-selected-message {
    padding: $spacing-medium;
    text-align: center;
    color: $text-colour-muted;
    background-color: $background-colour-subtle;
    border-radius: $border-radius;
    margin-top: $spacing-extra-small;
  }
  </style>