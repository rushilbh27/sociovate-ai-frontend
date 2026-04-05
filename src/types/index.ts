// Call log from /api/logs
export interface CallLog {
  id: number
  phone_number: string
  caller_name?: string
  duration_seconds: number
  summary?: string
  sentiment?: string
  lead_score?: string
  disposition?: string
  was_booked?: boolean
  recording_url?: string
  room_name?: string
  estimated_cost_inr?: number
  tts_chars?: number
  created_at: string
}

// Campaign
export interface Campaign {
  id: string
  name: string
  status: "draft" | "running" | "paused" | "completed" | "cancelled"
  client_name?: string
  context?: string
  first_line?: string
  objective?: string
  agent_instructions?: string
  total_contacts: number
  called_count: number
  completed_count: number
  concurrency: number
  created_at: string
  updated_at: string
}

// Campaign contact
export interface CampaignContact {
  id: string
  phone: string
  name?: string
  status: "pending" | "calling" | "completed" | "failed" | "skipped"
  lead_score?: string
  disposition?: string
  sentiment?: string
  summary?: string
  duration_seconds?: number
  variables?: Record<string, string>
  called_at?: string
  completed_at?: string
}

// Campaign progress
export interface CampaignProgress {
  total: number
  pending: number
  calling: number
  completed: number
  failed: number
  skipped: number
  by_lead_score: Record<string, number>
  by_disposition: Record<string, number>
}

// Tenant
export interface Tenant {
  id: string
  tenant_id: string
  api_key: string
  name: string
  is_active: boolean
  config?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Phone number mapping
export interface PhoneNumber {
  id: string
  phone: string
  phone_number: string
  tenant_id: string
  tenant_name?: string
  label?: string
  direction: "inbound" | "outbound" | "both"
  is_active: boolean
  created_at: string
}

// Stats from /api/stats
export interface CallStats {
  total_calls: number
  total_bookings: number
  avg_duration: number
  booking_rate: number
}

// Transcript line
export interface TranscriptLine {
  role: "user" | "assistant"
  content: string
  created_at: string
}

// Agent config
export interface AgentConfig {
  agent_name?: string
  company_name?: string
  client_name?: string
  service_name?: string
  objective?: string
  first_line?: string
  voicemail_message?: string
  context?: string
  context_block?: string
  system_prompt?: string
  agent_instructions?: string
  language?: string
  business_hours?: Record<string, [string, string] | null>
  tts_voice?: string
  tts_language?: string
  llm_provider?: string
  llm_model?: string
  llm_temperature?: number
  llm_max_tokens?: number
  transfer_number?: string
  webhook_url?: string
  custom_post_call_url?: string
  custom_action_webhook_url?: string
  [key: string]: unknown
}
