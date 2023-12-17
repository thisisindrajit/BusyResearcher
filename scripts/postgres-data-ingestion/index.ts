/*
Script steps:

1. Read the json file.
2. Format the data to be inserted into the database.
3. Connect to the database.
4. Insert the data into the database.
*/

const fs = require("fs");
const { Client } = require("pg");
const dotenv = require("dotenv");
const readline = require("readline");

// Load environment variables from .env file
dotenv.config();

// TYPES

type ScholarlyArticleVersion = {
  version: string;
  created: string;
};

type ParsedAuthor = [string, string, string];

type ScholarlyArticle = {
  id: string;
  submitter?: string;
  authors: string;
  title: string;
  comments?: string;
  "journal-ref"?: string;
  doi?: string;
  "report-no"?: string;
  categories?: string;
  license?: string;
  abstract: string;
  versions?: ScholarlyArticleVersion[];
  update_date?: string;
  authors_parsed: ParsedAuthor[];
};

// CONSTANTS

// Specify the path to your large JSON file
// const jsonFilePath = "/Users/indrajit/Downloads/arxiv-metadata-oai-snapshot.json";
const jsonFilePath =
  "/Users/indrajit/Desktop/Indrajit/Projects/busyresearcher/scripts/postgres-data-ingestion/input-data.json";
const formattedJsonFilePath =
  "/Users/indrajit/Desktop/Indrajit/Projects/busyresearcher/scripts/postgres-data-ingestion/formatted-data.json";

// Config for PostgreSQL database
const config = {
  user: process.env.DB_USER || "",
  host: process.env.DB_HOST || "",
  database: process.env.DB_DATABASE || "",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432", 10),
};

// FUNCTIONS

// Function to read and format JSON content
const processAndFormatJson = async (
  filePath: string
): Promise<ScholarlyArticle[]> => {
  try {
    console.log("Started processing and formatting JSON data...");

    let formattedData: ScholarlyArticle[] = [];

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      try {
        const jsonData: ScholarlyArticle = JSON.parse(line);

        // TODO: Format data before pushing to the array
        formattedData.push(jsonData);
      } catch (error: any) {
        console.error(`Error processing line: ${error.message}`);
      }
    }

    // Write to a new JSON file. TODO: Remove this later.
    fs.writeFileSync(formattedJsonFilePath, JSON.stringify(formattedData));

    return formattedData;
  } catch (error: any) {
    throw new Error(`Error processing and formatting JSON: ${error.message}`);
  }
};

// Function to insert formatted JSON data into PostgreSQL database
// const insertIntoDatabase = async (dataToInsert: ScholarlyArticle[]): Promise<void> => {
//   const client = new Client(config);
//   await client.connect();

//   try {
//     // Your database insert logic here
//     const query =
//       "INSERT INTO public.scholarly_articles (column1, column2) VALUES ($1, $2)";

//     for (const item of dataToInsert) {
//       await client.query(query, [item.property1, item.property2]);
//     }

//     console.log("Data inserted successfully.");
//   } catch (error: any) {
//     throw new Error(`Error inserting data into the database: ${error.message}`);
//   } finally {
//     await client.end();
//   }
// };

// Main function to execute the script
const main = async (): Promise<void> => {
  try {
    const formattedData = await processAndFormatJson(jsonFilePath);
    // await insertIntoDatabase(formattedData);
  } catch (error: any) {
    console.error(`Inserting into Postgres database failed: ${error.message}`);
  }
};

// Run the script
main();
