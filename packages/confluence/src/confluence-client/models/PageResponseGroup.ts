/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { Group } from './Group.js';
import type { PageRequest } from './PageRequest.js';
export type PageResponseGroup = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<Group>;
    totalCount?: number;
};


