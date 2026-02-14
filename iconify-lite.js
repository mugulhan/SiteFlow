(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const DEFAULT_VIEWBOX = "0 0 24 24";

  const ICONS = {
    "mdi:backburger": {
      paths: [
        "M3 6h18v2H3z",
        "M3 11h14v2H3z",
        "M3 16h18v2H3z",
        "M3 6l4 4-4 4z",
      ],
    },
    "mdi:menu": {
      paths: ["M3 6h18v2H3z", "M3 11h18v2H3z", "M3 16h18v2H3z"],
    },
    "mdi:account-circle": {
      paths: [
        "M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20",
        "M12 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6",
        "M6.5 18a5.5 5.5 0 0 1 11 0",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:account-outline": {
      paths: [
        "M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8",
        "M4.5 20a7.5 7.5 0 0 1 15 0",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:arrow-up-bold-box-outline": {
      paths: [
        "M4 4h16v16H4z",
        "M12 16V8",
        "M8.5 11.5 12 8l3.5 3.5",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:bell-outline": {
      paths: [
        "M10 21h4a2 2 0 0 1-4 0",
        "M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1z",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:bell-alert-outline": {
      paths: [
        "M10 21h4a2 2 0 0 1-4 0",
        "M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1z",
        "M12 8.5v3.5",
        "M12 14.5h.01",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:chart-line": {
      paths: [
        "M4 4v16h16",
        "M6 14l4-4 3 3 5-6",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:compass-outline": {
      paths: [
        "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18",
        "M15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5z",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:download": {
      paths: [
        "M12 4v10",
        "M8.5 10.5 12 14l3.5-3.5",
        "M5 19h14",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:download-box": {
      paths: [
        "M4 4h16v16H4z",
        "M12 8v7",
        "M8.5 12.5 12 16l3.5-3.5",
        "M8 18h8",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:email-edit-outline": {
      paths: [
        "M3 6h14v12H3z",
        "M3 7l7 5 7-5",
        "M14 17l4-4 2 2-4 4h-2z",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:email-fast-outline": {
      paths: [
        "M3 6h13v12H3z",
        "M3 7l6.5 5 6.5-5",
        "M18 9h3",
        "M19 12h3",
        "M18 15h3",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:eye-outline": {
      paths: [
        "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6",
        "M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:file-export-outline": {
      paths: [
        "M6 2h8l4 4v16H6z",
        "M14 2v4h4",
        "M12 10v6",
        "M8.5 13.5 12 17l3.5-3.5",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:home-variant-outline": {
      paths: [
        "M3 11 12 4l9 7",
        "M6 9.5V20h12V9.5",
        "M10 20v-5h4v5",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:link-variant-plus": {
      paths: [
        "M10.5 13.5 8.7 15.3a3 3 0 1 1-4.2-4.2l2.6-2.6a3 3 0 0 1 4.2 0",
        "M13.5 10.5l1.8-1.8a3 3 0 1 1 4.2 4.2l-2.6 2.6a3 3 0 0 1-4.2 0",
        "M9 15l6-6",
        "M19 3v4",
        "M17 5h4",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:pencil-outline": {
      paths: [
        "M3 21h3.8L18 9.8 14.2 6 3 17.2z",
        "M13 7.2 16.8 11",
        "M15.2 5 19 8.8",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:plus": {
      paths: ["M12 5v14", "M5 12h14"],
      stroke: true,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:star-outline": {
      paths: [
        "m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9z",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:trash-can-outline": {
      paths: [
        "M6 7h12",
        "M9 7V5h6v2",
        "M8 7l1 13h6l1-13",
        "M10 10v7",
        "M14 10v7",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:view-grid-outline": {
      paths: [
        "M3 3h8v8H3z",
        "M13 3h8v8h-8z",
        "M3 13h8v8H3z",
        "M13 13h8v8h-8z",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "mdi:view-dashboard-outline": {
      paths: [
        "M3 3h8v8H3z",
        "M13 3h8v5h-8z",
        "M13 10h8v11h-8z",
        "M3 13h8v8H3z",
      ],
    },
    "mdi:chart-timeline-variant": {
      paths: [
        "M4 5h2v14H4z",
        "M8 15l4-4 3 3 5-5v3l-5 5-3-3-4 4-4-4v-3z",
      ],
    },
    "mdi:cog-outline": {
      paths: [
        "M19.4 13a7.48 7.48 0 0 0 .1-1 7.48 7.48 0 0 0-.1-1l2.1-1.6-2-3.5-2.5 1a7.48 7.48 0 0 0-1.8-1l-.3-2.7h-4l-.3 2.7a7.48 7.48 0 0 0-1.8 1l-2.5-1-2 3.5 2.1 1.6a7.48 7.48 0 0 0-.1 1 7.48 7.48 0 0 0 .1 1L2.6 14.6l2 3.5 2.5-1a7.48 7.48 0 0 0 1.8 1l.3 2.7h4l.3-2.7a7.48 7.48 0 0 0 1.8-1l2.5 1 2-3.5z",
        "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
      ],
    },
    "mdi:logout": {
      paths: [
        "M4 5h10v2H6v10h8v2H4z",
        "M15 8l5 4-5 4v-3h-5v-2h5z",
      ],
    },
    "mdi:chevron-down": {
      paths: ["M6 9l6 6 6-6 1.4 1.4-7.4 7.4-7.4-7.4z"],
    },
    "mdi:chevron-left": {
      paths: ["M15.4 6L9 12.4l6.4 6.4L14 20.2 7.8 14l6.2-6.2z"],
    },
    "mdi:chevron-right": {
      paths: ["M8.6 6 15 12.4 8.6 18.8 10 20.2l6.2-6.2L10 7.8z"],
    },
    "mdi:close": {
      paths: [
        "M6.7 5.3 12 10.6l5.3-5.3 1.4 1.4-5.3 5.3 5.3 5.3-1.4 1.4L12 13.4l-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3z",
      ],
    },
    "mdi:flash-outline": {
      paths: [
        "M11 2L3 14h6l-1 8 10-12h-6l1-8z",
      ],
    },
    "mdi:open-in-new": {
      paths: [
        "M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4 9.3-9.3H14z",
        "M5 5h6v2H7v10h10v-4h2v6H5z",
      ],
    },
    "mdi:content-copy": {
      paths: [
        "M16 1H4v14h2V3h10z",
        "M20 5H8v18h12z",
      ],
    },
    "solar:alt-arrow-down-line-duotone": {
      paths: [
        "M12 5v12",
        "M7 12l5 5 5-5",
      ],
      stroke: true,
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
  };

  function buildSvg(iconDef, widthAttr, heightAttr) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", iconDef.viewBox || DEFAULT_VIEWBOX);
    const width = widthAttr || iconDef.width || "24";
    const height = heightAttr || iconDef.height || "24";
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("aria-hidden", "true");

    const isStroke = Boolean(iconDef.stroke);
    const paths = iconDef.paths || [];
    for (const d of paths) {
      const el = document.createElementNS(SVG_NS, isStroke ? "path" : "path");
      el.setAttribute("d", d);
      if (isStroke) {
        el.setAttribute("fill", "none");
        el.setAttribute("stroke", "currentColor");
        el.setAttribute("stroke-width", iconDef.strokeWidth || 2);
        el.setAttribute("stroke-linecap", iconDef.strokeLinecap || "round");
        el.setAttribute("stroke-linejoin", iconDef.strokeLinejoin || "round");
      } else {
        el.setAttribute("fill", "currentColor");
      }
      svg.appendChild(el);
    }
    return svg;
  }

  function buildFallback(width, height) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", DEFAULT_VIEWBOX);
    svg.setAttribute("width", width || "24");
    svg.setAttribute("height", height || "24");
    svg.setAttribute("aria-hidden", "true");
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "8");
    circle.setAttribute("fill", "currentColor");
    svg.appendChild(circle);
    return svg;
  }

  class InlineIcon extends HTMLElement {
    static get observedAttributes() {
      return ["icon", "width", "height"];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      const iconName = this.getAttribute("icon");
      const width = this.getAttribute("width");
      const height = this.getAttribute("height");
      const def = iconName ? ICONS[iconName] : null;

      this.textContent = "";
      const svg = def ? buildSvg(def, width, height) : buildFallback(width, height);
      this.appendChild(svg);
    }
  }

  if (!customElements.get("iconify-icon")) {
    customElements.define("iconify-icon", InlineIcon);
  }
})();
