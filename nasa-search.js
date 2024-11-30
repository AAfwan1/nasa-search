import { LitElement, html, css } from 'lit';

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
        background-color: #1e1e1e;
        padding: 16px;
        border-radius: 10px;
        color: white;
      }
      h2 {
        text-align: center;
        color: #ff4500;
        font-size: 32px;
        margin-bottom: 24px;
      }
      .search-bar {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }
      input {
        width: 100%;
        max-width: 600px;
        padding: 12px 16px;
        font-size: 18px;
        border: 1px solid #ff4500;
        border-radius: 25px;
        background-color: #2e2e2e;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
      }
      input:focus {
        outline: none;
        background-color: #3a3a3a;
        color: white;
        box-shadow: 0 6px 12px rgba(255, 69, 0, 0.5);
      }
      input::placeholder {
        color: #bbb;
      }
      .results {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
        justify-content: center;
        align-items: start;
      }
      .card {
        width: 240px;
        height: 300px;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
        transition: transform 0.3s ease, background-color 0.3s ease;
        cursor: pointer;
        background-color: #2e2e2e;
        color: white;
      }
      .card:hover {
        background-color: #3a3a3a;
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(255, 69, 0, 0.5);
      }
      .card img {
        width: 240px;
        height: 180px;
        object-fit: cover;
        border-bottom: 1px solid #444;
      }
      .card .info {
        padding: 16px;
        text-align: center;
      }
      .card .info p {
        margin: 4px 0;
        font-size: 14px;
        color: #ccc;
      }
      .card .info p.title {
        font-weight: bold;
        color: #ff4500;
      }
    `;
  }

  constructor() {
    super();
    this.value = null;
    this.title = 'The Nasa Base';
    this.loading = false;
    this.items = [];
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <div class="search-bar">
        <input
          id="input"
          placeholder="Search NASA images"
          @input="${this.inputChanged}"
        />
      </div>
      <div class="results">
        ${this.items.map(
          (item) => html`
            <div
              class="card"
              tabindex="0"
              @click="${() => this.openImage(item.links[0].href)}"
              @keypress="${(e) =>
                e.key === 'Enter' && this.openImage(item.links[0].href)}"
            >
              <img
                src="${item.links[0].href}"
                alt="${item.data[0].title || 'NASA Image'}"
              />
              <div class="info">
                <p class="title">${item.data[0].title || 'Untitled'}</p>
                <p>By: ${item.data[0].secondary_creator || 'Unknown'}</p>
              </div>
            </div>
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
  }

  updateResults(value) {
    this.loading = true;
    fetch(
      `https://images-api.nasa.gov/search?media_type=image&q=${value}`
    ).then((response) => response.json())
      .then((data) => {
        if (data.collection) {
          this.items = data.collection.items;
          this.loading = false;
        }
      });
  }

  openImage(url) {
    window.open(url, '_blank');
  }

  static get tag() {
    return 'nasa-search';
  }
}

customElements.define(NasaSearch.tag, NasaSearch);
