/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentRestriction } from './ContentRestriction.js';
import type { Cursor } from './Cursor.js';
import type { PageRequest } from './PageRequest.js';
export type PageResponseContentRestriction = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<ContentRestriction>;
    totalCount?: number;
};


