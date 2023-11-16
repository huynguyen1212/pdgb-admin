// @ts-nocheck

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useState } from "react";

const config = {
  fullPage: true,
  outputType: "html",
  defaultTitle: 'p',
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        attributes: true,
        classes: true,
        styles: true,
      },
    ],
  },
  heading: {
    options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
        { model: 'heading7', view: 'h7', title: 'Heading 7', class: 'ck-heading_heading7' },
        { model: 'heading8', view: 'h8', title: 'Heading 8', class: 'ck-heading_heading8' },
        { model: 'heading9', view: 'h9', title: 'Heading 9', class: 'ck-heading_heading9' },
    ]
},
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "sourceEditing",
      "|",
      "findAndReplace",
      "|",
      "selectAll",
      "wproofreader",
      "|",
      "heading",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",
      "-",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      {
        label: "Formatting",
        icon: "text",
        items: ["subscript", "superscript", "code", "|", "removeFormat"],
      },
      "|",
      "specialCharacters",
      "horizontalLine",
      "pageBreak",
      "|",
      "link",
      "insertImage",
      "mediaEmbed",
      "insertTable",
      "highlight",
      {
        label: "Insert",
        icon: "plus",
        items: ["blockQuote", "mediaEmbed", "codeBlock", "htmlEmbed"],
      },
      "|",
      "alignment",
      "|",
      "bulletedList",
      "numberedList",
      "outdent",
      "indent",
    ],
    shouldNotGroupWhenFull: true,
  },
  fontFamily: {
    supportAllValues: true,
  },
  fontSize: {
    options: [5, 6, 7, 8, 10, 12, 14, "default", 18, 20, 22, 24, 25, 28, 32, 36, 42, 46, 50, 52],
    supportAllValues: true,
  },
  htmlEmbed: {
    showPreviews: true,
  },
  mediaEmbed: {
    previewsInData:true
  },
  image: {
    styles: ["alignCenter", "alignLeft", "alignRight"],
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original",
        value: null,
      },
      {
        name: "resizeImage:50",
        label: "50%",
        value: "50",
      },
      {
        name: "resizeImage:75",
        label: "75%",
        value: "75",
      },
    ],
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "|",
      "imageStyle:inline",
      "imageStyle:wrapText",
      "imageStyle:breakText",
      "imageStyle:side",
      "|",
      "resizeImage",
    ],
    insert: {
      integrations: ["insertImageViaUrl"],
    },
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true,
    },
  },
  link: {
    decorators: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      toggleDownloadable: {
        mode: "manual",
        label: "Downloadable",
        attributes: {
          download: "file",
        },
      },
    },
  },
  placeholder: "type...",
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
      "toggleTableCaption",
    ],
  },
  removePlugins: ["Markdown", 'Title'],
};

interface Props {
  disabled?: boolean;
  data?: string;
  id?: string;
  onReady?: (editor: ClassicEditor) => void;
  onChange?: (event: Event, editor: ClassicEditor) => void;
  onBlur?: (event: Event, editor: ClassicEditor) => void;
  onFocus?: (event: Event, editor: ClassicEditor) => void;
  onError?: (event: Event, editor: ClassicEditor) => void;
}

export default function TextEditer(props: Props) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const exist = document.getElementById("ckeditor-script");
    // console.log("exist", exist, window.ClassicEditor);

    if (exist && window.ClassicEditor) {
      setLoading(true);
    }

    if (!exist) {
      const script = document.createElement("script");
      script.id = "ckeditor-script";
      script.src = "/ckeditor.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        setLoading(true);
      };
    }
  }, []);

  return (
    <div>
      {!ready && "loading..."}
      {loading && ClassicEditor && (
        <CKEditor
          config={config}
          editor={ClassicEditor}
          onReady={(editor: any) => {
            setReady(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}
