/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { NodeStatus } from './NodeStatus.js';
import type { PageRequest } from './PageRequest.js';
export type PageResponseNodeStatus = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<NodeStatus>;
    totalCount?: number;
};


