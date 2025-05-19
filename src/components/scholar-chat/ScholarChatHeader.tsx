import type { FC } from 'react';

const ScholarChatHeader: FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-primary">
        Scholar Chat
      </h1>
      <p className="text-lg text-muted-foreground mt-2">
        Upload your research paper, get summaries, and ask questions.
      </p>
    </header>
  );
};

export default ScholarChatHeader;
