/**
 * Create a nav-bar custom element
 */
class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * create a shadow dom for the nav-bar
     */
    connectedCallback() {
        this.shadowRoot.innerHTML = `
      <style>
        .navbar {
          background-color: rgba(51,51,51,0.57);
          overflow: hidden;
        }
        .nav-list {
     
          list-style-type: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
        }
        .nav-list li {
          float: left;
          padding: 5px 8px;
        }
        .nav-list li a {
          transition: all 0.3s;
          display: block;
          color: white;
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
        }
        .nav-list li a:hover {
          background-color: rgba(255,255,255,0.71);
          color: #393939;
          border-radius: 5px;
        }
      </style>
      <!-- nav bar -->
      <nav class="navbar">
        <ul class="nav-list">
          <li><a href="index.html">Home</a></li>
          <li><a href="./index.html#information">Information</a></li>
          <li><a href="./index.html#projects">My Projects</a></li>
          <li><a href="https://github.com/skyeuq/">GitHub</a></li>
        </ul>
      </nav>
    `;
    }
}
/**
 * Define the custom element
 */
customElements.define('nav-bar', NavBar);
