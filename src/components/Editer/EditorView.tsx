import React from "react";

export default function EditorView(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return <div id="editor-view" {...props} />;
}
