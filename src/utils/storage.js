export const save = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};

export const load = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

export const KEYS = {
  HEALTH: "mh_health",
  FAMILY: "mh_family",
  JOURNAL: "mh_journal",
  RECORDS: "mh_records",
  KIT: "mh_kit",
  SCORE: "mh_score",
  PROFILE: "mh_profile",
  LANG: "mh_lang",
  MODE: "mh_mode",
};
