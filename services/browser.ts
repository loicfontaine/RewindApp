import type {
  BrowserInput,
  BrowserInputRaw,
  ServiceInput,
  KeywordsInput,
  Suggestion,
} from "../types";
import { parseAndCountOccurence } from "~/utils/parse";
import { parse } from "dotenv";
import parameters from "~/rewindconfig.json";

const browserInputs: BrowserInput[] = [];

async function getBrowserListBetween(
  start: Date,
  end: Date
): Promise<BrowserInputRaw[]> {
  return new Promise((resolve, reject) => {
    start.setHours(0, 0, 0, 0);

    //listen to the message to receive the browser data
    function handleMessage(event: MessageEvent) {
      if (event.source !== window || !event.data.type) {
        return;
      }

      if (event.data.type === "BROWSER_TIME") {
        window.removeEventListener("message", handleMessage);
        if (event.data.data === undefined) {
          reject(new Error("No history found."));
        } else {
          resolve(event.data.data);
        }
      }
    }

    window.addEventListener("message", handleMessage);

    // post message to request the browser data
    window.postMessage(
      {
        type: "REQUEST_BROWSER_TIME",
        payload: { startTime: start.getTime(), endTime: end.getTime() },
      },
      "*"
    );
  });
}

export async function getBrowserActivity(
  start: Date,
  end: Date
): Promise<ServiceInput[]> {
  const browserDataRaw: BrowserInputRaw[] = await getBrowserListBetween(
    start,
    end
  );

  const browserData: BrowserInput[] = browserDataRaw.map(
    (element: BrowserInputRaw) => ({
      type: "browser",
      title: element.title || "No title",
      startTime: new Date(element.startTime),
      endTime: new Date(element.endTime),
      duration: element.timeSpent,
      url: element.pageUrl,
    })
  );

  return browserData;
}

export async function getBrowserSuggestions(
  start: Date,
  end: Date
): Promise<Suggestion[]> {
  browserInputs.length = 0;

  const browserDataRaw: BrowserInputRaw[] = await getBrowserListBetween(
    start,
    end
  );
  const browserSuggestions = [] as Suggestion[];

  browserDataRaw.forEach((element: BrowserInputRaw) => {
    const activityStart = new Date(element.startTime);
    const activityEnd = new Date(element.endTime);
    browserInputs.push({
      type: "browser",
      title: element.title || "No title",
      startTime: activityStart,
      endTime: activityEnd,
      duration: element.timeSpent,
      url: element.pageUrl,
    });
  });

  //detect inactivity
  let lastInput = start as Date;
  browserInputs.forEach((element) => {
    if (
      element.startTime.getTime() - lastInput.getTime() >
      1000 * 60 * parameters.inactivityMin
    ) {
      browserSuggestions.push({
        id: `inactivity`,
        type: "inactivity",
        startTime: lastInput,
        endTime: element.startTime,
        inputs: null,
        meetingId: null,
        inputKeyWord: null,
      });
    }
    lastInput = element.endTime;
  });

  //detect meets
  let count = 0;

  const meets = browserInputs.filter((element: BrowserInput) => {
    return element.url.includes("meet.google.com");
  }) as BrowserInput[];

  const meetingSuggestions = [] as Suggestion[];

  meets.map((element: BrowserInput) => {
    const meetId = element.url.substring(24, 36);
    if (
      meetId.length === 12 &&
      meetId.substring(3, 4) === "-" &&
      meetId.substring(8, 9) === "-"
    ) {
      const meetingSuggestion = meetingSuggestions.find(
        (suggestion) => suggestion.meetingId === meetId
      );

      if (meetingSuggestion) {
        if (meetingSuggestion.startTime > element.startTime) {
          meetingSuggestion.startTime = element.startTime;
        }
        if (meetingSuggestion.endTime < element.endTime) {
          meetingSuggestion.endTime = element.endTime;
        }
      } else {
        meetingSuggestions.push({
          id: `browser-${count}`,
          type: "meeting",
          startTime: element.startTime,
          endTime: element.endTime,
          inputs: null,
          meetingId: meetId,
          inputKeyWord: null,
        });
        count++;
      }
    }
  });
  //add only meetings that are longer than the activityMin
  meetingSuggestions
    .filter(
      (element) =>
        element.endTime.getTime() - element.startTime.getTime() >
        1000 * 60 * parameters.activityMin
    )
    .forEach((element) => {
      browserSuggestions.push(element);
    });

  browserSuggestions.sort((a, b) =>
    a.startTime.getTime() > b.startTime.getTime() ? 1 : -1
  );

  //detect activity
  let lastActivityEnd = start as Date;

  browserSuggestions.forEach((element) => {
    if (
      element.startTime.getTime() - lastActivityEnd.getTime() >
      1000 * 60 * parameters.activityMin
    ) {
      browserSuggestions.push({
        id: `browser-${count}`,
        type: "activity",
        startTime: lastActivityEnd,
        endTime: element.startTime,
        meetingId: null,
        inputKeyWord: null,
        inputs: null,
      });
      count++;
    }
    if (element.endTime.getTime() > lastActivityEnd.getTime())
      lastActivityEnd = element.endTime;
  });

  browserSuggestions.sort((a, b) =>
    a.startTime.getTime() > b.startTime.getTime() ? 1 : -1
  );

  return browserSuggestions.filter((element) => element.type != "inactivity");
}

export function getBrowserInputsBetween(
  start: Date,
  end: Date,
  id: string
): { inputs: ServiceInput[]; keywords: KeywordsInput[] } {
  let words = "";
  const inputs = browserInputs.filter(
    (input) => input.startTime >= start && input.endTime <= end
  );
  inputs.forEach((input) => {
    words = `${words} ${input.url} ${input.title}`;
  });

  return {
    inputs: inputs,
    keywords: parseAndCountOccurence(
      words,
      ["http:", "https:", "www", "no", "title", "com", "ch"],
      "browser"
    ),
  };
}

export function getBrowserTitle(inputs: ServiceInput[]): string {
  if (inputs.length === 0) return "No activity";
  const inputsDisplay = inputs.slice(0, 3);
  const inputsDisplayTitle = inputsDisplay.map((input) => input.title);
  let title = `Activity: ${inputsDisplayTitle.join()} `;
  return title;
}
