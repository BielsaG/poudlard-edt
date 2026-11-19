// Liste déroulante qui s'ouvre vers le bas avec défilement couleur étain
// options : tableau d'objets { id, name }
import { useState } from "react";

export default function ListeDeroulante({ valeur, options, onChange, placeholder }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="relative" onBlur={() => setOuvert(false)}>
      <button type="button" onClick={() => setOuvert(!ouvert)}
        className={`flex w-full items-center justify-between rounded-md bg-white p-2 text-left shadow-sm outline-none focus:ring-2 focus:ring-[#A8813F] ${valeur ? "" : "text-[#6E6459]"}`}>
        {valeur || placeholder}
        <span className="text-xs text-[#8A9597]">▼</span>
      </button>
      {ouvert && (
        <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-md bg-white shadow-md [scrollbar-color:#8A9597_#E5E7E8] [scrollbar-width:thin]">
          {options.map((o) => (
            <li key={o.id} onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(o.name); setOuvert(false); }}
              className={`cursor-pointer px-3 py-2 hover:bg-[#E5E7E8] ${o.name === valeur ? "font-semibold" : ""}`}>
              {o.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
