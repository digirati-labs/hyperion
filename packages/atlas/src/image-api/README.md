## Summary of logic and flow.

Where a thumbnail can appear:
- 1 thumbnail property of canvas
   - 1.1 fixed size
   - 1.2 embedded service - fixed sizes
   - 1.3 embedded service - profile 1 / 2 (custom size)
   - 1.4 ID of thumbnail (without width/height)
   - 1.5 dereference service - fixed sizes
   - 1.6 dereference service - profile allowing custom size
   - 1.7 dereference service - if smallest scale factor is single image
- 2 thumbnail property of image resource (annotation body)
   - 2.1 fixed size
   - 2.2 embedded service - fixed sizes
   - 2.3 embedded service - profile 1 / 2 (custom size)
   - 2.4 ID of thumbnail (without width/height)
   - 2.5 dereference service - fixed sizes
   - 2.6 dereference service - profile allowing custom size
   - 2.7 dereference service - if smallest scale factor is single image
- 3 first image resource in canvas
   - 3.1 image with fixed height and width
   - 3.2 embedded service - fixed sizes
   - 3.3 embedded service - profile 1 / 2 (custom size)
   - 3.4 ID of image resource (possibly full width/height)
   - 3.5 dereference service - fixed sizes
   - 3.6 dereference service - profile allowing custom size
   - 3.7 dereference service - if smallest scale factor is single image

If we are looking for a thumbnail, we should check in order:
- 1.1
- 1.2
- 1.3
- 2.1
- 2.2
- 2.3
- 3.1
- 3.2
- 3.3
- 1.5 (if dereference = true)
- 1.6 (if dereference = true)
- 1.7 (if dereference = true)
- 2.5 (if dereference = true)
- 2.6 (if dereference = true)
- 2.7 (if dereference = true)
- 3.5 (if dereference = true)
- 3.6 (if dereference = true)
- 3.7 (if dereference = true)
- 1.1 - 3.3 but choosing closest size from all (if fallback = true)
- 1.4
- 2.4
- 3.4

## Plan for rebuilding this method.
 All core functions ill live inside Atlas, as the image-service-understanding library.
 Anything that Atlas currently depends on from Vault will be moved to Atlas.
- new cache of all previous images, with their sizes etc.
- getFixedSizeFromImage(contentResource)
- getFixedSizesFromService(service)
- supportsCustomSizes(service)
- getCustomSizeFromService(service, config)
- getUnknownThumbnailFromResource(contentResource)
- dereferenceImageService(service)
- getSmallestScaleFactorAsSingleImage(service)

### The cache:
```typescript
type Cache = 
  | { 
    id: string, 
    height: number, 
    width: number 
  } 
  | { 
    id: string, 
    minWidth: number, 
    maxWidth: number, 
    minHeight: number, 
    maxHeight: number 
  }
```

## A new, smarter way to dereference
- Dereference first resource
- Extract image server fingerprint
   - image server type
   - domain name
- Deconstruct into template to guess values of second resource
- optionally load second resource with same domain to verify template matches
- Mark as safe - continue generating image service requests without making them
- Detect image errors - mark as unsafe, load each one individually (lazy if possible).


Note on contexts.
Thumbnail size context: optional - use defaults
manifest/canvas context - at least one
Can be used to get thumbnail for manifest or canvas
