/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestRepositorySelector } from './RestRepositorySelector.js';
export type RestExportRequest = {
    exportLocation?: string;
    repositoriesRequest: {
        includes: Array<RestRepositorySelector>;
    };
};


