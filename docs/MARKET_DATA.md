# Market data implementation record

- Provider: FinEdge API
- Index endpoint: `/api/v1/index/market-price/daily-feed`
- Website-facing proxy: `/api/market-indices`
- Display classification: delayed/latest available market data; never labelled real-time
- Server cache: 5 minutes, with up to 10 minutes of stale-while-revalidate
- Client refresh: 5 minutes
- Provider timeout: 8 seconds
- Credentials: `FINEDGE_API_TOKEN` is read only in server code and is not returned to clients
- Attribution displayed: `Source: FinEdge API`
- Time display: Asia/Kolkata (IST)
- Redistribution: normalized values are used only for the website’s educational market display

## Production approval required

The account owner must confirm that the active FinEdge plan permits commercial public website
display, the stated caching interval, derived/normalized display, and the required attribution.
Any provider-specific redistribution restriction takes precedence over this implementation.

Market news must remain enabled only while its source licence permits public display and the source
attribution remains visible.
