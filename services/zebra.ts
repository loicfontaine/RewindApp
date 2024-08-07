import type { ZebraActivity, ZebraActivityRaw, RoleRaw } from "~/types";
import { parseAndCountOccurence } from "~/utils/parse";
import { useAlertsStore } from "~/stores/alerts";
import { useServicesAuthStore } from "~/stores/servicesAuth";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "../app.vue";

const BASE_URL = "https://zebra.liip.ch/api/v2";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

let alertsStore: any;
let serviceAuthStore: any;

function startStore() {
  if (!alertsStore) {
    alertsStore = useAlertsStore();
  }
  if (!serviceAuthStore) {
    serviceAuthStore = useServicesAuthStore();
  }
}

export async function getAllActivity(): Promise<ZebraActivityRaw[]> {
  startStore();
  const url = `${BASE_URL}/activities?token=${serviceAuthStore.getZebraApiKey()}`;

  try {
    const response = await fetch(url, {});

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const dataArray: ZebraActivityRaw[] = Object.values(data.data.list);
    return dataArray;
  } catch (error) {
    console.error("Fetch error:", error);
    alertsStore.addAlert({
      title: "Error",
      message: "Could not fetch activities",
      type: "error",
    });
  }
  return [];
}

export async function getAllRoles(): Promise<RoleRaw[]> {
  startStore();
  const url = `${BASE_URL}/circles?type=all&token=${serviceAuthStore.getZebraApiKey()}`;

  try {
    const response = await fetch(url, {});

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const dataArray: RoleRaw[] = Object.values(data.data.list) as RoleRaw[];
    dataArray.filter((circle: RoleRaw) => circle.type === "role");
    return dataArray;
  } catch (error) {
    alertsStore.addAlert({
      title: "Error",
      message: "Could not fetch roles",
      type: "error",
    });
    console.error("Fetch error:", error);
  }
  return [];
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() retourne 0-11
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function getUserMostRecentActivity() {
  startStore();
  const allUserActivities = ref([] as any[]);
  const aMonthAgo = new Date();
  aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
  const url = `${BASE_URL}/timesheets?start_date=${formatDate(
    aMonthAgo
  )}&token=${serviceAuthStore.getZebraApiKey()}`;
  try {
    const response = await fetch(url, {});

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    allUserActivities.value = data.data.list.map((activity: any) => {
      return {
        alias: activity.occupation_alias,
        name: activity.occupation_name,
        keywords: activity.description,
      };
    });
  } catch (error) {
    console.error("Fetch error:", error);
    alertsStore.addAlert({
      title: "error",
      message: "Could not fetch user activities",
      type: "error",
    });
  }

  let topActivities = [] as ZebraActivity[];
  const totalActivities = allUserActivities.value.length;

  allUserActivities.value.forEach((activity: ZebraActivity) => {
    const currentActivity = topActivities.find(
      (topActivity) => topActivity.alias === activity.alias
    );
    if (currentActivity) {
      currentActivity.count++;
      currentActivity.keywords = `${currentActivity.keywords} ${activity.keywords}`;
    } else {
      topActivities.push({
        alias: activity.alias,
        count: 1,
        name: activity.name,
        keywords: activity.keywords,
        probability: 0,
      });
    }
  });
  topActivities.forEach((activity) => {
    activity.probability =
      Math.round((activity.count / totalActivities) * 10000) / 100;
    activity.keywords = parseAndCountOccurence(
      `${activity.keywords} ${activity.alias} ${activity.name}`
    );
  });

  topActivities.sort((a: any, b: any) => (a.count < b.count ? 1 : -1));
  return topActivities;
}

export function postTimesheet({
  project_id,
  activity_id,
  time,
  date,
  description,
  role_id,
}: {
  project_id: number;
  activity_id: number;
  time: number;
  date: string;
  description?: string;
  role_id?: number;
}) {
  const url = `${BASE_URL}/timesheets?token=${serviceAuthStore.getZebraApiKey()}`;
  const data = {
    project_id: project_id,
    activity_id: activity_id,
    time: time,
    date: date,
    role_id: role_id,
    description: description,
  };

  try {
    const response = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
