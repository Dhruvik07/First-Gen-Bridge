export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-primary-container focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-lg"
    >
      Skip to main content
    </a>
  );
}
