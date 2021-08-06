class ManifestElement extends HTMLElement {
  constructor() {
    super();
    this.vault = HyperionVault.globalVault();
    this.manifestRequests = [];
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<slot></slot>`;
  }

  static get observedAttributes() {
    return ['src'];
  }

  connectedCallback() {
    this.addEventListener('request-manifest', e => {
      this.manifestRequests.push(e.target);

      if (this.manifest) {
        e.target.manifest = this.manifest;
        e.target.dispatchEvent(new CustomEvent('manifest-loaded'));
      }
      this.dispatchEvent(new CustomEvent('manifest-loaded'));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'src': {
        this.vault.loadManifest(newValue).then(manifestRef => {
          this.manifest = manifestRef;
          this.dispatchEvent(
            new CustomEvent('iiif-manifest', {
              bubbles: true,
              cancelable: true,
            })
          );
          for (const req of this.manifestRequests) {
            req.manifest = this.manifest;
            req.dispatchEvent(new CustomEvent('manifest-loaded'));
          }
          this.dispatchEvent(new CustomEvent('manifest-loaded'));
        });

        break;
      }
    }
  }
}

class CanvasElement extends HTMLElement {
  constructor() {
    super();
    this.vault = HyperionVault.globalVault();
    this.canvasRequests = [];
    this.src = '';
    this.idx = -1;

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<slot></slot>`;

    this.addEventListener('manifest-loaded', () => {
      if (this.manifest) {
        if (this.idx !== -1) {
          this.src = this.manifest.items[this.idx].id;
        }

        if (!this.src) {
          return;
        }

        this.canvas = this.vault.fromRef({ id: this.src, type: 'Canvas' });

        this.render();
      }
    });
  }

  static get observedAttributes() {
    return ['src', 'idx'];
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('request-manifest', {
        bubbles: true,
        cancelable: true,
      })
    );

    this.addEventListener('request-canvas', e => {
      this.canvasRequests.push(e.target);

      if (this.canvas) {
        e.target.canvas = this.canvas;
        e.target.dispatchEvent(new CustomEvent('canvas-loaded'));
        this.dispatchEvent(new CustomEvent('canvas-loaded'));
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'src': {
        this.src = newValue;
        this.render();
        break;
      }
      case 'idx': {
        this.idx = Number(newValue);
        if (this.manifest) {
          this.src = this.manifest.items[newValue].id;
          this.render();
        }
        break;
      }
    }
  }

  render() {
    this.canvas = this.vault.fromRef({ id: this.src, type: 'Canvas' });
    if (this.canvas) {
      for (const req of this.canvasRequests) {
        req.canvas = this.canvas;
        req.dispatchEvent(new CustomEvent('canvas-loaded'));
      }
      this.dispatchEvent(new CustomEvent('canvas-loaded'));
    }
  }
}

class CanvasThumbnail extends HTMLElement {
  constructor() {
    super();
    this.vault = HyperionVault.globalVault();

    this.props = {
      maxWidth: 1024,
    };

    this.addEventListener('canvas-loaded', () => {
      this.render();
    });

    this.thumbnail = document.createElement('img');
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['max-width', 'width'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'max-width': {
        this.props.maxWidth = Number(newValue);
        break;
      }
      case 'width': {
        this.props.width = Number(newValue);
        break;
      }
    }
    this.render();
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('request-canvas', {
        bubbles: true,
        cancelable: true,
      })
    );

    this.shadowRoot.appendChild(this.thumbnail);
  }

  render() {
    if (this.canvas) {
      this.vault.getThumbnail(this.canvas, this.props).then(thumb => {
        if (thumb.best) {
          this.thumbnail.src = thumb.best.id;
        } else {
          this.thumbnail.src = '';
        }
      });
    }
  }
}

class ThumbnailElement extends HTMLElement {
  constructor() {
    super();
  }

  set image(newValue) {
    this._image = newValue;
  }

  render() {
    if (this._image) {
      this.$img.src = this._image.src;
      this.$img.setAttribute('width', this._image.width);
    }
  }
}

customElements.define('iiif-manifest', ManifestElement);
customElements.define('iiif-canvas', CanvasElement);
customElements.define('canvas-thumbnail', CanvasThumbnail);
