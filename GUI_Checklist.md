# EShop SUT — GUI Checklist (Blank Template)

**Test platform:** ____________________

| ID    | Aspect                 | Screen / area                        | Checklist item                                                                                               | Status | Notes / evidence |
| ----- | ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------ | ---------------- |
| UI-01 | IA-01 General UI       | Customer web — all screens           | Is the EShop brand/header presented consistently across customer pages?                                      |        |                  |
| UI-02 | IA-01 General UI       | Customer web — all screens           | Are page titles visually distinct from section headings and body text?                                       |        |                  |
| UI-03 | IA-01 General UI       | Customer web — all screens           | Is text readable at the default desktop viewport without clipping or overlap?                                |        |                  |
| UI-04 | IA-01 General UI       | Customer web — all screens           | Are Vietnamese labels and messages displayed with correct accents and no encoding errors?                    |        |                  |
| UI-05 | IA-01 General UI       | Customer web — product cards/detail  | Are product images sized consistently and kept within their image areas?                                     |        |                  |
| UI-06 | IA-01 General UI       | Customer web — product cards/detail  | Do long product names and descriptions wrap or truncate without covering other content?                      |        |                  |
| UI-07 | IA-01 General UI       | Customer web — all screens           | Are primary and secondary buttons visually distinguishable and consistently styled?                          |        |                  |
| UI-08 | IA-01 General UI       | Customer web — all screens           | Is text and control contrast sufficient against the background, including colored status or error text?      |        |                  |
| UI-09 | IA-01 General UI       | Customer web — responsive layout     | At a narrow/mobile viewport, do content, navigation, and controls fit without horizontal scrolling?          |        |                  |
| UI-10 | IA-01 General UI       | Customer web — keyboard use          | Can visible links, buttons, and form controls be reached and operated using the keyboard?                    |        |                  |
| UI-11 | IA-01 General UI       | Customer web — forms                 | Are form labels programmatically and visually associated with their inputs?                                  |        |                  |
| UI-12 | IA-02 Forms            | Customer web — registration          | Are name, email, and password fields clearly labeled and distinguishable?                                    |        |                  |
| UI-13 | IA-02 Forms            | Customer web — registration          | Does the email field communicate that an email address is expected and allow a suitable keyboard/input type? |        |                  |
| UI-14 | IA-02 Forms            | Customer web — registration          | Is the password masked while typed, with any password requirements made clear to the user?                   |        |                  |
| UI-15 | IA-02 Forms            | Customer web — login                 | Are the login identifier and password fields labeled clearly and are password characters masked?             |        |                  |
| UI-16 | IA-02 Forms            | Customer web — login                 | Can the user find and activate the forgot-password and registration paths from login?                        |        |                  |
| UI-17 | IA-02 Forms            | Customer web — forgot/reset password | Are the email, OTP, and new-password fields clearly labeled at the appropriate step?                         |        |                  |
| UI-18 | IA-02 Forms            | Customer web — forgot/reset password | Is the transition between requesting an OTP and entering the OTP/new password understandable?                |        |                  |
| UI-19 | IA-02 Forms            | Customer web — profile               | Are name, phone, and shipping-address fields labeled and formatted for their expected values?                |        |                  |
| UI-20 | IA-02 Forms            | Customer web — profile               | Does the address textarea provide enough visible space and a useful prompt for an address?                   |        |                  |
| UI-21 | IA-02 Forms            | Customer web — product detail        | Is the quantity control labeled, and is its current value easy to read and edit?                             |        |                  |
| UI-22 | IA-02 Forms            | Customer web — home/search           | Is the search field identifiable, and is the search action easy to discover?                                 |        |                  |
| UI-23 | IA-02 Forms            | Customer web — checkout              | Is the payment total field clearly labeled and visually distinguished from the itemized order summary?       |        |                  |
| UI-24 | IA-02 Forms            | Admin — CSV import                   | Is the file-selection control and any required CSV format or column guidance clear?                          |        |                  |
| UI-25 | IA-03 Navigation       | Customer web — header                | Do the brand, cart, login/register or account controls take the user to the expected destinations?           |        |                  |
| UI-26 | IA-03 Navigation       | Customer web — home/product list     | Can the user move from a product card to that product’s detail page?                                         |        |                  |
| UI-27 | IA-03 Navigation       | Customer web — product detail        | Is there an apparent way to return to the product list or continue shopping?                                 |        |                  |
| UI-28 | IA-03 Navigation       | Customer web — cart                  | Are continue-shopping and checkout actions easy to locate and distinguish?                                   |        |                  |
| UI-29 | IA-03 Navigation       | Customer web — checkout              | Is the route back to the cart or storefront available if the user needs to revise the order?                 |        |                  |
| UI-30 | IA-03 Navigation       | Customer web — authentication        | Can users switch between login and registration without losing their way?                                    |        |                  |
| UI-31 | IA-03 Navigation       | Customer web — profile               | Are profile details and order history presented as clearly identifiable sections?                            |        |                  |
| UI-32 | IA-03 Navigation       | Admin — sidebar                      | Are dashboard, categories, products, coupons, orders, and users easy to identify in the admin navigation?    |        |                  |
| UI-33 | IA-04 Feedback / state | Customer web — search                | Is a loading state shown while product search results are being fetched?                                     |        |                  |
| UI-34 | IA-04 Feedback / state | Customer web — search                | Does the page clearly distinguish search results, no matching products, and a request/error state?           |        |                  |
| UI-35 | IA-02 Forms            | Admin — login                        | Are email and password inputs labeled clearly, with the password masked?                                     |        |                  |

