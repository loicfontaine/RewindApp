import { ref } from "vue";
import { detectZebraActivities } from "./zebraActivity";
import { getDurationHours } from "../utils/date";
import type { Suggestion } from "../types";
import { getInputsBetween } from "./main";
import { useSuggestionStore } from "@/stores/suggestion";
import { createPinia, storeToRefs } from "pinia";
import { createApp } from "vue";
import App from "../app.vue";
import parameters from "../rewindconfig.json";


interface TypePriority {
    [key: string]: number;
}

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

export function getProposals(suggestions: Suggestion[]): Suggestion[] {
    const { lastIdUserModified } = storeToRefs(useSuggestionStore());
    const proposals = ref([] as Suggestion[]);
    console.log("suggestions", suggestions);
    proposals.value = suggestions.filter((suggestion) => {
        //pas très propre mais pas trouvé mieux
        const index = proposals.value.findIndex(
            (element) => element.id === suggestion.id
        );
        return index === -1 || index === proposals.value.indexOf(suggestion);

    }).map((suggestion: Suggestion) => ({
        ...suggestion,
        startTime: new Date(suggestion.startTime),
        endTime: new Date(suggestion.endTime),
    }));

    proposals.value = proposals.value
        .filter((suggestion) => {
            // regarde les type priority et s'il y'a un chevauchement de temps avec un autre suggestion de type priority plus élevé alors change le temps de la suggestion la moins élevée
            let toReturn = true;
            const priority = (parameters.typePriority as TypePriority)[suggestion.type];

            proposals.value.forEach((otherSuggestion) => {
                const priorityDiff = (parameters.typePriority as TypePriority)[otherSuggestion.type] - priority; // if other has higher priority
                let userModificationsPriority = {
                    start: 0,
                    end: 0,
                };



                const indexSuggestion = {
                    start: lastIdUserModified.value.findIndex(
                        (element) =>
                            element.id === suggestion.id && element.time === "startTime"
                    ),
                    end: lastIdUserModified.value.findIndex(
                        (element) =>
                            element.id === suggestion.id && element.time === "endTime"
                    ),
                };
                const indexOtherSuggestion = {
                    start: lastIdUserModified.value.findIndex(
                        (element) =>
                            element.id === otherSuggestion.id &&
                            element.time === "startTime"
                    ),
                    end: lastIdUserModified.value.findIndex(
                        (element) =>
                            element.id === otherSuggestion.id && element.time === "endTime"
                    ),
                };

                if (indexSuggestion.start > -1)
                    userModificationsPriority.start = 100 + indexSuggestion.start;
                if (indexSuggestion.end > -1)
                    userModificationsPriority.end = 100 + indexSuggestion.end;

                if (indexOtherSuggestion.start > -1) {
                    userModificationsPriority.start = 100 + indexOtherSuggestion.start;
                }

                if (indexOtherSuggestion.end > -1) {
                    userModificationsPriority.end = 100 + indexOtherSuggestion.end;
                }

                const userModificationsPriorityDiff = userModificationsPriority.start - userModificationsPriority.end;



                if (
                    otherSuggestion.startTime <= suggestion.startTime &&
                    otherSuggestion.endTime >= suggestion.endTime && otherSuggestion.id !== suggestion.id
                ) {
                    //suggestion est dans otherSuggestion
                    if (priorityDiff > 0) {
                        //suggestion à la priorité
                        //Afficher les deux mais enlever la durée de la suggestion intérieur
                        toReturn = false;
                    } else {
                        toReturn = false;
                    }
                }

                //start chevauche

                else if (
                    otherSuggestion.startTime < suggestion.startTime &&
                    otherSuggestion.endTime > suggestion.startTime
                ) {

                    if (
                        (priorityDiff > 0 && userModificationsPriority.end === 0 && userModificationsPriorityDiff < 0) ||
                        userModificationsPriority.start > userModificationsPriority.end
                    ) {
                        //suggestion à la priorité
                        otherSuggestion.endTime = suggestion.startTime;
                    } else if (priorityDiff < 0 || userModificationsPriority.end < userModificationsPriority.start) {
                        //otherSuggestion à la priorité
                        suggestion.startTime = otherSuggestion.endTime;
                    }
                    //si égalité de priorité alors priorité à l'intérieur de la suggestion
                    else if (otherSuggestion.startTime < suggestion.startTime) {
                        suggestion.startTime = otherSuggestion.endTime;
                    } else {
                        otherSuggestion.startTime = suggestion.endTime;
                    }
                }
            });

            return toReturn;
        })
        .filter(
            (suggestion) =>
                suggestion.endTime.getTime() - suggestion.startTime.getTime() >
                1000 * 60 * parameters.inactivityMin
        )
        .map((element: Suggestion) => {
            const res = getInputsBetween(element, element.id);
            const zebraActivity = detectZebraActivities(res.keyWords);
            return {
                ...element,
                inputs: res.inputs,
                ...(zebraActivity[0] && {
                    activity_selected: {
                        name: zebraActivity[0].name,
                        alias: zebraActivity[0].alias,
                    },
                }),
                duration: getDurationHours(element.startTime, element.endTime),
                inputKeyWord: res.keyWords,
                ZebraActivity: zebraActivity,
                title: element.title || `Activity: ${res.keyWords[0].words}, ${res.keyWords[1].words}, ${res.keyWords[2].words}`,
            }; // faire que les inputs du calendrier soit envoyés
        })
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return proposals.value;
}

