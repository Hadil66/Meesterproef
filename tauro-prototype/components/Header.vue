<template>
    <div class="header">
      <Navigation /> 
      <img
        src="/images/tauro_header.webp"
        class="header-image"
        alt="Mensen in een kantoorruimte"
      >
    </div>
  </template>
  
  <style scoped lang="scss">
  .header {
    position: relative;
  
  .header-image {
    max-height: 35em;
    width: 97vw;
    border-radius: $border-radius;
    margin: calc(-1 * (#{$spacing-large} + #{$spacing})) auto $spacing auto;
    display: block;
    object-fit: cover;
    z-index: 1; 
  }

  @media (min-width: 1536px) {
    .header-image {
      width: 70vw;
    }
  }
}
  </style>