## AI review and student additions

The checklist above is an initial AI-assisted draft based on the repository’s visible UI structure. Review it against the running application and course lecture criteria. Add student-authored items below that target omissions specific to the tested build (for example, accessibility, localization, responsive behavior, or platform-specific behavior). For each added item, record why the initial draft missed it.

| Added ID | Aspect                 | Screen / area                        | Student-authored checklist item                                                                                             | Why the AI missed it                                                                                                                                                                                                                | Status | Notes / evidence |
| -------- | ---------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------- |
| UI-36    | IA-02 Forms            | Customer web — forgot/reset password | Is the OTP hidden for the user                                                                                              | AI check the main flow and assume the OTP flowcheck works in reality the OTP was exposed from the first place. I assume this is for testing purposes but this is still a major security flaws                                       |        |                  |
| UI-37    | IA-02 Forms            | Customer web — forgot/reset password | is the prompt when the password validation fail easy to understand                                                          | During actual testing, the password fiels mainly says i miss this and that but doesnt show what is it that im missing, it also doesn't say much about what kind of special character is required in the password for it to be valid |        |                  |
| UI-38    | IA-02 Forms            | Customer web — cart                  | Does the app notify the user when an item is added to the cart?                                                             | Again these things arent usually think of but its also important for UI/UX reasons                                                                                                                                                  |        |                  |
| UI-39    | IA-01 General UI       | Customer web — responsive layout     | At 200% browser zoom, do key content and controls remain visible without overlap or horizontal scrolling?                   | The initial AI draft focused on the default viewport and missed zoom/reflow behavior.                                                                                                                                               |        |                  |
| UI-40    | IA-03 Navigation       | Customer web — direct routes         | When a user opens or refreshes a product detail or account route directly, does the page load and retain usable navigation? | The initial AI draft focused on click-through paths and missed direct URL entry and refresh behavior.                                                                                                                               |        |                  |
| UI-41    | IA-04 Feedback / state | Customer web — checkout              | While checkout is submitting, does the interface clearly show progress and prevent an accidental duplicate submission?      | The initial AI draft did not explicitly check progress feedback and repeat activation during submission.                                                                                                                            |        |                  |

## Execution summary

Complete after test execution.

| Metric                    | Result |
| ------------------------- | -----: |
| Checklist items           |     41 |
| Items executed            |        |
| Passed                    |        |
| Failed                    |        |
| Not Tested                |        |
| Bugs reported             |        |
| Screens/platforms covered |        |
