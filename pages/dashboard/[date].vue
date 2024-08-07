<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckIcon
                    class="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Timesheet successfully pushed</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Your timesheet has been successfully sent to Zebra. You
                      can now go back to the dashboard.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6">
                <NuxtLink to="/">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="open = false"
                  >
                    Go back to home
                  </button>
                </NuxtLink>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
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
import { getFormattedDurationFromMs } from "../../utils/date";
import { useSuggestionStore } from "@/stores/suggestion";
import { CheckCircleIcon } from "@heroicons/vue/20/solid";
import { useRoute } from "vue-router";
import { useServicesAuthStore } from "~/stores/servicesAuth.js";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/outline";

const open = ref(false);

const suggestionStore = useSuggestionStore();
const route = useRoute();
const servicesAuthStore = useServicesAuthStore();

const calendarContainer = ref<HTMLElement | null>(null);

const date = ref(route.params.date);

const totalworked = computed(() => {
  return suggestionStore.proposals.reduce((acc, suggestion) => {
    return acc + suggestion.endTime.getTime() - suggestion.startTime.getTime();
  }, 0);
});

const timesheetedTime = computed(() => {
  return suggestionStore.proposals.reduce((acc, suggestion) => {
    return acc + (suggestion.duration ?? 0) * 3600000;
  }, 0);
});
const difference = computed(() => {
  return totalworked.value - timesheetedTime.value;
});

function sendToZebra() {
  suggestionStore.verifyTimsheet = true;
  if (suggestionStore.differenceTimesheeted === 0) {
    open.value = true;
  }
  suggestionStore.pushToZebra();
}

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
