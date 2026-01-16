import type { HttpMethod, HttpQueryParams, OmitRequestInit } from "./http.types";

type HttpMethodMapper<K extends keyof RequestInit> = (init?: OmitRequestInit<K>) => RequestInit;

const buildParameters = (params: HttpQueryParams | null): string => {
  if (params === null) {
    return "";
  }

  const validEntries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  if (validEntries.length === 0) {
    return "";
  }

  return '?' + new URLSearchParams(validEntries);
};

const requestBase = (baseUrl: string) => (
  <K extends keyof RequestInit>(methodMapper: HttpMethodMapper<K>) => (
    (path: string, params: HttpQueryParams | null = null) => (init?: OmitRequestInit<K>) => (
      fetch(
        [baseUrl, path, buildParameters(params)].join(''),
        methodMapper(init),
      )
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response;
      })
    )
  )
);

const createMethodMapper = <K extends keyof RequestInit>(method: HttpMethod): HttpMethodMapper<K> => (
  (init) => ({ ...init, method })
);

export const createRequestor = (baseUrl: string) => {
  const requestorBase = requestBase(baseUrl);

  return {
    get     : requestorBase(createMethodMapper<'body'>('GET')),
    head    : requestorBase(createMethodMapper('HEAD')),
    post    : requestorBase(createMethodMapper('POST')),
    put     : requestorBase(createMethodMapper('PUT')),
    delete  : requestorBase(createMethodMapper('DELETE')),
    connect : requestorBase(createMethodMapper('CONNECT')),
    options : requestorBase(createMethodMapper('OPTIONS')),
    trace   : requestorBase(createMethodMapper('TRACE')),
    patch   : requestorBase(createMethodMapper('PATCH')),
  };
};

export type HttpRequestor = ReturnType<typeof createRequestor>;

export const withJson = <T>(json: T) => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(json),
});
