<template>
  <div class="px-4 py-2 m-2 w-1/2">
    <h2 class="font-bold mb-2">Calendar</h2>
    <div
      class="rounded-lg bg-white shadow overflow-y-auto max-h-full"
      ref="calendarContainer"
    >
      <Calendar :events="suggestionStore.proposals" />
    </div>
  </div>
  <div class="px-4 py-2 m-2 w-1/2 relative">
    <h2 class="font-bold mb-2">Timesheets proposal</h2>
    <div class="overflow-y-auto h-5/6 p-1">
      <Timesheets :suggestions="suggestionStore.proposals" />
    </div>
    <div
      class="w-full bg-white-100 shadow-lg rounded-lg p-8 flex flex-row justify-around bottom-0"
    >
      <div>
        <label class="block text-sm font-medium leading-6 text-gray-900">
          Timesheeted
        </label>
        <p>{{ getFormattedDurationFromMs(timesheetedTime) }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium leading-6 text-gray-900">
          Total worked
        </label>
        <p>{{ getFormattedDurationFromMs(totalworked) }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium leading-6 text-gray-900">
          Difference
        </label>
        <p>{{ getFormattedDurationFromMs(difference) }}</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        @click="sendToZebra"
      >
        <CheckCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Send to Zebra
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { getSuggestions } from "../../algorithms/main";
import type { Suggestion } from "../../types";
import { getFormattedDurationFromMs } from "../../utils/date";
import { useSuggestionStore } from "@/stores/suggestion";
import { CheckCircleIcon } from "@heroicons/vue/20/solid";
import { useRoute } from "vue-router";
import { useServicesAuthStore } from "~/stores/servicesAuth.js";

const suggestionStore = useSuggestionStore();
const route = useRoute();
const servicesAuthStore = useServicesAuthStore();

const calendarContainer = ref<HTMLElement | null>(null);
let oldDate: string | string[] = "";

const date = ref(route.params.date);
console.log("date parameters", date.value);

const totalworked = computed(() => {
  return suggestionStore.proposals.reduce((acc, suggestion) => {
    return acc + suggestion.endTime.getTime() - suggestion.startTime.getTime();
  }, 0);
});

const timesheetedTime = computed(() => {
  //count the total duration of all suggestions in ms
  return suggestionStore.proposals.reduce((acc, suggestion) => {
    return acc + (suggestion.duration ?? 0) * 3600000;
  }, 0);
});
const difference = computed(() => {
  return totalworked.value - timesheetedTime.value;
});

function sendToZebra() {
  suggestionStore.verifyTimsheet = true;
  suggestionStore.pushToZebra();
}

watch(
  () => servicesAuthStore.googleAuth,
  () => {
    console.log("calendarRdy", servicesAuthStore.calendarRdy);
    console.log("gisLoaded", servicesAuthStore.gisLoaded);
    console.log("gitLoaded", servicesAuthStore.gapiLoaded);
    console.log("zebraRdy", servicesAuthStore.zebraRdy);
    console.log("googleAuth", servicesAuthStore.googleAuth);
  }
);

onMounted(() => {
  console.log("mounted");
  if (calendarContainer.value) {
    calendarContainer.value.scrollTop = 1000;
    if (servicesAuthStore.auth) {
      suggestionStore.date = date.value as string;
      getSuggestions(
        new Date(`${date.value} 00:00:00`),
        new Date(`${date.value} 23:59:59`)
      );
    }
  }

  watch(
    () => servicesAuthStore.auth,
    async (auth) => {
      if (auth) {
        console.log("UNO");
        suggestionStore.date = date.value as string;
        await getSuggestions(
          new Date(`${date.value} 00:00:00`),
          new Date(`${date.value} 23:59:59`)
        );
      }
    }
  );
});
</script>
