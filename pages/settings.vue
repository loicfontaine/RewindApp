<template>
  <div class="mx-auto max-w-7xl w-full lg:flex lg:gap-x-16 lg:px-8">
    <h1 class="sr-only">General Settings</h1>

    <aside
      class="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20"
    >
      <nav class="flex-none px-4 sm:px-6 lg:px-0">
        <ul
          role="list"
          class="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
        >
          <li v-for="item in secondaryNavigation" :key="item.name">
            <a
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-gray-50 text-primary'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary',
                'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  item.current
                    ? 'text-primary'
                    : 'text-gray-400 group-hover:text-primary',
                  'h-6 w-6 shrink-0',
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div
        class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"
      >
        <div>
          <h2 class="text-base font-semibold leading-7 text-gray-900">
            Integrations
          </h2>
          <p class="mt-1 text-sm leading-6 text-gray-500">
            Connect applications to your account.
          </p>

          <ul
            role="list"
            class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            <li class="flex justify-between gap-x-6 py-6">
              <div class="font-medium text-gray-900">Zebra</div>
              <div
                class="w-1/2"
                v-if="!servicesAuthStore.zebraApiKey || updatezebraApiKey"
              >
                <label
                  for="zebra-api-key"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >API key</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="zebra-api-key"
                    placeholder="Your API key"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                    v-model="servicesAuthStore.zebraApiKey"
                    @blur="
                      servicesAuthStore.setZebraApiKey();
                      updatezebraApiKey = false;
                    "
                  />
                </div>
              </div>
              <button
                v-else
                type="button"
                class="font-semibold text-primary hover:text-indigo-500"
                @click="updatezebraApiKey = true"
              >
                Update
              </button>
            </li>

            <li class="flex justify-between gap-x-6 py-6">
              <div class="font-medium text-gray-900">Browser</div>
              <div>
                <a
                  href="Firefox_extension.xpi"
                  class="font-semibold text-primary hover:text-indigo-500"
                >
                  Firefox
                </a>
                <a
                  href="Chrome_extension.zip"
                  download="Chrome_extension.zip"
                  class="font-semibold text-primary hover:text-indigo-500 pl-5"
                >
                  Chrome
                </a>
              </div>
            </li>
            <li class="flex justify-between gap-x-6 py-6">
              <div class="font-medium text-gray-900">Calendar</div>
              <GoogleSignIn />
            </li>
          </ul>

          <div class="flex border-t border-gray-100 pt-6"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { KeyIcon, TagIcon } from "@heroicons/vue/20/solid";

import { useServicesAuthStore } from "~/stores/servicesAuth";

const servicesAuthStore = useServicesAuthStore();

const secondaryNavigation = [
  { name: "Services", href: "#", icon: KeyIcon, current: true },
  { name: "Rules", href: "#", icon: TagIcon, current: false },
];
const updatezebraApiKey = ref(false);
</script>
