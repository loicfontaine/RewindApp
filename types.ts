export interface ServiceInput {
  type: string;
  title: string;
  url: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  meetsId?: string | null;
  description?: string;
}





export interface BrowserInput extends ServiceInput {

}

export interface ZebraActivityRaw {
  id: number;
  name: string;
  description: string;
  project_id: number;
  budget: number;
  is_active: boolean;
  is_capped: boolean;
  alias: string;
  hourly_rate: number;
  is_bodyleasing: boolean;
  role_needed: boolean;
  budget_threshold: number;
  service_activity_id: number;
  view_timesheet_permission: number;
  project_name: string;
  circle_id: number;
}



export interface CalendarInput extends ServiceInput {
  description: string;
  attendees: Attendee[] | null;
  meetsId: string | null;
  id: string;
}

export interface CalendarInputRaw {
  summary: string;
  description: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  attendees: Attendee[] | null;
  htmlLink: string;
  conferenceData: {
    conferenceId: string;
  };

}

export interface BrowserInputRaw {
  title: string;
  pageUrl: string;
  timeSpent: number;
  startTime: number;
  endTime: number;
}

export interface Suggestion {
  title?: string;
  id: string;
  type: string;
  startTime: Date;
  endTime: Date;
  inputs: ServiceInput[] | null;
  meetingId: string | null;
  inputKeyWord: KeywordsInput[] | null;
  ZebraActivity?: ZebraActivity[] | null;
  duration?: number;
  role?: string;
}

export interface Service {
  name: string;
  getSuggestions: (start: Date, end: Date,) => Promise<Suggestion[]>;
  getInputsBetween: (start: Date, end: Date, id: string) => { inputs: ServiceInput[], keywords: KeywordsInput[] };
  data: ServiceInput[];
  priority: number;
}

export interface ZebraActivity {
  alias: string;
  count: number;
  probability: number;
  name: string;
  keywords: KeywordsInput[] | string;
}

export interface KeywordsInput {
  words: string;
  count: number;
  percent: number;
  type: string;

}



interface Attendee {
  email: string;
  displayName?: string;
  responseStatus: string;
  self: boolean;
  resource?: boolean;
}


export interface RoleRaw {

  id: number;
  parent_id: number;
  name: string;
  full_name: string;
  type: string;
  status: string;
  holaspirit_role_id: string;
  holaspirit_circle_id: string | null;
  holaspirit_remove_date: string | null;
  created_at: string;
  archived_at: string | null;
  google_group: string | null;
  google_group_sync: boolean;
  google_group_core_members_only: boolean;
  slack_channel: string | null;
  role_type_id: number;
  role_type_comment: string | null;
  float_sync: string | null;
  float_tag: string | null;
  assignments: {
    user_id: string;
    start_date: string;
    core_member: string;
    focus: string;
    recommended_fte: string | null;
  }[];
  planned_fte: string | null;
  recommendation_date: string | null;
  recommended_fte: string | null;
  recommended_chargeability: string | null;
  tech_radar_id: string | null;
  tech_radar_archived: string | null;
  role_type_name: string;
  tech_radar_active: boolean;

}

export interface Timesheet extends Suggestion {
  activity_selected?: {
    name: string;
    alias: string;
    id?: number;
  };
  description?: string;
  role_selected?: {
    name: string;
    id?: number;
  };
  completed?: boolean;
}

export interface ZebraActivityItem extends ZebraActivityRaw {
  display_name: string;
}
export interface RoleItem extends RoleRaw {
  display_name: string;
  alias?: string;
}