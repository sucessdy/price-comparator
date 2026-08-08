# Shopping Decision Engine

## Vision

We are not building another shopping application.

We are building a **Shopping Decision Engine**.

Most shopping applications help users buy products.

Our goal is different.

We help users make better purchasing decisions before they buy.

---

# The Problem

Today's shopping experience is broken.

Users spend hours:

* Searching across multiple platforms.
* Comparing prices manually.
* Reading descriptions.
* Checking delivery fees.
* Looking for discounts.
* Wondering if they are buying the correct product.

Even after all that effort, they still aren't confident they made the best decision.

The internet gives users information.

Our product should give users **confidence**.

---

# Mission

Reduce the thinking required before purchasing.

The software should understand the user's intent, collect relevant information, reason about the available choices, and recommend the best purchasing decision with a clear explanation.

Searching is work.

Comparing is work.

Thinking is work.

The software should perform that work.

The user should simply decide whether to accept the recommendation.

---

# Product Philosophy

Price is only one signal.

A good recommendation considers many factors:

* Product correctness
* Total cost
* Delivery fees
* Platform fees
* Delivery speed
* Convenience
* Availability
* User preferences
* Purchase history
* Trust

The cheapest product is not always the best decision.

The best decision is the one that fits the user's situation.

---

# Product Evolution

## Stage 1 — Product Comparison

Compare the same product across multiple platforms.

Answer:

> "Where is this product cheapest?"

---

## Stage 2 — Cart Optimization

Analyze an entire shopping cart.

Answer:

> "Should I buy everything from one platform or split the order?"

---

## Stage 3 — Intent Understanding

Understand what the user actually means.

Example:

User:

> "I need oats."

Engine asks itself:

* Rolled?
* Instant?
* Steel-cut?
* Organic?
* Preferred brand?
* Budget?
* Quantity?

Instead of searching words, understand intent.

---

## Stage 4 — User Memory

Remember recurring behavior.

Examples:

* Monthly purchases
* Favorite brands
* Preferred platforms
* Health preferences
* Budget range

The system should learn over time instead of asking the same questions repeatedly.

---

## Stage 5 — Recommendation Engine

Instead of returning prices, return decisions.

Example recommendations:

* Cheapest option
* Fastest delivery
* Best overall value
* Fewest deliveries
* Lowest total fees
* Highest confidence purchase

Every recommendation should include an explanation.

---

## Stage 6 — Personal Shopping Agent

Eventually, the engine should anticipate needs.

Examples:

* Recommend reordering monthly essentials.
* Notify users before prices increase.
* Suggest better alternatives.
* Recommend healthier options.
* Detect unnecessary spending.
* Predict future purchases.

The system evolves from a comparison tool into a trusted shopping assistant.

---

# Engineering Principles

Every feature must answer one question:

**Does this help users make better purchasing decisions?**

If the answer is no, it is not a priority.

Core principles:

* Understand intent before searching.
* Reduce cognitive load.
* Never ask the user twice.
* Explain every recommendation.
* Optimize for confidence, not only cost.
* Build trust through transparency.
* Use AI to simplify decisions, not complicate them.
* Every algorithm should improve reasoning.
* Every API should increase understanding.
* Every feature should remove friction.

---

# System Thinking

The engine should think like this:

User

↓

Intent

↓

Understand User

↓

Collect Product Data

↓

Reason About Options

↓

Recommend Best Decision

↓

Explain Why

↓

Learn From Feedback

This is the long-term direction of the system.

---

# North Star

We are not building software that helps people shop.

We are building software that helps people **decide**.

The ultimate goal is not to show users more information.

The ultimate goal is to make the best decision feel obvious.



client/
src/
├── components/
│   └── assistant/
│       ├── AssistantPage.tsx          ← Main container
│       ├── AssistantHero.tsx          ← Your existing main component
│       ├── LandingPage.tsx            ← Empty state
│       ├── ChatPage.tsx               ← Message list
│       ├── ChatInput.tsx              ← Input field
│       ├── Conversation.tsx           ← Message container
│       ├── MessageBubble.tsx          ← ROUTER - decides which card to show
│       ├── LoadingBubble.tsx          ← Loading animation
│       ├── SuggestedPrompts.tsx       ← Quick prompts
│       ├── assistant.types.ts         ← Types
│       │
│       └── cards/                      ← NEW FOLDER
│           ├── index.ts               ← Export all cards
│           ├── CompareCard.tsx        ← NEW - Product comparison
│           ├── ShoppingPlanCard.tsx   ← NEW - Cart optimization
│           ├── RecommendationCard.tsx ← NEW - Product recommendations
│           └── TextCard.tsx           ← NEW - Plain text fallback
│
├── hooks/
│   └── useAssistant.ts                ← Updated to use createAssistantMessage
│
├── services/
│   └── assistant.service.ts           ← Updated to return intent + data
│
├── utils/
│   └── createAssistantMessage.ts      ← NEW - Pure function
│
└── context/
    └── useUser.ts                     ← Existing 