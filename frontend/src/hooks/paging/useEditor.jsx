import { useCallback } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import { PAGE_IMAGE_UPLOAD_URI, WS_URL } from "@/api/_URI";
import axiosInstance from "@utils/axiosInstance";
import { useWebSocketMessage } from "./useWebSocketMessage";

export const useEditor = (
  throttledBroadcast,
  editorRef,
  componentId,
  pageId,
  setTitle
) => {
  const handleWebSocketMessage = useWebSocketMessage(
    editorRef,
    componentId,
    pageId,
    setTitle
  );

  const createEditor = useCallback(
    async (initialData = null, editorOptions = {}) => {
      console.log("createEditor - 에디터 생성 시작");

      const editorElement = document.getElementById("editorjs");
      if (editorElement) {
        editorElement.innerHTML = "";
      }

      const editor = new EditorJS({
        holder: "editorjs",
        readOnly: editorOptions.readOnly,
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 1,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  try {
                    const response = await axiosInstance.post(
                      PAGE_IMAGE_UPLOAD_URI,
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    console.log("이미지 업로드 응답:", response.data);

                    // Editor.js의 이미지 블록이 기대하는 정확한 데이터 구조
                    const imageData = {
                      success: 1,
                      file: {
                        url: response.data,
                      },
                    };

                    // 저장 및 브로드캐스트
                    setTimeout(async () => {
                      const savedData = await editor.save();
                      throttledBroadcast(savedData);
                    }, 100);

                    return imageData;
                  } catch (error) {
                    console.error("Upload failed:", error);
                    return {
                      success: 0,
                    };
                  }
                },
              },
            },
          },
          code: {
            class: CodeTool,
            config: {
              placeholder: "코드를 입력하세요...",
            },
          },
          link: {
            class: LinkTool,
            config: {
              endpoint: "http://localhost:8008/fetchUrl",
            },
          },
          quote: {
            class: Quote,
            config: {
              quotePlaceholder: "인용구를 입력하세요...",
              captionPlaceholder: "인용구의 출처를 입력하세요...",
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
        },
        data: initialData || {
          blocks: [],
        },
        onReady: () => {
          const editorElement = document.getElementById("editorjs");
          editorElement.addEventListener("input", async () => {
            try {
              const savedData = await editor.save();
              throttledBroadcast(savedData);
            } catch (error) {
              console.error("Error in input handler:", error);
            }
          });
          // 키보드 이벤트로 삭제 감지
          editorElement.addEventListener("keyup", async (e) => {
            // Backspace 또는 Delete 키 감지
            if (e.key === "Backspace" || e.key === "Delete") {
              try {
                const savedData = await editor.save();
                throttledBroadcast(savedData);
              } catch (error) {
                console.error("Error in keyup handler:", error);
              }
            }
          });
        },
      });

      await editor.isReady;
      console.log("🚀 Editor initialized successfully");

      const webSocket = new WebSocket(WS_URL);
      webSocket.onmessage = (event) => {
        handleWebSocketMessage(event.data);
      };

      return editor;
    },
    [throttledBroadcast, handleWebSocketMessage]
  );

  return createEditor;
};
