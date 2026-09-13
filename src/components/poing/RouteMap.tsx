export default function RouteMap({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? 'route-map large' : 'route-map'} aria-label="포항 여행 동선">
      <span className="pin p1" />
      <span className="pin p2 current" />
      <span className="pin p3" />
      <span className="route-line" />
    </div>
  );
}
