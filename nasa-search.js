import { LitElement, html, css } from 'lit';
import "./nasa-image.js";

export class NasaSearch extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
      }
      :host([loading]) .results {
        opacity: 0.1;
        visibility: hidden;
        height: 1px;
      }
      .results {
        visibility: visible;
        height: 100%;
        opacity: 1;
        transition-delay: 0.5s;
        transition: 0.5s all ease-in-out;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px; /* Add spacing between images */
      }
      nasa-image {
        border-radius: 10px; /* Rounded corners for images */
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      nasa-image:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      }
      details {
        margin: 16px 0;
        padding: 16px;
        background-color: white;
        border-radius: 10px;
        color: black;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      summary {
        font-size: 24px;
        padding: 8px;
        color: black;
      }
      input {
        font-size: 20px;
        line-height: 40px;
        width: 100%;
        border: 1px solid black;
        border-radius: 20px; /* Rounded corners for input */
        padding: 8px 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease;
      }
      input:focus {
        outline: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      h2 {
        text-align: center;
        color: #ff0000;
        font-size: 36px;
        margin: 16px 0;
      }
    `;
  }

  constructor() {
    super();
    this.value = null;
    this.title = 'Browse the Nasa Base';
    this.loading = false;
    this.items = [];
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <details open>
        <summary>Type here to search</summary>
        <div>
          <input
            id="input"
            placeholder="Search NASA images"
            @input="${this.inputChanged}"
          />
        </div>
      </details>
      <div class="results">
        ${this.items.map(
          (item) => html`
            <nasa-image
              source="${item.links[0].href}"
              title="${item.data[0].title}"
            ></nasa-image>
          `
        )}
      </div>
    `;
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }

  updated(changedProperties) {
    if (changedProperties.has('value') && this.value) {
      this.updateResults(this.value);
    } else if (changedProperties.has('value') && !this.value) {
      this.items = [];
    }
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  updateResults(value) {
    this.loading = true;
    fetch(
      `https://images-api.nasa.gov/search?media_type=image&q=${value}`
    ).then((d) => (d.ok ? d.json() : {})).then((data) => {
      if (data.collection) {
        this.items = [];
        this.items = data.collection.items;
        this.loading = false;
      }
    });
  }

  static get tag() {
    return 'nasa-search';
  }
}
customElements.define(NasaSearch.tag, NasaSearch);
