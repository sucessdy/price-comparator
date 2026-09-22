# SmartCart — My Build Journey & Thought Process

> This file is my running record of how I built SmartCart, how my thinking evolved, the mistakes I made, the debugging lessons I learned, and where the project currently stands.
>
> This is not meant to be perfect technical documentation. It is my actual development journey and the reasoning behind the decisions I made.

---

## 1. Where the idea started

The project originally started as a simple **price comparator**.

The initial idea was:

> A user enters a product → the system compares prices across platforms → the user sees the cheapest option.

The initial focus was:

- Product data
- MongoDB
- Product prices
- Different shopping platforms
- Compare API
- Cheapest platform

But while building it, I realized that showing prices was not enough.

The user would still have to think:

> "Which one should I buy?"
> "Where should I buy it?"
> "What if I need multiple products?"
> "Which combination will actually cost the least?"

That is where the project started evolving.

---

## 2. From Price Comparator to SmartCart

My thinking gradually changed from:

```text
Search
→ Compare
→ Think
→ Choose
```

to:

```text
Ask
→ Understand
→ Recommend
→ Compare
→ Add to Plan
→ Optimize
```

So the project evolved from a simple price comparison tool into a **shopping assistant**.

Core idea:

> "Do not just show the user prices. Help the user make a shopping decision."

---

## 3. Backend foundation

I structured the backend into layers:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
MongoDB
```

I learned that:

- The controller should handle HTTP request/response concerns.
- The service should contain business logic.
- The repository should handle database queries.
- MongoDB should store the actual product data.

This separation became important because I did not want controllers to contain all the business logic.

---

## 4. Product Repository

The repository gradually gained operations such as:

```text
findByNameAndPlatform()
findByName()
findByNames()
create()
updatePriceWithHistory()
findByCategory()
searchProducts()
```

One important realization was the difference between exact lookup and search/discovery.

### `findByName()`

Its purpose is an exact product lookup.

Example:

```text
boat headphones
```

### `searchProducts()`

Its purpose is broader discovery.

For example:

```text
headphones
```

can search both:

```text
name OR category
```

This taught me:

> Exact lookup and product discovery are different operations.

---

## 5. Product Service

The product service contains the main product-related business operations:

```text
addOrUpdateProduct()
compareProduct()
compareProducts()
optimizeCart()
```

### `compareProduct()`

This compares one product across different platforms.

Example:

```text
boat headphones

amazon → ₹2499
flipkart → ...
croma → ...

cheapest → amazon
```

### `compareProducts()`

Later I realized that:

```text
compare Sony
```

and:

```text
compare Sony and Boat
```

are two different use cases.

So I created separate functions:

```text
compareProduct()
→ one product across platforms

compareProducts()
→ multiple products against each other
```

For multiple products, I used `Promise.all()` because each product d cacomparison is independent ann run concurrently.

---

# 6. Smart Cart / Cart Optimization

Smart Cart became one of the most important parts of the project.

A user can build a shopping plan:

```text
milk × 1
bread × 1
eggs × 2
```

Then the user can select:

```text
Optimize Plan
```

The backend evaluates two major strategies.

### Split-cart strategy

For each product, choose the cheapest available platform.

### Single-platform strategy

Check whether one platform has all required products and calculate its overall cost.

Then calculate:

```text
product cost                                                                                            
+
platform/order fees
```

and co                                                                                                                                                

The response contains information such as:

```text
recommended
savings
missingProducts
shoppingPlan
alternatives
summary
```

Important learning:

> The cheapest individual products do not necessarily produce the cheapest overall order.

Order grouping and platform fees can change the final total.

---

# 7. Frontend architecture

Initially, too much logic was inside the frontend page.

I realized that the page should not own every piece of application logic.

So I moved toward:

```text
AssistantPage
      ↓
useAssistant
      ↓
assistant.service
      ↓
assistant.api
      ↓
Backend
```

### AssistantPage

Mostly responsible for rendering the UI and connecting callbacks.

### `useAssistant`

Owns:

```text
input
messages
loading
shoppingPlan
send workflow
clear conversation
add to plan
remove from plan
optimize plan
```

### `assistant.service`

Handles assistant-related application operations.

### `assistant.api`

Handles HTTP communication through Axios.

---

# 8. Shopping Plan

One important design decision:

> The shopping plan should not be a chat message.

A chat message represents historical conversation.

The shopping plan represents current session state.

So I kept:

```text
Chat messages
+
ShoppingPlan state
```

separate.

The UI looks like:

```text
Shopping Plan
2 Items

