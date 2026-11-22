# Task 1 — JMeter Performance Test Plans

This document specifies three Apache JMeter plans for the same end-to-end API workflow. Build three separate `.jmx` files and run them against the local backend. These are design files: replace the student ID and date in filenames, prepare the CSV data, and record actual run results when executing.

## 1. SUT and workflow

- Base URL: `http://localhost:3000`
- Protocol: HTTP; content type for JSON requests: `application/json`
- Workflow per virtual user: login → product listing → product detail → add to cart → read cart → apply coupon → checkout → view orders → view profile.
- Endpoint groups: `POST /api/login` (auth-heavy); `GET /api/products` and `GET /api/products/{id}` (read-heavy); cart, coupon, checkout, order history, and profile (transactional/user-specific).

### Exact sampler order and request data

Create a **Test Plan** containing **HTTP Request Defaults**, **HTTP Header Manager**, a **CSV Data Set Config**, scenario-specific **Thread Group(s)**, and one **Transaction Controller** called `Purchase journey` inside each virtual user's thread. Add the following HTTP samplers in order. Set `Implementation` to HttpClient4 (the JMeter default on current releases), connect timeout to 5,000 ms and response timeout to 15,000 ms. Do not add automatic retries for POST requests.

| #   | JMeter sampler         | Method and path                   | Request data / headers                                                                                                                 | Extract and validate                                                                                                              |
| --- | ---------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `01 Login`             | `POST /api/login`                 | JSON `{"email":"${email}","password":"${password}"}`; content type JSON                                                                | HTTP 200; JSON extractor `$.token` → `token`; assert token is not empty.                                                          |
| 2   | `02 Product list`      | `GET /api/products`               | No body; `?search=${search}` optional (omit query if blank)                                                                            | HTTP 200; response contains the selected product ID/name.                                                                         |
| 3   | `03 Product detail`    | `GET /api/products/${product_id}` | No body                                                                                                                                | HTTP 200; JSON product `id` equals `${product_id}`.                                                                               |
| 4   | `04 Add to cart`       | `POST /api/cart`                  | JSON `{"id":${product_id},"name":"${product_name}","price":${product_price},"quantity":${quantity}}`; `Authorization: Bearer ${token}` | HTTP 200 and response message `Added to cart`.                                                                                    |
| 5   | `05 Read cart`         | `GET /api/cart`                   | `Authorization: Bearer ${token}`                                                                                                       | HTTP 200; response contains `${product_id}` and `${quantity}`.                                                                    |
| 6   | `06 Apply coupon`      | `POST /api/apply-coupon`          | JSON `{"code":"${coupon_code}","total_amount":${cart_total},"user_id":${user_id}}`                                                     | Expected successful response; extract `$.coupon_id` → `coupon_id`, `$.final_amount` → `final_amount`; assert `success` is `true`. |
| 7   | `07 Checkout`          | `POST /api/checkout`              | JSON `{"total_amount":${final_amount},"shipping_address":"${shipping_address}"}`; `Authorization: Bearer ${token}`                     | HTTP 200; extract `$.orderId` → `order_id`; assert order ID is not empty.                                                         |
| 8   | `08 Record coupon use` | `POST /api/coupon-usage`          | JSON `{"coupon_id":${coupon_id}}`; `Authorization: Bearer ${token}`                                                                    | HTTP 200. Include this if the frontend's normal successful checkout records use; it keeps coupon-use limits/data consistent.      |
| 9   | `09 View my orders`    | `GET /api/orders/my-orders`       | `Authorization: Bearer ${token}`                                                                                                       | HTTP 200; response contains `${order_id}`.                                                                                        |
| 10  | `10 View profile`      | `GET /api/users/me`               | `Authorization: Bearer ${token}`                                                                                                       | HTTP 200; response email equals `${email}`.                                                                                       |

Configure **HTTP Header Manager** with `Content-Type: application/json` and `Accept: application/json`. Add `Authorization: Bearer ${token}` at the sampler level for authenticated requests (4, 5, 7, 8, 9, 10); do not send a literal empty token. Login and coupon apply are unauthenticated in the current backend implementation. Use **JSON Extractor** post-processors for the token, coupon ID, final amount, and order ID. Use **Response Assertion** for status and fixed response text; use **JSON JMESPath Assertion** if installed, or **JSR223 Assertion (Groovy)** to parse JSON and compare fields/values. Label each sampler clearly as above so reports can be filtered by endpoint.

