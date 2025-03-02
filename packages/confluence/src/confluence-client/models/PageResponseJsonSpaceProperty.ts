/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { JsonSpaceProperty } from './JsonSpaceProperty.js';
import type { PageRequest } from './PageRequest.js';
export type PageResponseJsonSpaceProperty = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<JsonSpaceProperty>;
    totalCount?: number;
};


