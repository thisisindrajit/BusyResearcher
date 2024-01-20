SELECT * FROM public.scholarly_articles ORDER BY published DESC LIMIT 10;

SELECT * FROM public.scholarly_articles WHERE id in ('2401.06763v1', '2401.06710v1', 
													 '2401.06683v1', '2401.06703v1', 
													 '2401.06740v1');
													 
SELECT SUM(total_ingested) FROM public.arxiv_categories;

SELECT id, total_ingested, last_ingested_at FROM public.arxiv_categories ORDER BY total_ingested
DESC;

SELECT pg_size_pretty(pg_total_relation_size('public.scholarly_articles'));

SELECT * FROM public.scholarly_articles WHERE id='2303.13621v1';

SELECT COUNT(id) FROM public.scholarly_articles;

-- ids of articles where the abstract does not end with full stop but with a number (basically % 
-- seems to doing something and cutting off the abstract during ingestion)
SELECT id FROM public.scholarly_articles WHERE abstract ~* '\d$' AND abstract !~* '\.$';