import { describe, expect, it, vi } from "vitest";
import { shareLink } from "./share";

const url = "https://elbluesesfemenino.cl/#/capitulo/t3e04";

describe("shareLink", () => {
  it("uses the share sheet when the browser has one", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    expect(await shareLink({ share }, "La Rox", url)).toBe("shared");
    expect(share).toHaveBeenCalledWith({ title: "La Rox", url });
  });

  it("is not an error when the person closes the share sheet", async () => {
    const abort = Object.assign(new Error("closed"), { name: "AbortError" });
    const share = vi.fn().mockRejectedValue(abort);
    expect(await shareLink({ share }, "La Rox", url)).toBe("cancelled");
  });

  it("passes on any other error of the share sheet", async () => {
    const share = vi.fn().mockRejectedValue(new Error("not allowed"));
    await expect(shareLink({ share }, "La Rox", url)).rejects.toThrow("not allowed");
  });

  it("copies the link when there is no share sheet", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await shareLink({ clipboard: { writeText } }, "La Rox", url)).toBe("copied");
    expect(writeText).toHaveBeenCalledWith(url);
  });

  it("fails when it can neither share nor copy", async () => {
    await expect(shareLink({}, "La Rox", url)).rejects.toThrow();
  });
});
