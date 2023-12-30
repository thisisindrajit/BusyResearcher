import datetime
from urllib.request import urlopen
import feedparser
import os
import psycopg2
from pylatexenc.latex2text import LatexNodes2Text
import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv

load_dotenv()

# Function to print synchronous logs
def print_logs(message, type = "info"):
    if type == "error":
        print(f'Error - {message}')
    else:
        print(message)

# Function to convert iso8601 to postgres timestamp format
def convert_iso8601_to_timestamp(iso8601_string):
    # Convert ISO 8601 string to a Python datetime object
    dt_object = datetime.datetime.strptime(iso8601_string, "%Y-%m-%dT%H:%M:%SZ")

    # Return the formatted timestamp string with microseconds
    return dt_object.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

# Function to format string
def format_string(input):
    try:
        # Replacing new line characters with space and then removing extra spaces
        formatted_string = str(' '.join(input.replace('\n', ' ').split()))

        return formatted_string
    except Exception as e:
        print_logs(f"Error while formatting string: {e}", "error")

        # Return original input if there is an error
        return input

# Function to convert latex to plain text
def latex_to_plain_text(id, latex_text):
    try:
        # Convert LaTeX to plain text
        plain_text = LatexNodes2Text().latex_to_text(latex_text)

        return plain_text
    except Exception as e:
        print_logs(f"Error while converting latex to plain text for entry with id {id}: {e}", "error")

        # Return the original text if there is an error
        return latex_text

# Function to upsert entries to vector db
def upsert_entries_to_vector_db_and_return_if_successful(documents, metadatas, ids):
    # Initialize chroma client and upsert entries
    try:
        chroma_client = chromadb.HttpClient(host=os.environ["CHROMADB_HOST_URL"], settings=Settings(chroma_client_auth_provider=os.environ["CHROMA_CLIENT_AUTH_PROVIDER"],chroma_client_auth_credentials=os.environ["CHROMA_CLIENT_AUTH_CREDENTIALS"]))

        # Create collection "busyresearcher" if it doesn't exist
        collection = chroma_client.get_or_create_collection(name=os.environ["CHROMADB_COLLECTION_NAME"], metadata = {"hnsw:space": "cosine"})

        # Upsert entries
        collection.upsert(
            documents = documents,
            metadatas = metadatas,
            ids = ids
        )
    except Exception as e:
        print_logs(f'Error while upserting entries to vector db: {e}', "error")
        return False

    return True

# Function to get details for next ingestion
def get_details_for_next_ingestion(conn):
    cur = None

    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM fn_get_details_for_next_ingestion()")
        details = cur.fetchone()
    except (Exception, psycopg2.DatabaseError) as e:
        print_logs(f"Error while getting details for next ingestion: {e}", "error")
    finally:
      if cur is not None:
        cur.close()

    return details

# Function to update metadata for category
def update_metadata_for_category_and_return_if_successful(conn, category, no_of_articles_ingested):
    cur = None

    try:
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM fn_update_metadata_for_category('{category}',{no_of_articles_ingested})")

        # Commit all changes finally if no errors occurred
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as e:
        print_logs(f"Error while updating metadata for category {category}: {e}", "error")

        return False
    finally:
      if cur is not None:
        cur.close()

    return True

# Function to upsert entries to postgres DB
def upsert_entries_to_postgres_db_and_return_if_successful(conn, data_dict):
    cur = None

    try:
        cur = conn.cursor()

        # Prepare a list of tuples for all entries
        values = [(entry.get('id'), entry.get('title'), entry.get('abstract'), entry.get('categories'), entry.get('authors'), entry.get('comment') if entry.get('comment') is not None else None, True, convert_iso8601_to_timestamp(entry.get('published'))) for entry in data_dict.values()]

        # Use mogrify to generate the bulk upsert query
        values_str = ','.join(cur.mogrify("(%s,%s,%s,%s,%s,%s,%s,%s)", row).decode('utf-8') for row in values)

        # Construct the UPSERT query with multiple rows
        query = f"""INSERT INTO public.scholarly_articles
          (id, title, abstract, categories, authors, comment, is_embedding_created, published)
        VALUES
          {values_str}
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          abstract = EXCLUDED.abstract,
          categories = EXCLUDED.categories,
          authors = EXCLUDED.authors,
          comment = EXCLUDED.comment,
          is_embedding_created = EXCLUDED.is_embedding_created,
          published = EXCLUDED.published;"""

        # Execute the query
        cur.execute(query)

        # Commit all changes finally if no errors occurred
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as e:
        print(f"Error while upserting entries to postgres DB: {e}", "error")

        return False
    finally:
        if cur is not None:
            cur.close()

    return True

# Function to set last ingested time for category
def set_last_ingested_time_for_category(conn, category):
    cur = None

    try:
        cur = conn.cursor()
        cur.execute(f"""UPDATE public.arxiv_categories
            SET last_ingested_at = CURRENT_TIMESTAMP
            WHERE id = '{category}';""")

        # Commit all changes finally if no errors occurred
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as e:
        print_logs(f"Error while updating last ingested at for category {category}: {e}", "error")
    finally:
      if cur is not None:
        cur.close()

