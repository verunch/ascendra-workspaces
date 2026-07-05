export interface Policy {
  id: string;
  name: string;
  maxVmsPerUser: number;
  idleTimeoutMinutes: number; // auto-stop after this much idle time
  allowedTemplateIds: string[];
  appliesToTeam?: string;
  createdAt: string;
}
