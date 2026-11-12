import { getEpisode, type Episode } from "./episodes";

export const LAST_EPISODE_KEY = "elbluesesfemenino:last-episode";

/** Remembers the last episode that was opened, only in this browser. */
export function saveLastEpisode(id: string): void {
  try {
    localStorage.setItem(LAST_EPISODE_KEY, id);
  } catch {
    // Storage can be unavailable (private mode): it just will not be remembered.
  }
}

/** The last episode that was opened, if it still exists. */
export function getLastEpisode(): Episode | undefined {
  try {
    const id = localStorage.getItem(LAST_EPISODE_KEY);
    return id ? getEpisode(id) : undefined;
  } catch {
    return undefined;
  }
}
