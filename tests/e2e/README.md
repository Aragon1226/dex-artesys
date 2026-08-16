# End-to-end loading & retry tests

Playwright (Python) tests that simulate a slow or failing network and assert the
branded skeletons and retry UI show up instead of empty states.

## Run

```bash
python3 tests/e2e/test_loading_states.py
```

The dev server must be running on `http://localhost:8080` (override with
`E2E_BASE_URL`). Screenshots of every asserted state land in
`/tmp/browser/loading-states` (override with `E2E_SHOTS_DIR`).

## Coverage

| Screen | Slow network | Failing network |
| --- | --- | --- |
| Market (`/app/market`) | `table` skeleton + "Loading market data" | retry state persists while the feed fails |
| Assets history modal | `history` skeleton + "Loading deposits" | retry state, then clears after retry |
| Futures (`/app/futures`) | `positions` skeleton | positions + trade-history retry states, then clears |
| Support chat modal | `chat` skeleton + "Loading conversation" | retry state, then clears |
| Admin > Users | `table` skeleton | retry state, then clears |

## How it works

- `harness.py` holds the shared browser harness: a tiny test registry (pytest is
  not available in this environment), network shaping, auth, and assertions.
- Slow network: every data request (`/rest/v1/**`, Binance, CoinCap) is delayed,
  so skeletons stay on screen long enough to assert.
- Failing network: the same requests are aborted, which surfaces `RetryState`.
- Each test signs up a fresh account through the UI; the admin tests also seed
  the client-side admin permission cache so `/admin/users` is reachable.
- The market feed falls back to cached prices and never throws, so a dev-only
  flag (`?forceFetchError=market`, see `src/lib/devFaults.ts`) forces its error
  path. It is inert in production builds.

## Test hooks in app code

- `data-testid="loading-block"` (+ `data-variant`) and `data-testid="brand-loader"`
  on `LoadingBlock` / `BrandLoader`.
- `data-testid="retry-state"` and `data-testid="retry-button"` on `RetryState`.
