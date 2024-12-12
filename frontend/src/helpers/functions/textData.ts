export const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;

    const contentType = response.headers.get("content-type");
    return contentType ? contentType.startsWith("image/") : false;
  } catch {
    return false;
  }
};
