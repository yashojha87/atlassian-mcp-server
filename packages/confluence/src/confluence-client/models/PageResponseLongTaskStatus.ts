/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { LongTaskStatus } from './LongTaskStatus.js';
import type { PageRequest } from './PageRequest.js';
export type PageResponseLongTaskStatus = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<LongTaskStatus>;
    totalCount?: number;
};


