SELECT * FROM public.scholarly_articles ORDER BY published DESC LIMIT 10;

SELECT * FROM public.scholarly_articles WHERE id in ('2401.06763v1', '2401.06710v1', 
													 '2401.06683v1', '2401.06703v1', 
													 '2401.06740v1');
													 
SELECT SUM(total_ingested) FROM public.arxiv_categories;

SELECT id, total_ingested, last_ingested_at FROM public.arxiv_categories ORDER BY total_ingested
DESC;

SELECT pg_size_pretty(pg_total_relation_size('public.scholarly_articles'));

SELECT * FROM public.scholarly_articles WHERE id='1606.08164v2';

SELECT COUNT(id) FROM public.scholarly_articles;

-- ids of articles where the abstract does not end with full stop but with a number (basically % 
-- seems to doing something and cutting off the abstract during ingestion)
SELECT id FROM public.scholarly_articles WHERE abstract ~* '\d$' AND abstract !~* '\.$';


-- Sample query for search
WITH unnested_categories AS (
	SELECT id, unnest(categories) as category_ids
	FROM public.scholarly_articles
	WHERE id in ('2112.13986v1','1709.03329v1','2112.02162v1',
				 '1812.05415v1','1910.00652v3','1906.01885v1',
				 '1606.08164v2','1609.08446v1','2312.03437v1',
				 '2102.00928v1')
),
extended_aggregated_categories AS (
	SELECT a.id, array_agg(b.category_title) as categories
		FROM unnested_categories a
		INNER JOIN public.arxiv_categories b
		ON a.category_ids = b.id
		GROUP BY a.id
)

SELECT b.id, b.title, b.abstract, b.categories as category_ids, a.categories, b.authors, b.published, b.comment 
	FROM extended_aggregated_categories a 
	INNER JOIN public.scholarly_articles b
	ON a.id = b.id
	ORDER BY
	CASE a.id
		WHEN '2112.13986v1' THEN 1
		WHEN '1709.03329v1' THEN 2
		WHEN '2112.02162v1' THEN 3
		WHEN '1812.05415v1' THEN 4
		WHEN '1910.00652v3' THEN 5
		WHEN '1906.01885v1' THEN 6
		WHEN '1606.08164v2' THEN 7
		WHEN '1609.08446v1' THEN 8
		WHEN '2312.03437v1' THEN 9
		WHEN '2102.00928v1' THEN 10
	END;
	
-- Update abstract
-- UPDATE public.scholarly_articles SET abstract='Only about 10% of the baryons in the universe lie in galaxies as stars or cold gas, with the remainder predicted to exist as a dilute gaseous filamentary network known as the Cosmic Web. Some of this gas is detected through UV absorption line studies, but half of the gas remains undetected. Growth of structure simulations suggest that these "missing" baryons were shock heated in unvirialized cosmic filaments to temperatures of 10^5.5-10^7 K, and that the gas is chemically enriched by galactic superwinds. Most of the gas in this temperature regime can be detected only by X-ray observations through absorption and emission from the He-like and H-line ions of C, N, and O. This white paper shows that an X-ray telescope such as IXO can test the most central predictions of the Cosmic Web: the distribution of gas mass with temperature; the dynamics of the gas and its relationship to nearby galaxies; and the topology of the Cosmic Web material.' WHERE id='0906.4984v1';