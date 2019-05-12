<div align="center"><img src="https://raw.githubusercontent.com/stephenwf/hyperion/master/hyperion-logo.png" width="390" /></div>
<br />

Experimental framework for working with IIIF in JavaScript and Typescript.

Aims to provide safe typings for valid Presentation 3 JSON-LD and normalization step (also with typings).

3 steps in that the library does:
- Preprocess resources to ensure valid Presentation 3
- Cast JSON to Typescript interface
- Normalize resources into flat tree of resources

This library can be the basis of other tools that want to work deeper with IIIF Presentation 3 resources.

<div align="center"><img src="https://raw.githubusercontent.com/stephenwf/hyperion/master/vault-logo.png" width="390" /></div> 

This is the main library used to fetch, store and retrieve IIIF resources. It is not tied to a single framework and can be used with both JavaScript and Typescript.


<div align="center"><img src="https://raw.githubusercontent.com/stephenwf/hyperion/master/atlas-logo.png" width="390" /></div>

Super-fast, abstract IIIF Viewer. Build a world and fill it with canvases. Lets users move, pan and zoom, or take your users on a smooth tour of your world.


<div align="center"><img src="https://raw.githubusercontent.com/stephenwf/hyperion/master/react-vault-logo.png" width="390" /></div>
React hooks are, hands down, the best way to work with IIIF.


## Development
You need `yarn` in order to work with this monorepo. Simply clone the repository and run `yarn` followed by `yarn start`. This will build
all of the libraries and examples, running them in watch mode. You'll get the following servers started:
- [http://localhost:5105/](http://localhost:5105/) - Documentation site
- [http://localhost:5103/](http://localhost:5103/) - Vanilla example
- [http://localhost:5101/](http://localhost:5101/) - React example
- [http://localhost:5102/](http://localhost:5102/) - Annotation example

If you want to see the pattern library for the annotation example, you can cd into `./examples/hyperion-annotation-example` and run `yarn docz:dev`. 

You can run tests from the root of the repository by running: `yarn test`.

**Pull requests are always welcome!* 
