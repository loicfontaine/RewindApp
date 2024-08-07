<template>
  <TransitionRoot :show="open" as="template" @after-leave="query = ''" appear>
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
          class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"
        />
      </TransitionChild>

      <div
        class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
          >
            <Combobox @update:modelValue="onSelect">
              <div class="relative">
                <MagnifyingGlassIcon
                  class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <ComboboxInput
                  class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  @change="query = $event.target.value"
                  @blur="query = ''"
                />
              </div>

              <ComboboxOptions
                v-if="filteredItems.length > 0"
                static
                class="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
              >
                <ComboboxOption
                  v-for="item in filteredItems"
                  :key="item.id"
                  :value="item"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'cursor-default select-none px-4 py-2',
                      active && 'bg-primary text-white',
                    ]"
                  >
                    {{ item.display_name }}
                  </li>
                </ComboboxOption>
              </ComboboxOptions>

              <p
                v-if="query !== '' && filteredItems.length === 0"
                class="p-4 text-sm text-gray-500"
              >
                {{ `No ${props.item} found.` }}
              </p>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useActivityStore } from "~/stores/activity";
import type { RoleItem, ZebraActivityItem } from "~/types";
import { useRoleStore } from "~/stores/role";

const props = defineProps<{
  item: "role" | "activity";
}>();

let items = ref([] as ZebraActivityItem[] | RoleItem[]);

const activityStore = useActivityStore();
const roleStore = useRoleStore();

if (props.item === "activity") {
  items.value = activityStore.activities.map((activity) => {
    return {
      ...activity,
      display_name: activity.alias
        ? `${activity.name} (${activity.alias})`
        : activity.name,
    };
  });
} else if (props.item === "role") {
  items.value = roleStore.roles.map((role) => {
    return {
      ...role,
      display_name: role.full_name,
    };
  });
}

const open = ref(true);
const query = ref("");

const filteredItems = computed(() => {
  if (query.value.trim() === "") {
    return [];
  }

  const queryWords = query.value.toLowerCase().split(" ").filter(Boolean);

  return items.value
    .filter((item) => {
      const itemWords = item.display_name.toLowerCase().split(" ");
      return queryWords.every((qWord) =>
        itemWords.some((iWord) => iWord.includes(qWord))
      );
    })
    .slice(0, 10);
});

const emit = defineEmits({
  click: null,
  select({ item, type }) {
    return { item, type };
  },
});

function onSelect(item: ZebraActivityItem | RoleItem) {
  if (item) {
    emit("select", { item: item, type: props.item });
  }
}
</script>
