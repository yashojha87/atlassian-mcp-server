/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { JsonContentProperty } from './JsonContentProperty.js';
import type { PageRequest } from './PageRequest.js';
export type PageResponseJsonContentProperty = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<JsonContentProperty>;
    totalCount?: number;
};


