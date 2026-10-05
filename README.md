# Team kuch_bhi — Meesho DICE Challenge Season 3
### Indian Institute of Technology Guwahati (IIT Guwahati)

A product solution built for the **Meesho DICE Challenge Season 3** to reduce Return-to-Origin (RTO) and get more orders delivered successfully.

## Working Prototype

**Live Prototype:**  
[Open the Prototype](https://meeshodiceprototype.lovable.app/)

**Prototype Source Code:**  
[View Prototype Code](./prototype)

## The Problem

RTO can happen because of customer unavailability, address issues, refusal, distance and last-mile execution.

From the case data:

- 80% of orders are COD
- COD RTO rate: 20%
- Prepaid RTO rate: 5%
- ~94% of illustrative RTOs are COD
- Forward cost: ₹50
- Reverse cost: ₹120
- Cost per RTO: ₹170

Our research also found that customers prefer a second delivery opportunity over immediate return.

## Our Solution

We use a simple two-step approach:

### 1. Prevent

A Risk Engine checks:

- Payment type
- Address quality
- Customer refusal history

Based on these signals, risky COD orders receive a **single, reason-specific WhatsApp nudge**.

**No blocking. No cancellation. No checkout friction.**

### 2. Recover

If delivery still fails, the system offers:

1. Reschedule
2. Alternate receiver
3. Address assistance
4. Hub hold / self-collection where available

The recovery flow is adapted to different customer and city cohorts.

## Risk Engine

| Payment | Address | History | Action |
|---|---|---|---|
| Prepaid | Any | Any | Ship normally |
| COD | Clean | Reliable/New | Ship normally |
| COD | Medium/High | Reliable/New | Address nudge |
| COD | Clean | At-Risk | Intent + reschedule |
| COD | Medium/High | At-Risk | Intent + address |

New customers are **not treated as risky simply because they have no history.**

## Impact & Testing

The proposed pilot follows a **30–60–90 day plan**:

**0–30:** Prove with a controlled pilot  
**31–60:** Expand to more regions  
**61–90:** Decide whether to scale

Key metrics:

- RTO rate vs control
- Recovery success
- Cost per rescued order
- Customer complaints
- Rider impact

Our current estimate of **~3.3 fewer RTOs per 100 orders** is a hypothesis to be validated through the pilot.

## Key Idea

**Prevent the risky order before dispatch. If delivery still fails, give it one smart second chance.**

## Links

- [Working Prototype](https://meeshodiceprototype.lovable.app/)
- [Prototype Source Code](./prototype)
- [GitHub Repository](https://github.com/Ayush7066/Meesho_Dice_Season3)