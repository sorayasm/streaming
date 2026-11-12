import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, Input, SectionHeader } from "@sorayasm/vietri-ds";
import { site } from "../data/site";
import { useLanguage, type Content } from "../i18n";
import { ExternalButton } from "./ExternalButton";
import { Section } from "./Section";

interface Values {
  name: string;
  email: string;
  message: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values, messages: Content["contact"]["form"]["errors"]): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = messages.nameRequired;
  if (!values.email.trim()) errors.email = messages.emailRequired;
  else if (!emailPattern.test(values.email.trim())) errors.email = messages.emailInvalid;
  if (!values.message.trim()) errors.message = messages.messageRequired;
  return errors;
}

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

export function ContactSection() {
  const { t } = useLanguage();
  const form = t.contact.form;
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const refs = {
    name: useRef<FieldElement>(null),
    email: useRef<FieldElement>(null),
    message: useRef<FieldElement>(null),
  };

  const handleChange =
    (field: keyof Values) => (event: ChangeEvent<FieldElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(values, form.errors);
    setErrors(next);
    setSent(false);

    // Move focus to the first field with an error, so keyboard and screen
    // reader users land where they need to fix something.
    const firstInvalid = (["name", "email", "message"] as const).find((key) => next[key]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    const body = `${values.name} (${values.email})\n\n${values.message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <Section id="contact" tinted>
      <Box
        sx={{
          display: "grid",
          gap: 6,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
          alignItems: "start",
        }}
      >
        <Stack spacing={3}>
          <SectionHeader
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            description={t.contact.description}
          />
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {t.contact.elsewhere}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <ExternalButton href={site.github} label={t.footer.links.github} />
              <ExternalButton href={site.npm} label={t.footer.links.npm} />
              <ExternalButton href={site.linkedin} label={t.footer.links.linkedin} />
            </Stack>
          </Stack>
        </Stack>

        <Box
          component="form"
          noValidate
          aria-label={form.label}
          onSubmit={handleSubmit}
        >
          <Stack spacing={3}>
            <Input
              label={form.name}
              name="name"
              autoComplete="name"
              required
              fullWidth
              value={values.name}
              onChange={handleChange("name")}
              error={Boolean(errors.name)}
              helperText={errors.name}
              inputRef={refs.name}
            />
            <Input
              label={form.email}
              name="email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              value={values.email}
              onChange={handleChange("email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
              inputRef={refs.email}
            />
            <Input
              label={form.message}
              name="message"
              required
              fullWidth
              multiline
              minRows={5}
              value={values.message}
              onChange={handleChange("message")}
              error={Boolean(errors.message)}
              helperText={errors.message}
              inputRef={refs.message}
            />
            <Box>
              <Button type="submit" size="large" variant="contained">
                {form.send}
              </Button>
            </Box>
            {/* Always rendered, so screen readers announce it when the text appears. */}
            <Typography role="status" aria-live="polite" variant="body2" color="text.secondary">
              {sent ? form.sending : ""}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Section>
  );
}
