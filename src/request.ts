import type { HttpBody, HttpMethod, HttpQueryParameters, HttpRequest } from "./types";

const buildParameters = (params: HttpQueryParameters): string => {
  if (params === undefined) {
    return "";
  }

  const validEntries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  if (validEntries.length === 0) {
    return "";
  }

  return '?' + new URLSearchParams(validEntries).toString();
};

export const request = <
  M extends HttpMethod,
  U extends string,
  P extends HttpQueryParameters,
  B extends HttpBody,
>(port: number) => (
  (request: HttpRequest<M, U, P, B>) => {
    const url = `http://localhost:${port}/${request.url}${buildParameters(request.parameters)}`;
    const data = {
      method: request.method,
      headers: request.body !== undefined
        ? { "Content-Type": "application/json" }
        : undefined,
      body: request.body !== undefined
        ? JSON.stringify(request.body)
        : undefined,
    };
    return fetch(url, data);
  }
);
