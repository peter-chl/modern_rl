export default function Figure({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-6">
      <div className="flex justify-center overflow-x-auto rounded-md border border-border bg-surface p-4 font-sans">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-sans text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
