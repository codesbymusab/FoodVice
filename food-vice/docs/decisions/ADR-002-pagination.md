# ADR-002:  Cursor Based Pagination

## Date
[18-06-2026]

## Status
Accepted

## Context
FoodVice restaurant,review and reel listings will grow to thousands of entries.
Offset-based pagination (`LIMIT 20 OFFSET X`) degrades as X grows
because the database must scan and discard X rows before returning results.
At 10,000 restaurants with OFFSET 9980, the DB touches 10,000 rows to return 20.

## Decision
Use cursor-based pagination using [created_at + _id] as the cursor.
Each page returns a `nextCursor` token. The next request passes this
token to fetch the next page efficiently using WHERE clauses instead of OFFSET.

## Consequences
✓ Consistent O(log n) performance regardless of page depth
✓ Stable results — new insertions don't shift pages
✓ Works well with indexes on the cursor fields

✗ No random page access ("jump to page 47")
✗ Cursor must be encoded to prevent client manipulation
✗ Slightly more complex implementation than OFFSET

## Implementation notes
Cursor = base64(JSON.stringify({ created_at, _id }))
Query: WHERE created_at < cursor.created_at OR 
       (created_at = cursor.created_at AND _id < cursor._id)