# AI Interaction Log — GUI Checklist Draft

This log records the AI assistance used to create the initial GUI checklist, as requested for the assignment's AI audit. The conversation transcript available when this log was prepared does not expose timestamps for earlier messages. I have recorded the session date and marked those interaction times as unavailable rather than estimating them.

## Tool and timestamp information

- **AI tool:** OpenAI Codex (GPT-6)
- **Date of interaction:** 2026-11-15 (session date shown in the workspace)
- **Time of original interaction:** 2026-11-15 13:17
- **Log prepared:** 2026-11-15 17:14:47

## Interaction 1 — Initial checklist request

**Prompt (verbatim):**

> base on the overall structure of the sut app and from the pool can you crate those 40 UI checklist

**AI output:**

I inspected the repository and drafted a 60-item checklist covering the customer web storefront, web admin, and mobile app. It was organized under the four interface aspects in the assignment: IA-01 General UI, IA-02 Forms, IA-03 Navigation, and IA-04 Feedback / state. I created `GUI_Checklist.md` with Status and Notes / evidence columns, initially marking the items Not tested and including sections for student-authored additions and an execution summary.

### Initial 60-item checklist draft

| ID    | Aspect                 | Screen / area                           | Checklist item                                                                                                         |
| ----- | ---------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| UI-01 | IA-01 General UI       | Customer web — all screens              | Is the EShop brand/header presented consistently across customer pages?                                                |
| UI-02 | IA-01 General UI       | Customer web — all screens              | Are page titles visually distinct from section headings and body text?                                                 |
| UI-03 | IA-01 General UI       | Customer web — all screens              | Is text readable at the default desktop viewport without clipping or overlap?                                          |
| UI-04 | IA-01 General UI       | Customer web — all screens              | Are Vietnamese labels and messages displayed with correct accents and no encoding errors?                              |
| UI-05 | IA-01 General UI       | Customer web — product cards/detail     | Are product images sized consistently and kept within their image areas?                                               |
| UI-06 | IA-01 General UI       | Customer web — product cards/detail     | Do long product names and descriptions wrap or truncate without covering other content?                                |
| UI-07 | IA-01 General UI       | Customer web — all screens              | Are primary and secondary buttons visually distinguishable and consistently styled?                                    |
| UI-08 | IA-01 General UI       | Customer web — all screens              | Is text and control contrast sufficient against the background, including colored status or error text?                |
| UI-09 | IA-01 General UI       | Customer web — responsive layout        | At a narrow/mobile viewport, do content, navigation, and controls fit without horizontal scrolling?                    |
| UI-10 | IA-01 General UI       | Customer web — keyboard use             | Can visible links, buttons, and form controls be reached and operated using the keyboard?                              |
| UI-11 | IA-01 General UI       | Customer web — keyboard use             | Is the current keyboard focus visibly indicated on interactive controls?                                               |
| UI-12 | IA-01 General UI       | Customer web — forms                    | Are form labels programmatically and visually associated with their inputs?                                            |
| UI-13 | IA-01 General UI       | Customer web — all screens              | Do icon-only or image-based controls have an accessible name or equivalent text?                                       |
| UI-14 | IA-01 General UI       | Mobile app — all views                  | Are text, touch targets, and spacing usable on the tested phone screen without clipping?                               |
| UI-15 | IA-01 General UI       | Mobile app — all views                  | Does the layout respect the device status bar and safe areas?                                                          |
| UI-16 | IA-02 Forms            | Customer web — registration             | Are name, email, and password fields clearly labeled and distinguishable?                                              |
| UI-17 | IA-02 Forms            | Customer web — registration             | Does the email field communicate that an email address is expected and allow a suitable keyboard/input type?           |
| UI-18 | IA-02 Forms            | Customer web — registration             | Is the password masked while typed, with any password requirements made clear to the user?                             |
| UI-19 | IA-02 Forms            | Customer web — login                    | Are the login identifier and password fields labeled clearly and are password characters masked?                       |
| UI-20 | IA-02 Forms            | Customer web — login                    | Can the user find and activate the forgot-password and registration paths from login?                                  |
| UI-21 | IA-02 Forms            | Customer web — forgot/reset password    | Are the email, OTP, and new-password fields clearly labeled at the appropriate step?                                   |
| UI-22 | IA-02 Forms            | Customer web — forgot/reset password    | Is the transition between requesting an OTP and entering the OTP/new password understandable?                          |
| UI-23 | IA-02 Forms            | Customer web — profile                  | Are name, phone, and shipping-address fields labeled and formatted for their expected values?                          |
| UI-24 | IA-02 Forms            | Customer web — profile                  | Does the address textarea provide enough visible space and a useful prompt for an address?                             |
| UI-25 | IA-02 Forms            | Customer web — product detail           | Is the quantity control labeled, and is its current value easy to read and edit?                                       |
| UI-26 | IA-02 Forms            | Customer web — home/search              | Is the search field identifiable, and is the search action easy to discover?                                           |
| UI-27 | IA-02 Forms            | Customer web — checkout                 | Is the coupon-code field clearly labeled and is the apply action associated with it?                                   |
| UI-28 | IA-02 Forms            | Customer web — checkout                 | Is the payment total field clearly labeled and visually distinguished from the itemized order summary?                 |
| UI-29 | IA-02 Forms            | Admin — login                           | Are email and password inputs labeled clearly, with the password masked?                                               |
| UI-30 | IA-02 Forms            | Admin — product/category/coupon forms   | Are required fields, units, and expected formats apparent before submission?                                           |
| UI-31 | IA-02 Forms            | Admin — CSV import                      | Is the file-selection control and any required CSV format or column guidance clear?                                    |
| UI-32 | IA-03 Navigation       | Customer web — header                   | Do the brand, cart, login/register or account controls take the user to the expected destinations?                     |
| UI-33 | IA-03 Navigation       | Customer web — home/product list        | Can the user move from a product card to that product’s detail page?                                                   |
| UI-34 | IA-03 Navigation       | Customer web — product detail           | Is there an apparent way to return to the product list or continue shopping?                                           |
| UI-35 | IA-03 Navigation       | Customer web — cart                     | Are continue-shopping and checkout actions easy to locate and distinguish?                                             |
| UI-36 | IA-03 Navigation       | Customer web — checkout                 | Is the route back to the cart or storefront available if the user needs to revise the order?                           |
| UI-37 | IA-03 Navigation       | Customer web — authentication           | Can users switch between login and registration without losing their way?                                              |
| UI-38 | IA-03 Navigation       | Customer web — profile                  | Are profile details and order history presented as clearly identifiable sections?                                      |
| UI-39 | IA-03 Navigation       | Admin — sidebar                         | Are dashboard, categories, products, coupons, orders, and users easy to identify in the admin navigation?              |
| UI-40 | IA-03 Navigation       | Admin — sidebar                         | Is the currently selected admin section visually indicated?                                                            |
| UI-41 | IA-03 Navigation       | Mobile app — views                      | Are navigation actions between home, product detail, cart, and account-related views discoverable and consistent?      |
| UI-42 | IA-03 Navigation       | All platforms                           | Does browser back or the app’s back/home control return to a sensible previous screen without losing expected context? |
| UI-43 | IA-04 Feedback / state | Customer web — search                   | Is a loading state shown while product search results are being fetched?                                               |
| UI-44 | IA-04 Feedback / state | Customer web — search                   | Does the page clearly distinguish search results, no matching products, and a request/error state?                     |
| UI-45 | IA-04 Feedback / state | Customer web — product detail           | Is a loading or failure state shown if product details cannot be retrieved?                                            |
| UI-46 | IA-04 Feedback / state | Customer web — add to cart              | Does the interface confirm that a product was added and communicate any updated cart quantity/state?                   |
| UI-47 | IA-04 Feedback / state | Customer web — cart                     | Is the empty-cart state clear and does it provide a way to continue shopping?                                          |
| UI-48 | IA-04 Feedback / state | Customer web — cart                     | After removing an item, is the updated cart and total shown clearly, including the empty state if applicable?          |
| UI-49 | IA-04 Feedback / state | Customer web — checkout/coupon          | Is coupon success feedback distinct from coupon validation/error feedback?                                             |
| UI-50 | IA-04 Feedback / state | Customer web — checkout                 | Is the final payable amount updated and distinguishable after a coupon is applied?                                     |
| UI-51 | IA-04 Feedback / state | Customer web — checkout                 | Is progress indicated while checkout is processing, and is duplicate submission discouraged?                           |
| UI-52 | IA-04 Feedback / state | Customer web — checkout                 | Is order success clearly confirmed, with an understandable next action?                                                |
| UI-53 | IA-04 Feedback / state | Customer web — registration/login/reset | Are validation and authentication failures shown near the relevant form, in language the user can act on?              |
| UI-54 | IA-04 Feedback / state | Customer web — profile                  | Is a successful profile save confirmed, and are save failures explained?                                               |
| UI-55 | IA-04 Feedback / state | Customer web — order history            | Are order statuses presented with readable text and visually distinguishable states?                                   |
| UI-56 | IA-04 Feedback / state | Admin — dashboard/lists                 | Are loading, empty, and request-failure states understandable for the dashboard and management lists?                  |
| UI-57 | IA-04 Feedback / state | Admin — create/update/delete            | Does each successful create, update, or delete action provide clear confirmation and updated list state?               |
| UI-58 | IA-04 Feedback / state | Admin — CSV import                      | Are preview, importing/progress, completion, and row/error results presented clearly?                                  |
| UI-59 | IA-04 Feedback / state | Admin — order management                | Are order statuses clearly labeled and is a failed status update communicated?                                         |
| UI-60 | IA-04 Feedback / state | Mobile app — network actions            | Are loading, success, empty, and error states visible for product loading, login, cart, coupon, and checkout actions?  |

## Interaction 2 — Request to append the checklist to Markdown

**Prompt (verbatim):**

> append them to an md file too

**Time:** 2026-11-15 13:17

**AI output:** The checklist was written to the project-root file `GUI_Checklist.md` as Markdown, with checklist status and notes/evidence columns, a student-additions section, and an execution-summary section.

## Interaction 3 — Clarification to create a new file

**Prompt (verbatim):**

> or just create a new one

**Time:** 2026-11-15 13:17

**AI output:** I confirmed that `GUI_Checklist.md` was created as a new file in the project root.
