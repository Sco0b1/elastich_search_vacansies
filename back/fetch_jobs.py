# fetch_jobs.py
import json
import requests
from datetime import datetime
from elasticsearch import helpers


API_URL = "https://remotive.com/api/remote-jobs"
INDEX   = "it_jobs"
BATCH   = 100

def parse_job(raw: dict) -> dict:
    """Преобразует сырые данные в формат, который мы хотим хранить."""
    return {
        "title":       raw.get("title", "")[:200],
        "description": raw.get("description", "")[:5000],
        "company":     raw.get("company_name", ""),
        "location": raw.get("candidate_required_location", "remote"),
        "experience_level": raw.get("some_experience_field", ""),
        "job_type": raw.get("job_type", ""),
        "salary": raw.get("salary", "")

    }

def fetch_and_index_jobs(es, index_name: str):
    resp = requests.get(API_URL, timeout=30)
    resp.raise_for_status()
    jobs = resp.json().get("jobs", [])
    print(f"Fetched {len(jobs)} jobs")

    actions = []
    for raw in jobs:
        doc = parse_job(raw)
        actions.append({
            "_op_type": "index",
            "_index":   index_name,
            "_id":      raw.get("id"),
            "_source":  doc
        })
        if len(actions) >= BATCH:
            helpers.bulk(es, actions, request_timeout=60)
            actions.clear()
    if actions:
        helpers.bulk(es, actions, request_timeout=60)
    print("Raw documents indexed.")
