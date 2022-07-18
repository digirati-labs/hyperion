## Motivations

- Painting
- Tagging
- Supplementing
- Commenting

## Body types

- Images
- Image with image service
- Audio
- Video
- Text (vtt)
- TextualBody
- GeoJSON feature
- Choice
- Alto XML

## Target + selector types

- Full canvas
- Full canvas (scaled)
- Time target (t=123)
- Time range target (t=123,456)
- Region (x, y, width + height)
- SVG target
- Point (x, y)

### Compatible selector conversions

- Fragment -> SVG
- Geo polygon -> SVG
- SVG -> Fragment (lossy)
- String + Fragment -> Fragment

## Library features

- Code building (standalone)
- Code editing (standalone)
- Vault integrated building
- Vault integrated editing
- Annotation query API\*
- Form API - for editing/creating
- Target editing API
- Atlas bindings (?)
- Annotation support levels\*\*
- Suggested UI rendering (docs)

\*Query implementation like:

```js
const query = createQuery({
  motivation: 'painting',
  type: 'Image',
  options: {
    withImageService: true,
    custom: img => {
      // Exactly one service.
      return img?.service.length === 1;
    },
  },
});

const filteredList = query(annotationList);
```

Or a matcher, with the same API:

```js
const matcher = createMatcher({
  motivation: 'painting',
  type: 'Image',
});

if (matcher(annotation)) {
  // ...
}
```

With potential for composition:

```js
const secondMatcher = createMatcher.OR([
  matcher,
  {
    type: 'Audio',
  },
]);

if (secondMatcher(annotation)) {
  // ...
}
```

\*\*with implementation helpers, maybe something like this:

```js
const iterator = implementationLevel3({
  Choice: (choices, choose) => {},
  Image: {
    Whole: ({ size, url }) => {},
    Rect: ({ size, url }, region) => {},
    // Choice: (choices, choose) => {}, // optional choice per resource type
  },
  Audio: {
    Whole: ({ duration, url, format }) => {},
    TimeFragment: ({ duration, url, format }, { from, to }) => {},
  },
  Highlight: {
    Rect: bounds => {},
    Polygon: points => {},
    SVG: ({ position, svg }) => {},
  },
  Comment: {
    Point: (comment, { x, y }) => {},
    Rect: (comment, bounds) => {},
    SVG: (comment, { position, svg }) => {},
  },
  // For text, the library could support loading formats like Alto into
  // individual text+rect regions.
  Text: {
    Rect: () => {},
  },
});

iterator(annotationPage); // Calls appropriate function.
```

## Example building patterns

Class-based builder (per motivation)

```js
const annotation = new PaintingAnnotation('https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image');
annotation.setBody(
  new ImageBody.PNG('http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png', {
    width: 1200,
    height: 1800,
  })
);
annotation.setTarget('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1');
```

Class based builder

```js
const annotation = new Annotation('https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image');
annotation.setBody(
  imageBody({
    id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
    format: 'image/png',
    width: 1200,
    height: 1800,
  })
);
annotation.setTarget('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1');
```

Functional / object based

```js
const annotation = createAnnotation('https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image');
annotation.body = imageBody({
  id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
  format: 'image/png',
  width: 1200,
  height: 1800,
});
annotation.target = 'https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1';
```

Factory based

```js
const annotation = createAnnotation(
  'https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image',
  anno => {
    anno.body = imageBody({
      id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
      format: 'image/png',
      width: 1200,
      height: 1800,
    });
    anno.target = 'https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1';
  }
);
```

Factory based (with helpers)

```js
const annotation = createAnnotation(
  'https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image',
  anno => {
    anno.setBody(
      anno.createImageBody({
        id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
        format: 'image/png',
        width: 1200,
        height: 1800,
      })
    );
    anno.setTarget('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1');
  }
);
```

Factory based (editing)

```js
const newAnnotation = editAnnotation(annotationJson, anno => {
  anno.setTarget('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p2');
});
```

Vault based (editing)

