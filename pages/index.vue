<template>
  <div class="bg-white">
    <!-- Header -->
    <Header />
    <main class="isolate">
      <!-- Hero section -->
      <div class="relative">
        <div
          class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        ></div>
        <div class="py-60">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
              <h1
                class="text-4xl font-normal tracking-tight text-gray-900 sm:text-6xl leading-tight"
              >
                Keep it Lazy, <span class="font-bold">Rewind</span> handles your
                timesheet
              </h1>
              <p class="mt-6 text-lg leading-8 text-gray-600">
                Rewind is a proof of concept to help Liip's collaborators with
                their timesheeting.
              </p>

              <div class="mt-10 flex items-center justify-center gap-x-6">
                <input
                  type="date"
                  name="date"
                  id="date"
                  v-model="dateInput"
                  class="block w-fit px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />

                <NuxtLink
                  :to="
                    servicesAuthStore.auth
                      ? {
                          name: 'dashboard-date',
                          params: { date: dateInput.toString() },
                        }
                      : 'settings'
                  "
                  @click="goToDashboard"
                  class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                >
                  Rewind
                </NuxtLink>

                <div
                  class="text-sm font-semibold leading-6 text-gray-900 cursor-pointer hover:text-secondary"
                  @click="launchTutorial"
                >
                  Tutorial <span aria-hidden="true">→</span>
                </div>
              </div>
            </div>
            <div class="mt-16 flow-root sm:mt-24"></div>
          </div>
        </div>
      </div>
      <!-- Timesheets section -->
      <a id="how-to">
        <div class="overflow-hidden bg-white pb-24 sm:pb-32">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div
              class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
            >
              <div class="lg:ml-auto lg:pl-4 lg:pt-4">
                <div class="lg:max-w-lg">
                  <h2 class="text-base font-semibold leading-7 text-primary">
                    Presentation
                  </h2>
                  <p
                    class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                  >
                    Timesheet proposal section
                  </p>
                  <p class="mt-6 text-lg leading-8 text-gray-600">
                    The timesheet section is a proposal of your timesheet. When
                    selected, you can see and correct the timesheet. You can
                    decide to delete one or more entries. New proposals will
                    then appear.
                  </p>
                  <dl
                    class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"
                  >
                    <div
                      v-for="feature in timesheetsFeatures"
                      :key="feature.name"
                      class="relative pl-9"
                    >
                      <dt class="inline font-semibold text-gray-900">
                        <component
                          :is="feature.icon"
                          class="absolute left-1 top-1 h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                        {{ feature.name }}
                      </dt>
                      {{ " " }}
                      <dd class="inline">{{ feature.description }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div class="flex items-start justify-end lg:order-first">
                <img
                  src="/proposal-timesheet.png"
                  alt="Product screenshot"
                  class="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
                  width="2432"
                  height="1442"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Calendar section -->
        <div class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div
              class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
            >
              <div class="lg:pr-8 lg:pt-4">
                <div class="lg:max-w-lg">
                  <h2 class="text-base font-semibold leading-7 text-primary">
                    Presentation
                  </h2>
                  <p
                    class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                  >
                    Calendar section
                  </p>
                  <p class="mt-6 text-lg leading-8 text-gray-600">
                    Both Calendar and Timesheets proposal sections display the
                    same informations. The calendar section is a visual
                    representation of your day of work. You can see your
                    meetings, your breaks and your work time.
                  </p>
                  <dl
                    class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"
                  >
                    <div
                      v-for="feature in calendarFeatures"
                      :key="feature.name"
                      class="relative pl-9"
                    >
                      <dt class="inline font-semibold text-gray-900">
                        <component
                          :is="feature.icon"
                          class="absolute left-1 top-1 h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                        {{ feature.name }}
                      </dt>
                      {{ " " }}
                      <dd class="inline">{{ feature.description }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <img
                src="/app.png"
                alt="Product screenshot"
                class="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                width="2432"
                height="1442"
              />
            </div>
          </div>
        </div>
      </a>
      <!-- Feature  section -->
      <div class="mx-auto max-w-7xl px-6 sm:mt-56 lg:px-8 mb-32">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-primary">
            How does it works ?
          </h2>
          <p
            class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Save time, privately
          </p>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Rewind will connect to different services you're using while working
            (for now Google Calendar, Firefox & Chrome). On the other hand,
            Rewind will get informations on your last month of timesheeting.
            Based on this information Rewind suggests a TimeSheet. Correct it
            and send it to Zebra !
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl
            class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
          >
            <div
              v-for="feature in features"
              :key="feature.name"
              class="relative pl-16"
            >
              <dt class="text-base font-semibold leading-7 text-gray-900">
                <div
                  class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary"
                >
                  <component
                    :is="feature.icon"
                    class="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                {{ feature.name }}
              </dt>
              <dd class="mt-2 text-base leading-7 text-gray-600">
                {{ feature.description }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

import {
  CalendarIcon,
  CheckCircleIcon,
  TagIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CodeBracketSquareIcon,
  PuzzlePieceIcon,
  GlobeAltIcon,
} from "@heroicons/vue/24/outline";

import { useAlertsStore } from "~/stores/alerts";
import { useServicesAuthStore } from "~/stores/servicesAuth";

const alertStore = useAlertsStore();
const servicesAuthStore = useServicesAuthStore();

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];
const features = [
  {
    name: "Browser extension",
    description:
      "One of our main source of data is your browser history. We only use it to know which website you've visited and how long you've been on it. All data is only stored and processed on your computer.",
    icon: GlobeAltIcon,
  },
  {
    name: "Services",
    description:
      "On your settings page you can grant us access to different services (for now Google Calendar). The more services you grant us access to, the more accurate your timesheet will be. For each services, we only get the informations needed and they are stored nowhere just processed.",
    icon: PuzzlePieceIcon,
  },
  {
    name: "Algorithm",
    description:
      "The algorithm is based on your last month of timesheeting. It will get all the activites you worked on and descriptions. We then gather the informations from the services you granted us access and compare them to Zebra informations to propose you a timesheet.",
    icon: CodeBracketSquareIcon,
  },
];

const calendarFeatures = [
  {
    name: "Visual representation",
    description:
      "Easily see what you've done during your day. Meetings, breaks and work time.",
    icon: CalendarIcon,
  },
  {
    name: "Selectable",
    description:
      "Select the event your want to see the details. It will be displayed in the timesheet section.",
    icon: CheckCircleIcon,
  },
];

const timesheetsFeatures = [
  {
    name: "Activity",
    description:
      "Rewind will propose you up to 5 Zebra activities for each event. You can select the one you want to keep or change it completely.",
    icon: BriefcaseIcon,
  },
  {
    name: "Role",
    description:
      "For now we don't propose the role of the activity. You'll have to select it yourself. We are working on it.",
    icon: UserGroupIcon,
  },
  {
    name: "Keywords trigger",
    description:
      "The keywords trigger are some keywords that will help you to find what you've done in this time range. They are compared to your last month of timesheeting. The bold ones are the one that matched with an activity of your last month.",
    icon: TagIcon,
  },
];

const dateInput = ref("2024-06-20");

function launchTutorial() {
  alertStore.addAlert({
    type: "info",
    title: "1. Zebra access",
    message:
      "First you need to give us you Zebra credentials. Don't forget to add path for activities, roles and timesheet.",
    button: {
      text: "Next",
      action: () => {
        alertStore.dismissFirst();
      },
    },
  });

  alertStore.addAlert({
    type: "info",
    title: "2. Browser extension",
    message:
      "Then you can download the browser extension. It will help us to know which website you've visited and how long you've been on it.",
    button: {
      text: "Next",
      action: () => {},
    },
  });

  alertStore.addAlert({
    type: "info",
    title: "3. extension installed",
    message:
      "Now that you installed it. We will be able to provide you a timesheet based on your browser activity.",
    button: {
      text: "Next",
      action: () => {},
    },
  });

  alertStore.addAlert({
    type: "success",
    title: "4. Read how it works",
    message:
      "You are all set. You can now read how Rewind works. Next step will be to Rewind your timesheet. At that moment you will have to sign in with Google.",
    button: {
      text: "Read about it",
      action: () => {
        navigateTo("/#how-to");
      },
    },
  });

  navigateTo("settings");
}

function goToDashboard() {
  if (!servicesAuthStore.auth) {
    alertStore.addAlert({
      type: "info",
      title: "Not logged in",
      message: "You need to to log these informations before using Rewind.",
      displayTime: 5000,
    });
  }
}
</script>
