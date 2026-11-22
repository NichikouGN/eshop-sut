# HW05 AI Audit Log

## Tool and record scope

- **AI tool:** OpenAI ChatGPT / Codex, GPT-6 coding agent.
- **Date:** 2026-11-22 (Asia/Ho_Chi_Minh; UTC date is also 2026-11-22).
- **Time record:** The conversation export does not expose timestamps for earlier turns. I have marked those times as unavailable instead of estimating them. The current time was checked during audit creation at 14:02 UTC (21:02 ICT); this is an audit-preparation time, not a claim about the message arrival time.
- **Scope:** This log records the user's task prompts and the assistant's user-facing responses for the Task 1 test-plan design, CSV workflow data, and Task 2 result analysis. Generated artifact outputs are linked directly; the files contain their full text verbatim. Earlier drafts replaced during requested revisions are not represented as the final artifacts.

---

## Interaction 1 — Task 1 test-plan request

**Date/time:** 2026-11-22; time unavailable in transcript.

**User input (verbatim):**

> i have a requirement in the .pdf file. Now  i also hvae the following flow: a user first login, then click on any given item, then click add to cart, then they will click buy, put in a coupon, click buy and finally go into profile and view the bought item. Now in Task 1 i need you to help me design 3 test plans using Load, Stress and Spike covering the route i just mentioned. Put the test plans as a .md first then we can move to the next requirement.

**AI output (verbatim user-facing response):**

> Created [Task1_Performance_Test_Plans.md](/home/nichikou/Downloads/uni/repo/eshop-sut/Task1_Performance_Test_Plans.md) with Load, Stress, and Spike plans for your purchase flow, including workload settings, CSV data guidance, checks, and distinct report views.
>
> I also noted API behavior that may affect the flow: coupon application has a mismatch between the API spec and backend, and checkout may not clear the cart as the requirements describe. The plan calls these out for verification during execution.

**Generated output:** The initial draft was subsequently revised at the user's request. The final, revised plan is [Task1_Performance_Test_Plans.md](../Task1_Performance_Test_Plans.md).

---

## Interaction 2 — JMeter-specific revision

**Date/time:** 2026-11-22; time unavailable in transcript.

**User input (verbatim):**

> can you edit this .md so this is specifically for performance test utilizing Jmeter so the test plan should reflect the endpoint we are calling with specific data, how muc virtual user is using, the loops, listeners,...

**AI output (verbatim user-facing response):**

> Updated [Task1_Performance_Test_Plans.md](/home/nichikou/Downloads/uni/repo/eshop-sut/Task1_Performance_Test_Plans.md) with JMeter-specific sampler order, HTTP methods and paths, JSON request bodies, CSV variables, assertions and extractors, virtual-user profiles, loop settings, timers, listeners, and output paths.
>
> I corrected the plans to use fresh CSV account data on each loop, since repeatedly applying coupons or reusing a user’s in-memory cart could skew results. The repository’s seed data has only one regular user, so the document notes that additional test accounts and CSV rows are needed for the proposed concurrent runs.

**Generated output:** The final, revised plan is [Task1_Performance_Test_Plans.md](../Task1_Performance_Test_Plans.md).

---

## Interaction 3 — Data-driven CSV request

**Date/time:** 2026-11-22; time unavailable in transcript.

**User input (verbatim):**

> ok moving on, the next task require us to create data driven workflow. From the proposed test plan can you create the csv tht will be used along with it like what the make the workflow data-driven subtask of task 1 talks about. After than give me a quick rundown of how to use these csv

**AI output (verbatim user-facing response):**

