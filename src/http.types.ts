export type QueryParamValue = string | number | boolean | null | undefined;
export type HttpMethod = (
  'GET'     |
  'HEAD'    |
  'POST'    |
  'PUT'     |
  'DELETE'  |
  'CONNECT' |
  'OPTIONS' |
  'TRACE'   |
  'PATCH'
);

export type HttpQueryParams = Record<string, QueryParamValue>;
