---
name: Normalization
order: 2
---
# Normalization
Database normalization is the process of structuring a relational database in accordance with a series of so-called normal forms in order to reduce data redundancy and improve data integrity. – [Wikipedia](https://en.wikipedia.org/wiki/Database_normalization)

Is this framework a database then? No, and yes, but mostly no.

Normalisation of IIIF resources is useful when you start working with massive collections or many different resources
that you want to keep organised. It can also help to maintain a stable state object (for use in something like Redux)
that makes managing external resources that have to be fetched, much easier.

The process of normalisation takes a deeply nested structure of resources and flattens it down into a very shallow structure. So a manifest may go from:

```json
{
  "@context": [
    "http://www.w3.org/ns/anno.jsonld",
    "http://iiif.io/api/presentation/{{ page.major }}/context.json"
  ],
  "id": "https://example.org/iiif/book1/manifest",
  "type": "Manifest",
  "label": {"en": ["Image 1"]},
  "items": [
    {
      "height": 1800,
      "id": "https://example.org/iiif/book1/canvas/p1",
      "items": [
        {
          "id": "https://example.org/iiif/book1/page/p1/1",
          "items": [
            {
              "body": {
                "format": "image/png",
                "height": 1800,
                "id": "http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png",
                "type": "Image",
                "width": 1200
              },
              "id": "https://example.org/iiif/book1/annotation/p0001-image",
              "motivation": "painting",
              "target": "https://example.org/iiif/book1/canvas/p1",
              "type": "Annotation"
            }
          ],
          "type": "AnnotationPage"
        }
      ],
      "type": "Canvas",
      "width": 1200
    }
  ]
}
```

To something like this:
```json
{
  "annotationPages": {
    "https://example.org/iiif/book1/page/p1/1": {
      "id": "https://example.org/iiif/book1/page/p1/1",
      "type": "AnnotationPage",
      "items": [
        "https://example.org/iiif/book1/annotation/p0001-image"
      ]
    }
  },
  "annotations": {
    "https://example.org/iiif/book1/annotation/p0001-image": {
    "id": "https://example.org/iiif/book1/annotation/p0001-image",
      "type": "Annotation",
      "body": {
        "format": "image/png",
        "height": 1800,
        "id": "http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png",
        "type": "Image",
        "width": 1200
      },
      "motivation": "painting",
      "target": "https://example.org/iiif/book1/canvas/p1"
    }
  },
  "canvases": {
    "https://example.org/iiif/book1/canvas/p1": {
      "id": "https://example.org/iiif/book1/canvas/p1",
      "type": "Canvas",
      "items": [
        "https://example.org/iiif/book1/page/p1/1"
      ],
      "height": 1800,
      "width": 1200
    }
  },
  "manifests": {
    "https://example.org/iiif/book1/manifest": {
      "@context": [
        "http://www.w3.org/ns/anno.jsonld",
        "http://iiif.io/api/presentation/{{ page.major }}/context.json"
      ],
      "id": "https://example.org/iiif/book1/manifest",
      "type": "Manifest",
      "label": { "en": ["Image 1"] },
      "items": [
        "https://example.org/iiif/book1/canvas/p1"
      ]
    }
  }
}
```

This is a scalable way to store many IIIF resources in a single state.

## JSON-LD is a graph

## Flattening the graph

## Normalization

## Using normalized resources

### References