> Created [users.csv](/home/nichikou/Downloads/uni/repo/eshop-sut/data/users.csv) with one row using the SUT’s seeded test account, AirPods product, and `VIP100` coupon.
>
> ### Use it in JMeter
>
> 1. Add a **CSV Data Set Config** inside each Thread Group.
> 2. Set the filename to `${__P(data_dir,data/users.csv)}` or use the CSV’s absolute path.
> 3. Set **Variable Names** to the header names: `user_id,email,password,product_id,product_name,product_price,quantity,cart_total,coupon_code,shipping_address,search`.
> 4. Set **Ignore first line** to `True`, **Recycle on EOF** to `False`, **Stop thread on EOF** to `True`, and **Sharing mode** to `All threads`.
> 5. Reference the fields in the samplers as `${email}`, `${product_id}`, `${coupon_code}`, and so on. JMeter extracts the token, coupon result, and order ID from API responses during the workflow.
>
> This one-row file is suitable for a single workflow smoke check. It is not enough for load, stress, or spike testing: those runs need unique test accounts and rows for each workflow iteration. Add accounts to the SUT first, then add rows with their real `user_id` values. Don’t duplicate the seeded account row for concurrent users, since they would share a cart and coupon-use history.

**Generated output:** The CSV created at that point was [data/users.csv](../data/users.csv). The subsequently supplied run artifacts include [hw05/test-plans/users.csv](test-plans/users.csv), which is the data-file location referenced by the submitted test-plan set.

---

## Interaction 4 — Task 2 analysis request

**Date/time:** 2026-11-22; time unavailable in transcript.

**User input (verbatim):**

> ok i have all the test plans logs rn. now i changed some of your proposal to up the limit and shorten the test time too. can you check task 2 and tell me your analysis

**AI output (verbatim):**

> ## Task 2 analysis
>
> The runs show a clear progression: the Load run handled its observed workload cleanly, Stress pushed response times much higher without recorded request failures, and Spike produced timeouts and authorization failures.
>
> | Run | Observed workload | Workflow p95 | Request p95 highlights | Failed HTTP requests |
> |---|---:|---:|---|---:|
> | Load | 25 concurrent threads; about 68 seconds of log data | 487 ms | Checkout 129 ms; My Orders 116 ms | 0 / 40,840 |
> | Stress | Peak 500 threads; about 315 seconds | 17.84 s | My Orders 3.17 s; Checkout 2.59 s | 0 / 116,802 |
> | Spike | Peak 1,025 threads; about 120 seconds | 20.71 s | Profile 3.54 s; Checkout 3.47 s; Product detail 3.46 s | 590 / 64,775 (0.91%) |
>
> These figures come from the `elapsed` field in the raw JTLs: [Load](</home/nichikou/Downloads/uni/repo/eshop-sut/hw05/logs/load.jtl>), [Stress](</home/nichikou/Downloads/uni/repo/eshop-sut/hw05/logs/stress.jtl>), and [Spike](</home/nichikou/Downloads/uni/repo/eshop-sut/hw05/logs/spike.jtl>). Workflow p95 uses the `Transaction Controller` samples; endpoint p95 uses each HTTP sampler’s samples.
>
> ### Interpretation
>
> - **Load:** The observed request samples all returned HTTP 200. Endpoint p95s were below 130 ms, and workflow p95 was 487 ms. This supports a good result for this run’s workload and duration.
> - **Stress:** No failed HTTP requests were recorded, but response times degraded substantially. Workflow p95 reached 17.84 seconds, and endpoint p95s reached 3.17 seconds. This indicates major slowdown by the observed 500-thread peak, even though the run did not record request failures.
> - **Spike:** There were 590 failed HTTP requests: 361 connection/socket timeouts, 226 HTTP 401 responses, and 3 HTTP 400 responses. Request-level failure rate was 0.91%. The 401s mean some requests were unauthorized; the logs alone don’t establish whether they were caused by missing/stale tokens or another authentication issue. Don’t describe all failures as backend crashes.
>
> ### Task 2 caveats to address
>
> The JTLs contain both individual HTTP samples and a `Transaction Controller` sample for each journey. The controller sample summarizes its child requests, so counting both as independent HTTP requests double-counts work and can inflate the failure rate. For example, Spike has 590 failed HTTP samples; the JTL reports 875 failed samples when failed controller summaries are included. Report endpoint failures from the HTTP sampler rows, and report workflow timing separately.
>
> There are also reproducibility and workload-validity concerns in the submitted plans:
>
> - The Load log spans about **68 seconds**, although the earlier plan described a longer run. The JMX has an infinite loop and no scheduler duration, so record how the run was stopped and describe its actual duration.
> - All three JMX files reference `/home/nichikou/Downloads/hw05/users.csv`. That path is absent from the current workspace; the checked-in file is `hw05/test-plans/users.csv`.
> - CSV settings in the JMX recycle the data and keep threads running at EOF. If the source CSV contains only one account, concurrent threads reuse that account. This can lead to shared cart state and makes the results less representative of independent shoppers.
> - The CSV report files are sample-level JTL exports, not precomputed summary tables. State how you calculated percentiles and error rates, and retain the raw JTLs as evidence.
>
> ### Thresholds and optimization ideas
>
> For an initial threshold proposal, use **Load p95 under 2 seconds per API request and under 1% failed HTTP requests**. The Load run met both. Treat these as proposed thresholds for this SUT and machine, not universal guarantees. Stress and Spike show that workflow p95 becomes much higher as concurrency rises; the Spike run also crossed the 1% boundary if failed transaction summaries are mistakenly included, so make the HTTP-only calculation explicit.
>
> Potential optimizations should be presented as hypotheses, not proven causes:
>
> - **Database indexes:** Feasible to investigate. The stress run’s slowest endpoint p95 was `GET /api/orders/my-orders` at 3,168 ms. An index on `(user_id, id)` for orders could help that query as order history grows. The run doesn’t prove the query is the bottleneck; profiling and a controlled retest are needed.
> - **SQLite WAL mode:** Feasible to evaluate for concurrent read/write workloads. The spike’s timeout errors make it a reasonable experiment, but the logs do not prove SQLite locking caused them.
> - **Connection pooling:** Not an evidence-backed first fix here. This app uses SQLite through a shared database connection; investigate its database access and contention before proposing a pool.
> - **Product caching or indexes for product search:** Possible future work, but the current seed has only a few products and product endpoints were not the slowest in Stress. The measurements don’t support prioritizing this yet.
>
> For your write-up, cite the exact JTL values above and explain that the run sizes and reused CSV data limit how broadly the results can be generalized.

