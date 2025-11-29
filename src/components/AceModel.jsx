import AceEditor from "react-ace";

// Languages
import "ace-builds/src-noconflict/mode-json";

// Themes
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-github";

// Autocomplete
import "ace-builds/src-noconflict/ext-language_tools";

function JsonEditor({ value, onChange }) {
  return (
    <AceEditor
      mode="json"
      theme="twilight"
      value={value}
      onChange={onChange}
      name="json-editor"
      width="100%"
      height="200px"
      fontSize={16}
      setOptions={{
        useWorker: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}

export default JsonEditor;

