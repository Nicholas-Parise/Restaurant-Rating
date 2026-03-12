INSERT INTO categories(name)
SELECT DISTINCT lower(unaccent(replace(replace(trim(cat), '_', ' '), '-', ' ')))
FROM restaurants,
     regexp_split_to_table(cuisine, '[,;/]') AS cat
WHERE cuisine IS NOT NULL
  AND trim(cat) <> ''
ON CONFLICT (name) DO NOTHING;


INSERT INTO category_aliases (alias, canonical_category_id)
SELECT name, id
FROM categories;

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='acai')
WHERE alias IN ('acai bowl');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='asian')
WHERE alias IN ('asain','asian fusion');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='bbq')
WHERE alias IN ('barbecue');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='afghan')
WHERE alias IN ('afghanistan', 'afghanistani');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='chicken fingers')
WHERE alias IN ('chicken finger', 'chicken finger');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='dinner')
WHERE alias IN ('dinenr');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='salvadoran')
WHERE alias IN ('salvadorian','el salvadorian','salvadorean');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='caribbean')
WHERE alias IN ('carribbean');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='shaved ice')
WHERE alias IN ('shave ice');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='milkshakes')
WHERE alias IN ('milkshake');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='south east asian')
WHERE alias IN ('southeast asian');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='cocktails')
WHERE alias IN ('cocktail');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='dumplings')
WHERE alias IN ('dumpling');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='pakistani')
WHERE alias IN ('pakistan');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='south indian')
WHERE alias IN ('southern indian');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='potatoes')
WHERE alias IN ('potatoe','potato');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='poutine')
WHERE alias IN ('poutines');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='canadian')
WHERE alias IN ('new canadian','canadian food');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='samosas')
WHERE alias IN ('samosa');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='westcoast')
WHERE alias IN ('west coast');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='waffles')
WHERE alias IN ('waffle');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='noodles')
WHERE alias IN ('noodle');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='oysters')
WHERE alias IN ('oyster');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='fast food')
WHERE alias IN ('fastfood');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='mongolian')
WHERE alias IN ('mongolian grill');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='snacks')
WHERE alias IN ('snack');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='grilled cheese')
WHERE alias IN ('grilled cheese sandwich');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='crepes')
WHERE alias IN ('crepe');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='comfort food')
WHERE alias IN ('comfort');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='quebecois')
WHERE alias IN ('quebeciois');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='hong kong')
WHERE alias IN ('hongkong');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='philippines')
WHERE alias IN ('phillipines');

UPDATE category_aliases
SET canonical_category_id = (SELECT id FROM categories WHERE name='regional')
WHERE alias IN ('region');

/*
INSERT INTO restaurant_cats (restaurant_id, category_id)
SELECT
    r.id,
    c.id
FROM restaurants r
CROSS JOIN regexp_split_to_table(r.cuisine, '[,;/]') AS cat
JOIN categories c
    ON c.name = lower(unaccent(replace(replace(trim(cat), '_', ' '), '-', ' ')))
WHERE r.cuisine IS NOT NULL
ON CONFLICT DO NOTHING;
*/

INSERT INTO restaurant_cats (restaurant_id, category_id)
SELECT
    r.id,
    ca.canonical_category_id
FROM restaurants r
CROSS JOIN regexp_split_to_table(r.cuisine, '[,;/]') AS raw_cat
JOIN category_aliases ca
    ON lower(unaccent(replace(replace(trim(raw_cat), '_', ' '), '-', ' '))) = ca.alias
WHERE r.cuisine IS NOT NULL
ON CONFLICT DO NOTHING;