"use client";

import { useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import styles from "./monacoEditor.module.scss";

loader.config({
  paths: {
    vs: "/_next/static/monaco-editor/vs",
  },
});

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: "on",
};

type Props = {
  value?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
};

export default function MonacoEditor({
  value = "",
  language = "typescript",
  onChange,
  readOnly = false,
}: Props) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) {
    editorRef.current = editor;
    editor.focus();

    monacoInstance.editor.defineTheme("myDark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#1e1e1e" },
    });
    monacoInstance.editor.setTheme("myDark");
  }

  return (
    <div className={styles.monaco}>
      <Editor
        height="100%"
        language={language}
        value={value}
        theme="vs-dark"
        options={{ ...defaultOptions, readOnly }}
        onChange={onChange}
        onMount={handleMount}
        loading={<div className="p-4 text-sm">loading editor…</div>}
      />
    </div>
  );
}
