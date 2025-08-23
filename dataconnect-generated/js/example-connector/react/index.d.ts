import { CreateNewClarificationData, ListPublicClarificationsData, UpdateClarificationContentData, UpdateClarificationContentVariables, ListClarificationsByUserData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewClarification(options?: useDataConnectMutationOptions<CreateNewClarificationData, FirebaseError, void>): UseDataConnectMutationResult<CreateNewClarificationData, undefined>;
export function useCreateNewClarification(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewClarificationData, FirebaseError, void>): UseDataConnectMutationResult<CreateNewClarificationData, undefined>;

export function useListPublicClarifications(options?: useDataConnectQueryOptions<ListPublicClarificationsData>): UseDataConnectQueryResult<ListPublicClarificationsData, undefined>;
export function useListPublicClarifications(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicClarificationsData>): UseDataConnectQueryResult<ListPublicClarificationsData, undefined>;

export function useUpdateClarificationContent(options?: useDataConnectMutationOptions<UpdateClarificationContentData, FirebaseError, UpdateClarificationContentVariables>): UseDataConnectMutationResult<UpdateClarificationContentData, UpdateClarificationContentVariables>;
export function useUpdateClarificationContent(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateClarificationContentData, FirebaseError, UpdateClarificationContentVariables>): UseDataConnectMutationResult<UpdateClarificationContentData, UpdateClarificationContentVariables>;

export function useListClarificationsByUser(options?: useDataConnectQueryOptions<ListClarificationsByUserData>): UseDataConnectQueryResult<ListClarificationsByUserData, undefined>;
export function useListClarificationsByUser(dc: DataConnect, options?: useDataConnectQueryOptions<ListClarificationsByUserData>): UseDataConnectQueryResult<ListClarificationsByUserData, undefined>;
