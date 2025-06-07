<template>
  <fieldset class="booking-submission-fieldset">
    <legend class="stepper-title">Stap 3: Opmerking & Reserveren</legend>

    <label for="reservationComment" class="form-label"
      >Opmerking toevoegen (optioneel)</label
    >
    <textarea
      id="reservationComment"
      v-model="localComment"
      class="form-textarea"
      placeholder="Voeg hier eventuele opmerkingen toe"
      rows="3"
      maxlength="200"
      :disabled="props.isSubmittingBooking"
    ></textarea>
    <p
      v-if="localComment.length > 0 || props.isSubmittingBooking"
      class="char-counter"
    >
      {{ localComment.length }} / 200
    </p>

    <hr class="divider" />

    <p class="submission-prompt">
      Klik hieronder om uw reservering definitief te maken.
    </p>
    <button
      type="button"
      class="submit-button"
      @click="handleSubmit"
      :disabled="props.isSubmittingBooking"
      :class="{ 'is-loading': props.isSubmittingBooking }"
    >
      <span v-if="props.isSubmittingBooking" class="button-loader"></span>
      <span v-else>Reserveer Vergaderruimte</span>
    </button>
  </fieldset>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  isSubmittingBooking: { type: Boolean, default: false },
  reservationCommentProp: { type: String, default: "" },
});
const emit = defineEmits([
  "update:reservationCommentProp",
  "submit-booking-requested",
]);

const localComment = computed({
  get: () => props.reservationCommentProp,
  set: (value) => emit("update:reservationCommentProp", value),
});

const handleSubmit = () => {
  emit("submit-booking-requested");
};
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

.booking-submission-fieldset {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.stepper-title {
  font-size: $font-size-large;
  font-weight: $bold;
  color: $text-colour-emphasis;
  margin-bottom: $spacing-medium;
  text-align: center;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: $bold;
  color: $text-colour-emphasis;
  margin-bottom: $spacing-extra-small;
}

.form-textarea {
  width: 100%;
  padding: $spacing-extra-small math.div($spacing, 1.5);
  border: 1px solid $border-colour;
  border-radius: math.div($border-radius, 2);
  background-color: $background-colour;
  color: $text-colour;
  font-size: $font-size-small * 1.1;
  line-height: 1.5;
  margin-top: math.div($spacing-extra-small, 2);
  margin-bottom: $spacing-medium * 0.75;
  resize: vertical;
  transition: border-color $transition-duration ease,
    box-shadow $transition-duration ease;

  &:focus {
    outline: none;
    border-color: $primary-colour;
    box-shadow: 0 0 0 2px rgba($primary-colour, 0.2);
  }

  &::placeholder {
    color: $text-colour-muted;
    opacity: 1;
  }

  &:disabled {
    background-color: $background-colour-disabled;
    color: $text-colour-disabled;
    cursor: not-allowed;
    border-color: $border-colour-subtle;
  }
}

.char-counter {
  font-size: $font-size-tiny * 1.2;
  color: $text-colour-muted;
  text-align: right;
  margin-top: -$spacing-extra-small * 1.5;
  margin-bottom: $spacing-extra-small;
  padding-right: math.div($spacing-extra-small, 2);
}

.divider {
  border: 0;
  border-top: 1px solid $border-colour-subtle;
  margin-top: $spacing-medium;
  margin-bottom: $spacing-medium;
}

.submission-prompt {
  text-align: center;
  color: $text-colour;
  margin-bottom: $spacing;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ($spacing * 0.75) $spacing-medium;
  font-size: $font-size-small * 1.1;
  font-weight: $bold;
  color: $text-colour;
  background-color: $primary-colour;
  border: 1px solid transparent;
  border-radius: $border-radius;
  cursor: pointer;
  transition: background-color $transition-duration ease,
    opacity $transition-duration ease;
  margin-top: $spacing;

  &:hover:not(:disabled) {
    background-color: color.scale($primary-colour, $lightness: -10%);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba($primary-colour, 0.4);
  }

  &:disabled {
    background-color: $background-colour-disabled;
    color: $text-colour-disabled;
    border-color: $border-colour-subtle;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.is-loading {
    .button-loader + span {
      visibility: hidden;
    }
  }
}

.button-loader {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border: 2px solid rgba($text-colour-on-primary, 0.3);
  border-radius: $border-radius-circle;
  border-top-color: $text-colour-on-primary;
  animation: spin 1s ease-in-out infinite;
  margin-right: $spacing-extra-small;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
