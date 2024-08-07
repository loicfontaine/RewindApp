<template>
  <div class="rounded-md bg-red-50 p-4" v-if="alertsFiltered.length > 0">
    <div class="flex justify-center">
      <div class="flex-shrink-0">
        <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ alertsFiltered[0].title }}
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ alertsFiltered[0].message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/20/solid";

import { useAlertsStore } from "@/stores/alerts";

const alertsStore = useAlertsStore();
const { alerts } = storeToRefs(alertsStore);

const alertsFiltered = computed(() =>
  alerts.value.filter((alert) => alert.type === "error")
);
</script>
