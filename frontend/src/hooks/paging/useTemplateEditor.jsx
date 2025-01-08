import { useCallback } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";

export const useTemplateEditor = (editorRef) => {
  const createEditor = useCallback(async (initialData = null) => {
    console.log("Template editor creation started");

    const editorElement = document.getElementById("editorjs");
    if (editorElement) {
      editorElement.innerHTML = "";
    }

    const editor = new EditorJS({
      holder: "editorjs",
      readOnly: true,
      tools: {
        header: Header,
        list: List,
        image: ImageTool,
        code: CodeTool,
        quote: Quote,
        table: Table,
      },
      data: initialData || {
        blocks: [],
      },
      onReady: () => {
        console.log("Template editor is ready with data:", initialData);
      },
    });

    await editor.isReady;
    console.log("Template editor initialized successfully");
    return editor;
  }, []);

  return createEditor;
};
