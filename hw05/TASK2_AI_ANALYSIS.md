# Task 2 — AI Analysis of JMeter Results

## Scope and method

This analysis uses the raw JMeter sample logs in `hw05/logs/`:

- `load.jtl`
- `stress.jtl`
- `spike.jtl`

The values below were calculated from the `elapsed` field, which is measured in milliseconds. Endpoint statistics include HTTP sampler rows only. The separate `Transaction Controller` rows are used to represent end-to-end workflow duration. They summarize the child sampler activity and must not be counted again as independent HTTP requests. `Debug Sampler` rows are excluded from API metrics.

The JTLs are sample-level logs rather than pre-aggregated summary tables. Percentiles below use the nearest-rank method: sort the elapsed values and select the observation at `ceil(p × sample_count)`. Percentiles are descriptive of these runs and their local test environment.

## Results

| Scenario | Observed peak threads | Log time span | HTTP samples | Failed HTTP samples | HTTP failure rate | Workflow p95 |
|---|---:|---:|---:|---:|---:|---:|
| Load | 25 | 68.07 sec | 40,840 | 0 | 0% | 487 ms |
| Stress | 500 | 314.66 sec | 116,802 | 0 | 0% | 17,838 ms |
| Spike | 1,025 | 119.92 sec | 64,775 | 590 | 0.911% | 20,714 ms |

### Load

All 40,840 recorded HTTP samples succeeded with response code 200. Endpoint p95 response times were:

| Endpoint | Samples | p95 elapsed |
|---|---:|---:|
| `POST /api/login` | 4,546 | 71 ms |
| `GET /api/products` | 4,545 | 81 ms |
| `GET /api/products/:id` | 4,545 | 60 ms |
| `POST /api/cart` | 4,545 | 24 ms |
| `GET /api/cart` | 4,545 | 48 ms |
| `POST /api/apply-coupon` | 4,539 | 99 ms |
| `POST /api/checkout` | 4,530 | 129 ms |
| `GET /api/users/me` | 4,524 | 89 ms |
| `GET /api/orders/my-orders` | 4,521 | 116 ms |

For this run, measured endpoint p95s were well below the proposed 2-second limit and the HTTP failure rate was zero. This is a good result for the observed run conditions. The log covers about 68 seconds, so it does not establish behavior over a longer steady-state load period.

### Stress

No failed HTTP samples were recorded among 116,802 requests. Latency nevertheless rose sharply at the observed peak of 500 threads. Workflow p95 was 17.838 seconds. The slowest endpoint p95s were:

| Endpoint | Samples | p95 elapsed |
|---|---:|---:|
| `GET /api/orders/my-orders` | 12,795 | 3,168 ms |
| `POST /api/checkout` | 12,884 | 2,593 ms |
| `POST /api/login` | 13,274 | 2,783 ms |
| `GET /api/products` | 13,095 | 2,209 ms |

The run therefore remained functionally successful according to the JTL success flags, but it did not meet the proposed 2-second endpoint p95 threshold at this load. This is evidence of substantial degradation, not evidence that the system remained acceptably responsive. The run does not identify the exact saturation point because the log alone does not include synchronized server CPU, memory, database, and load-generator measurements.

### Spike

At a recorded peak of 1,025 threads, the HTTP samplers recorded 590 failures in 64,775 samples, a 0.911% failure rate. The failed HTTP samples consisted of:

- 361 connection or socket timeouts.
- 226 HTTP 401 Unauthorized responses.
- 3 HTTP 400 responses.

Workflow p95 reached 20.714 seconds. Selected endpoint p95s were `GET /api/users/me` at 3,538 ms, `POST /api/checkout` at 3,470 ms, `GET /api/products/:id` at 3,461 ms, and `GET /api/products` at 3,435 ms. The largest single HTTP sample elapsed time was 19,151 ms for profile retrieval.

The timeouts are consistent with the backend or the test path being overloaded, but the JTL cannot determine whether the limiting resource was the backend, SQLite, the host operating system, or the JMeter generator. The 401 responses indicate authentication failures. They may have followed login or token problems during the surge, but that causal relationship requires inspection of request/response data and token handling; it should not be asserted from the aggregate counts alone.

## Threshold proposal

For a first performance gate on this machine and configuration, use:

1. **Load target:** HTTP request failure rate below 1% and per-endpoint p95 below 2 seconds at the agreed normal-load concurrency.
2. **Stress degradation indicator:** flag the first concurrency stage where endpoint p95 exceeds 2 seconds or errors appear. The current Stress run exceeded the latency target at its observed 500-thread peak despite zero recorded HTTP failures.
3. **Spike target:** report timeout and HTTP error rates separately, alongside p95 and recovery time. The current Spike HTTP failure rate is 0.911%, close to the 1% threshold; its endpoint p95s substantially exceed 2 seconds.

