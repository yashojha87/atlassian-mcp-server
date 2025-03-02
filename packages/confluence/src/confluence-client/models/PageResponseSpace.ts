/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { PageRequest } from './PageRequest.js';
import type { Space } from './Space.js';
export type PageResponseSpace = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<Space>;
    totalCount?: number;
};