boat headphones × 2

-     quantity     +
Optimize Plan
```

The quantity behavior is:

```text
2 → 1 → removed
```

and pressing `+` increases the quantity.

---

# 9. Assistant and Query Parser

After the core shopping flow worked, I added a conversational assistant.

The user can type something like:

```text
I need headphones under 3000
```

The system needs to understand:

```text
intent
category
budget
```

So I created `queryParser.js`.

Current intents:

```text
COMPARE
OPTIMIZE_CART
SHOPPING_NEED
GENERAL
UNKNOWN
```

The parser roughly follows:

```text
General?
↓
Comparison?
↓
Optimization?
↓
Shopping + budget?
↓
Shopping without budget?
↓
Product extraction?
↓
Unknown
```

---

# 10. GENERAL intent bug

One bug was that a message such as:

```text
hello
```

could be treated like a product request.

That could eventually cause:

```text
compareProduct("hello")
```

which is obviously incorrect.

So I added a `GENERAL` intent.

Now queries such as:

```text
hello
hi
hey
thanks
what can you do
```

can be handled as normal conversation.

Important learning:

> Not every user message is a shopping operation.

---

# 11. `buy headphones` bug

Another bug appeared with:

```text
buy headphones
```

The parser originally had a path where no budget caused the shopping parser to return `null`, after which the request fell through into generic product extraction and could become:

```text
COMPARE
```

That was wrong.

So I added shopping-query detection so requests like:

```text
buy headphones
I need headphones
I want headphones
find headphones
```

can enter the shopping flow.

---

# 12. Optional budget bug

At one point, the application generated a MongoDB query like:

```js
{
  category: "headphones",
  price: { $lte: null }
}
```

for:

```text
buy headphones
```

The problem was that budget is optional.

The correct mental model is:

```text
category = required
budget = optional
```

So the price filter should only be added when a real budget exists:

```js
if (budget !== null && budget !== undefined) {
  query.price = { $lte: budget };
}
```

This allows:

```text
buy headphones
```

to search all matching headphones.

While:

```text
headphones under 3000
```

applies:

```text
price <= 3000
```

---

# 13. Small `filter()` bug

In the recommendation service, I accidentally wrote:

```js
products.fliter(...)
```

instead of:

```js
products.filter(...)
```

I also learned that:

```js
if (!filteredProducts)
```

does not detect an empty array.

The correct check is:

```js
if (!filteredProducts.length)
```

because an empty array is still truthy in JavaScript.

Important learning:

> Empty arrays are truthy.

---

# 14. Multi-product comparison

After improving the parser, a request like:

```text
compare sony headphones, boat headphones
```

could be extracted as:

```js
[
  "sony headphones",
  "boat headphones"
]
```

Then the backend performs:

```text
compareProducts()
    ↓
compareProduct("sony headphones")
compareProduct("boat headphones")
```

---

# 15. `Array.map` bug

At one point I got:

```text
productNames.map is not a function
```

The reason was that `compareProducts()` expected an array, but I was passing arguments incorrectly.

Correct:

```js
compareProducts(products)
```

Not:

```js
compareProducts(products[0], products[1])
```

Important learning:

> A function's input contract needs to be clear and respected.

If the function expects:

```js
string[]
```

it must receive an array.

---

# 16. `compareProduct is not defined`

Inside the multi-product comparison function, I had:

```js
productNames.map((name) => compareProduct(name))
```

But `compareProduct` was being defined through `exports`, not as a local variable.

That caused:

```text
ReferenceError: compareProduct is not defined
```

I fixed it using:

```js
exports.compareProduct(name)
```

Important learning:

> CommonJS exports and local variables are different concepts.

---

# 17. Frontend crash — `Object.entries`

The backend eventually returned multi-product comparison data correctly, but the frontend became blank.

The error was:

```text
Cannot convert undefined or null to object
```

at:

```js
Object.entries(comparison.prices)
```

The reason was a response-shape mismatch.

A single comparison looked like:

```js
{
  product: "boat headphones",
  prices: {...},
  cheapest: {...}
}
```

But the multi-product response looked like:

```js
{
  products: [...],
  details: [...]
}
```

So the old `CompareCard` received the wrong structure.

Then:

```text
comparison.prices
→ undefined
```

and:

```text
Object.entries(undefined)
```

crashed React.

---

# 18. Single vs Multiple Comparison Cards

Instead of forcing one component to handle two different response shapes, I created:

```text
CompareCard
→ one product comparison

