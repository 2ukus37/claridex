# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`example-connector/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListPublicClarifications*](#listpublicclarifications)
  - [*ListClarificationsByUser*](#listclarificationsbyuser)
- [**Mutations**](#mutations)
  - [*CreateNewClarification*](#createnewclarification)
  - [*UpdateClarificationContent*](#updateclarificationcontent)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListPublicClarifications
You can execute the `ListPublicClarifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
listPublicClarifications(): QueryPromise<ListPublicClarificationsData, undefined>;

interface ListPublicClarificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicClarificationsData, undefined>;
}
export const listPublicClarificationsRef: ListPublicClarificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicClarifications(dc: DataConnect): QueryPromise<ListPublicClarificationsData, undefined>;

interface ListPublicClarificationsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicClarificationsData, undefined>;
}
export const listPublicClarificationsRef: ListPublicClarificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicClarificationsRef:
```typescript
const name = listPublicClarificationsRef.operationName;
console.log(name);
```

### Variables
The `ListPublicClarifications` query has no variables.
### Return Type
Recall that executing the `ListPublicClarifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicClarificationsData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublicClarificationsData {
  clarifications: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Clarification_Key)[];
}
```
### Using `ListPublicClarifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicClarifications } from '@dataconnect/generated';


// Call the `listPublicClarifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicClarifications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicClarifications(dataConnect);

console.log(data.clarifications);

// Or, you can use the `Promise` API.
listPublicClarifications().then((response) => {
  const data = response.data;
  console.log(data.clarifications);
});
```

### Using `ListPublicClarifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicClarificationsRef } from '@dataconnect/generated';


// Call the `listPublicClarificationsRef()` function to get a reference to the query.
const ref = listPublicClarificationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicClarificationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clarifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clarifications);
});
```

## ListClarificationsByUser
You can execute the `ListClarificationsByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
listClarificationsByUser(): QueryPromise<ListClarificationsByUserData, undefined>;

interface ListClarificationsByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListClarificationsByUserData, undefined>;
}
export const listClarificationsByUserRef: ListClarificationsByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listClarificationsByUser(dc: DataConnect): QueryPromise<ListClarificationsByUserData, undefined>;

interface ListClarificationsByUserRef {
  ...
  (dc: DataConnect): QueryRef<ListClarificationsByUserData, undefined>;
}
export const listClarificationsByUserRef: ListClarificationsByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listClarificationsByUserRef:
```typescript
const name = listClarificationsByUserRef.operationName;
console.log(name);
```

### Variables
The `ListClarificationsByUser` query has no variables.
### Return Type
Recall that executing the `ListClarificationsByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListClarificationsByUserData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListClarificationsByUserData {
  clarifications: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Clarification_Key)[];
}
```
### Using `ListClarificationsByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listClarificationsByUser } from '@dataconnect/generated';


// Call the `listClarificationsByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listClarificationsByUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listClarificationsByUser(dataConnect);

console.log(data.clarifications);

// Or, you can use the `Promise` API.
listClarificationsByUser().then((response) => {
  const data = response.data;
  console.log(data.clarifications);
});
```

### Using `ListClarificationsByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listClarificationsByUserRef } from '@dataconnect/generated';


// Call the `listClarificationsByUserRef()` function to get a reference to the query.
const ref = listClarificationsByUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listClarificationsByUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clarifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clarifications);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewClarification
You can execute the `CreateNewClarification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
createNewClarification(): MutationPromise<CreateNewClarificationData, undefined>;

interface CreateNewClarificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateNewClarificationData, undefined>;
}
export const createNewClarificationRef: CreateNewClarificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewClarification(dc: DataConnect): MutationPromise<CreateNewClarificationData, undefined>;

interface CreateNewClarificationRef {
  ...
  (dc: DataConnect): MutationRef<CreateNewClarificationData, undefined>;
}
export const createNewClarificationRef: CreateNewClarificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewClarificationRef:
```typescript
const name = createNewClarificationRef.operationName;
console.log(name);
```

### Variables
The `CreateNewClarification` mutation has no variables.
### Return Type
Recall that executing the `CreateNewClarification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewClarificationData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewClarificationData {
  clarification_insert: Clarification_Key;
}
```
### Using `CreateNewClarification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewClarification } from '@dataconnect/generated';


// Call the `createNewClarification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewClarification();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewClarification(dataConnect);

console.log(data.clarification_insert);

// Or, you can use the `Promise` API.
createNewClarification().then((response) => {
  const data = response.data;
  console.log(data.clarification_insert);
});
```

### Using `CreateNewClarification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewClarificationRef } from '@dataconnect/generated';


// Call the `createNewClarificationRef()` function to get a reference to the mutation.
const ref = createNewClarificationRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewClarificationRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.clarification_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.clarification_insert);
});
```

## UpdateClarificationContent
You can execute the `UpdateClarificationContent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
updateClarificationContent(vars: UpdateClarificationContentVariables): MutationPromise<UpdateClarificationContentData, UpdateClarificationContentVariables>;

interface UpdateClarificationContentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClarificationContentVariables): MutationRef<UpdateClarificationContentData, UpdateClarificationContentVariables>;
}
export const updateClarificationContentRef: UpdateClarificationContentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClarificationContent(dc: DataConnect, vars: UpdateClarificationContentVariables): MutationPromise<UpdateClarificationContentData, UpdateClarificationContentVariables>;

interface UpdateClarificationContentRef {
  ...
  (dc: DataConnect, vars: UpdateClarificationContentVariables): MutationRef<UpdateClarificationContentData, UpdateClarificationContentVariables>;
}
export const updateClarificationContentRef: UpdateClarificationContentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClarificationContentRef:
```typescript
const name = updateClarificationContentRef.operationName;
console.log(name);
```

### Variables
The `UpdateClarificationContent` mutation requires an argument of type `UpdateClarificationContentVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClarificationContentVariables {
  id: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `UpdateClarificationContent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClarificationContentData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClarificationContentData {
  clarification_update?: Clarification_Key | null;
}
```
### Using `UpdateClarificationContent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClarificationContent, UpdateClarificationContentVariables } from '@dataconnect/generated';

// The `UpdateClarificationContent` mutation requires an argument of type `UpdateClarificationContentVariables`:
const updateClarificationContentVars: UpdateClarificationContentVariables = {
  id: ..., 
  content: ..., 
};

// Call the `updateClarificationContent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClarificationContent(updateClarificationContentVars);
// Variables can be defined inline as well.
const { data } = await updateClarificationContent({ id: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClarificationContent(dataConnect, updateClarificationContentVars);

console.log(data.clarification_update);

// Or, you can use the `Promise` API.
updateClarificationContent(updateClarificationContentVars).then((response) => {
  const data = response.data;
  console.log(data.clarification_update);
});
```

### Using `UpdateClarificationContent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClarificationContentRef, UpdateClarificationContentVariables } from '@dataconnect/generated';

// The `UpdateClarificationContent` mutation requires an argument of type `UpdateClarificationContentVariables`:
const updateClarificationContentVars: UpdateClarificationContentVariables = {
  id: ..., 
  content: ..., 
};

// Call the `updateClarificationContentRef()` function to get a reference to the mutation.
const ref = updateClarificationContentRef(updateClarificationContentVars);
// Variables can be defined inline as well.
const ref = updateClarificationContentRef({ id: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClarificationContentRef(dataConnect, updateClarificationContentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.clarification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.clarification_update);
});
```

