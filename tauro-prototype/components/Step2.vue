<template>
  <fieldset class="selection-review-fieldset">
    <legend class="stepper-title">Stap 2: Controleer uw selectie</legend>
    <div class="content-wrapper">
      <div class="confirmation-details">
        <p>
          <strong>Gekozen Ruimte:</strong> {{ selectedRoomObject?.name || 'Niet geselecteerd' }}
        </p>
        <p>
          <strong>Datum:</strong> {{ formattedSelectedDateLong || 'Niet geselecteerd' }}
        </p>
        <p>
          <strong>Geselecteerde Tijd(en):</strong>
          {{ timeSelection.length > 0 ? timeSelection.join(", ") : "Geen tijden geselecteerd" }}
        </p>
      </div>
      <p class="confirmation-caption">
        Klopt alles? Klik op 'Volgende' om door te gaan.
      </p>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
defineProps({
  selectedRoomObject: { type: Object, default: null },
  formattedSelectedDateLong: { type: String, default: "" },
  timeSelection: { type: Array as () => string[], default: () => [] },
  canProceed: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
fieldset {
  border: 0;
  padding: 0;
  margin: 0;
}

legend {
  padding: 0;
  display: block;
  width: 100%;
}

.selection-review-fieldset {
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
  padding: $spacing-extra-small;
  margin-bottom: 0;

  p {
    padding: math.div($spacing-extra-small, 1.5) $spacing-extra-small;
    margin: 0;
    color: $text-colour;

    &:not(:last-child) {
      border-bottom: 1px solid $border-colour-subtle;
    }

    strong {
      font-weight: $bold;
      margin-right: math.div($spacing-extra-small, 1.5);
      color: $text-colour-emphasis;
    }
  }
}

.confirmation-caption {
  font-size: $font-size-small;
  color: $text-colour-muted;
  text-align: center;
  margin-top: $spacing;
}
</style>