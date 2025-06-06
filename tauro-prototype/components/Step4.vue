<template>
  <div class="step4-page-container">
    <main class="content-wrapper">
      <article v-if="lastBookingDetails" class="confirmation-card">
        <div class="custom-alert alert-success" role="alert">
          <div class="alert-content">
            <h2 class="alert-title">Reservering Succesvol!</h2>
            <p class="alert-text">{{ confirmationMessage }}</p>
          </div>
        </div>

        <section class="details-section">
          <h3 class="details-heading">Uw Reserveringsdetails</h3>
          <ul class="details-list">
            <li>
              <strong class="detail-label">Ruimte:</strong>
              <span class="detail-value">{{ lastBookingDetails.roomName }}</span>
            </li>
            <li>
              <strong class="detail-label">Datum:</strong>
              <span class="detail-value">{{ lastBookingDetails.formattedDate }}</span>
            </li>
            <li>
              <strong class="detail-label">Tijd(en):</strong>
              <span class="detail-value">{{ lastBookingDetails.times?.join(", ") }}</span>
            </li>
            <li v-if="lastBookingDetails.comment">
              <strong class="detail-label">Opmerking:</strong>
              <span class="detail-value text-wrap">{{ lastBookingDetails.comment }}</span>
            </li>
          </ul>
        </section>

        <div class="actions-section">
          <button
            class="custom-btn btn-primary btn-large"
            @click="handleNewReservation"
          >
            Nieuwe Reservering Maken
          </button>
        </div>
      </article>
      <div v-else class="custom-alert alert-info" role="alert">
        Geen bevestigingsdetails beschikbaar of er is een fout opgetreden.
      </div>
    </main>
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
.step4-page-container {
  display: flex;
  justify-content: center;
  padding: $spacing-medium 0;
}

.content-wrapper {
  width: 100%;
  max-width: 768px;
  padding: 0 $spacing;

  @media (min-width: 960px) {
    max-width: 66.66%;
  }
  @media (min-width: 1280px) {
    max-width: 58.33%;
  }
}

.confirmation-card {
  @include card-style();

  @media (min-width: 768px) {
    padding: $spacing-medium;
  }
}

.custom-alert {
  @include message-box(
    $padding: $spacing, 
    $bg-color: $background-colour-subtle, 
    $text-color: $text-colour-muted,      
    $border: 1px solid $border-colour-subtle, 
    $radius: math.div($border-radius, 2),    
    $align: left                             
  );

  display: flex;
  align-items: flex-start;
  margin-bottom: $spacing-medium;

  .alert-content {
    flex-grow: 1; 
  }

  .alert-title {
    font-size: $font-size-large * 0.8;
    font-weight: $bold;
    margin-bottom: $spacing-extra-small;
  }

  .alert-text {
    font-size: $font-size-small;
    line-height: 1.5;
  }

  &.alert-success {
    background-color: #ecf8d5;
    color: $gray-900;
    border-color: #c5d7a1; 
  }

  &.alert-info {
    background-color: $info-colour-light; 
    color: $text-colour-emphasis;
    border-color: $primary-colour; 
  }
}

.details-section {
  margin-bottom: $spacing-medium;

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

    .detail-label {
      font-weight: $bold;
      margin-right: $spacing-extra-small;
      color: $text-colour-emphasis;
      flex-shrink: 0;
    }

    .detail-value {
      color: $text-colour;
      flex-grow: 1;
      word-break: break-word;
    }
  }
}

.actions-section {
  text-align: center;
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