MultipleCompareCard
→ multiple product comparisons
```

Then `MessageBubble` decides which component to render based on the data shape:

```text
single object
→ CompareCard

array
→ MultipleCompareCard
```

This worked successfully for:

```text
compare sony headphones, boat headphones
```

and both comparison results appeared in the UI.

---

# 19. Recommendation Card

The recommendation card shows information such as:

```text
Best Match
product
best price
platform
reason
Compare
Add to Plan
```

Example:

```text
boat headphones
₹2499
Amazon

Fits your headphones requirement.
```

---

# 20. Add to Plan

From the recommendation card, the user can select:

```text
Add to Plan
```

and the product is added to the shopping plan.

When the same product is added again:

```text
quantity + 1
```

is used.

Remove/decrement reduces the quantity and removes the product when the quantity reaches zero.

---

# 21. Conversation Context

I realized that the assistant should not only understand the current message.

Example:

```text
I need headphones under 3000
```

The system can preserve:

```js
context: {
  category: "headphones",
  budget: 3000
}
```

The purpose is to support follow-up requests such as:

```text
show me something cheaper
```

or:

```text
show me better quality
```

The assistant can then use the previous conversation context.

---

# 22. Priority

Priority was designed as an **optional** preference.

Possible values:

```text
lowest-price
quality
delivery
```

Examples:

```text
find the cheapest headphones
→ lowest-price
```

```text
find the best quality headphones
→ quality
```

```text
find headphones with fast delivery
→ delivery
```

When no preference is specified:

```text
priority = null
```

Important realization:

> Priority is an optional preference, not a required field.

---

# 23. Budget + Priority

The shopping request model is becoming:

```text
category  → main requirement
budget    → optional constraint
priority  → optional preference
products  → depends on the request
```

This creates a better foundation for future recommendation logic.

---

# 24. Search Discovery

Another limitation appeared:

```text
compare boat headphones
```

works because it is an exact product name.

But:

```text
compare headphones
```

can fail because `"headphones"` is a category, not necessarily an exact product name.

For that reason, I added:

```text
searchProducts()
```

which searches by:

```text
name OR category
```

This gives the system a way to discover products instead of requiring an exact product name.

---

# 25. Hackathon requirement — SerpApi

For the hackathon, I needed live shopping data instead of relying only on seeded MongoDB data.

So I integrated SerpApi.

The architecture became:

```text
Search Service
      ↓
SerpApi
      ↓
Google Shopping results
      ↓
Normalizer
      ↓
our application's data shape
```

I tested:

```text
GET /api/search?q=headphones
```

and received:

```text
200 OK
count: 40
```

This proved that:

```text
SerpApi ✅
Search endpoint ✅
Normalizer ✅
```

were working.

---

# 26. Redis cache

I also added Redis caching around live search.

Flow:

```text
query
 ↓
cache key
 ↓
Redis GET
 ↓
hit → return cached data
 ↓
miss
 ↓
SerpApi
 ↓
normalize
 ↓
Redis SET
 ↓
return
```

I successfully reached:

```text
Redis connected
Redis miss
```

The intended second-request behavior is:

```text
same query
→ Redis hit
```

The purpose is to make repeated searches faster and reduce unnecessary external API requests.

---

# 27. API routing bug

At one point, assistant requests were returning 404 without even reaching the backend controller.

The browser showed:

```text
API URL: /api
```

instead of the expected backend URL.

The request path was traced layer by layer:

```text
React
 ↓
Axios
 ↓
route
 ↓
controller
```

The actual cause was a typo/extra character in:

```text
VITE_API_URL
```

After correcting it, the backend controller was reached again.

Important learning:

> A 404 does not automatically mean business logic is wrong. Trace the request through each layer before changing the application logic.

---

# 28. Live recommendation flow

The recommendation service was then connected to the live search service:

```text
Assistant
   ↓
recommendationService
   ↓
searchProduct()
   ↓
Redis
   ↓
SerpApi
   ↓
Normalizer
   ↓
budget filter
   ↓