# Function that runs before exiting the function app
def exit_script(conn, start_utc_timestamp, category):
    # Set last ingested time for category
    set_last_ingested_time_for_category(conn, category)

    # Closing the postgres connection
    conn.close()

    # Logging function end time
    end_utc_timestamp = datetime.datetime.utcnow().replace(
    tzinfo=datetime.timezone.utc).isoformat()

    print_logs(f'Ingestion script ended at {end_utc_timestamp}')

    # Convert timestamp strings to datetime objects
    start_time = datetime.datetime.fromisoformat(start_utc_timestamp)
    end_time = datetime.datetime.fromisoformat(end_utc_timestamp)

    # Calculate time difference
    time_difference = end_time - start_time

    # Log the result
    print_logs(f'<----Time taken to run script (in seconds):{time_difference.total_seconds()}---->')

# Function to add all entries to dictionary and respective lists after formatting and cleaning
def add_all_entries_to_dict_and_respective_lists(feed, all_entries, primary_category, documents, metadatas, ids):
    # Run through each entry and add it to dictionary
    for entry in feed.entries:
        # Basic details
        id = entry.id.split("/abs/")[-1]
        title = format_string(entry.title)
        published = entry.published

        # Authors
        authors = None

        try:
            authors = [format_string(author.name) for author in entry.authors]
        except AttributeError:
            print_logs(f'No authors found for entry with id {id}', "error")

        # Comment
        comment = None

        try:
            comment = format_string(entry.arxiv_comment)
        except AttributeError:
            pass

        # Categories
        categories = [t['term'] for t in entry.tags]

        # Abstract
        formatted_abstract = None

        try:
            formatted_abstract = latex_to_plain_text(id, format_string(entry.summary))
        except Exception as e:
            print_logs(f'Error while formatting abstract for entry with id {id}: {e}', "error")
            continue

        # Add entry to lists
        documents.append(f'{title} - {formatted_abstract}') # Add combination of title and abstract as document
        metadatas.append({ "source": "arxiv", "published": published })
        ids.append(id)

        # Add entry to dictionary
        all_entries[id] = {
            'id': id,
            'title': title,
            'abstract': formatted_abstract,
            'categories': categories,
            'authors': authors,
            'comment': comment,
            'published': published
        }

def main():
    # Logging function start time
    start_utc_timestamp = datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc).isoformat()

    print_logs(f'Ingestion script started at {start_utc_timestamp}')

    # creating the postgres connection
    conn = None

    try:
        conn = psycopg2.connect(
                host=os.environ["POSTGRES_SERVER"],
                database=os.environ["POSTGRES_DATABASE"],
                user=os.environ["POSTGRES_USER"],
                password=os.environ["POSTGRES_PASSWORD"])
    except (Exception, psycopg2.DatabaseError) as e:
        print_logs(f"Error while connecting to postgres DB: {e}", "error")
        return

    # Base api query url
    base_url = os.environ["ARXIV_API_BASE_URL"]

    # Get details for next ingestion
    details = get_details_for_next_ingestion(conn)

    # Search parameters
    search_query = f'cat:{details[0]}'
    start_index = f'{details[1]}'
    max_results = os.environ["MAX_RESULTS"]
    sort_by = 'submittedDate'
    sort_order = 'ascending'

    query = f'search_query={search_query}&start={start_index}&max_results={max_results}&sortBy={sort_by}&sortOrder={sort_order}'

    # perform a GET request using the base_url and query
    response = urlopen(base_url + query).read()

    # parse the response using feedparser
    feed = feedparser.parse(response)

    # Logging metadata information
    print_logs(f"""<----QUERY INFORMATION ---->
                 Query: {feed.feed.title}
                 Total results for this query: {feed.feed.opensearch_totalresults}
                 Start index for this query: {feed.feed.opensearch_startindex}""")

    len_entries = len(feed.entries)
    print_logs(f'Length of entries - {len_entries}')

    if len_entries == 0:
        print_logs("No entries found. Exiting function.")
        exit_script(conn, start_utc_timestamp, details[0])
        return

    all_entries = dict()
    documents = []
    metadatas = []
    ids = []

    # Add all entries to dictionary and respective lists after formatting and cleaning
    add_all_entries_to_dict_and_respective_lists(feed, all_entries, details[0], documents, metadatas, ids)

    # Upsert to vector DB
    is_vector_db_upsert_successful = upsert_entries_to_vector_db_and_return_if_successful(documents, metadatas, ids)

    # If entries have been upserted to vector db successfully, then add them in postgres DB
    if is_vector_db_upsert_successful == True:
        is_postgres_db_upsert_successful = upsert_entries_to_postgres_db_and_return_if_successful(conn, all_entries)

        # If entries have been upserted to postgres db successfully, update metadata table with last ingested index, last ingested at and total ingested scholarly articles
        if is_postgres_db_upsert_successful == True:
            is_metadata_updation_successful = update_metadata_for_category_and_return_if_successful(conn, details[0], len_entries)

            print_logs(f'Metadata updation status for category {details[0]} -  {"success" if is_metadata_updation_successful == True else "failure"}')

    exit_script(conn, start_utc_timestamp, details[0])

main()