```js
editor.setVault(vault);
editor.editAnnotation('https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image', anno => {
  anno.setTarget('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p2');
});
```

## Annotation examples

Single image

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image",
  "type": "Annotation",
  "motivation": "painting",
  "body": {
    "id": "http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png",
    "type": "Image",
    "format": "image/png",
    "height": 1800,
    "width": 1200
  },
  "target": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1"
}
```

Single audio

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/0002-mvm-audio/canvas/page/annotation",
  "type": "Annotation",
  "motivation": "painting",
  "body": {
    "id": "https://fixtures.iiif.io/audio/indiana/mahler-symphony-3/CD1/medium/128Kbps.mp4",
    "type": "Sound",
    "format": "audio/mp4",
    "duration": 1985.024
  },
  "target": "https://iiif.io/api/cookbook/recipe/0002-mvm-audio/canvas/page"
}
```

Single video

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/0003-mvm-video/canvas/page/annotation",
  "type": "Annotation",
  "motivation": "painting",
  "body": {
    "id": "https://fixtures.iiif.io/video/indiana/lunchroom_manners/high/lunchroom_manners_1024kb.mp4",
    "type": "Video",
    "height": 360,
    "width": 480,
    "duration": 572.034,
    "format": "video/mp4"
  },
  "target": "https://iiif.io/api/cookbook/recipe/0003-mvm-video/canvas"
}
```

Simple image service

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/0005-image-service/annotation/p0001-image",
  "type": "Annotation",
  "motivation": "painting",
  "body": {
    "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen/full/max/0/default.jpg",
    "type": "Image",
    "format": "image/jpeg",
    "height": 3024,
    "width": 4032,
    "service": [
      {
        "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen",
        "profile": "level1",
        "type": "ImageService3"
      }
    ]
  },
  "target": "https://iiif.io/api/cookbook/recipe/0005-image-service/canvas/p1"
}
```

Video with subtitles

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/0219-using-caption-file/canvas/page/annotation",
  "type": "Annotation",
  "motivation": "painting",
  "body": [
    {
      "id": "https://fixtures.iiif.io/video/indiana/lunchroom_manners/high/lunchroom_manners_1024kb.mp4",
      "type": "Video",
      "height": 360,
      "width": 480,
      "duration": 572.034,
      "format": "video/mp4"
    },
    {
      "id": "https://fixtures.iiif.io/video/indiana/lunchroom_manners/lunchroom_manners.vtt",
      "type": "Text",
      "format": "text/vtt",
      "label": {
        "en": ["Captions in WebVTT format"]
      },
      "language": "en"
    }
  ],
  "target": "https://iiif.io/api/cookbook/recipe/0219-using-caption-file/canvas"
}
```

Polygon annotations

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/0139-geolocate-canvas-fragment/geoAnno.json",
  "type": "Annotation",
  "motivation": "tagging",
  "label": {
    "en": ["Annotation containing GeoJSON-LD coordinates that place the map depiction onto a Leaflet web map."]
  },
  "body": {
    "id": "https://iiif.io/api/cookbook/recipe/0139-geolocate-canvas-fragment/geo.json",
    "type": "Feature",
    "properties": {
      "label": {
        "en": ["Targeted Map from Chesapeake and Ohio Canal Pamphlet"]
      }
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-77.097847, 38.901359],
          [-77.02694, 38.901359],
          [-77.02694, 39.03404],
          [-77.097847, 39.03404]
        ]
      ]
    }
  },
  "target": "https://iiif.io/api/cookbook/recipe/0139-geolocate-canvas-fragment/canvas.json#xywh=920,3600,1510,3000"
}
```

