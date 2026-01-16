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
  const requesterBase = requestBase(baseUrl);

  return {
    get     : requesterBase(createMethodMapper<'body'>('GET')),
    head    : requesterBase(createMethodMapper('HEAD')),
    post    : requesterBase(createMethodMapper('POST')),
    put     : requesterBase(createMethodMapper('PUT')),
    delete  : requesterBase(createMethodMapper('DELETE')),
    connect : requesterBase(createMethodMapper('CONNECT')),
    options : requesterBase(createMethodMapper('OPTIONS')),
    trace   : requesterBase(createMethodMapper('TRACE')),
    patch   : requesterBase(createMethodMapper('PATCH')),
  };
};

export type HttpRequester = ReturnType<typeof createRequestor>;

export const withJson = <T>(json: T) => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(json),
});
