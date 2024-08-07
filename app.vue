<template>
  <NuxtPage v-if="route.path === '/'" />
  <div class="flex flex-col h-screen" v-else>
    <div class="max-h-1/6">
      <Header />
      <ErrorAlert></ErrorAlert>
      <NotifUndo></NotifUndo>
    </div>
    <div class="h-5/6 my-auto flex px-20 pb-20">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadGapiAndGisScripts } from "./services/gapiService";

const route = useRoute();
loadGapiAndGisScripts();
</script>