These are proposed initial thresholds, not service-level objectives supplied by the product owner. Confirm them against expected user experience and repeat runs before treating them as release gates. For Stress and Spike, the purpose is also to characterize degradation; do not require them to meet the normal-load target at arbitrarily high load.

## Optimization hypotheses and feasibility

The run data identifies symptoms and candidate areas, not proven root causes. Any proposed change should be tested with a controlled before/after run using the same data and workload.

| Proposal | Assessment | Evidence and next step |
|---|---|---|
| Add an index for user order history, such as `(user_id, id)` on `orders` | Feasible to investigate | `GET /api/orders/my-orders` had the highest Stress endpoint p95 at 3,168 ms. The route filters by `user_id` and orders by ID. Profile the query and compare plans before and after adding an index. The timing alone does not prove the query is the bottleneck. |
| Add a composite index on coupon usage lookup fields | Feasible to investigate | The coupon route checks usage by `coupon_id` and `user_id`. A composite index could help as usage rows grow, but this test does not isolate that query as a bottleneck. |
| Enable SQLite WAL mode | Feasible experiment | WAL may improve reader/writer concurrency in SQLite workloads. The Spike timeouts make it a candidate, but the JTL contains no evidence that database locking caused the failures. Compare database wait/lock evidence before and after. |
| Introduce a database connection pool | Not supported as the first recommendation | This backend uses SQLite and a shared database connection. Pooling is not automatically beneficial for this architecture; first measure database contention and the Node.js request path. |
| Add product caching or a product-name search index | Possible, but not prioritized by these results | Product endpoints were not the slowest endpoints under Stress, and the seeded data set contains only a few products. Reconsider with production-sized data and profiling. A normal B-tree index may not help a substring search such as `LIKE '%term%'`. |

## Metric interpretation pitfalls

1. **Do not mix workflow samples with request samples.** Each completed journey has a `Transaction Controller` row in addition to its HTTP child rows. In the Spike log, there are 590 failed HTTP sampler rows and 285 failed transaction-summary rows. Counting both yields 875 failed samples, but it does not mean there were 875 failed HTTP requests. Report the HTTP-only rate as 590 / 64,775 = 0.911%, and present workflow timing separately.
2. **Use `elapsed` in milliseconds for response time.** The JTL also has `Latency`; it measures a different timing boundary and should not be substituted for total sampler elapsed time when reporting response-time percentiles.
3. **A zero failure rate does not mean the Stress run passed its latency goal.** Stress had no failed HTTP requests, but its workflow p95 was 17.838 seconds and some endpoint p95s exceeded 2 seconds.
4. **Do not infer root cause from timeout counts alone.** A client-side connect timeout may reflect backend saturation, host limits, network/socket pressure, or load-generator limits. Correlate with resource-monitor evidence.

## Evidence limitations and reproducibility findings

- The Load JTL spans 68.07 seconds. The submitted Load JMX uses an infinite loop and has no scheduler duration, so the log does not demonstrate a ten-minute steady-state run. Record how it was stopped and use the actual duration in the report.
- The JMX files reference `/home/nichikou/Downloads/hw05/users.csv`, while the repository data file is `hw05/test-plans/users.csv`. The absolute path is not portable and is absent from the current workspace. Use a repository-relative path or a JMeter property and include the data file with the submission.
- The CSV Data Set Config in the JMX files has `Recycle on EOF = true` and `Stop thread on EOF = false`. If the source CSV has only one account, threads reuse that same identity. Because the cart is keyed by user ID in backend memory, this can cause shared cart state and weakens the realism of concurrent-user results. Confirm the actual CSV used at run time and use unique accounts/rows for a repeatable test.
- The test plans do not call `POST /api/coupon-usage`. Repeated coupon applications therefore may not represent the frontend's normal successful checkout lifecycle or coupon-use limit behavior.
- JMeter's `View Results Tree` can consume substantial generator memory at high throughput. For the full Spike run, prefer the saved JTL and non-GUI execution; use the listener on a small diagnostic run.
- The JTL files do not include backend CPU/memory samples. The report needs the separate resource-monitor screenshots/logs to determine whether the generator or SUT was saturated.

## Overall conclusion

The observed Load run was fast and had no failed HTTP requests, but it lasted only about 68 seconds. Stress reached 500 concurrent threads with no HTTP failures but showed severe latency degradation. Spike reached 1,025 threads and produced 590 failed HTTP requests, mainly connection/socket timeouts and 401 responses. These results support an initial normal-load target of under 2 seconds endpoint p95 and under 1% HTTP failures, while also showing that the current Stress/Spike behavior needs investigation. Because the plans reuse CSV data, use a non-portable CSV path, and lack complete resource evidence in the JTL, treat the results as useful observations rather than a fully reproducible capacity benchmark.
