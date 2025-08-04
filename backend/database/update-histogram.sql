
WITH scores AS (
  SELECT generate_series(1, 10) AS score
),
review_counts AS (
  SELECT
    restaurant_id,
    score,
    COUNT(*) AS count
  FROM reviews
  GROUP BY restaurant_id, score
),
all_combinations AS (
  SELECT
    r.id AS restaurant_id,
    s.score
  FROM restaurants r
  CROSS JOIN scores s
),
joined_counts AS (
  SELECT
    ac.restaurant_id,
    ac.score,
    COALESCE(rc.count, 0) AS count
  FROM all_combinations ac
  LEFT JOIN review_counts rc
    ON ac.restaurant_id = rc.restaurant_id AND ac.score = rc.score
),
histograms AS (
  SELECT
    restaurant_id,
    to_jsonb(jsonb_object_agg(score, count ORDER BY score)) AS data
  FROM joined_counts
  GROUP BY restaurant_id
)
UPDATE restaurants r
SET score_histogram = h.data
FROM histograms h
WHERE r.id = h.restaurant_id;
