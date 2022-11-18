const template = document.createElement('template');

template.innerHTML = `
<div>
  <div>
    <img id="card-artwork" src="../img/artwork-default.png">
  </div>
  <div>
    <div id="card-title-1">Title 1</div>
    <div id="card-title-2">Title 2</div>
    <div id="card-title-3">Title 3</div>
  </div>
</div>
`;

class LibraryCard extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // static get observedAttributes() {
  //   return ['artwork', 'title-1', 'title-2', 'title-3'];
  // }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   this.shadowRoot.querySelector('#card-artwork').src = this.getAttribute('artwork');
  //   this.shadowRoot.querySelector('#card-title-1').innerHTML = this.getAttribute('title-1');
  //   this.shadowRoot.querySelector('#card-title-2').innerHTML = this.getAttribute('title-2');
  //   this.shadowRoot.querySelector('#card-title-3').innerHTML = this.getAttribute('title-3');
  // }

}

window.customElements.define('library-card', LibraryCard);