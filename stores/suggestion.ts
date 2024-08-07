import { defineStore } from "pinia";

import type { Suggestion, Timesheet } from "~/types";
import { ref, computed } from "vue";
import { services } from "~/algorithms/main";
import { useAlertsStore } from "~/stores/alerts";
import { useRoleStore } from "~/stores/role";
import { useActivityStore } from "~/stores/activity";
import { postTimesheet } from "~/services/zebra";

export const useSuggestionStore = defineStore("suggestion", () => {
    const suggestions = ref([] as Suggestion[]);
    const alertsStore = useAlertsStore();
    const activityStore = useActivityStore();
    const lastSuggestionRemoved = ref(null as Suggestion | null);
    const verifyTimsheet = ref(false);
    const lastIdUserModified = ref(
        [] as { id: string; time: "startTime" | "endTime" }[]
    );
    const date = ref("" as string);
    const differenceTimesheeted = computed(() => {
        return proposals.value.length - timesheets.value.length;
    });

    const proposals = ref([] as Suggestion[]);

    const timesheets = computed(() => {
        return proposals.value.filter(
            (element: Timesheet) => element.completed === true
        );
    });

    function fetch(start: Date, end: Date) {
        lastIdUserModified.value.splice(0);

        suggestions.value.length = 0;

        services.forEach(async (service) => {
            suggestions.value.push(...(await service.getSuggestions(start, end)));
        });
    }

    function remove(id: string) {
        const index = suggestions.value.findIndex(
            (element: Suggestion) => element.id === id
        );
        alertsStore.addAlert({
            title: "Proposal removed",
            message: `${suggestions.value[index].title} has successfully beeen deleted`,
            type: "info",
            button: { text: "Undo", action: undoRemove },
            displayTime: 5000,
        });
        lastSuggestionRemoved.value = suggestions.value[index];
        suggestions.value.splice(index, 1);
    }

    function undoRemove() {
        if (lastSuggestionRemoved.value) {
            suggestions.value.push(lastSuggestionRemoved.value);
            alertsStore.addAlert({
                title: "Proposal restored",
                message: `${lastSuggestionRemoved.value.title} has successfully beeen restored`,
                type: "success",
                button: { text: "Undo", action: undoRemove },
                displayTime: 5000,
            });
            lastSuggestionRemoved.value = null;
        }
    }

    function updateTime(
        id: string,
        timeType: "startTime" | "endTime",
        event: Event
    ) {
        const newValue = (event.target as HTMLInputElement).value;
        const [hours, minutes] = newValue.split(":").map(Number);

        const suggestionFind = suggestions.value.find(
            (element: Suggestion) => element.id === id
        );

        if (
            suggestionFind &&
            !(
                suggestionFind[timeType].getHours() === hours &&
                suggestionFind[timeType].getMinutes() === minutes
            )
        ) {
            const timeBeforeChange = suggestionFind[timeType];
            const updatedTime = new Date(suggestionFind[timeType]);
            updatedTime.setHours(hours);
            updatedTime.setMinutes(minutes);

            suggestionFind[timeType] = updatedTime;
            const index = lastIdUserModified.value.findIndex(
                (element: { id: string; time: "startTime" | "endTime" }) =>
                    element.id === suggestionFind.id && element.time === timeType
            );
            if (index > -1) {
                lastIdUserModified.value.splice(index, 1);
            }
            lastIdUserModified.value.push({ id: suggestionFind.id, time: timeType });
            alertsStore.addAlert({
                type: "success",
                title: "Time updated",
                message: `You've successfully updated time to ${newValue}`,
                displayTime: 5000,
                button: {
                    text: "undo",
                    action: () => {
                        suggestionFind[timeType] = timeBeforeChange;
                        alertsStore.addAlert({
                            type: "success",
                            title: "Modification cancelled",
                            message: "Your last time update has been cancelled.",
                            displayTime: 5000,
                        });
                    },
                },
            });
        }
    }

    function pushToZebra() {
        if (differenceTimesheeted.value === 0) {
            alertsStore.alerts = alertsStore.alerts.filter(
                (element: any) => element.title !== "Timesheet not validated"
            );
            navigateTo("/");
            timesheets.value.forEach((timesheet: Timesheet) => {
                sendToZebra(timesheet);
            });
            alertsStore.alerts.push({
                type: "success",
                title: "Timesheet validated",
                message: `All proposals have been validated and sent to Zebra`,
            });
        } else {
            alertsStore.addAlert({
                title: "Timesheet not validated",
                message: `You have ${differenceTimesheeted.value} proposals that are not validated`,
                type: "error",
            });
        }
    }

    function sendToZebra(timesheet: Timesheet) {
        const activity = timesheet.activity_selected
            ? activityStore.getFromName(timesheet.activity_selected.name)
            : null;
        const role_id = timesheet.role_selected?.id;
        const project_id = activity?.project_id;
        const activity_id = activity?.id;
        const date = timesheet.startTime.toISOString().split("T")[0];
        const time = timesheet.duration;
        const description = timesheet.description;

        if (role_id && project_id && activity_id && date && time && description) {
            postTimesheet({
                project_id,
                activity_id,
                time,
                date,
                description,
                role_id,
            });
        } else {
            alertsStore.addAlert({
                title: "Timesheet not validated",
                message: `You have ${timesheets.value.length} proposals that are not validated`,
                type: "error",
            });
        }
    }

    return {
        suggestions,
        timesheets,
        remove,
        fetch,
        undoRemove,
        proposals,
        updateTime,
        verifyTimsheet,
        pushToZebra,
        lastIdUserModified,
        date,
        differenceTimesheeted,
    };
});