**Generated output:** The analysis was saved as [TASK2_AI_ANALYSIS.md](TASK2_AI_ANALYSIS.md). That file is the complete analysis artifact and includes the detailed per-endpoint values, method, caveats, threshold proposal, and recommendation assessment.

---

## Interaction 5 — Save Task 2 analysis as Markdown

**Date/time:** 2026-11-22; time unavailable in transcript.

**User input (verbatim):**

> can you write your anayliss as a .md file insid ethe hw05 folder

**AI output (verbatim user-facing response):**

> Created [TASK2_AI_ANALYSIS.md](/home/nichikou/Downloads/uni/repo/eshop-sut/hw05/TASK2_AI_ANALYSIS.md). It includes the measured results, proposed thresholds, feasible optimization ideas, metric interpretation pitfalls, and reproducibility limitations.

**Generated output:** [TASK2_AI_ANALYSIS.md](TASK2_AI_ANALYSIS.md).

---

## Interaction 6 — Create this AI audit log

**Date/time:** 2026-11-22; exact message time unavailable. Audit preparation time checked at 14:02 UTC / 21:02 Asia/Ho_Chi_Minh.

**User input (verbatim):**

> can you write an AI log with the tool, input, output with verbatim for me too

**AI output (verbatim user-facing response):**

> I’ll create an audit log under `hw05` with the AI tool, timestamps, your prompts quoted exactly, and my responses quoted verbatim. For the longer generated deliverables, I’ll link the exact Markdown/CSV artifacts as the complete outputs rather than duplicating them into the audit file.

**Generated output:** [AI_AUDIT_LOG.md](AI_AUDIT_LOG.md), this file.

---

## Final deliverables referenced in this log

- [Task 1 JMeter test plans](../Task1_Performance_Test_Plans.md)
- [Task 1 CSV data file](test-plans/users.csv)
- [Task 2 analysis](TASK2_AI_ANALYSIS.md)
- [Task 1 `.jmx` files](test-plans/)
- [Raw JTL logs](logs/)
