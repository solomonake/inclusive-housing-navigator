import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

/**
 * Extract text from various file formats
 */
export async function extractTextFromFile(
  file: { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<{ text: string; meta: { mime: string; name: string; bytes: number } }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const meta = {
    mime: file.type,
    name: file.name,
    bytes: arrayBuffer.byteLength
  };

  let text = '';

  try {
    if (file.type === 'text/plain') {
      text = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
    } else if (file.type === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.type === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    // Clean up the text
    text = text
      .trim()
      .replace(/\s+/g, ' ') // Collapse multiple whitespace
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();

    if (!text) {
      throw new Error('No text content found in file');
    }

    return { text, meta };
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw error;
  }
}
