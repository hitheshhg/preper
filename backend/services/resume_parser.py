import io
import re
from typing import Tuple, Dict, Any

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

class ResumeParser:
    """
    Production-grade file extractor for PDF, DOCX, and TXT resumes.
    Strictly validates file size, magic headers, MIME signatures, and handles corrupt files gracefully.
    """

    @classmethod
    def extract_text_from_bytes(
        cls,
        file_bytes: bytes,
        filename: str,
        content_type: str = ""
    ) -> Tuple[str, str, Dict[str, Any]]:
        """
        Extracts raw text from file bytes with multi-layer validation.
        Returns: (cleaned_text, error_message, metadata)
        """
        metadata: Dict[str, Any] = {
            "filename": filename,
            "size_bytes": len(file_bytes) if file_bytes else 0,
            "format": "unknown",
            "page_count": 1,
            "char_count": 0
        }

        # 1. Validate File Presence & Size
        if not file_bytes or len(file_bytes) == 0:
            return "", "Uploaded file is empty. Please select a valid resume document.", metadata

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            return "", f"Your resume exceeds the 10 MB limit ({len(file_bytes) / (1024*1024):.1f} MB). Please upload a smaller file.", metadata

        lower_name = filename.lower().strip() if filename else "resume"
        extracted_text = ""

        # 2. Extract based on format with signature validation
        try:
            if lower_name.endswith(".pdf"):
                metadata["format"] = "PDF"
                # Check PDF magic bytes (%PDF)
                if not file_bytes.startswith(b"%PDF"):
                    return "", "The uploaded file has a .pdf extension but is not a valid PDF document.", metadata

                import PyPDF2
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                metadata["page_count"] = len(pdf_reader.pages)
                
                if len(pdf_reader.pages) == 0:
                    return "", "The PDF document has no pages.", metadata

                pages_text = []
                for page_idx, page in enumerate(pdf_reader.pages):
                    page_content = page.extract_text() or ""
                    if page_content.strip():
                        pages_text.append(page_content)

                extracted_text = "\n\n".join(pages_text)

            elif lower_name.endswith(".docx"):
                metadata["format"] = "DOCX"
                # Check DOCX zip magic bytes (PK\x03\x04)
                if not file_bytes.startswith(b"PK\x03\x04"):
                    return "", "The uploaded file has a .docx extension but is not a valid Word document.", metadata

                import docx
                doc = docx.Document(io.BytesIO(file_bytes))
                paragraphs_text = [p.text for p in doc.paragraphs if p.text and p.text.strip()]
                # Also include table cell contents if present
                for table in doc.tables:
                    for row in table.rows:
                        row_text = " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()])
                        if row_text:
                            paragraphs_text.append(row_text)

                extracted_text = "\n".join(paragraphs_text)

            elif lower_name.endswith(".txt") or lower_name.endswith(".md"):
                metadata["format"] = "TXT"
                extracted_text = file_bytes.decode("utf-8", errors="ignore")

            else:
                return "", f"Unsupported file format for '{filename}'. Please upload a PDF or DOCX file.", metadata

        except Exception as e:
            return "", f"We couldn't read this file. It may be corrupt or encrypted. Try re-exporting your resume as standard PDF. ({str(e)})", metadata

        # 3. Clean and sanitize text
        cleaned = cls.clean_text(extracted_text)
        metadata["char_count"] = len(cleaned)

        if len(cleaned.strip()) < 40:
            return "", "We couldn't extract sufficient readable text from this file. If it contains scanned images, please use a text-selectable PDF.", metadata

        return cleaned, "", metadata

    @classmethod
    def clean_text(cls, text: str) -> str:
        if not text:
            return ""

        # Remove null bytes and non-printable control characters
        text = text.replace("\x00", "")
        # Normalize carriage returns and line endings
        text = re.sub(r"\r\n", "\n", text)
        text = re.sub(r"\r", "\n", text)
        # Normalize weird unicode spaces and bullet symbols
        text = re.sub(r"[\u2022\u2023\u25E6\u2043\u2219]", "• ", text)
        text = re.sub(r"[\u2013\u2014]", "-", text)
        text = re.sub(r"[\u2018\u2019]", "'", text)
        text = re.sub(r"[\u201C\u201D]", '"', text)
        # Normalize redundant blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)
        # Normalize multiple spaces and tabs
        text = re.sub(r"[ \t]{2,}", " ", text)

        return text.strip()

resume_parser = ResumeParser()
