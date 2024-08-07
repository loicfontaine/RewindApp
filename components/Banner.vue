<template>
  <div
    class="flex items-center gap-x-6 bg-secondary px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
    v-if="open"
  >
    <p class="text-sm leading-6 text-white">
      <a href="https://demo-rewind.lfontaine.ch/">
        <strong class="font-semibold">Not a Liiper ?</strong
        ><svg
          viewBox="0 0 2 2"
          class="mx-2 inline h-0.5 w-0.5 fill-current"
          aria-hidden="true"
        >
          <circle cx="1" cy="1" r="1" /></svg
        >Discover the demo website<span aria-hidden="true">&rarr;</span>
      </a>
    </p>
    <div class="flex flex-1 justify-end">
      <button
        type="button"
        class="-m-3 p-3 focus-visible:outline-offset-[-4px]"
      >
        <span class="sr-only">Dismiss</span>
        <XMarkIcon
          class="h-5 w-5 text-white"
          aria-hidden="true"
          @click="open = false"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/20/solid";
import { ref } from "vue";
const open = ref(true);
</script>
