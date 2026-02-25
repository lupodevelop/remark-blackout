# remark-blackout

A tiny [remark](https://github.com/remarkjs/remark) plugin that makes it easy to
obfuscate passages of text in Markdown using `spoiler` directives. It takes its
name from the classic “blackout” style used by the KGB, the U.S. Department of
Justice, or the infamous redactions in the **Epstein files** – where entire
passages were simply painted over in black. The plugin renders the concealed
content as a `<spoiler>` element with black-on-black styling; readers can only
reveal it by selecting the text.

## Installation

```bash
npm install remark-blackout remark-directive
# or
pnpm add remark-blackout remark-directive
```

> `remark-directive` is a required peer dependency and must be listed before `remark-blackout` in your plugin array.

## Usage

```js
import remarkDirective from 'remark-directive';
import remarkBlackout from 'remark-blackout';

export default {
  // astro.config.mjs
  markdown: {
    remarkPlugins: [remarkDirective, remarkBlackout],
  },
};
```

Once enabled you can write in Markdown:

```md
:::spoiler
This paragraph is censored; select it to read.
:::

Inline form: :spoiler[secret content].
```

The plugin simply rewrites the directive nodes into raw HTML; the styling is
left to your CSS (the usual black-on-black trick is common).

## Example CSS

```css
spoiler {
  background: #000;
  color: #000;
}
spoiler::selection {
  color: #fff;
}
```

## License

MIT
