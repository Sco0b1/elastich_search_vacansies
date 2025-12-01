# embed_jobs.py
from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

ES_HOST = "http://localhost:9200"
INDEX   = "it_jobs"
FIELD   = "description"
EMBED   = "job_embedding"
BATCH   = 64

def embed_all_jobs(es: Elasticsearch, index_name: str):
    model = SentenceTransformer("intfloat/e5-small-v2")
    scroll = helpers.scan(
        es,
        index=index_name,
        query={"query": {"exists": {"field": FIELD}}},
        _source=[FIELD],
        preserve_order=True
    )
    actions, cnt = [], 0
    for doc in tqdm(scroll, desc="Embedding"):
        text = doc["_source"].get(FIELD, "")[:512]
        vector = model.encode(text).tolist()
        actions.append({
            "_op_type": "update",
            "_index":   index_name,
            "_id":      doc["_id"],
            "doc":      {EMBED: vector}
        })
        cnt += 1
        if len(actions) >= BATCH:
            helpers.bulk(es, actions, request_timeout=120)
            actions.clear()
    if actions:
        helpers.bulk(es, actions, request_timeout=120)
    print(f"Embedded {cnt} documents")