SVG Selector

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/annotation/p2/svg",
  "type": "Annotation",
  "motivation": "supplementing",
  "body": {
    "language": "de",
    "type": "TextualBody",
    "value": "Gansenliessel"
  },
  "target": {
    "type": "SpecificResource",
    "source": "https://iiif.io/api/cookbook/recipe/canvas/p1",
    "selector": [
      {
        "type": "FragmentSelector",
        "value": "xywh=749,1054,338,460"
      },
      {
        "type": "SvgSelector",
        "value": "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><path d='M904.000000,1509.000000 L924.000000,1506.000000 L966.000000,1510.000000 L961.000000,1466.000000 L982.000000,1453.000000 L962.000000,1436.000000 L959.000000,1403.000000 L979.000000,1412.000000 L1004.000000,1411.000000 L1006.000000,1375.000000 L971.000000,1366.000000 L959.000000,1336.000000 L935.000000,1319.000000 L915.000000,1322.000000 L916.000000,1347.000000 L899.000000,1356.000000 L892.000000,1379.000000 L881.000000,1379.000000 L873.000000,1396.000000 L880.000000,1418.000000 L866.000000,1431.000000 L865.000000,1468.000000 L877.000000,1470.000000 L878.000000,1492.000000 L892.000000,1492.000000 L904.000000,1509.000000' /></g></svg>"
      }
    ]
  }
}
```

Tagging annotation

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/annotation/p0002-tag",
  "type": "Annotation",
  "motivation": "tagging",
  "body": {
    "type": "TextualBody",
    "value": "Gänseliesel-Brunnen",
    "language": "de"
  },
  "target": "https://iiif.io/api/cookbook/recipe/canvas/p1#xywh=749,1054,338,460"
}
```

Comment annotation

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/canvas/annotation1",
  "type": "Annotation",
  "motivation": "commenting",
  "body": {
    "type": "TextualBody",
    "value": "breath",
    "format": "text/plain"
  },
  "target": {
    "source": "https://iiif.io/api/cookbook/recipe/canvas/1",
    "selector": {
      "type": "PointSelector",
      "t": 27.660653
    }
  }
}
```

Comment annotation (range)

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/canvas/segment1/annotation/4",
  "type": "Annotation",
  "motivation": "commenting",
  "body": {
    "type": "TextualBody",
    "value": "repetition of 'her kind'",
    "format": "text/plain"
  },
  "target": {
    "source": "https://iiif.io/api/cookbook/recipe/canvas/1",
    "selector": {
      "type": "RangeSelector",
      "startSelector": {
        "type": "PointSelector",
        "t": 46.734653
      },
      "endSelector": {
        "type": "PointSelector",
        "t": 47.875068
      }
    }
  }
}
```

Choice annotation

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/annotation/p0001-image",
  "type": "Annotation",
  "motivation": "painting",
  "body": {
    "type": "Choice",
    "items": [
      {
        "id": "https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-natural/full/max/0/default.jpg",
        "type": "Image",
        "format": "image/jpeg",
        "width": 2000,
        "height": 1271,
        "label": { "en": ["Natural Light"] },
        "service": [
          {
            "id": "https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-natural",
            "type": "ImageService3",
            "profile": "level1"
          }
        ]
      },
      {
        "id": "https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-xray/full/max/0/default.jpg",
        "type": "Image",
        "format": "image/jpeg",
        "width": 2000,
        "height": 1271,
        "label": { "en": ["X-Ray"] },
        "service": [
          {
            "id": "https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-xray",
            "type": "ImageService3",
            "profile": "level1"
          }
        ]
      }
    ]
  },
  "target": "https://iiif.io/api/cookbook/recipe/canvas/p1"
}
```

Alto XML

```json
{
  "id": "https://iiif.io/api/cookbook/recipe/newspaper_issue_2-anno_alto",
  "type": "Annotation",
  "motivation": "supplementing",
  "body": [
    {
      "id": "{{ id.path }/newspaper_issue_2-alto_p1.xml",
      "type": "Dataset",
      "format": "application/xml",
      "profile": "http://www.loc.gov/standards/alto/",
      "label": {
        "en": ["ALTO XML"]
      },
      "language": "en"
    }
  ],
  "target": "https://iiif.europeana.eu/presentation/9200355/BibliographicResource_3000096302516/canvas/p1"
}
```
