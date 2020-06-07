## Parser IIIF conversion


### Lists

#### Set properties
- thumbnail 
- logo 
- behavior
- rendering 
- service 
- seeAlso 
- partOf

#### Annotation properties
- body
- target
- motivation
- source
- selector
- state
- stylesheet 
- styleClass

#### Object properties
- thumbnail -> "Image"
- logo -> Image"
- homepage -> ""
- rendering -> ""
- seeAlso -> "Dataset"
- partOf -> ""

#### Content type map
- "image" -> "Image",
- "audio" -> "Sound",
- "video" -> "Video",
- "application/pdf" -> "Text",
- "text/html" -> "Text",
- "text/plain" -> "Text",
- "application/xml" -> "Dataset",
- "text/xml" -> "Dataset"

### Steps (re-naming)
- [x] attribution to requiredStatement
- [x] viewingHint to behavior
- [x] description to summary
- [x] otherContent to annotations
- [x] within to partOf
- [x] Start canvas to start - fixing string starts to objects

### Steps
- [x] Convert language mapping on descriptive properties
- [x] Fix context fields
- [x] Fix profiles
- [x] Fix types
- [x] Fix non-array elements that need to be (set_properties)
- [x] Head requests for content type of remote items - behind configuration
- [x] Fix License field, move to metadata if multiple
- [x] Fix service type (nothing else)
- [x] Combine members, collections and manifests into items properties
- [x] contentLayer to supplementary (AnnotationCollection)
- [x] Convert canvas images to items into annotation page
- [x] Annotation page to Annotation list
- [x] Annotation: on -> target
- [x] Annotation: resource -> body
- [x] Annotation: motivation remove prefix

### Steps (todo)
- [ ] Convert multiple sequences into ranges
- [ ] Merge range structure items + make sure they all have type
- [ ] Remove behaviour=top from range
- [ ] Annotation: parse stylesheet
- [ ] Try to set `type` on everything - using format, remote types, URL format (content_type_map)
- [ ] Minting of new URLs for IDs that are not set, using IIIF resource guides

### Post-process steps
- [ ] Process range structures
- [ ] Add v3 context to top level
- [ ] Reorder keys

### Processing levels
- [x] Process service
- [x] Process resource (not service or language or not to be traversed)
- [x] Process generic (top level?)
- [x] Process collection
- [x] Process manifest
- [x] Process sequence
- [x] Process canvas
- [x] Process layer
- [x] Process annotation page (list)
- [x] Process annotation collection (layer)
- [x] Process annotation
- [x] Process specific resource
- [x] Process textual body
- [x] Process choice

### Post-processing
- [x] Post-process manifest

### Fixtures
- http://iiif.io/api/presentation/2.1/example/fixtures/collection.json
- http://iiif.io/api/presentation/2.1/example/fixtures/1/manifest.json
- http://iiif.io/api/presentation/2.0/example/fixtures/list/65/list1.json
- http://media.nga.gov/public/manifests/nga_highlights.json
- https://iiif.lib.harvard.edu/manifests/drs:48309543
- http://adore.ugent.be/IIIF/manifests/archive.ugent.be%3A4B39C8CA-6FF9-11E1-8C42-C8A93B7C8C91
- http://bluemountain.princeton.edu/exist/restxq/iiif/bmtnaae_1918-12_01/manifest
- https://api.bl.uk/metadata/iiif/ark:/81055/vdc_00000004216E/manifest.json
- https://damsssl.llgc.org.uk/iiif/2.0/4389767/manifest.json
- http://iiif.bodleian.ox.ac.uk/iiif/manifest/60834383-7146-41ab-bfe1-48ee97bc04be.json
- https://lbiiif.riksarkivet.se/arkis!R0000004/manifest
- https://d.lib.ncsu.edu/collections/catalog/nubian-message-1992-11-30/manifest.json
- https://ocr.lib.ncsu.edu/ocr/nu/nubian-message-1992-11-30_0010/nubian-message-1992-11-30_0010-annotation-list-paragraph.json
- http://iiif.harvardartmuseums.org/manifests/object/299843
- https://purl.stanford.edu/qm670kv1873/iiif/manifest.json
- http://dams.llgc.org.uk/iiif/newspaper/issue/3320640/manifest.json
- http://manifests.ydc2.yale.edu/manifest/Admont43
- https://manifests.britishart.yale.edu/manifest/1474
- http://demos.biblissima-condorcet.fr/iiif/metadata/BVMM/chateauroux/manifest.json
- http://www.e-codices.unifr.ch/metadata/iiif/sl-0002/manifest.json
- https://data.ucd.ie/api/img/manifests/ucdlib:33064
- http://dzkimgs.l.u-tokyo.ac.jp/iiif/zuzoubu/12b02/manifest.json
- https://dzkimgs.l.u-tokyo.ac.jp/iiif/zuzoubu/12b02/list/p0001-0025.json
- http://www2.dhii.jp/nijl/NIJL0018/099-0014/manifest_tags.json
- https://data.getty.edu/museum/api/iiif/298147/manifest.json
- https://www.e-codices.unifr.ch/metadata/iiif/csg-0730/manifest.json

### Other
 - Check all presence of all MUSTs in the spec and maybe bail?
 - A Collection must have at least one label.
 - A Manifest must have at least one label.
 - An AnnotationCollection must have at least one label.
 - id on Collection, Manifest, Canvas, content, Range,
 -    AnnotationCollection, AnnotationPage, Annotation
 - type on all
 - width+height pair for Canvas, if either
 - items all the way down
