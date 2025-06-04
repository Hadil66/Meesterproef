<template>
    <nav>
      <img src="/images/tauro-logo.svg" class="tauro-logo" alt="Tauro logo">
  
      <button
        class="mobile-menu-button"
        @click="toggleMobileMenu"
        aria-label="Menu openen"
        :aria-expanded="isMobileMenuOpen.toString()"
        title="Menu"
      >
        <!-- MENU ICON -->
        <svg width="40px" height="40px" viewBox="0 0 512 512" version="1.1" xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          :class="{ 'is-open': isMobileMenuOpen }">
          <g id="_x37_20-_menu__x2C__ui__x2C__user_interface__x2C_">
            <g>
              <line x1="26.7" x2="486.25" y1="105.643" y2="105.643" />
              <line x1="26.7" x2="486.25" y1="256.511" y2="256.511" />
              <line x1="26.7" x2="486.25" y1="407.312" y2="407.312" />
            </g>
          </g>
        </svg>
      </button>
  
      <!-- MOBILE MENU -->
      <ul v-if="isMobileMenuOpen" class="mobile-menu-list">
        <li v-for="(item, index) in items" :key="index" class="mobile-menu-item">
          <NuxtLink :to="item.path">{{ item.title }}</NuxtLink>
        </li>
      </ul>
  
      <!-- DeESKTOP MENU-->
      <ul class="big-menu">
        <li v-for="(item, index) in items" :key="index" class="big-menu-item" tabindex="0">
          <NuxtLink :to="'#'">{{ item.title }}</NuxtLink>        
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const items = [
    { title: 'Kantoorruimte', path: '' },
    { title: 'Werkplek', path: '/werkplek' },
    { title: 'Vergaderruimte', path: '/vergaderruimte' },
    { title: 'Locaties', path: '/locaties' },
    { title: 'Over Tauro', path: '/over-tauro' },
    { title: 'Contact', path: '/contact' }
  ];
  
  const isMobileMenuOpen = ref(false);
  
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  </script>
  
<style scoped lang="scss">
  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: $spacing * 2;
    height: $spacing-large + ($spacing * 2); 
    position: relative;

    .tauro-logo {
      height: $spacing-extra-large;
    }

    .mobile-menu-button {
      padding: math.div($spacing-extra-small, 1.6);
      height: $spacing * 4;
      width: $spacing * 4;
      border-radius: $border-radius-circle;
      background-color: rgba($gray-25, 0.75);
      border: none;
      cursor: pointer;
      align-items: center;
      justify-content: center;

      svg {
        display: block;
        overflow: visible;

        > g > g > line {
          fill: none;
          stroke: $gray-900;
          stroke-width: 13.4167;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-miterlimit: 2.6131;
          transition: transform $transition-duration ease-in-out, opacity $transition-duration ease-in-out;
          transform-origin: 256.475px 256.511px;
        }

        &.is-open {
          > g > g {
            > line:nth-of-type(1) {
              transform: rotate(45deg) translateY(125px);
            }
            > line:nth-of-type(2) {
              opacity: 0;
            }
            > line:nth-of-type(3) {
              transform: rotate(-45deg) translateY(-155px);
            }
          }
        }
      }
    }
  }

  .mobile-menu-list {
    position: absolute;
    top: calc(#{$spacing-large + $spacing * 2} - #{$spacing});
    right: $spacing * 2;
    background-color: $white;
    border: 1px solid $border-colour;
    border-radius: $border-radius;
    box-shadow: 0 4px 12px rgba($gray-900, 0.15);
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 80;
    min-width: 200px;
  }

  .mobile-menu-item {
    a {
      display: block;
      padding: ($spacing * 0.75) $spacing-medium;
      text-decoration: none;
      color: $gray-800;
      font-size: 1rem;
      border-bottom: 1px solid $border-colour-subtle;

      &:hover {
        background-color: $background-colour-alt;
      }
    }

    &:last-child {
      a {
        border-bottom: none;
      }
    }
  }

  /* DESKTOP MENU */
  .big-menu {
    background-color: rgba($gray-25, 0.75);
    display: flex;
    flex-direction: row;
    gap: $spacing;
    height: $spacing * 3;
    padding: 0 $spacing-medium;
    border-radius: 50px; 
    list-style: none;
    margin: 0;
    align-items: center;

    .big-menu-item {
      padding: 0;

      a {
        font-size: 1rem;
        text-decoration: none;
        color: $gray-800;
        padding: $spacing-extra-small ($spacing * 0.75);
        display: block;
        border-radius: math.div($border-radius, 2);

        &:hover,
        &:focus {
          color: $primary-colour;
        }
      }
    }
  }

  /* MEDIA QUERIES */
  @media (max-width: 650px) {
    nav {
      padding: $spacing * 1.5;

      .tauro-logo {
        height: $spacing-extra-large;
        margin-top: $spacing-large;
      }

      .mobile-menu-list {
        right: $spacing * 1.5;
        top: calc(#{$spacing-large + $spacing * 2} - #{$spacing * 1.5});
      }
    }
  }

  @media (max-width: 1079px) {
    nav .mobile-menu-button {
      display: flex;
    }
    .big-menu {
      display: none;
    }
  }

  @media (min-width: 1080px) {
    nav .mobile-menu-button {
      display: none;
    }

    .big-menu {
      display: flex;
    }

    nav .tauro-logo {
      height: $spacing-extra-large + ($spacing * 2);
      margin-top: $spacing * 3;
    }
  }

  @media (min-width: 1536px) {
    nav {
      width: 70vw;
      margin: 0 auto;
    }
  }
</style>
