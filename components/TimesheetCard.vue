<template>
  <SearchBar
    :item="itemType"
    v-if="isSearchBarActive"
    @close="isSearchBarActive = false"
    @select="itemSelected"
  ></SearchBar>

  <div v-if="expanded">
    <div
      class="rounded-md bg-red-50 p-2"
      v-if="alerts && suggestionStore.verifyTimsheet"
    >
      <div class="flex justify-center">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ alerts }}
          </h3>
        </div>
      </div>
    </div>
    <div class="grid-cols-3 grid gap-4 p-4 relative">
      <div class="absolute right-0 h-full flex justify-between flex-col py-8">
        <TrashIcon
          @click="suggestionStore.remove(proposal.id)"
          class="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer"
          aria-hidden="true"
        />
        <ChevronUpIcon
          class="h-8 w-8 text-gray-600 cursor-pointer p-1 rounded-md hover:bg-hovered"
          aria-hidden="true"
          @click="changeHash('')"
        />
      </div>
      <div>
        <div
          class="block text-sm font-medium leading-6 text-gray-900 cursor-pointer"
          @click="activeSearchBar('activity')"
        >
          Zebra activity <span class="font-light text-xs">Not listed ?</span>
        </div>
        <p v-if="zebraActivitySearched">{{ zebraActivitySearched }}</p>
        <p
          v-else-if="
            proposal.ZebraActivity && proposal.ZebraActivity.length > 0
          "
          v-for="zebraActivity in proposal.ZebraActivity.filter((activity: ZebraActivity, index: number) => index < 3)"
          @click="zebraActivitySelected = zebraActivity"
          :class="`${getZebraSelectedStyle(zebraActivity)}`"
        >
          {{
            `${zebraActivity.probability.toFixed(2)}% ${zebraActivity.name} (${
              zebraActivity.alias
            })`
          }}
        </p>
        <p v-else>-</p>
      </div>
      <div>
        <div
          class="block text-sm font-medium leading-6 text-gray-900 cursor-pointer"
          @click="activeSearchBar('role')"
        >
          Role
          <span class="font-light text-xs">Not listed ?</span>
        </div>
        <p v-if="roleSearched">{{ roleSearched }}</p>
        <p v-else>-</p>
      </div>
      <div>
        <div class="block text-sm font-medium leading-6 text-gray-900">
          Duration
        </div>
        <div>
          <input
            type="time"
            :value="getFormattedHours(proposal.startTime)"
            @blur="suggestionStore.updateTime(proposal.id, 'startTime', $event)"
            class="rounded-md hover:bg-hovered p-1"
          />
          <span> - </span>
          <input
            type="time"
            :value="getFormattedHours(proposal.endTime)"
            @blur="suggestionStore.updateTime(proposal.id, 'endTime', $event)"
            class="rounded-md hover:bg-hovered p-1"
          />
          <p>({{ proposal.duration }})</p>
        </div>
      </div>

      <div>
        <div
          for="comment"
          class="block text-sm font-medium leading-6 text-gray-900"
        >
          Description
        </div>
        <div class="mt-2">
          <textarea
            rows="4"
            name="comment"
            id="comment"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            v-model="descriptionRef"
          />
        </div>
      </div>
      <div class="col-span-2">
        <div class="block text-sm font-medium leading-6 text-gray-900">
          Keywords trigger
        </div>
        <div class="flex flex-row flex-wrap">
          <div
            v-for="keyword in inputKeywordDisplay"
            :class="`w-fit
            p-1
            rounded-md
            px-3
            m-1
            ${getKeywordStyle(keyword)}
            `"
          >
            {{ `${keyword.words} (${keyword.percent.toFixed(2)}%)` }}
          </div>
          <div
            class="font-light p-1 m-1 cursor-pointer hover:bg-hovered rounded-md hover:text-primary"
            v-if="
              proposal.inputKeyWord &&
              proposal.inputKeyWord.length >
                parameters.timesheetCard.minNbKeywords &&
              !seeMoreKeywords
            "
            @click="seeMoreKeywords = true"
          >
            Voir plus
          </div>
          <div
            v-else
            class="font-light p-1 m-1 cursor-pointer hover:bg-hovered rounded-md hover:text-primary"
            @click="seeMoreKeywords = false"
          >
            Voir moins
          </div>
        </div>
      </div>
    </div>
  </div>
  <a
    v-else
    :href="`#${proposal.id}`"
    class="cursor-pointer"
    @mouseover="hovered = true"
    @mouseout="hovered = false"
  >
    <div
      class="rounded-md bg-red-50 p-2"
      v-if="alerts && suggestionStore.verifyTimsheet"
    >
      <div class="flex justify-center">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ alerts }}
          </h3>
        </div>
      </div>
    </div>
    <div class="grid-cols-3 grid gap-4 p-4 relative">
      <div class="absolute right-0 h-full flex justify-center flex-col py-4">
        <TrashIcon
          @click="suggestionStore.remove(proposal.id)"
          :class="`h-6 w-6 text-gray-600 hover:text-red-500 ${
            hovered ? 'visible' : 'invisible'
          }`"
          aria-hidden="true"
        />
      </div>
      <div>
        <div class="block text-sm font-medium leading-6 text-gray-900">
          Zebra activity
        </div>
        <p v-if="zebraActivitySearched">{{ zebraActivitySearched }}</p>
        <p
          v-else-if="
            proposal.ZebraActivity && proposal.ZebraActivity.length > 0
          "
        >
          {{
            zebraActivitySelected
              ? `${zebraActivitySelected.name} (${zebraActivitySelected.alias})`
              : "-"
          }}
        </p>
        <p v-else>-</p>
      </div>
      <div>
        <div class="block text-sm font-medium leading-6 text-gray-900">
          Role
        </div>
        <p v-if="roleSearched">{{ roleSearched }}</p>
        <p v-else>{{ `-` }}</p>
      </div>
      <div>
        <div class="block text-sm font-medium leading-6 text-gray-900">
          Duration
        </div>
        <p>
          {{
            `${getFormattedHours(proposal.startTime)} - ${getFormattedHours(
              proposal.endTime
            )} (${proposal.duration ?? 0})`
          }}
        </p>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type {
  KeywordsInput,
  RoleItem,
  ZebraActivity,
  ZebraActivityItem,
  Timesheet,
} from "../types";
import { TrashIcon, ChevronUpIcon, XCircleIcon } from "@heroicons/vue/24/solid";
import { useSuggestionStore } from "../stores/suggestion";
import parameters from "../rewindconfig.json";

const suggestionStore = useSuggestionStore();
const itemType = ref("role" as "role" | "activity");

const isSearchBarActive = ref(false);
const props = defineProps<{
  proposal: Timesheet;
  expanded: boolean;
}>();
const hovered = ref(false);
const seeMoreKeywords = ref(false);
const descriptionRef = ref();
const zebraActivitySelected = ref(props.proposal.ZebraActivity?.[0]);
const timesheetValidated = ref(false);

function getZebraSelectedStyle(zebraActivity: ZebraActivity) {
  return zebraActivitySelected.value?.alias === zebraActivity.alias
    ? "font-semibold rounded-md text-primary "
    : "font-normal cursor-pointer hover:bg-hovered";
}

const alerts = computed(() => {
  const valueMissing = [] as string[];
  if (!props.proposal.activity_selected) {
    valueMissing.push("Activity");
  }
  if (!props.proposal.role_selected) {
    valueMissing.push("Role");
  }
  if (valueMissing.length > 0) {
    props.proposal.completed = false;
    return `Please select missing informations: ${valueMissing.join(", ")}`;
  } else {
    props.proposal.completed = true;
  }
});

watch(
  () => zebraActivitySelected.value,
  (value) => {
    if (value) {
      props.proposal.activity_selected = {
        name: value.name,
        alias: value.alias,
      };
    }
  }
);

function activeSearchBar(item: "role" | "activity") {
  isSearchBarActive.value = true;
  itemType.value = item;
}
function getKeywordStyle(keyword: KeywordsInput) {
  let toReturn = "text-gray-700 bg-hovered";
  if (!zebraActivitySelected.value) {
    return toReturn;
  }
  if (
    Array.isArray(zebraActivitySelected.value.keywords) &&
    zebraActivitySelected.value.keywords.length > 0
  ) {
    zebraActivitySelected.value.keywords.forEach((Zebrakeyword) => {
      if (Zebrakeyword.words === keyword.words) {
        toReturn = "font-semibold text-primary bg-selected";
      }
    });
  }
  return toReturn;
}

const inputKeywordDisplay = computed(() => {
  return (
    props.proposal.inputKeyWord?.filter((keyword, index) =>
      seeMoreKeywords.value
        ? index < 20
        : index < parameters.timesheetCard.minNbKeywords
    ) || []
  );
});

function changeHash(hash: string) {
  window.location.hash = hash;
}
const zebraActivitySearched = ref("");
const roleSearched = ref("");

function itemSelected({
  item,
  type,
}: {
  item: ZebraActivityItem | RoleItem;
  type: string;
}) {
  if (type === "activity") {
    zebraActivitySearched.value = item.display_name;
    props.proposal.activity_selected = {
      name: item.name,
      alias: item.alias ?? "",
      id: item.id,
    };
  } else if (type === "role") {
    roleSearched.value = item.display_name;
    props.proposal.role_selected = { name: item.name, id: item.id };
  }
  isSearchBarActive.value = false;
}
</script>