recommendation
```

For example:

```text
I need headphones under 3000
```

could now return live shopping results rather than only MongoDB seed data.

---

# 29. Current relevance problem

Live search is working, but live search results are not automatically perfect recommendations.

For example, a broad query such as:

```text
headphones
```

can return closely related products such as earphones or other audio products.

So the next important layer is:

```text
SEARCH
 ↓
RELEVANCE FILTER
 ↓
BUDGET FILTER
 ↓
PRIORITY / RANKING
 ↓
TOP RECOMMENDATIONS
```

This is important because getting results is not enough.

The results also need to be relevant to the user's intent.

---

# 30. Future provider architecture

For the hackathon, SerpApi is the live search provider.

Long-term, I want the rest of the application to be independent of one specific provider.

The intended architecture is:

```text
SearchProvider
      ↓
provider implementation
```

For example:

```text
SearchProvider
   ↑
SerpApiProvider
```

Later other legitimate or official/licensed sources could implement the same interface.

The goal is:

> The recommendation system should not need to know which provider supplied the search data.

---

# 31. The emotional part of the journey

While building the project, I sometimes compared myself to people who said they built applications in a few days and thought:

> "I have been working on this for months."

Sometimes I even felt like quitting tech.

But when I look at what I actually built:

```text
MongoDB
Express
repositories
services
business logic
cart optimization
assistant
intent parsing
recommendations
React state
cards
Redis
SerpApi
```

I can see that this was not just a small UI project.

I was trying to understand the system while building it.

At the same time, I now want to move faster.

My new rule is:

```text
BUILD
→ TEST
→ DEBUG
→ COMMIT
→ NEXT
```

---

# 32. New development mindset

I do not want to endlessly perfect the project before shipping it.

The goal is:

```text
MVP first
+
clean boundaries
+
future-friendly structure
```

Not:

```text
design everything for the next ten years
```

A better approach is:

> Create clean boundaries now so future changes do not force a complete rewrite.

---

# 33. Hackathon priority

The current focus is:

```text
1. Live search works
2. SerpApi works
3. Redis caching works
4. Recommendation uses live data
5. Relevance filtering
6. Compare remains stable
7. Smart Cart remains stable
8. End-to-end demo
9. README / presentation / final polish
```

Avoid unnecessary refactoring while racing toward the demo.

---

# 34. Final SmartCart direction

The product direction is now:

```text
USER
 ↓
UNDERSTAND NEED
 ↓
SEARCH
 ↓
FILTER
 ↓
RANK
 ↓
RECOMMEND
 ↓
COMPARE
 ↓
ADD TO PLAN
 ↓
OPTIMIZE
```

The real goal is:

> Reduce the effort required for a user to make a shopping decision.

---

# 35. Current checkpoint

```text
Product database                 ✅
Product CRUD/business logic     ✅
Price comparison                ✅
Multi-product comparison        ✅
Recommendation flow             ✅
Recommendation cards            ✅
Add to Plan                     ✅
Quantity + / −                  ✅
Shopping Plan                   ✅
Optimize Plan                   ✅
General conversation             ✅
Natural shopping requests       ✅
Budget filtering                ✅
Priority extraction             ✅
Search endpoint                 ✅
SerpApi                          ✅
Normalizer                       ✅
Redis connection/cache          ✅
```

Remaining:

```text
Relevance/ranking               🚧
Final hackathon polish          🚧
```

---

# 36. One-line summary

> **I started with a simple price comparator, but while building it I evolved it into a conversational Smart Shopping Assistant that can understand a user's need, search live products, recommend options, compare products, build a shopping plan, and optimize the overall cart.**

---

# 37. Final mental model

```text
                    SMARTCART

                         USER
                           ↓
                    ASSISTANT API
                           ↓
                    QUERY PARSER
                           ↓
              ┌────────────┼────────────┐
              ↓            ↓            ↓
           COMPARE      SHOPPING      OPTIMIZE
              ↓            ↓            ↓
        ProductService   Search       Cart Logic
                           ↓
                         Redis
                           ↓
                        SerpApi
                           ↓
                       Normalizer
                           ↓
                     Recommendations
                           ↓
                        React UI
                           ↓
             Compare / Plan / Optimize
```

## Most important learning

> **Software engineering is not only about writing code. It is also about tracing requests, understanding layers, maintaining data contracts, isolating bugs, and gradually improving the system.**

---

## Next

Current focus:

```text
live search
→ relevance filtering
→ ranking
→ reliable recommendation
→ hackathon demo
```

**BUILD → TEST → DEBUG → COMMIT → NEXT**
