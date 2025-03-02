/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './Cursor.js';
import type { PageRequest } from './PageRequest.js';
import type { Person } from './Person.js';
export type PageResponsePerson = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<Person>;
    totalCount?: number;
};


