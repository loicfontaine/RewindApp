<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-20 m-20"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="alertsFiltered.length > 0"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon
                  class="h-6 w-6 text-green-400"
                  aria-hidden="true"
                  v-if="alertsFiltered[0].type === 'success'"
                />
                <InformationCircleIcon
                  class="h-6 w-6 text-blue-400"
                  aria-hidden="true"
                  v-else
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ alertsFiltered[0].title }}
                </p>

                <p class="mt-1 text-sm text-gray-500">
                  {{ alertsFiltered[0].message }}
                </p>
                <button
                  type="button"
                  class="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  v-if="alertsFiltered[0].button"
                  @click="action"
                >
                  {{ alertsFiltered[0].button.text }}
                </button>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  @click="alertsStore.dismiss(alerts[0].id)"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon, InformationCircleIcon } from "@heroicons/vue/20/solid";
import { useAlertsStore } from "@/stores/alerts";

const alertsStore = useAlertsStore();
const { alerts } = storeToRefs(alertsStore);

const alertsFiltered = computed(() =>
  alerts.value.filter(
    (alert) => alert.type === "info" || alert.type === "success"
  )
);

function action() {
  alertsFiltered.value[0].button.action();
  alertsStore.dismiss(alertsFiltered.value[0].id);
}
</script>