Put a **Constant Timer** of 1,500 ms under the Transaction Controller, so it pauses between each sampler (including after the final one). This is a simple, reproducible think-time approximation; it yields roughly 13.5 seconds of think time per complete workflow. If a more varied user model is desired, replace it with **Uniform Random Timer** using a 1,000 ms constant delay and 1,000 ms random delay, and document the change.

### CSV input and one-time transaction control

Create `data/users.csv`, encoded UTF-8, with a header row:

```csv
user_id,email,password,product_id,product_name,product_price,quantity,cart_total,coupon_code,shipping_address,search
2,test@eshop.com,Test1234!,4,Tai nghe AirPods Pro 2,6000000,1,6000000,VIP100,12 Le Loi Q1 HCMC,Tai nghe
```

The example product ID/name/price and test account come from the repository seed data; confirm the database has not been reset or edited. `cart_total` is `product_price × quantity` for this one-item workflow. Coupon application receives this total; checkout receives the extracted coupon `final_amount`.

Configure **CSV Data Set Config**: Filename `${__P(data_dir,data/users.csv)}`, Variable Names set explicitly to the columns above, Ignore first line `True`, Recycle on EOF `False`, Stop thread on EOF `True`, Sharing mode `All threads`. Put the CSV config inside the Thread Group. Set the **Thread Group Loop Count** to `Forever`; the Transaction Controller simply groups the workflow samplers and runs again on each loop. The Thread Group/plugin schedule determines run duration. This makes every iteration use a fresh account/cart/coupon allowance. Prepare enough unique rows for the planned concurrency and duration: estimate at least `peak users × (duration seconds / 20)`, then add 25% extra; use more if measured journey time is shorter than 20 seconds. Each row should have a unique user and valid database `user_id`. Do not recycle the CSV during a run. When EOF is reached, JMeter stops that thread, so insufficient rows reduce achieved load.

**Important account/coupon data constraint:** the seed database has only one ordinary user, so the single example row supports a smoke check, not concurrent load. Prepare the required number of unique users before performance execution. For coupon limits, use unique accounts or a coupon with sufficient uses; do not reuse one account across concurrent threads. The backend cart is in memory per user ID. Correctness of this test depends on isolated user/cart data.

### Common JMeter settings

- Run in **non-GUI mode** for measured load. Keep assertions enabled; do not use `View Results Tree` during high-volume execution.
- Save samples in CSV JTL format with timestamp, elapsed time, label, response code, success, thread name, and response message. Preserve the full raw `.jtl` file for each run.
- HTTP Request Defaults: Server Name `localhost`, Port `3000`, Protocol `http`.
- Add a **Transaction Controller** with `Generate parent sample` enabled if you want one whole-journey duration in addition to sampler-level timings. Label it `Purchase journey`.
- Add a **Uniform Random Timer** or the defined Constant Timer at the journey level; don't place both.
- The default success threshold for initial evaluation: failed requests under 1%, and per-endpoint p95 under 2 seconds during the Load run. These are provisional targets for this exercise, not guarantees from the SUT. Record measured values even when targets are missed.
- Monitor backend CPU and memory separately (for example, `htop`); also watch test-generator CPU/memory so generator saturation is not misattributed to the backend.

## 2. Load plan

**JMX filename:** `{StudentID}_Load_{YYYYMMDD}.jmx`

### Thread Group configuration

- Number of Threads (users): **20** -> **25**
- Ramp-up period: **120 seconds** -> **60**
- Loop Count: **Forever**
- Action after sampler error: **Continue** so later responses and failures are recorded; assertions mark the failing samples. Do not retry.
- Data: `users.csv`

This produces a 2-minute ramp to the target concurrency and approximately 10 minutes near the target. Each iteration uses a new CSV account and creates a separate order. The 1.5-second timer separates actions. If the local machine cannot run 20 users reliably, calibrate at 5 users, then document the actual load and the reason for adjustment.

### Listener and output

- Listener/report view: **Summary Report** (unique to Load).
- Save JTL to `results/load.jtl`; save the Summary Report screenshot/export as run evidence.
- For a high-volume run, disable GUI listeners and use `jmeter -n -t {StudentID}_Load_{YYYYMMDD}.jmx -l results/load.jtl`; generate the HTML dashboard with `jmeter -g results/load.jtl -o reports/load-html`.

