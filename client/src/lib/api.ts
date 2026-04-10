const API_BASE = '/api';

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  totalTokensUsed: number;
  totalCostUsd: number;
  totalLinesAccepted: number;
  totalLinesGenerated: number;
  activeLoopAlerts: number;
  priorArtSearches: number;
  overallVibeScore: number;
  potentialBurnUsd: number;
  actualSpendUsd: number;
  savingsRatePct: number;
  loopsCaught: number;
  priorArtMatches: number;
}

export interface VibeScoreData {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    acceptanceRate: number;
    acceptanceBonus: number;
    costEfficiency: number;
    efficiencyBonus: number;
    loopPenalty: number;
  };
  trend: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  totalTokensUsed: number;
  totalCostUsd: number;
  linesGenerated: number;
  linesAccepted: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreditLog {
  id: string;
  projectId?: string;
  provider: 'claude' | 'openai' | 'replit' | 'gemini' | 'other';
  featureName: string;
  tokensUsed: number;
  costUsd: number;
  linesGenerated: number;
  linesAccepted: number;
  notes?: string;
  createdAt: number;
}

export interface LoopEvent {
  id: string;
  projectId?: string;
  similarity: number;
  sequenceA: string;
  sequenceB: string;
  status: 'open' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: number;
}

export interface SignalResponse {
  signal: 'CLEAR' | 'CAUTION' | 'HALT';
  reason: string;
  budgetRemainingUsd: number;
  budgetRemainingPct: number;
  etaToLimitMinutes: number | null;
  activeAlerts: string[];
  recommendation: string;
  timestamp: number;
}

export interface SignalConfig {
  id: number;
  dailyBudgetUsd: number;
  monthlyBudgetUsd: number;
  warningThresholdPct: number;
  haltThresholdPct: number;
  velocityWindowMinutes: number;
  velocityMultiplierWarning: number;
  velocityMultiplierHalt: number;
  loopHaltEnabled: number;
  emailAlertEnabled: number;
  emailAddress?: string;
  webhookUrl?: string;
  updatedAt: number;
}

export interface LeaderboardEntry {
  rank: number;
  projectName: string;
  vibeScore: number;
  grade: string;
  savingsUsd: number;
  totalSpendUsd: number;
  acceptanceRatePct: number;
  totalTokens: number;
}

async function fetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Dashboard
export const dashboard = {
  getSummary: () => fetchJson<DashboardSummary>('/dashboard/summary'),
  getVibeScore: () => fetchJson<VibeScoreData>('/dashboard/vibe-score'),
  getActivity: () => fetchJson<any[]>('/dashboard/activity'),
  getCreditBreakdown: () => fetchJson<any[]>('/dashboard/credit-breakdown'),
};

// Projects
export const projects = {
  list: () => fetchJson<Project[]>('/projects'),
  get: (id: string) => fetchJson<Project>(`/projects/${id}`),
  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'totalTokensUsed' | 'totalCostUsd' | 'linesGenerated' | 'linesAccepted'>) =>
    fetchJson<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Project>) =>
    fetchJson<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<{ success: boolean }>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// Credit Logs
export const creditLogs = {
  list: (projectId?: string) => {
    const query = projectId ? `?projectId=${projectId}` : '';
    return fetchJson<CreditLog[]>(`/credit-logs${query}`);
  },
  create: (data: Omit<CreditLog, 'id' | 'createdAt'>) =>
    fetchJson<CreditLog>('/credit-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchJson<{ success: boolean }>(`/credit-logs/${id}`, {
      method: 'DELETE',
    }),
};

// Loop Detector
export const loopDetector = {
  analyze: (sequenceA: string, sequenceB: string, projectId?: string) =>
    fetchJson<any>('/loop-detector/analyze', {
      method: 'POST',
      body: JSON.stringify({ sequenceA, sequenceB, projectId }),
    }),
  listEvents: () => fetchJson<LoopEvent[]>('/loop-detector/events'),
  updateEvent: (id: string, status: 'open' | 'closed') =>
    fetchJson<LoopEvent>(`/loop-detector/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Prior Art
export const priorArt = {
  search: (query: string, strictMode = false) =>
    fetchJson<any>('/prior-art/search', {
      method: 'POST',
      body: JSON.stringify({ query, strictMode }),
    }),
  getCache: () => fetchJson<any[]>('/prior-art/cache'),
};

// Signal Bus
export const signal = {
  check: (token: string = 'default') =>
    fetchJson<SignalResponse>(`/signal/${token}`),
  getConfig: () => fetchJson<SignalConfig>('/signal/config'),
  updateConfig: (data: Partial<SignalConfig>) =>
    fetchJson<SignalConfig>('/signal/config', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Leaderboard
export const leaderboard = {
  list: () => fetchJson<LeaderboardEntry[]>('/leaderboard'),
};
