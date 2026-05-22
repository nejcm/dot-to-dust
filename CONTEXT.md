# Dot to Dust

Dot to Dust is a quiet memento-mori app. It shows finite time as a single fitted dot grid, not as a productivity dashboard.

## Language

**Civil Date**:
A local-calendar `YYYY-MM-DD` string with no timezone semantics.
Avoid: UTC date, timestamp, JavaScript date API surface.

**Life Grid**:
The fitted dot canvas for one active view.
Avoid: chart, calendar, heatmap.

**View**:
One of `weeks`, `months`, or `years`.
Avoid: mode, tab, range.

**Stage**:
One of five lived-life bands: `0-11`, `12-22`, `23-39`, `40-59`, `60-80`.
Avoid: category, age bucket.

**Future Dot**:
An unlived unit rendered with the single muted future color.
Avoid: upcoming stage, planned time.

**Today Ring**:
The visual ring on the latest lived dot before bonus time.
Avoid: selected dot, cursor.

**Bonus Time**:
The state after week `4160`, where the grid stays fully lived and the headline counts up.
Avoid: expired, over limit.

## Relationships

- A **View** determines units and grid layout, not date math policy.
- `life-math` owns all civil-date calculations.
- `dot-states` converts date math into the only shape the canvas renders.
- **Future Dots** never carry a **Stage**.
- **Bonus Time** has no **Today Ring**.
- The headline uses `ahead`; avoid `left` unless requirements change.

## Flagged Ambiguities

- "80 years" is implemented as `4160` weeks for bonus-time entry; month/year bonus counts can lag because calendar months and years are calendar-aware.
- `Date` objects are allowed inside civil-date helpers only; do not expose them from feature APIs.
