<template>
  <div class="step4-container">
    <section v-if="lastBookingDetails" class="confirmation-card">
      <h2 class="confirmation-title">Reservering Succesvol!</h2>
      <p class="confirmation-message" role="status">
        {{ confirmationMessage }}
      </p>

      <div class="details-section">
        <h3 class="details-heading">Uw Reserveringsdetails</h3>
        <ul class="details-list">
          <li>
            <strong>Ruimte:</strong>
            <span>{{ lastBookingDetails.roomName }}</span>
          </li>
          <li>
            <strong>Datum:</strong>
            <span>{{ lastBookingDetails.formattedDate }}</span>
          </li>
          <li>
            <strong>Tijd(en):</strong>
            <span>{{ lastBookingDetails.times?.join(", ") }}</span>
          </li>
          <li v-if="lastBookingDetails.comment">
            <strong>Opmerking:</strong>
            <span class="text-wrap">{{ lastBookingDetails.comment }}</span>
          </li>
        </ul>
      </div>

      <button
        class="custom-btn btn-primary btn-large"
        @click="handleNewReservation"
      >
        Nieuwe Reservering Maken
      </button>
    </section>

    <div v-else class="info-alert" role="alert">
      Geen bevestigingsdetails beschikbaar of er is een fout opgetreden.
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  lastBookingDetails: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["new-reservation-requested"]);

const confirmationMessage = computed(() => {
  if (!props.lastBookingDetails) {
    return "";
  }
  return "Uw reservering is succesvol verwerkt en opgeslagen.";
});

const handleNewReservation = () => {
  emit("new-reservation-requested");
};
</script>

<style lang="scss" scoped>
.step4-container {
  display: flex;
  justify-content: center;
  padding: $spacing-medium 0;
  width: 100%;
}

.confirmation-card {
  @include card-style();
  width: 100%;
  max-width: 768px;
  padding: $spacing-medium;
  text-align: center;
}

.confirmation-title {
  font-size: $font-size-large;
  font-weight: $bold;
  margin-bottom: $spacing-extra-small;
}

.confirmation-message {
  font-size: $font-size-small;
  line-height: 1.5;
  background-color: #ecf8d5;
  color: $gray-900;
  border: 1px solid #c5d7a1;
  border-radius: math.div($border-radius, 2);
  padding: $spacing-extra-small $spacing;
  margin-bottom: $spacing-medium;
  display: inline-block;
  text-align: center;
}

.info-alert {
  @include message-box(
    $padding: $spacing,
    $bg-color: $info-colour-light,
    $text-color: $text-colour-emphasis,
    $border: 1px solid $primary-colour,
    $radius: math.div($border-radius, 2),
    $align: center
  );
  max-width: 768px;
}

.details-section {
  margin-bottom: $spacing-large;
  text-align: left;

  .details-heading {
    font-size: $font-size-large * 0.9;
    font-weight: $bold;
    margin-bottom: $spacing;
    color: $text-colour-emphasis;
  }
}

.details-list {
  @include list-reset;

  li {
    display: flex;
    padding: $spacing-extra-small 0;
    font-size: $font-size-small;
    color: $text-colour;
    border-bottom: 1px solid $border-colour-subtle;

    &:last-child {
      border-bottom: none;
    }

    strong {
      font-weight: $bold;
      margin-right: $spacing-extra-small;
      color: $text-colour-emphasis;
      flex-shrink: 0;
    }

    span {
      color: $text-colour;
      flex-grow: 1;
      word-break: break-word;

      &.text-wrap {
        white-space: pre-wrap;
      }
    }
  }
}

.custom-btn {
  display: inline-block;
  padding: ($spacing-extra-small) ($spacing);
  font-size: $font-size-small;
  font-weight: $bold;
  border-radius: math.div($border-radius, 2);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color $transition-duration ease,
    border-color $transition-duration ease, color $transition-duration ease;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;

  &.btn-primary {
    background-color: $primary-colour;
    color: $text-colour;
    border-color: $primary-colour;

    &:hover {
      background-color: color.scale($primary-colour, $lightness: -10%);
      border-color: color.scale($primary-colour, $lightness: -10%);
    }
  }

  &.btn-large {
    padding: ($spacing * 0.8) ($spacing * 1.5);
    font-size: $font-size-small * 1.1;
  }
}
</style>
