---
name: Background
order: 1
---
# Background
Hyperion is a JavaScript and Typescript framework for working with IIIF – International Image 
Interoperability Framework&trade;. Its purpose is to make working with IIIF easy and to both enable
and encourage the sharing of useful solutions to difficult problems in the space.

## Philosophy
For something to be truly useful, it has to be **very easy to use** but as **powerful as you need** it to be. 
Throughout this documentation you will see very high-level APIs to work quickly with IIIF to whip 
something together, but also a deeper dive, peeling back the abstractions. In each of the libraries
all of the internals are exposed. From the primitive building blocks, you could build a different
framework entirely for a different JSON-standard. 

## Code code code
On nearly every page you will come across quick summaries of functionality and how a certain "thing"
works and code snippets, like most documentation, but in addition you will also have the Framework in 
front of you in an online code editor to hack around in. Additionally, some pages may take a deeper dive 
into the technical choices or step through how the code under-pinning the functionality works. It's a 
mixed bag. This is both documentation for users of the framework, and developers building the framework.

## Credits
Hyperion is certainly not the first IIIF framework. Here are some of the fine examples IIIF libraries and 
frameworks, many of which Hyperion takes inspiration from.
* [Manifesto](https://github.com/IIIF-Commons/manifesto) and [Manifold](https://github.com/IIIF-Commons/manifold)
* [IIIF Manifest Layouts](https://github.com/sul-dlss/iiifManifestLayouts)
* [Mirador Viewer](https://github.com/ProjectMirador/mirador)
* [OpenSeadragon](https://github.com/openseadragon/openseadragon)
* [biiif](https://github.com/edsilv/biiif)

## Who created this?
My name is Stephen Fraser, and I've been working with IIIF for the past 3 years. I work at  [Digirati](https://digirati.com) 
as the frontend technical lead, working on Cultural Heritage projects. Mostly these projects are related 
to progressing the uses of IIIF, specifically with annotations.

Some of the work I've done with Digirati over the years with IIIF:
* [Canvas Panel](https://github.com/digirati-co-uk/canvas-panel) - A library for rapid development of bespoke IIIF viewers and experiences, some listed below
  * The [V&A](https://www.vam.ac.uk) worked with us to create a viewer for their [Ocean Liners](https://www.vam.ac.uk/articles/inside-an-ocean-liner-aquitania) exhibit
  * The [NUI Galway Library](http://library.nuigalway.ie) created a very unique [timeline viewer](https://exhibitions.library.nuigalway.ie/oshaughnessy-memoirs/memoir-engineering-experiences.html) with us.
  * The [Royal Academy of Arts](https://www.royalacademy.org.uk) recently won a Webby for their [Summer Exhibition](https://chronicle250.com/) for which we built a Canvas Panel based viewer with search
* [Annotation studio](https://annotation-studio.digirati.com) - An application for annotating IIIF content with structured JSON, simple text or a controlled vocabulary using W3C annotations. Used for crowd-sourcing campaigns at the National Library of Wales and also the Indigenous Digital Archives. It was also used to clean up annotations for the Royal Academy tagging.
* [Universal Viewer](http://universalviewer.io) - Although I'm a relatively new contributor to the Universal Viewer, I have worked with the British Library and their work on using the IIIF AV (Audio / Visual) specification inside the UV for their sounds project.
* [Timeliner](https://github.com/digirati-co-uk/timeliner) – A project from Indiana University to convert an older audio annotating tool to use IIIF.
* [Madoc Platform](https://github.com/digirati-co-uk/madoc-platform) - A crowd-sourcing platform (which itself uses Annotation Studio) for importing IIIF resources and creating sites to showcase them or set up websites to source annotations.
* [Wellcome Quilt](http://ghp.wellcomecollection.org/annotation-viewer/quilt/) - First IIIF Presentation 3 project I've worked on, with annotations that contain rotations and strange shapes.

Outside of Digirati I've also created some experimental projects, may of them are now consolidated into Hyperion.
* [IIIF Redux](https://github.com/stephenwf/iiif-redux) - state management for IIIF using redux
* [IIIF Image matrix](https://github.com/stephenwf/iiif-image-matrix) - a lightweight, math-heavy IIIF viewer
* [IIIF Universe viewer](https://iiif-universe.netlify.com) - Minimal, but ultra-fast IIIF collection viewer that uses JSON-streaming to start printing out the contents of collections as they are being downloaded.
* [Presentation 3 - scrapbook](https://github.com/stephenwf/presentation-3) - A presentation 3 JSON schema and validator, including the worlds most impractical editor.
* [Elucidate micro](https://github.com/stephenwf/elucidate-micro) - A tiny race-condition prone annotation server for local testing, saves to flat files

This framework is a culmination of all of the work done on these projects.  
