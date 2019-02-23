// A full implementation of getting the correct thumbnail.
// Some of this logic should be moved to main Hyperion package
// Should work under:
// - Collections
// - Manifests
// - Canvas
// - Annotation
//
// It will take in a preferred size, with a sensible default.
// It will also take a maximum external resource, that will state how many resources down the chain its allowed to
// go to fetch a thumbnail. By default it would be 1 on canvas, 2 on manifest, 3 on collection.
// This will be, in React, the definitive way to get a thumbnail for the current resource.
// Possibly in the future an image service could be used to build up an image using tiles onto an HTML5 canvas
// and then a data-uri provided for the thumbnail, again increasing the likely-hood of a thumbnail.
