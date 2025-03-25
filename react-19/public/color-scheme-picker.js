class ColorSchemePickerMenu extends HTMLElement {
  #open = false;
  #currentScheme = "system";
  #container = null;

  static get observedAttributes() {
    return ["current-scheme"];
  }

  get open() {
    return this.#open;
  }

  set open(value) {
    this.#open = value;
    this.update();
  }

  constructor() {
    super();
    this.#container = document.createElement("div");
    this.#container.className =
      "absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 hidden";
  }

  connectedCallback() {
    this.appendChild(this.#container);
    this.update();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current-scheme") {
      this.#currentScheme = newValue || "system";
      this.update();
    }
  }

  update() {
    if (!this.#open) {
      this.#container.classList.add("hidden");
      return;
    }

    this.#container.classList.remove("hidden");
    this.#container.innerHTML = `
      <div class="py-1">
        <button
          data-scheme="light"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            this.#currentScheme === "light"
              ? "bg-gray-100 dark:bg-gray-700"
              : ""
          }"
        >
          <span>☀️</span> Light
        </button>
        <button
          data-scheme="dark"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            this.#currentScheme === "dark" ? "bg-gray-100 dark:bg-gray-700" : ""
          }"
        >
          <span>🌙</span> Dark
        </button>
        <button
          data-scheme="system"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            this.#currentScheme === "system"
              ? "bg-gray-100 dark:bg-gray-700"
              : ""
          }"
        >
          <span>💻</span> System
        </button>
      </div>
    `;

    // Add event listeners
    const buttons = this.#container.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const scheme = button.getAttribute("data-scheme");
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: { scheme },
            bubbles: true,
            composed: true,
          }),
        );
      });
    });
  }
}

if (!customElements.get("color-scheme-picker-menu")) {
  customElements.define("color-scheme-picker-menu", ColorSchemePickerMenu);
}
