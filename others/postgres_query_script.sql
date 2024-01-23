SELECT * FROM public.scholarly_articles ORDER BY published DESC LIMIT 10;

SELECT * FROM public.scholarly_articles WHERE id in ('2401.06763v1', '2401.06710v1', 
													 '2401.06683v1', '2401.06703v1', 
													 '2401.06740v1');
													 
SELECT SUM(total_ingested) FROM public.arxiv_categories;

SELECT id, total_ingested, last_ingested_at FROM public.arxiv_categories ORDER BY total_ingested
DESC;

SELECT pg_size_pretty(pg_total_relation_size('public.scholarly_articles'));

SELECT * FROM public.scholarly_articles WHERE id='1706.03762v7';

SELECT COUNT(id) FROM public.scholarly_articles;

-- ids of articles where the abstract does not end with full stop but with a number (basically % 
-- seems to doing something and cutting off the abstract during ingestion)
SELECT id FROM public.scholarly_articles WHERE abstract ~* '\d$' AND abstract !~* '\.$';

SELECT COUNT(id) FROM public.scholarly_articles WHERE abstract ~* '\d$' AND abstract !~* '\.$';

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
-- UPDATE public.scholarly_articles SET abstract='More than 10% of extra-solar planets (EPs) orbit in a binary or multiple stellar system. We investigated the motion of planets revolving in binary systems in the frame of the particular case of the three body problem. We carried out an analysis of the motion an EP revolving in a binary system by following conditions; a) a planet in a binary system revolves around one of the components (parent star), b) the distance between the star`s components is greater than between the parent star and the orbiting planet (ratio of the semi-major axes is a small parameter), c) the mass of the planet is smaller than the mass of the stars, but is not negligible. The Hamiltonian of the system without short periodic terms was used. We expanded the Hamiltonian in terms of Legendre polynomial and truncated after the second order term depending on only one angular variable. In this case the solution of this system was obtained and the qualitative analysis of motion was produced. We have applied this theory to real EPs and compared to the numerical integration. Analyses of the possible regions of motion are presented. It is shown that the case of the stable and unstable motion of the EPs are possible. We applied our calculations to two binary systems hosting an EP and calculated the possible values for their unknown orbital elements.' WHERE id='1212.3843v3';