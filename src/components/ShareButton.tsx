import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Share2 } from "lucide-react";
import { Button, Icon } from "@sorayasm/vietri-ds";
import { content } from "../content";
import { shareLink } from "../data/share";

/**
 * Shares the address of the current page: with the share sheet of the phone when
 * the browser has one, and by copying the link when it does not.
 */
export function ShareButton() {
  const [message, setMessage] = useState("");

  // The message goes away by itself.
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function share() {
    try {
      const result = await shareLink(navigator, document.title, window.location.href);
      if (result === "copied") setMessage(content.episode.copied);
    } catch {
      setMessage(content.episode.shareFailed);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={share} startIcon={<Icon icon={Share2} />}>
        {content.episode.share}
      </Button>
      {/* Always rendered, so screen readers announce it when the text appears. */}
      <Typography role="status" aria-live="polite" variant="body2" color="text.secondary">
        {message}
      </Typography>
    </>
  );
}
