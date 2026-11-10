<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// El modo "popup" (ruta /popup) limita la altura de todo el HTML a 520px
watchEffect(() => {
  document.documentElement.classList.toggle('popup-mode', route.meta.popup === true)
})
</script>

<template>
  <RouterView />
</template>
