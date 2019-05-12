---
name: IIIF refresher
order: 2
---
# IIIF
The International Image Interoperability Framework&trade; – IIIF – is a set of standards outlining a structure for
institutions who have Digitised books, manuscripts, newspapers, art work and many others. The 4 currently published 
specifications are the Image API, Presentation API, Authentication API and Search API.

## Meet the APIs
These are the published and ratified IIIF standards, the current versions that are in use at dozens of institutions
sharing their vast collections with millions of images to the public.  

### Image API
> The Image API specifies a syntax for web requests that lets us ask for images at different sizes and in different 
formats and qualities. Each image endpoint is a web service that returns new derivative images. We can ask for the 
full image, or regions of the image. We can rotate, scale, distort, crop and mirror the whole image, or parts of 
the image.

– Tom Crane, [An introduction to IIIF](https://resources.digirati.com/iiif/an-introduction-to-iiif/)

In a nutshell, an image server that implements the Image API will slice up a very large image into small tiles that 
can be requested atomically to drive deep zoom experiences without downloading enormous images. The specification 
itself describes how an image server advertises all of the ways that an image can be sliced, at what scale and at
what size. From this information you can build up a list of URLs to images for each tile.

<div class="fesk-info">
In the Hyperion framework, reading and understanding this specification is done by <a href="/atlas/introduction">Atlas</a>
which contains a parser for going from a tile source endpoint to a full set of tiles that can be painted onto the 
world.
</div>

#### See it in action
<div id="viewer"
       data-element="canvas-panel-viewer"
       data-manifest="https://cudl.lib.cam.ac.uk/iiif/MS-ADD-00269"
       data-canvas="https://cudl.lib.cam.ac.uk/iiif/MS-ADD-00269/canvas/1"
       style="width: 100%; height: 500px; position: relative; background: #000;"
  ></div>

<div style="font-size: 12px; color: #999; margin: 20px 0;">
Provided by Cambridge University Library. Zooming image © Cambridge University Library, All rights reserved. Images made available for download are licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License (CC BY-NC 3.0) This metadata is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License.
</div>

This image is served from the IIIF Image API. This is a 
very simple example of a viewer in IIIF. You can <a href="javascript: void(0);" id="zoomIn">zoom in</a> and also 
<a href="javascript: void(0);" id="zoomOut">zoom out</a> of the image. This is thanks to the IIIF Image API. 

<script type="application/javascript">
document.getElementById('zoomIn').addEventListener('click', function() {
  document.getElementById('viewer').osd.zoomIn();
})
document.getElementById('zoomOut').addEventListener('click', function() {
  document.getElementById('viewer').osd.zoomOut();
})
</script>

### Presentation API
> The Presentation API describes “just enough metadata to drive a remote viewing experience”. This metadata is a IIIF 
Manifest. The Manifest represents the thing. A book. A painting. A film. A sculpture. An opera. A long-playing record. 
A manuscript. A map. An aural history field recording. A videocassette of a public information film. A laboratory 
notebook. A diary. All of these things would be represented by a IIIF Manifest. You publish IIIF manifests for each 
of your objects.

– Tom Crane, [An introduction to IIIF](https://resources.digirati.com/iiif/an-introduction-to-iiif/)

It is the heart of IIIF, the main entry point to IIIF resources. As mentioned all real world objects that you can
pick up and hold can be represented in IIIF, well that's the theory. It's the job of the manifest to contain as 
much information to accurately represent that object, although not always describe that object. Some metadata will
still be external to the manifest. Manifests are made up of canvases, which for a book may represent a page. Canvases
are abstract spaces that you can "paint" onto. You paint annotations onto canvases, and these annotations can contain
Image API compliant services, enabling deep zoom. 

There is a vast amount of depth to the Presentation specification, with many types of resources:
* Collections
* Manifests
* Canvases
* Annotations
* Annotation Pages
* Annotation Collections
* Ranges
* Services
* Content resources

Each of these resources can have JSON properties attached to them, they fit into 4 categories:
* **Technical** – this is for machine readable properties where the values have defined behaviors, like the "id" field.
* **Descriptive** – this is for labels, summaries and other human readable text.
* **Structural** – like Manifests that contain a list of canvases under an "items" property.
* **Linking** – like external links to logos that can be attached to manifests or canvases under a "logo" property.

Generally viewers will read the technical properties required to view a resource, try to present as much of the
descriptive properties to the user as possible, use the structural properties to build up a navigation through
resources and then provide external links or visual elements with the linking properties.

There are some exceptions though to this simple grouping of properties.

* **Poster canvas** – this is usually an external or internal URL to a canvas. It looks and acts like a linking property,
but is defined as a Descriptive property.
* **Annotations / Items** - these two properties can both contain annotations (paged) when on a canvas. The specification
does state that "items" in a canvas must be painting, and the "annotations" property can have non-painting annotations.
* **Annotations** embedded inside IIIF resources do not conform to W3C annotation model standards, although they might 
accidentally. Mainly the internationalisation of the labels. In addition, annotations can have many IIIF specific 
properties, making them a challenge to display.

<div class="fesk-info">
Be sure to <a href="https://iiif.io/api/presentation/3.0/" target="_blank">check out the specification</a> for more information. In Hyperion, 
Presentation V3 is the only version supported, any older IIIF resources will automatically be upgraded on the fly.
In the future Hyperion will only ever support the very latest Presentation version, upgrading older versions.
</div> 

### Authentication API
> Content providers that need to restrict access to their resources may offer tiered access to alternative versions 
that go beyond a simple all-or-nothing proposition. These alternative versions could be degraded based on resolution, 
watermarking, or compression, for example, but are often better than no access at all.

– [IIIF Authentication API 1.0](https://iiif.io/api/auth/1.0/)

The authentication API is a flexible API for adding authentication to IIIF Image API resources. This specification
will be implemented in the Hyperion Framework, offering a simple way to authenticate both IIIF Image API resources
and other more experimental support for other data types using examples from the community.

<div class="fesk-info">
Keep an eye out for this feature in the future, if you're interested in developing this reach out on 
<a href="https://github.com/stephenwf/hyperion" target="_blank">Github</a>
</div>

### Search API
The IIIF Search API allows for the searching of annotations that are associated with a IIIF resource, with viewers
typically painting these annotations in a UI to display these search results. Use cases from the specification:

* Searching OCR generated text to find words or phrases within a book, newspaper or other primarily textual content.
* Searching transcribed content, provided by crowd-sourcing or transformation of scholarly output.
* Searching multiple streams of content, such as the translation or edition, rather than the raw transcription of the content, to jump to the appropriate part of an object.
* Searching on sections of text, such as defined chapters or articles.
* Searching for user provided commentary about the resource, either as a discovery mechanism for the resource or for the discussion.
* Discovering similar sections of text to compare either the content or the object.

<div class="fesk-info">
Soon in Hyperion, you will be able to very simply fetch and use a search service on a IIIF resources and get back
results that can be painted onto Atlas to drive the same rich IIIF experience.
</div>

## Meet the new APIs
### Change Discovery API
### Content State API

## Meet the viewers
### Mirador
### Universal Viewer
### Diva
### Leaflet IIIF

## Meet the editors
### Bodleian manifest editor
### IIIF Manifest editor
### Narrative editor
### Annotation studio
### Mirador (again!)
### IIIF Annotation editor (https://iiif.harvard.edu/iiif-annotations-editor/)

