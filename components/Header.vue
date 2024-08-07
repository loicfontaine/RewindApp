<template>
  <Disclosure as="header" class="bg-white shadow" v-slot="{ open }">
    <div
      class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8"
    >
      <div class="relative flex h-20 justify-between">
        <div class="relative z-10 flex px-2 lg:px-0">
          <a class="flex flex-shrink-0 items-center" href="/">
            <img class="h-16 w-auto" src="/logo.png" alt="Rewind" />
          </a>
        </div>
        <div
          class="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0 gap-6"
          v-if="servicesAuthStore.auth"
        >
          <div class="sm:max-w-xs flex">
            <label for="date" class="sr-only">Date</label>
            <input
              id="date"
              name="date"
              class="block w-full rounded-md border-0 bg-white py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="date"
              type="date"
              v-model="dateInput"
            />
          </div>

          <div class="flex-shrink-0">
            <NuxtLink
              :to="{
                name: 'dashboard-date',
                params: { date: dateInput.toString() },
              }"
            >
              <button
                type="button"
                class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
              >
                Rewind
              </button>
            </NuxtLink>
          </div>
        </div>
        <div class="relative z-10 flex items-center lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
      <nav class="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            item.current
              ? 'bg-selected text-gray-900'
              : 'text-gray-900 hover:bg-hovered hover:text-gray-900',
            'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</NuxtLink
        >
      </nav>
    </div>
  </Disclosure>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, BackwardIcon } from "@heroicons/vue/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { Disclosure, DisclosureButton } from "@headlessui/vue";
import { useServicesAuthStore } from "~/stores/servicesAuth.js";

const servicesAuthStore = useServicesAuthStore();
const route = useRoute();

const emit = defineEmits({
  // No validation
  click: null,

  // Validate submit event
  rewind: (date: Date | null) => {
    if (date) {
      return true;
    } else {
      console.warn("Invalid submit event payload!");
      return false;
    }
  },
});

const dateInput = ref<Date | string>(new Date().toISOString().split("T")[0]);

const navigation = [
  {
    name: "Home",
    href: "/",
    current: route.path === "/",
  },
  {
    name: "Settings",
    href: "/settings",
    current: route.path === "/settings",
  },
];
</script>
