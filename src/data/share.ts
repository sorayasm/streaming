export type ShareResult = "shared" | "copied" | "cancelled";

/** The parts of `navigator` that sharing needs. */
export interface ShareTarget {
  share?: (data: { title: string; url: string }) => Promise<void>;
  clipboard?: { writeText: (text: string) => Promise<void> };
}

/**
 * Shares a link: with the share sheet of the phone when there is one, and by copying
 * it when there is not. Closing the share sheet is not an error ("cancelled").
 * It throws when the link can be neither shared nor copied.
 */
export async function shareLink(
  target: ShareTarget,
  title: string,
  url: string
): Promise<ShareResult> {
  if (typeof target.share === "function") {
    try {
      await target.share({ title, url });
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return "cancelled";
      throw error;
    }
  }
  if (!target.clipboard) throw new Error("This browser can neither share nor copy.");
  await target.clipboard.writeText(url);
  return "copied";
}
