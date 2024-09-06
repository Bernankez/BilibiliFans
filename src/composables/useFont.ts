export function useFont(family: string, source: string | BinaryData, descriptors?: FontFaceDescriptors) {
  const loaded = ref(false);
  const font = ref<FontFace>();

  async function load() {
    const _font = new FontFace(family, source, descriptors);
    await _font.load();
    document.fonts.add(_font);
    loaded.value = true;
    font.value = _font;
  }

  load();

  return {
    loaded,
    font,
  };
}
