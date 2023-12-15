# sanity-elasticsearch-connector

## Installation

## Elasticsearch Setup

### Cloud Elasticsearch

1. [Sign up for an Elasticsearch Cloud account](https://cloud.elastic.co/).
2. Create a deployment. The free tier is sufficient for development.

### Local Insecure Elasticsearch

Run Elasticsearch in a Docker container:

```bash
docker run \
       -p 9200:9200 \
       -p 9300:9300 \
       -e "discovery.type=single-node" \
       -e "xpack.security.enabled=false" \
       docker.elastic.co/elasticsearch/elasticsearch:8.10.0
```

(Only suitable for local development, without SSL.)

### Environment variables

```
SANITY_PROJECT_ID=yourProjectId
SANITY_DATASET=yourDataset
#SANITY_TYPES=collectionObject,collectionArtist,exhibition,page,product
SANITY_TYPES=collectionObject,collectionArtist
ELASTIC_USE_CLOUD=false
ELASTIC_LOCAL_NODE=http://localhost:9200
ELASTIC_CLOUD_ID=yourCloudId
ELASTIC_CLOUD_USERNAME=yourCloudUsername
ELASTIC_CLOUD_PASSWORD=yourCloudPassword
ELASTIC_INDEX_NAME=content
CHUNK_SIZE=1000
```

## Test

### Run the tests

```
npm test:watch
```

## Run

### Run the sync

```
ts-node src/sync
```

## TODO

Museum Location: only getting museumLocationId. Maybe museum location needs to be a document.

Artist: is it a "collectionArtist" or an "Artist" augmented with collectionArtist data?
