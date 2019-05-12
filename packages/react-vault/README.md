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
