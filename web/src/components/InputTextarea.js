// InputTextareaComponent.js
import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

const InputTextareaComponent = ({
  value,
  onChange,
  rows = 5,
  cols,
  autoResize =false,
  disable,
  readOnly
}) => {
  return (
    <InputTextarea
      rows={rows}
      cols={cols}
      value={value}
      onChange={onChange}
      autoResize={autoResize}
      disabled ={disable}
      readOnly={readOnly}
    />
  );
};

export default InputTextareaComponent;
