# Security Specification - Touchline Hub

## 1. Data Invariants
- Users can only read/write their own profile (`users/{userId}`).
- Only admins or the coach of a team can manage team data, matches, and players.
- Parents can be linked to players.
- Coaches manage their teams and match data.
- Subscriptions are managed via Stripe webhooks/admin functions.

## 2. The Dirty Dozen Payloads (Examples)
1. Write to `users/{userId}` as another user.
2. Update `role` in `users/{userId}`.
3. Delete `teams/{teamId}` without owning it.
4. Create a `Team` without being a coach (set coachId to someone else).
5. Read PII of another user (e.g., `email`).
6. Update `matches/{matchId}` score as a parent.
7. Inject malicious code in `trainingNotes`.
8. Create an `Availability` for another player.
9. Delete a `Match` as a parent.
10. Update `subscriptionStatus` to 'active' in `users/{userId}`.
11. Update `totalPaid` in `playerPayments` as a parent.
12. Modify a `Match` after status is 'completed'.

## 3. Test Runner
(I will implement `firestore.rules.test.ts` with tests for these.)
