import { defineStore } from "pinia";
import { getAllRoles } from "~/services/zebra";
import type { RoleRaw } from "~/types";
import { useAlertsStore } from "~/stores/alerts";

export const useRoleStore = defineStore("role", () => {
    const roles = ref([] as RoleRaw[]);
    const alertsStore = useAlertsStore();

    async function fetch() {
        roles.value = await getAllRoles();
        if (roles.value.length === 0) {
            alertsStore.addAlert({
                title: "Can't access Zebra roles",
                message: `Error has occured while fetching zebra roles`,
                type: "error",
            });
        }
    }

    function getFromName(name: string): RoleRaw | undefined {
        return roles.value.find((role) => role.name === name);
    }

    return {
        roles,
        fetch,
        getFromName,
    };
});
