import { UserEntry } from "./user-entry.model";
import { ReviewEntry } from "./review-entry.model";

export type ReportTarget =
  | { type: 'user'; data: UserEntry }
  | { type: 'review'; data: ReviewEntry };
