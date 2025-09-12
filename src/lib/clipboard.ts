// src/lib/clipboard.ts
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  try {
    // ambiente client?
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

    // tenta Clipboard API apenas se disponível e em contexto seguro + gesto do usuário
    const canClipboard = !!navigator.clipboard && window.isSecureContext;

    if (canClipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback: textarea invisível + execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}