<
<template>
  <div class="flex h-full flex-col">
    <div class="isolate flex flex-auto overflow-hidden bg-white">
      <div class="flex flex-auto flex-col overflow-auto">
        <div
          ref="containerNav"
          class="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
        >
          <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
            <span>W</span>
            <span
              class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
              >19</span
            >
          </button>
          <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
            <span>T</span>
            <span
              class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-primary"
              >20</span
            >
          </button>
          <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
            <span>F</span>
            <span
              class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
              >21</span
            >
          </button>
          <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
            <span>S</span>
            <span
              class="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-base font-semibold text-white"
              >22</span
            >
          </button>
          <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
            <span>S</span>
            <span
              class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
              >23</span
            >
          </button>
          <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
            <span>M</span>
            <span
              class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
              >24</span
            >
          </button>
          <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
            <span>T</span>
            <span
              class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
              >25</span
            >
          </button>
        </div>
        <div class="flex w-full flex-auto">
          <div class="w-14 flex-none bg-white ring-1 ring-gray-100" />
          <div class="grid flex-auto grid-cols-1 grid-rows-1">
            <!-- Horizontal lines -->
            <div
              class="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
              style="grid-template-rows: repeat(48, minmax(3.5rem, 1fr))"
            >
              <div ref="containerOffset" class="row-end-1 h-7"></div>
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  00:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  01:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  02:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  03:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  04:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  05:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  06:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  07:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  08:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  09:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  10:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  11:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  12:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  13:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  14:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  15:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  16:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  17:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  18:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  19:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  20:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  21:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  22:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  23:00
                </div>
              </div>
              <div />
            </div>
            <!-- Events -->
            <ol
              class="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
              style="
                grid-template-rows: 1.75rem repeat(288, minmax(0, 1fr)) auto;
              "
            >
              <li
                v-for="event in props.events"
                :key="event.id"
                class="relative mt-px"
                :style="{
                  gridRow: getGridRow(event.startTime, event.endTime),
                }"
              >
                <a
                  :href="`#${event.id}`"
                  :class="`absolute inset-1 overflow-y-auto rounded-lg ${getColor(
                    event.id
                  )} p-2 text-xs leading-5 flex flex-col  content-start flex-wrap gap-x-4`"
                >
                  <p class="font-semibold text-blue-700 w-fit">
                    {{ event.title }}
                  </p>

                  <div class="text-blue-700 group-hover:text-blue-700 w-fit">
                    <p v-if="event.ZebraActivity && event.ZebraActivity[0]">
                      {{
                        `${event.ZebraActivity[0].name} (${event.ZebraActivity[0].alias})`
                      }}
                    </p>
                    <p v-else>No activity found</p>
                  </div>

                  <p class="text-blue-500 group-hover:text-blue-700">
                    <time :datetime="event.startTime.toISOString()">
                      {{ event.startTime.getHours() }}:{{
                        event.startTime.getMinutes().toString().padStart(2, "0")
                      }}
                    </time>
                  </p>
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { Suggestion } from "~/types";

const container = ref<HTMLElement | null>(null);
const containerNav = ref<HTMLElement | null>(null);
const containerOffset = ref<HTMLElement | null>(null);
//1h = 12,2

const props = defineProps<{
  events: Suggestion[];
}>();

const hash = ref() as Ref<string>;

function getColor(id: string): string {
  let color = "bg-selected hover:bg-blue-100";
  if (hash.value === `#${id}`) {
    color = "bg-blue-200";
  }

  return color;
}

function getGridRow(startTime: Date, endTime: Date): string {
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();

  const startRow = startHour * 12 + startMinutes * 0.2 + 2;

  const durationInMinutes = (endTime.getTime() - startTime.getTime()) / 60000;
  const spanRows = Math.floor(durationInMinutes * 0.2);

  if (spanRows === 0) {
    return `${Math.round(startRow)} / span 1`;
  }
  return `${Math.round(startRow)} / span ${spanRows}`;
}

onMounted(() => {
  window.addEventListener("hashchange", () => {
    hash.value = window.location.hash;
  });
});
</script>
