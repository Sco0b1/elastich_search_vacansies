#!/usr/bin/env python3
# main.py
import json
import sys
from elasticsearch import Elasticsearch, exceptions, ApiError
from fetch_jobs import fetch_and_index_jobs
from embed_jobs import embed_all_jobs

ES_HOST = "http://localhost:9200"
INDEX   = "it_jobs"
MAPPING_FILE = "jobs_mapping.json"

def create_index_if_not_exists(es):
    try:
        if not es.indices.exists(index=INDEX):
            mapping = json.load(open(MAPPING_FILE, encoding="utf-8"))
            es.indices.create(index=INDEX, body=mapping)
            print(f"Index `{INDEX}` created.")
        else:
            print(f"Index `{INDEX}` already exists.")
    except ApiError as e:
        print("Error creating index:", e)
        sys.exit(1)

def main():
    es = Elasticsearch(ES_HOST, request_timeout=60)

    create_index_if_not_exists(es)
    fetch_and_index_jobs(es, INDEX)
    embed_all_jobs(es, INDEX)
    print("✅ All done.")

if __name__ == "__main__":
    main()
