import { InputText } from "primereact/inputtext";
import "../css/MyRequisitions.css";
export default function SearchHeader({ title }) {
  return (
    <div className="">
      <h3 className="my-req-title">{title}</h3>
      {/* <div className="p-input-icon-left w-3">
        <i className="pi pi-search " />
        <InputText
          className="border-round-3xl w-full h-2rem text-sm"
          placeholder="Search"
        />
      </div> */}
    </div>
  );
}
