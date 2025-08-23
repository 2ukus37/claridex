import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ClarificationTag_Key {
  clarificationId: UUIDString;
  tagId: UUIDString;
  __typename?: 'ClarificationTag_Key';
}

export interface Clarification_Key {
  id: UUIDString;
  __typename?: 'Clarification_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewClarificationData {
  clarification_insert: Clarification_Key;
}

export interface LinkedClarification_Key {
  sourceClarificationId: UUIDString;
  targetClarificationId: UUIDString;
  __typename?: 'LinkedClarification_Key';
}

export interface ListClarificationsByUserData {
  clarifications: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Clarification_Key)[];
}

export interface ListPublicClarificationsData {
  clarifications: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Clarification_Key)[];
}

export interface StudySetClarification_Key {
  studySetId: UUIDString;
  clarificationId: UUIDString;
  __typename?: 'StudySetClarification_Key';
}

export interface StudySet_Key {
  id: UUIDString;
  __typename?: 'StudySet_Key';
}

export interface Tag_Key {
  id: UUIDString;
  __typename?: 'Tag_Key';
}

export interface UpdateClarificationContentData {
  clarification_update?: Clarification_Key | null;
}

export interface UpdateClarificationContentVariables {
  id: UUIDString;
  content: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewClarificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateNewClarificationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateNewClarificationData, undefined>;
  operationName: string;
}
export const createNewClarificationRef: CreateNewClarificationRef;

export function createNewClarification(): MutationPromise<CreateNewClarificationData, undefined>;
export function createNewClarification(dc: DataConnect): MutationPromise<CreateNewClarificationData, undefined>;

interface ListPublicClarificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicClarificationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicClarificationsData, undefined>;
  operationName: string;
}
export const listPublicClarificationsRef: ListPublicClarificationsRef;

export function listPublicClarifications(): QueryPromise<ListPublicClarificationsData, undefined>;
export function listPublicClarifications(dc: DataConnect): QueryPromise<ListPublicClarificationsData, undefined>;

interface UpdateClarificationContentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClarificationContentVariables): MutationRef<UpdateClarificationContentData, UpdateClarificationContentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClarificationContentVariables): MutationRef<UpdateClarificationContentData, UpdateClarificationContentVariables>;
  operationName: string;
}
export const updateClarificationContentRef: UpdateClarificationContentRef;

export function updateClarificationContent(vars: UpdateClarificationContentVariables): MutationPromise<UpdateClarificationContentData, UpdateClarificationContentVariables>;
export function updateClarificationContent(dc: DataConnect, vars: UpdateClarificationContentVariables): MutationPromise<UpdateClarificationContentData, UpdateClarificationContentVariables>;

interface ListClarificationsByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListClarificationsByUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListClarificationsByUserData, undefined>;
  operationName: string;
}
export const listClarificationsByUserRef: ListClarificationsByUserRef;

export function listClarificationsByUser(): QueryPromise<ListClarificationsByUserData, undefined>;
export function listClarificationsByUser(dc: DataConnect): QueryPromise<ListClarificationsByUserData, undefined>;

