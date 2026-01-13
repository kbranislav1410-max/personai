import { readFile } from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts text content from a resume file
 * @param filePath - Full path to the resume file
 * @param fileType - Type of file ('pdf' or 'docx')
 * @returns Extracted text content
 * @throws Error if extraction fails
 */
export async function extractResumeText(
  filePath: string,
  fileType: string
): Promise<string> {
  try {
    if (fileType === 'pdf') {
      // Extract text from PDF
      const dataBuffer = await readFile(filePath);
      const pdfParser = new PDFParse({ data: dataBuffer });
      const data = await pdfParser.getText();
      return data.text.trim();
    } else if (fileType === 'docx') {
      // Extract text from DOCX
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    throw new Error(
      `Failed to extract text from ${fileType.toUpperCase()} file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
