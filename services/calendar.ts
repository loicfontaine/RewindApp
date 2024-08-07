import { formatRFC3339 } from "../utils/date";
import type { CalendarInput, CalendarInputRaw, ServiceInput, KeywordsInput, Suggestion } from "../types";
import { parseAndCountOccurence } from "~/utils/parse";
import parameters from "~/rewindconfig.json";


let calendarInputs: CalendarInput[] = [];



export async function listEventBetween(start: Date, end: Date): Promise<any[]> {
  let response;
  try {
    const request = {
      calendarId: "primary",
      timeMin: formatRFC3339(start),
      timeMax: formatRFC3339(end),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime",
    };
    response = await window.gapi.client.calendar.events.list(request);
  } catch (err: any) {
    console.log("GAPI error:" + (err as any).message);
    return [];
  }
  const events = response.result.items;
  if (!events || events.length == 0) {
    console.log("GAPI: No events found.");
    return [];
  }
  console.log("GAPI: Events found.", events);
  return events;
}




export async function getCalendarActivity(start: Date, end: Date): Promise<CalendarInput[]> {

  const calendarDataRaw = await listEventBetween(start, end);
  let count = 0;
  return calendarDataRaw.filter((event: CalendarInputRaw) => event.start.dateTime).map((event: CalendarInputRaw) => {
    count++;
    return {
      type: "calendar",
      title: event.summary || "No title",
      startTime: new Date(event.start.dateTime),
      endTime: new Date(event.end.dateTime),
      duration: end.getTime() - start.getTime(),
      url: event.htmlLink,
      attendees: event.attendees || null,
      description: event.description || "",
      meetsId: event.conferenceData?.conferenceId || null,
      id: `calendar-${count}`,

    };
  });
}

export function getCalendarInputsBetween(start: Date, end: Date, id: string): { inputs: ServiceInput[], keywords: KeywordsInput[] } {

  const input = calendarInputs.find((element) => element.id === id);

  if (!input) return { inputs: [], keywords: [] };
  const words = `${input.title} ${input.description}`;


  return { inputs: [input], keywords: parseAndCountOccurence(words, [], "browser") };
}


export async function getCalendarSuggestions(start: Date, end: Date
): Promise<Suggestion[]> {
  const calendarSuggestions = [] as Suggestion[];
  calendarInputs.length = 0;
  calendarInputs = await getCalendarActivity(start, end);
  calendarInputs.forEach((element) => {
    if (parameters.calendarFilter.summary.includes(element.title)) return;

    if (element.startTime.getTime() - start.getTime() > 1000 * 60 * parameters.inactivityMin) {
      calendarSuggestions.push({ id: element.id, type: 'event', startTime: element.startTime, endTime: element.endTime, inputs: [element], meetingId: element.meetsId as string, inputKeyWord: null, title: `${element.type} "${element.title}"` });

    }

  });
  console.log("calendarSuggestions", calendarSuggestions)
  return calendarSuggestions;
}



/*
export async function listEventBetween(start: Date, end: Date): Promise<any[]> {
  return data.calendarData.filter((element) => new Date(element.start.dateTime ?? "").getTime().valueOf() >= start.getTime() && new Date(element.end.dateTime ?? "").getTime().valueOf() <= end.getTime());
}
*/