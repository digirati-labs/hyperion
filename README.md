<div align="center"><img src="https://raw.githubusercontent.com/stephenwf/hyperion/master/hyperion.png" width="390" /></div>
<br />

Experimental framework for working with IIIF in JavaScript and Typescript.

Aims to provide safe typings for valid Presentation 3 JSON-LD and normalization step (also with typings). 

3 steps in that the library does:
- Preprocess resources to ensure valid Presentation 3
- Cast JSON to Typescript interface
- Normalize resources into flat tree of resources

This library can be the basis of other tools that want to work deeper with IIIF Presentation 3 resources. 

## Using JavaScript

**NOTE: The package is not yet published and name may change**

If you're IDE supports it (like Intelij and VSCode) you can develop using types and hints by using the small utilities
that will cast JSON objects to the strongly typed definitions. This way you get the same warnings when you try to access
non-existent properties, or nullable ones. 

```javascript
import { cast } from 'hyperion-framework';

const json = getManifestFromUrlSomewhere('http://...');

const manifest = cast.toManifest(json); 

// You now have a strongly typed Manifest object here
console.log(manifest.items[0].annotations);
```

You can also use various utilities (in progress) included:

### Pattern matching
Pattern matching is an imitation of a functional programming behaviour where you can run some code when certain
criteria matches, typically the type they have. This is used, with a JavaScript implementation to open up the type
system for use in JavaScript so that you can handle fields in IIIF that have many different shapes and get strong
typing on them. The body field of an Annotation is one example that has a pattern matching implementation: 
 
```javascript
import { cast, matchAnnotationBody } from 'hyperion-framework';

const manifest = cast.toManifest(getManifestFromUrlSomewhere('http://..'));

const getBodyTypes = matchAnnotationBody({
    String: () => 'ExternalResource',
    ChoiceBody: () => 'Choice',
    ContentResource: resource => resource.type,
    SpecificResource: resource => resource.type,
    OtherContentResource: resource => resource.type,
});

// Not this is unsafe, as canvas.items or annotationPage.items may be undefined.
const bodyTypes = getBodyTypes(manifest.items[0].items[0].items[0].body);

console.log(bodyTypes); // ['ExternalResource', 'Video', 'Image'];
```

The object you pass into `matchAnnotationBody` takes in a map of `Type => function` and when you pass an annotation
body to that function it will run through all of the bodies and return you an array of results after passing them through
your code. 

This can be incorporated into UI libraries, such as React, Stencil or VueJS to render different annotation bodies, or be 
used to process annotation bodies.

## Using Typescript
With typescript you get access to the Types and Interfaces directly, and you can Type any functions you create to
manipulate IIIF data accordingly. Rewriting the first Javascript example in Typescript: 
```typescript
import { Manifest } from 'hyperion-framework';

const manifest: Manifest = getManifestFromUrlSomewhere('http://...') as Manifest;

console.log(manifest.items[0].annotations);
```
You can use Typescripts own casting to get the types on plain JSON objects.

There's also an extension to the pattern matching, allowing you to type all the way through your matcher. In
typescript, we can also access the JSON using the nullable accessor, so the calls are always safe. The IDE will
tell you when you try to access a property that needs that check:
```typescript
import {
  Manifest, 
  ChoiceBody, 
  ContentResource, 
  SpecificResource,
  matchAnnotationBody
} from 'hyperion-framework';

const manifest: Manifest = getManifestFromUrlSomewhere('http://...') as Manifest;

const getBodyTypes = matchAnnotationBody<string>({
   String: (s: string): string => 'ExternalResource',
   ChoiceBody: (c: ChoiceBody): string => 'Choice',
   ContentResource: (w: ContentResource): string => w.type,
   SpecificResource: (s: SpecificResource): string => s.type,
   OtherContentResource: (o: ContentResource): string => o.type,
});

// Note the `items![0]` for the safe nullable check. 
const bodyTypes: string[] = getBodyTypes(manifest.items[0].items![0].items![0].body); 

console.log(bodyTypes); // ['ExternalResource', 'Video', 'Image']
``` 

**Note: In this example I've used complete types on all functions, they can mostly all be inferred, so the code you write
will look more like the JS example, with the same Type-safety**

## Normalisation
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

The functionality of this is adapter from [IIIF Redux](https://github.com/stephenwf/iiif-redux) and is not yet ready. 

## Traversal
To achieve the Normalisation step, there is also a IIIF-specific traversal tool that lets you traverse through a deeply 
nested IIIF resource choosing specific steps to run on specific resources. This could be a way to gather statistics about
the resource, fix inconsistencies, or to map it to a completely different structure. 

Because its aware of the structure of IIIF, its smarter than a brute force object-traversal tool with the added bonus of strongly typed all the way down.

The simplest traversal you can do is the "all" type:
```typescript
import { Traverse } from 'hyperion-framework';

const ids: string[] = [];
const traversal = Traverse.all(
  (resource: any): any => {
    if (resource.id) {
      ids.push(resource.id);
    }
    return resource;
  }
);

traversal.traverseManifest(someManifest);
```

This goes through all of the currently supported IIIF resources in a structure and logs their ID to some variable, a 
simple example, but you can peel away the abstraction to traverse individual types too:

```typescript
import { Traverse } from 'hyperion-framework';

const canvasList: string[] = [];
const annotationList: string[] = [];
const traversal = new Traverse({
  canvas: [
    currentCanvas => {
      canvasList.push(currentCanvas.id);
      return currentCanvas;
    },
  ],
  annotation: [
    currentAnnotation => {
      annotationList.push(currentAnnotation.id);
      return currentAnnotation;
    },
  ],
});

traversal.traverseManifest(someManifest);
```

The API for this is likely to change a lot, but you can see that each type takes in an array of transform steps, they
each return the same type of resource (in this case the same resource) as the input, allowing you to immutably change fields
 on the resources. 
 
 
 ## Contributing
 All contributions and ideas are welcome. 
