/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { Label } from './Label.js';
import type { PageRequest } from './PageRequest.js';
export type PageResponseLabel = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<Label>;
    totalCount?: number;
};


