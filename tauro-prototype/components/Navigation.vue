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
          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="_x37_20-_menu__x2C__ui__x2C__user_interface__x2C_">
            <g>
              <line style="fill:none;stroke:#000000;stroke-width:13.4167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2.6131;" x1="26.7" x2="486.25" y1="105.643" y2="105.643" />
              <line style="fill:none;stroke:#000000;stroke-width:13.4167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2.6131;" x1="26.7" x2="486.25" y1="256.511" y2="256.511" />
              <line style="fill:none;stroke:#000000;stroke-width:13.4167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2.6131;" x1="26.7" x2="486.25" y1="407.312" y2="407.312" />
            </g>
          </g>
          <g id="Layer_1" />
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
          <NuxtLink :to="item.path">{{ item.title }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const items = [
    { title: 'Kantoorruimte', path: '/kantoorruimte' },
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
    padding: 2em;
    height: 7em;
    position: relative;
  
    .tauro-logo {
      z-index: 24;
      height: 15em;
      margin-top: -1em;
    }
  
    .mobile-menu-button {
      padding: 5px;
      height: 4em;
      width: 4em;
      border-radius: 50%;
      background-color: rgba(249, 248, 246, 0.75);
      border: none;
      cursor: pointer;
      z-index: 82;
      display: flex; 
      align-items: center;
      justify-content: center;
  
      svg {
        display: block;
      }
    }
  
    .mobile-menu-list {
      position: absolute;
      top: calc(7em - 1em);
      right: 2em;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      list-style: none;
      padding: 0;
      margin: 0;
      z-index: 80;
      min-width: 200px;
    }
  
    .mobile-menu-item {
      a {
        display: block;
        padding: 12px 20px;
        text-decoration: none;
        color: #333;
        font-size: 16px;
        border-bottom: 1px solid #eee;
  
        &:hover {
          background-color: #f9f8f6;

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
      background-color: rgba(249, 248, 246, 0.75);
      display: flex;
      flex-direction: row;
      gap: 15px;
      height: 3em;
      padding: 0 20px;
      border-radius: 50px;
      list-style: none;
      margin: 0;
      align-items: center;
  
      .big-menu-item {
        padding: 0;
  
        a {
          font-size: 16px;
          text-decoration: none;
          color: #333;
          padding: 8px 12px;
          display: block;
          border-radius: 4px;
  
          &:hover,
          &:focus-within {
            background-color: rgba(0,0,0,0.05);
          }
        }
      }
    }
  
    /* MEDIA QUERIES */
    @media (max-width: 650px) {
      nav{
        padding: 1.5em; 
      }
      
  
      .tauro-logo {
        height: 10em;
      }
      .mobile-menu-list {
        right: 1.5em;
        top: calc(7em - 1.5em);
      }
    }
  
    @media (max-width: 1079px) {
      .mobile-menu-button {
        display: flex; 
      }
      .big-menu {
        display: none; 
     }
    }
  
    @media (min-width: 1080px) {
      .mobile-menu-button {
        display: none; 
      }
      .big-menu {
        display: flex; 
      }
    }
  
    @media (min-width: 1536px) {
      nav {
        width: 70vw;
        margin: 0 auto;
      }
    }
  }
  </style>