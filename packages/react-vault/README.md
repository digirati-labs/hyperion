# React vault
React bindings for Hyperion vault.

## Road map

Technical proof of concepts
- Retrieval hooks
- Selectors that have dependencies on other selectors (typed)
- memoization of selectors
- possible move to react-redux-hooks

Set of proof of concept Vault bindings/hooks/contexts for:
- Collections
- Manifest
- Canvas
- Annotation
- Image service
- VaultContext

Complete the base hooks implementation for setting up contexts and selectors and build up hook collection
- AnnotationContext
- AnnotationPageContext
- CanvasContext
- CollectionContext
- ManifestContext
- useAnnotation
- useAnnotationPage
- useCanvas
- useCollection
- useDispatch
- useExternalAnnotationList
- useExternalCollection
- useExternalManifest
- useManifest
- useVault
- useVaultEffect

Create viewer abstractions
- SimpleViewerContext
- SingleCanvasContext

Canvas clock implementation
- useAnnotationsAtTime
- useCanvasClock
- useCanvasTimeline

Other helpers
- RangeContext
- usePaintingAnnotations
- useRange
- useSearchService
- useVirtualCanvas


### New hooks

#### useRenderingStrategy
There are many ways that a canvas can be rendered, some are easier than others. A hook 
that breaks these down into easier to render chunks will make iteratively supporting 
features easier.

This hook will return a type, some data and some actions. The types may be something like:

- Single image - A single image or image service.
- Composite image - A composition of more than one image or image service.
- Choice - A choice that needs to be given to the user (with functions to make choice)
- Audio - A single audio file, or sequential audio files
- Video - A single video file, or sequential video files
- Complex timeline - A composite of either multiple audio, video and composite images on a timeline.

This gives implementations a goal, and can easily let users know that they don't support 
the given canvas without an error. 

The data models returned from this strategy should be similar to each other. A single image 
should have a way to load an image service, generate tiles or fixed sizes. Composite image 
should be the same as single image but with multiple. A choice should be available from the 
hook regardless of the type, to support a menu-like system for choices even after a choice 
is made. Audio and video should use a similar interface with controls. Complex timeline should 
be very similar to audio/video with the same controls but with additional structure similar 
to composite image. 

```typescript
type UseRenderingStrategy = {
  type: 'single-image' | 'composite-image' | 'audio' | 'video' | 'complex-timeline';
  image: { type: 'fixed-size' } | { type: 'image-service' } | null;
  images: [];
  media: { type: 'audio' } | { type: 'video' } | { type: 'sequence' };
  duration: number;
  choice: {} | null;
}
```

## Querying and indexing

```ts

// Builds a memoized query
const filter = useFilter(() => {
  type: 'Canvas',
  id: id => id.startsWidth(`https://${myDomain}/`),
}, [myDomain]);

// The first time this is called it will build an index based on your query. (label + $contains)
const search = useVaultSearch([filter, { label: { $contains: `my-query` } }]);

//
search.results // now contains the results.

// Imperative example.
// For this filter to work, it must match reference equality.
const myFilterObject = vault.createFilter({
  type: 'Canvas',
  id: id => id.startsWidth('https://mydomain/'),
});

const myIndex = vault.createIndex({
  name: 'My index',
  refresh: true,
  filter: myFilterObject,
  indexes: ['viewingHint'],
});

// This is roughly what would be stored.
const state = {
  indexes: [
    {
      filter: myFilterObject,
      index: {
        viewingHint: {
          individuals: ['http://manifest-1/canvas-1.json'], 
          paged: ['http://manifest-1/canvas-2.json', 'http://manifest-1/canvas-3.json'],
        }
      }
    }
  ]
};

// And this is how it would be used.
const results = vault.query([myFilterObject, { 
  // This would be pre-filtered by the index.
  viewingHint: 'individuals',
  // Then this would be executed against the found objects.
  title: { $contains: 'Test' },
}]);
```


## Vault event manager

```js

// desired API:

const annotation = getAnnotationFromSomwehere();
const manager = useEventManager();

useEffect(() => {
  const lastAnnotation = annotation;
  const clickHandler = (e, anno) => {
    // ...
  };
  
  manager.select(lastAnnotation, 'optional-label').addEventListener('click', clickHandler);

  return () => {
    manager.select(lastAnnotation).removeEventListener('click', clickHandler);
  }
}, [annotation]);

// ...

<MyAnnotationComponent {...mananger.eventsFor(annotation)} />

// .. or

const annotationEvents = useEvents(annotation, 'optional-label');

<MyAnnotationComponent {...annotationEvents} />

// .. or

const div = useRef();

useBindEvents(div, annotation, 'optional-label');

<MyAnnotationComponent ref={div} />

```



### Storing annotation pages

- Annotation pages on canvases
- Annotation pages on manifests
- Annotation pages with manifestId in meta
- Annotation pages with canvasId in meta

#### Meta

Example state:
```js
const state = {
  meta: {
    'https://example.org/annotation-list/1': {
      annotationListManager: {
        isActive: true,
        resources: ['https://example.org/manifest-1'],
      }
    },
  }
};
```
