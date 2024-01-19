SELECT * FROM public.scholarly_articles ORDER BY published DESC LIMIT 10;

SELECT * FROM public.scholarly_articles WHERE id in ('2401.06763v1', '2401.06710v1', 
													 '2401.06683v1', '2401.06703v1', 
													 '2401.06740v1');
													 
SELECT SUM(total_ingested) FROM public.arxiv_categories;

SELECT id, total_ingested, last_ingested_at FROM public.arxiv_categories ORDER BY total_ingested
DESC;

SELECT pg_size_pretty(pg_total_relation_size('public.scholarly_articles'));

SELECT * FROM public.scholarly_articles WHERE id='quant-ph/9801057v2';