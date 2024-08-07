import { createPinia } from "pinia";
import {
  getBrowserSuggestions,
  getBrowserInputsBetween,
} from "../services/browser";
import {
  getCalendarSuggestions,
  getCalendarInputsBetween,
} from "../services/calendar";
import type { Suggestion, ServiceInput, KeywordsInput } from "../types";
import type { Ref } from "vue";
import { ref, computed } from "vue";
import { detectZebraActivities } from "./zebraActivity";
import { useAlertsStore } from "@/stores/alerts";

import { createApp } from "vue";
import App from "../app.vue";
import { useActivityStore } from "@/stores/activity.js";
import { useRoleStore } from "@/stores/role.js";
import { useSuggestionStore } from "~/stores/suggestion";
import { getProposals } from "./proposals";
import { loadGapiAndGisScripts } from "~/services/gapiService";


const pinia = createPinia();
const app = createApp(App);
app.use(pinia);



export const services = [
  {
    name: "browser",
    getSuggestions: getBrowserSuggestions,
    getInputsBetween: getCalendarInputsBetween,
  },
  {
    name: "calendar",
    getSuggestions: getCalendarSuggestions,
    getInputsBetween: getBrowserInputsBetween,

  },

  //{ name: 'anotherService', getActivity: getAnotherServiceActivity },
];

export function getInputsBetween(suggestion: Suggestion, suggestionId: string) {
  const start = suggestion.startTime;
  const end = suggestion.endTime;

  const inputs = [] as ServiceInput[];
  const keyWords = [] as KeywordsInput[];

  services.forEach((service) => {
    const res = service.getInputsBetween(start, end, suggestionId);
    inputs.push(...res.inputs);
    keyWords.push(...res.keywords);
  });
  return { inputs: inputs, keyWords: keyWords };
}

let alertsStore: any;

let activityStore: any;
let roleStore: any;
let suggestionStore: any;

export async function getSuggestions(
  start: Date, end: Date): Promise<Ref<Suggestion[]>> {

  alertsStore = useAlertsStore();
  activityStore = useActivityStore();
  roleStore = useRoleStore();
  suggestionStore = useSuggestionStore();

  if (roleStore.roles.length === 0) {
    roleStore.fetch();
  }

  if (activityStore.activities.length === 0) {
    activityStore.fetch();
  }

  //loop with service to get inputs and put in one array
  suggestionStore.fetch(start, end);

  watch(
    suggestionStore.suggestions,
    () => {
      suggestionStore.proposals.length = 0;

      suggestionStore.proposals.push(
        ...getProposals(suggestionStore.suggestions)
      );

      console.log("proposals", suggestionStore.proposals);
    },
    { deep: true }
  );

  return suggestionStore.proposals;
}
