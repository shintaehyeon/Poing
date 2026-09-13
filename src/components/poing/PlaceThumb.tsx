export default function PlaceThumb({ tone }: { tone: string }) {
  return <div className={`place-thumb ${tone}`} aria-hidden="true" />;
}
