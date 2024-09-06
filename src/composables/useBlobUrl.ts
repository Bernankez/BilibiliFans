import type { MaybeRefOrGetter } from "vue";

export function useBlobUrl(blob: MaybeRefOrGetter<Blob | string | undefined>) {
  const url = ref<string>();
  watchEffect(() => {
    const value = toValue(blob);
    if (value instanceof Blob) {
      url.value = URL.createObjectURL(value);
    } else {
      url.value = value;
    }
  });

  watch(url, (_, oldUrl) => {
    if (oldUrl) {
      revoke(oldUrl);
    }
  }, { immediate: true });

  function revoke(_url?: string) {
    const tempUrl = _url || url.value;
    if (tempUrl) {
      URL.revokeObjectURL(tempUrl);
    }
  }

  return {
    url,
    revoke,
  };
}
