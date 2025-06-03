<template>
    <section class="selection-review-step">
      <h2 class="stepper-title">Stap 2: Controleer uw selectie</h2>
      <div class="content-wrapper">
        <dl class="confirmation-details">
          <div class="detail-entry">
            <dt class="detail-label">Gekozen Ruimte:</dt>
            <dd class="detail-value">{{ selectedRoomObject?.name }}</dd>
          </div>
          <div class="detail-entry">
            <dt class="detail-label">Datum:</dt>
            <dd class="detail-value">{{ formattedSelectedDateLong  }}</dd>
          </div>
          <div class="detail-entry">
            <dt class="detail-label">Geselecteerde Tijd(en):</dt>
            <dd class="detail-value">{{ timeSelection.length > 0 ? timeSelection.join(", ") : 'Geen tijden geselecteerd' }}</dd>
          </div>
        </dl>
        <p class="confirmation-caption">
          Klopt alles? Klik op 'Volgende' om door te gaan.
        </p>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  defineProps({
    selectedRoomObject: { type: Object, default: null },
    formattedSelectedDateLong: { type: String, default: '' },
    timeSelection: { type: Array as () => string[], default: () => [] },
    canProceed: { type: Boolean, default: false }
  });
  </script>
  
  <style lang="scss" scoped>  
  .selection-review-step {
    width: 100%;
  }
  
  .stepper-title {
    font-size: $font-size-large;
    font-weight: $bold;
    color: $text-colour-emphasis;
    margin-bottom: $spacing-medium;
    text-align: center;
  }
  
  .content-wrapper {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
  
  .confirmation-details {
    @include card-style(
      $bg-color: $background-colour,
      $border: 1px solid $border-colour-subtle,
      $radius: $border-radius,
      $shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
    );
    margin-bottom: 0;
  }
  
  .detail-entry {
    display: flex;
    align-items: flex-start;
    padding: $spacing-extra-small ($spacing-extra-small * 1.5);
  }
  
  .detail-label {
    font-weight: $bold;
    margin-right: math.div($spacing-extra-small, 1.5);
    color: $text-colour-emphasis;
  }
  
  .detail-value {
    color: $text-colour;
    margin-left: 0;
    text-align: left;
    text-wrap: wrap;
    flex-grow: 1;
  }
  
  .confirmation-caption {
    font-size: $font-size-small;
    color: $text-colour-muted;
    text-align: center;
    margin-top: $spacing;
  }
  </style>