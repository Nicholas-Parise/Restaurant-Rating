BEGIN TRANSACTION;

DELETE FROM popular;

WITH recent AS (
    SELECT restaurant_id,
           COUNT(*) AS review_count
    FROM reviews
    WHERE created >= NOW() - INTERVAL '24 hours'
    GROUP BY restaurant_id
),
top_recent AS (
    SELECT restaurant_id, review_count
    FROM recent
    ORDER BY review_count DESC
    LIMIT 20
),
fallback AS (
    SELECT r.restaurant_id,
           COUNT(*) AS review_count,
           MAX(r.created) AS last_review
    FROM reviews r
    WHERE NOT EXISTS (
        SELECT 1
        FROM top_recent tr
        WHERE tr.restaurant_id = r.restaurant_id
    )
    GROUP BY r.restaurant_id
),
combined AS (
    SELECT restaurant_id, review_count, NULL::timestamp AS last_review
    FROM top_recent

    UNION ALL

    SELECT restaurant_id, review_count, last_review
    FROM fallback
),
ranked AS (
    SELECT restaurant_id,
           ROW_NUMBER() OVER (
               ORDER BY review_count DESC, last_review DESC NULLS LAST
           ) AS priority
    FROM combined
    LIMIT 20
)
INSERT INTO popular (restaurant_id, priority)
SELECT restaurant_id, priority
FROM ranked;

COMMIT;