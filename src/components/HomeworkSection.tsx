interface HomeworkSectionProps {
  text: string;
  fileUrl?: string;
  fileName?: string;
}

const HomeworkSection = ({ text, fileUrl, fileName }: HomeworkSectionProps) => {
  return (
    <div>
      <div className="bg-muted rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-book-open text-primary mt-1" />
          <p className="text-foreground text-sm leading-relaxed">{text}</p>
        </div>
      </div>

      {fileUrl && fileName && (
        <a
          href={fileUrl}
          download={fileName}
          className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
        >
          <i className="fas fa-file-download text-primary text-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium truncate">{fileName}</p>
            <p className="text-muted-foreground text-xs">Нажмите чтобы скачать</p>
          </div>
          <i className="fas fa-arrow-down text-muted-foreground" />
        </a>
      )}
    </div>
  );
};

export default HomeworkSection;
