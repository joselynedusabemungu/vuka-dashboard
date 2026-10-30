"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ID_KEY = "userId";

function getStoredValue(key) {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return getStoredValue(ACCESS_TOKEN_KEY);
}
export function getRefreshToken() {
  return getStoredValue(REFRESH_TOKEN_KEY);
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  } catch {}
}

export function storeAuth(data) {
  if (typeof window === "undefined" || !data) return;
  const accessToken =
    data.access_token || data.accessToken || data.token || null;
  const refreshToken = data.refresh_token || data.refreshToken || null;
  const userId =
    data.user_id ||
    data.userId ||
    data.user?.user_id ||
    data.user?.id ||
    data.id ||
    null;

  try {
    if (accessToken)
      localStorage.setItem(ACCESS_TOKEN_KEY, String(accessToken));
    if (refreshToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, String(refreshToken));
    if (userId !== null && userId !== undefined)
      localStorage.setItem(USER_ID_KEY, String(userId));
  } catch {}
}

function buildUrl(path) {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.msg || JSON.stringify(item);
      })
      .join(" ");
  }
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  return fallback;
}

async function rawRequest(
  path,
  { method = "GET", body, token, headers = {} } = {},
) {
  const requestHeaders = { Accept: "application/json", ...headers };
  if (body !== undefined) requestHeaders["Content-Type"] = "application/json";
  if (token) requestHeaders.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    const error = new Error(
      "Unable to connect to the Vuka server. Please check your internet connection or try again.",
    );
    error.status = 0;
    throw error;
  }

  const data = await parseResponse(response);
  if (!response.ok) {
    const error = new Error(
      extractErrorMessage(
        data,
        `Request failed with status ${response.status}.`,
      ),
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token is available.");

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const data = await rawRequest("/registration/refresh", {
          method: "POST",
          body: { refresh_token: refreshToken },
        });
        storeAuth(data);
        if (!getAccessToken())
          throw new Error("The server did not return a new access token.");
        return data;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

async function request(path, options = {}, retry = true) {
  const token = getAccessToken();
  try {
    return await rawRequest(path, {
      ...options,
      token: options.token ?? token,
    });
  } catch (error) {
    if (error?.status === 401 && retry && getRefreshToken()) {
      try {
        await refreshAccessToken();
        return await request(path, options, false);
      } catch (refreshError) {
        clearAuth();
        throw refreshError;
      }
    }
    throw error;
  }
}

async function register(payload) {
  return rawRequest("/registration/register", {
    method: "POST",
    body: payload,
  });
}
async function login(payload) {
  return rawRequest("/registration/login", { method: "POST", body: payload });
}
async function verifyMfa(payload) {
  return rawRequest("/registration/mfa/verify", {
    method: "POST",
    body: payload,
  });
}

async function me() {
  const data = await request("/registration/me");
  const userId =
    data?.user_id ?? data?.id ?? data?.user?.user_id ?? data?.user?.id;
  if (
    userId !== undefined &&
    userId !== null &&
    typeof window !== "undefined"
  ) {
    localStorage.setItem(USER_ID_KEY, String(userId));
  }
  return data;
}

async function updateMe(payload) {
  return request("/registration/me", { method: "PATCH", body: payload });
}

async function logout() {
  try {
    const refreshToken = getRefreshToken();
    if (getAccessToken()) {
      await request(
        "/registration/logout",
        {
          method: "POST",
          body: refreshToken ? { refresh_token: refreshToken } : undefined,
        },
        false,
      );
    }
  } finally {
    clearAuth();
  }
}

async function requestPasswordReset(email) {
  return rawRequest("/registration/forgot-password", {
    method: "POST",
    body: { email },
  });
}
async function resetPassword(payload) {
  return rawRequest("/registration/reset-password", {
    method: "POST",
    body: payload,
  });
}

async function onboarding() {
  return request("/onboarding/me");
}

async function saveOnboarding(payload) {
  const { user_id, ...rest } = payload || {};
  return request("/onboarding/", { method: "POST", body: rest });
}

async function updateOnboarding(onboardingId, payload) {
  return request(`/onboarding/${onboardingId}`, {
    method: "PATCH",
    body: payload,
  });
}

async function recommendedContent(limit = 20) {
  const items = await request(`/content_pathway/me?skip=0&limit=${limit}`);
  return Array.isArray(items) ? items : [];
}

async function refreshRecommendedContent(limit = 20) {
  return recommendedContent(limit);
}

async function markWatched(contentPathwayId) {
  return request(`/content_pathway/${contentPathwayId}/watched`, {
    method: "POST",
  });
}

async function generateAssessment(contentId) {
  return request(`/content-assessments/generate/${contentId}`, {
    method: "POST",
  });
}

async function generatedAssessments() {
  const data = await request("/content-assessments");
  return Array.isArray(data)
    ? data
    : data?.assessments || data?.items || data?.data || [];
}

async function getGeneratedAssessment(assessmentId) {
  return request(`/content-assessments/${assessmentId}`);
}

async function startAssessment(generatedId) {
  return request(`/verified-assessment/start/${generatedId}`, {
    method: "POST",
  });
}

async function resumeAssessment(generatedId) {
  try {
    return await request(`/verified-assessment/resume/${generatedId}`);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
}

async function myAssessments() {
  const data = await request("/verified-assessment/me");
  return Array.isArray(data) ? data : [];
}

async function saveAssessmentProgress(assessmentId, answers, currentStep) {
  return request(`/verified-assessment/${assessmentId}/progress`, {
    method: "PATCH",
    body: { answers, current_step: currentStep },
  });
}

async function submitAssessment(assessmentId, answers) {
  return request(`/verified-assessment/${assessmentId}/submit`, {
    method: "POST",
    body: { answers },
  });
}

async function progressSummary() {
  return request("/user-progress/summary");
}

async function opportunities() {
  return request("/opportunity-recommendations/me");
}

async function refreshOpportunities() {
  return request("/opportunity-recommendations/me/refresh", { method: "POST" });
}

export const api = {
  register,
  login,
  verifyMfa,
  me,
  updateMe,
  logout,
  requestPasswordReset,
  resetPassword,
  onboarding,
  saveOnboarding,
  updateOnboarding,
  recommendedContent,
  refreshRecommendedContent,
  markWatched,
  generateAssessment,
  generatedAssessments,
  getGeneratedAssessment,
  startAssessment,
  resumeAssessment,
  myAssessments,
  saveAssessmentProgress,
  submitAssessment,
  progressSummary,
  opportunities,
  refreshOpportunities,
};
