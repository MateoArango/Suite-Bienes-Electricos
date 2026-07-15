from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

TOOLS = Path(r"C:\Users\marango\Desktop\Suite Bienes Eléctricos\.tools")
sys.path.insert(0, str(TOOLS))

import fitz  # type: ignore


ROOT = Path(r"C:\Users\marango\Desktop\Suite Bienes Eléctricos")
PDF = ROOT / "output" / "pdf" / "ImportActiveComponent_Automation_Test_Scenario_Map.pdf"
OUT = ROOT / "tmp" / "final_qa_render"
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

doc = fitz.open(PDF)
page_stats = []
full_text = []
for index, page in enumerate(doc):
    text = page.get_text("text")
    full_text.append(text)
    pix = page.get_pixmap(matrix=fitz.Matrix(1.65, 1.65), alpha=False)
    target = OUT / f"page-{index + 1:02d}.png"
    pix.save(target)
    page_stats.append(
        {
            "page": index + 1,
            "chars": len(text),
            "words": len(text.split()),
            "width": pix.width,
            "height": pix.height,
            "png": str(target),
        }
    )

joined = "\n".join(full_text)
required_strings = [
    "QA-IMP-001",
    "QA-IMP-040",
    "POST /electrical-assets/import/load",
    "GET /electrical-assets/article-resume/{plate}",
    "Current 102-column header contract",
    "CODIGO CREG CONDUCTOR",
]
result = {
    "pdf": str(PDF),
    "pages": doc.page_count,
    "page_stats": page_stats,
    "missing_required_strings": [value for value in required_strings if value not in joined],
    "mojibake_hits": [value for value in ("Ã³", "Ã¡", "Ã©", "Ã±", "Â°") if value in joined],
    "very_sparse_pages": [item["page"] for item in page_stats if item["words"] < 35],
}
(OUT / "qa_summary.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(result, indent=2, ensure_ascii=False))
doc.close()