Record throughput, average, median, p90, p95, p99, min/max, and error percentage, overall and by sampler label. Confirm all completed journeys reach order history and profile.

## 3. Stress plan

**JMX filename:** `{StudentID}_Stress_{YYYYMMDD}.jmx`

Use the JMeter Plugins **Stepping Thread Group** -> **Ultimate Thread Group** so concurrency rises in explicit, reproducible stages. Install the JMeter Plugins Custom Thread Groups component before building this plan. Configure:

- Initial delay: **0 seconds**
- Initial users: **10** -> **50**
- Start **10** -> **50** additional users every **120 seconds** -> **30 secondds**
- Ramp-up time for each step: **30 seconds** -> **15 seconds**
- Hold each step: **90 seconds** -> **30 seconds**
- Steps: **9**
- Total duration: approximately **18 minutes** -> **5m15s**; the journey loops while each scheduled thread is active, and CSV EOF stops a thread if the prepared data runs out.
- Action after sampler error: **Continue**; no automatic retries.

### Listener and output

- Listener/report view: **Aggregate Report** (unique to Stress).
- Save JTL to `results/stress.jtl`; use Aggregate Report for the required distinct JMeter view.
- Run non-GUI and generate `reports/stress-html` from the raw JTL with `jmeter -g results/stress.jtl -o reports/stress-html`.

Report the last stable concurrency, first degraded stage, p95/error rate/throughput per stage, backend and generator resource use, and recovery after load drops. To capture recovery within the same plan, use a separate 5-user Thread Group with a **Startup Delay** matching the end of the stress ramp and a 180-second duration; ensure it uses its own user rows and does not overlap account identities. If this recovery group complicates the run, perform and label a separate 5-user recovery run.

## 4. Spike plan

**JMX filename:** `{StudentID}_Spike_{YYYYMMDD}.jmx`

Use JMeter Plugins **Ultimate Thread Group** to schedule baseline, spike, and recovery populations. Add three rows:

| Row         |      Users |      Ramp-up | Startup delay |           Hold | Shutdown ramp |
| ----------- | ---------: | -----------: | ------------: | -------------: | ------------: |
| Baseline    |    5 -> 25 |  10 -> 0 sec |         0 sec | 300 -> 120 sec |   10 -> 0 sec |
| Spike burst | 50 -> 1000 | 10 -> 15 sec | 120 -> 30 sec |  120 -> 30 sec |  10 -> 15 sec |

### Listener and output

- Listener/report view: **View Results Tree** (unique to Spike), used only for a representative short diagnostic run with a small CSV and low request count; retain request/response details for errors.
- For the full spike, disable View Results Tree to avoid its memory overhead. Save the raw JTL to `results/spike.jtl`, then generate the report folder with `jmeter -g results/spike.jtl -o reports/spike-html`.
- Compare baseline, burst, and recovery p95, error rate, throughput, and backend resource use. Record the time until latency/error rates return to baseline range.

## 5. Repository/API notes to resolve before execution

The API specification and backend implementation have differences that affect request construction and result interpretation:

1. `POST /api/apply-coupon` is unauthenticated in the backend and expects `code`, `total_amount`, and `user_id` in JSON. The API specification shows the same fields. Include `user_id` from CSV; do not send a bearer token unless the implementation is changed.
2. `POST /api/coupon-usage` is a separate authenticated endpoint. The frontend's checkout sequence should be checked to confirm whether it calls this after successful checkout. The plan includes it as a sampler so coupon use limits remain realistic; if the frontend does not call it, omit it and document that choice.
3. The current backend coupon calculation for `percent` appears inconsistent with the specification (which says discount = total × percent / 100). The supplied `VIP100` is fixed amount and avoids that specific ambiguity. Do not assume an incorrect final amount is a JMeter failure; compare it with the API behavior and report the defect.
4. The system requirements say checkout recalculates totals and clears the cart, but the backend route currently accepts the client-supplied `total_amount` and does not clear the in-memory cart. This plan posts the coupon's `final_amount` to reproduce the stated user flow, then checks order history. Record observed mismatches as SUT issues.
5. Backend login currently increments failed attempts by two and locks for three minutes. Use only valid credentials to prevent the account-lockout behavior from contaminating performance runs. Reset test accounts between runs if a lockout occurs and record the reset.
