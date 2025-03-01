/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationUser } from './ApplicationUser.js';
import type { PullRequest } from './PullRequest.js';
export type PullRequestParticipant = {
    approved?: boolean;
    lastReviewedCommit?: string;
    pullRequest?: PullRequest;
    role?: PullRequestParticipant.role;
    status?: PullRequestParticipant.status;
    user?: ApplicationUser;
};
export namespace PullRequestParticipant {
    export enum role {
        AUTHOR = 'AUTHOR',
        REVIEWER = 'REVIEWER',
        PARTICIPANT = 'PARTICIPANT',
    }
    export enum status {
        UNAPPROVED = 'UNAPPROVED',
        NEEDS_WORK = 'NEEDS_WORK',
        APPROVED = 'APPROVED',
    }
}


