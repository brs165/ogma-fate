import { h as head, s as slot } from "../../chunks/index2.js";
function _layout($$renderer, $$props) {
  head("12qhfyh", $$renderer, ($$renderer2) => {
    $$renderer2.push(`<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> <link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300..900;1,300..900&amp;family=JetBrains+Mono:wght@400;700&amp;display=swap" rel="stylesheet"/>`);
  });
  $$renderer.push(`<div class="app-shell" data-theme="dark"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div>`);
}
export {
  _layout as default
};
