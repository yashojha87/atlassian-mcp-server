/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationUser } from './ApplicationUser.js';
import type { Comment } from './Comment.js';
import type { Commentable } from './Commentable.js';
import type { CommentThreadDiffAnchor } from './CommentThreadDiffAnchor.js';
export type CommentThread = {
    anchor?: CommentThreadDiffAnchor;
    anchored?: boolean;
    commentable?: Commentable;
    createdDate?: string;
    id?: number;
    resolved?: boolean;
    resolvedDate?: string;
    resolver?: ApplicationUser;
    rootComment?: Comment;
    updatedDate?: string;
};


