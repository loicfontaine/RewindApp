<template>
  <ul role="list" class="space-y-3">
    <li
      v-for="proposal in suggestionStore.proposals"
      :key="proposal.id"
      class="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6"
      :id="proposal.id"
    >
      <TimesheetCard
        :proposal="proposal"
        :expanded="hash === `#${proposal.id}`"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useSuggestionStore } from "~/stores/suggestion";

const suggestionStore = useSuggestionStore();

const hash = ref() as Ref<string>;
onMounted(() => {
  window.addEventListener("hashchange", () => {
    hash.value = window.location.hash;
  });
});
</script>
