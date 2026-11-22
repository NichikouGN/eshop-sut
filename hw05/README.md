| No. | Criteria                                                                          |   Grade | Self-Assessed Grade |
| --: | --------------------------------------------------------------------------------- | ------: | ------------------: |
|   1 | Task 1 — Load testing                                                             |      30 |                  25 |
|   2 | Task 1 — Stress testing                                                           |      20 |                  15 |
|   3 | Task 1 — Spike testing                                                            |      20 |                  15 |
|   4 | Task 2 — AI analysis + misinterpretation hunt (with correct values from raw logs) |      10 |                   5 |
|   5 | Task 3 — Continuous Performance Testing proposal (G9.6)                           |      10 |                   0 |
|   6 | Agent Skills                                                                      |      10 |                   0 |
|     | **Total**                                                                         | **100** |                  60 |

## Performance Test Run Summary

The summary below is calculated from the raw JTL files in [`logs/`](logs/). Run time is the observed timestamp span in each JTL. Peak concurrent users comes from the maximum `allThreads` value. HTTP p95/p99 combine HTTP sampler rows only; workflow p95/p99 use the `Transaction Controller` rows. Error rate counts failed HTTP sampler rows only and excludes transaction-summary samples to avoid double-counting.

| Scenario | Observed duration | Peak concurrent users | HTTP request samples | HTTP errors | HTTP error rate | HTTP p95 | HTTP p99 | Workflow p95 | Workflow p99 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Load | 01:08 | 25 | 40,840 | 0 | 0.000% | 93 ms | 134 ms | 487 ms | 592 ms |
| Stress | 05:15 | 500 | 116,802 | 0 | 0.000% | 2,435 ms | 5,089 ms | 17,838 ms | 19,844 ms |
| Spike | 02:00 | 1,025 | 64,775 | 590 | 0.911% | 3,236 ms | 5,355 ms | 20,714 ms | 27,293 ms |

### Run notes

- **Load:** All recorded HTTP samples succeeded. The observed run lasted about 68 seconds; report this measured duration rather than the planned duration.
- **Stress:** No HTTP failures were recorded, but request and end-to-end workflow percentiles increased substantially at 500 concurrent threads.
- **Spike:** The 590 failed HTTP samples comprise 361 connection/socket timeouts, 226 HTTP 401 responses, and 3 HTTP 400 responses. The 401 responses are authentication failures; the JTL alone does not establish their underlying cause.
- JTLs also contain `Transaction Controller` summary rows. Those rows are reported separately as workflow timing and are not included in HTTP request counts or the HTTP error rate.

### Evidence

- [Load raw JTL](logs/load.jtl) · [Stress raw JTL](logs/stress.jtl) · [Spike raw JTL](logs/spike.jtl)
- [Load HTML report](html-reports/load-html/index.html) · [Stress HTML report](html-reports/stress-html/index.html) · [Spike HTML report](html-reports/spike-html/index.html)
