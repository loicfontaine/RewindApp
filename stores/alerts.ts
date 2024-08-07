import { defineStore } from "pinia";
import { ref } from "vue";

interface Alert {
    id?: number;
    title: string;
    message: string;
    type: "success" | "error" | "info";
    button?: { text: string; action: () => void };
}

export const useAlertsStore = defineStore("alerts", () => {
    const alerts = ref([] as Alert[]);
    const count = ref(0);

    function addAlert({
        title,
        message,
        type,
        button,
        displayTime,
    }: {
        title: string;
        message: string;
        type: "success" | "error" | "info";
        button?: { text: string; action: () => void };
        displayTime?: number;
    }): number {
        alerts.value.push({ id: count.value++, title, message, type, button });

        if (displayTime) {
            setTimeout(() => {
                dismiss(count.value - 1);
            }, displayTime);
        }
        return count.value;
    }

    function dismiss(id: number) {
        alerts.value.splice(
            alerts.value.findIndex((alert) => alert.id === id),
            1
        );
    }
    function dismissFirst() {
        if (alerts.value[0].id) {
            dismiss(alerts.value[0].id);
        } else {
            console.error("No alerts to dismiss");
        }
    }

    return {
        alerts,
        addAlert,
        dismiss,
        dismissFirst,
    };
});
