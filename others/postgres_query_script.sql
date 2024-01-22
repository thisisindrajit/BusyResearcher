SELECT * FROM public.scholarly_articles ORDER BY published DESC LIMIT 10;

SELECT * FROM public.scholarly_articles WHERE id in ('2401.06763v1', '2401.06710v1', 
													 '2401.06683v1', '2401.06703v1', 
													 '2401.06740v1');
													 
SELECT SUM(total_ingested) FROM public.arxiv_categories;

SELECT id, total_ingested, last_ingested_at FROM public.arxiv_categories ORDER BY total_ingested
DESC;

SELECT pg_size_pretty(pg_total_relation_size('public.scholarly_articles'));

SELECT * FROM public.scholarly_articles WHERE id='1706.03762';

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
-- UPDATE public.scholarly_articles SET abstract='The General Transit Feed Specification (GTFS) standard for publishing transit data is ubiquitous. GTFS being tabular data, with information spread across different files, necessitates specialized tools or packages to retrieve information. Concurrently, the use of Large Language Models(LLMs) for text and information retrieval is growing. The idea of this research is to see if the current widely adopted LLMs (ChatGPT) are able to understand GTFS and retrieve information from GTFS using natural language instructions without explicitly providing information. In this research, we benchmark OpenAI&#x27;s GPT-3.5-Turbo and GPT-4 LLMs which are the backbone of ChatGPT. ChatGPT demonstrates a reasonable understanding of GTFS by answering 59.7% (GPT-3.5-Turbo) and 73.3% (GPT-4) of our multiple-choice questions (MCQ) correctly. Furthermore, we evaluated the LLMs on information extraction tasks using a filtered GTFS feed containing four routes. We found that program synthesis techniques outperformed zero-shot approaches, achieving up to 93% (90%) accuracy for simple queries and 61% (41%) for complex ones using GPT-4 (GPT-3.5-Turbo).' WHERE id='2308.02618v2';