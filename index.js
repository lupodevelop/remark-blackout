import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

export default function remarkBlackout() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        (node.type === 'containerDirective' ||
         node.type === 'textDirective' ||
         node.type === 'leafDirective') &&
        node.name === 'spoiler'
      ) {
        const content = toString(node);
        node.type = 'html';
        node.value = `<spoiler>${content}</spoiler>`;
        delete node.children;
        delete node.attributes;
      }
    });
  };
}
