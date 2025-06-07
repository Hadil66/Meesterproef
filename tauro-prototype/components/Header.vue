<template>
  <header>
    <a href="#main-content" class="skip-link">
      Sla hoofdmenu over en ga naar de hoofdinhoud
    </a>
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
    />
  </header>
</template>

<style scoped lang="scss">
.skip-link {
  position: absolute;
  top: 10px;
  left: -9999px; 
  z-index: 9999; 
  padding: 1em;
  background-color: $primary-colour;
  color: $text-colour;
  text-decoration: none;
  font-weight: $bold;
  border-radius: $border-radius;
  
  &:focus {
    left: 10px;
  }
}

header {
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