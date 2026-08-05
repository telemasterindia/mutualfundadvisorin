type MarketDataNoticeProps = {
  source: string;
  refreshedAt: string | null;
  marketDataAsOf?: string | null;
  stale?: boolean;
};

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
  timeZoneName: "short",
});

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

export function MarketDataNotice({
  source,
  refreshedAt,
  marketDataAsOf,
  stale = false,
}: MarketDataNoticeProps) {
  return (
    <aside
      className="mx-auto max-w-7xl px-4 py-2 text-[11px] leading-5 text-muted-foreground sm:px-6 lg:px-8"
      aria-label="Market data notice"
    >
      <p>
        Market data may be delayed. For educational and informational purposes only; not investment
        advice or a buy, sell or hold recommendation.
      </p>
      {stale && (
        <p className="font-semibold text-warning">
          This data is older than the expected update period. Verify it with the official exchange,
          issuer or data source before relying on it.
        </p>
      )}
      <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        <div className="flex gap-1">
          <dt className="font-semibold text-foreground">Source:</dt>
          <dd>{source}</dd>
        </div>
        {marketDataAsOf && (
          <div className="flex gap-1">
            <dt className="font-semibold text-foreground">Market data as of:</dt>
            <dd>
              <time dateTime={marketDataAsOf}>{formatTime(marketDataAsOf)}</time>
            </dd>
          </div>
        )}
        {refreshedAt && (
          <div className="flex gap-1">
            <dt className="font-semibold text-foreground">Last successful refresh:</dt>
            <dd>
              <time dateTime={refreshedAt}>{formatTime(refreshedAt)}</time>
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}
