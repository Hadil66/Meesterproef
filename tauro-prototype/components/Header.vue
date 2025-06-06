<template>
  <div class="header">
    <Navigation />
    <NuxtImg
      src="/images/tauro-header.webp"
      class="header-image"
      alt="Mensen in een kantoorruimte"
      fetchpriority="high"
      sizes="sm:97vw md:97vw lg:70vw"
      width="1920"
      height="600"
      format="webp"
      quality="80"
    />
  </div>
</template>

<style scoped lang="scss">
.header {
  position: relative;

  .header-image {
    max-height: 10em;
    width: 97vw;
    border-radius: $border-radius;
    margin: calc(-1 * (#{$spacing-large} + #{$spacing})) auto $spacing auto;
    display: block;
    object-fit: cover;
    z-index: 1;

    @media (min-width: 650px) {
      max-height: 20em;
    }

    @media (min-width: 1080px) {
      max-height: 35em;
    }
    
    @media (min-width: 1536px) {
      width: 70vw;
    }
  }
}
</style>