import Container from "@mui/material/Container";
import { Button, SectionHeader } from "@sorayasm/vietri-ds";
import { content } from "../content";

export function NotFoundPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <SectionHeader
        level={1}
        title={content.notFound.title}
        description={content.notFound.description}
      />
      <Button href="#/" sx={{ mt: 4 }}>
        {content.notFound.back}
      </Button>
    </Container>
  );
}
