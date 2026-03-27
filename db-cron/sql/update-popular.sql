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
    SELECT restaurant_id, review_count, NULL::timestamp AS last_review
    FROM recent
    ORDER BY review_count DESC
    LIMIT 20
),
fallback_reviews AS (
    SELECT r.restaurant_id,
           COUNT(*) AS review_count,
           MAX(r.created) AS last_review
    FROM reviews r
    WHERE r.restaurant_id NOT IN (
        SELECT restaurant_id FROM top_recent
    )
    GROUP BY r.restaurant_id
),
top_fallback_reviews AS (
    SELECT restaurant_id, review_count, last_review
    FROM fallback_reviews
    ORDER BY review_count DESC, last_review DESC
    LIMIT 20
),
no_reviews_fallback AS (
    SELECT res.id AS restaurant_id,
           0 AS review_count,
           NULL::timestamp AS last_review
    FROM restaurants res
    WHERE res.id NOT IN (
        SELECT restaurant_id FROM reviews
    )
    ORDER BY RANDOM()
    LIMIT 20
),
combined AS (
    SELECT * FROM top_recent

    UNION ALL

    SELECT * FROM top_fallback_reviews

    UNION ALL

    SELECT * FROM no_reviews_fallback
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