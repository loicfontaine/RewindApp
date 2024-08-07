import { defineStore } from "pinia";
import { getAllActivity } from "~/services/zebra";
import type { ZebraActivityRaw } from "~/types";

export const useActivityStore = defineStore("activity", () => {
    const activities = ref([] as ZebraActivityRaw[]);

    async function fetch() {
        activities.value = await getAllActivity();
    }

    function getFromName(name: string): ZebraActivityRaw | undefined {
        return activities.value.find((activity) => activity.name === name);
    }

    return {
        activities,
        fetch,
        getFromName,
    };
});
