/**
 * cvParser.js - Extraccion de texto desde PDF, DOCX y TXT
 * Usa pdfjs-dist con worker local (compatible con Vite), mammoth y FileReader nativo.
 */
import * as pdfjsLib from 'pdfjs-dist';

// Worker local via new URL() - forma correcta para Vite con pdfjs-dist v4+
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText.trim();
}

async function extractTextFromDOCX(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return (result.value || '').trim();
}

function extractTextFromTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target.result || '').trim());
    reader.onerror = () => reject(new Error('Error al leer el archivo TXT'));
    reader.readAsText(file, 'utf-8');
  });
}

export async function extractTextFromFile(file) {
  const type = file.type;
  const name = file.name?.toLowerCase() || '';
  let rawText = '';

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    rawText = await extractTextFromPDF(file);
    if (rawText.replace(/\s+/g, '').length < 50) {
      return {
        text: '',
        warning: 'No se detecto texto en el PDF. Por favor, sube un documento con texto seleccionable o un archivo .docx',
      };
    }
  } else if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    rawText = await extractTextFromDOCX(file);
  } else if (type === 'text/plain' || name.endsWith('.txt')) {
    rawText = await extractTextFromTXT(file);
  } else {
    return {
      text: '',
      warning: 'Formato no soportado. Por favor sube un archivo .pdf, .docx o .txt',
    };
  }

  return { text: rawText.slice(0, 15000) };
}
