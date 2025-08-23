import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'claridx-diagnostic',
  location: 'us-central1'
};

export const createNewClarificationRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewClarification');
}
createNewClarificationRef.operationName = 'CreateNewClarification';

export function createNewClarification(dc) {
  return executeMutation(createNewClarificationRef(dc));
}

export const listPublicClarificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicClarifications');
}
listPublicClarificationsRef.operationName = 'ListPublicClarifications';

export function listPublicClarifications(dc) {
  return executeQuery(listPublicClarificationsRef(dc));
}

export const updateClarificationContentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClarificationContent', inputVars);
}
updateClarificationContentRef.operationName = 'UpdateClarificationContent';

export function updateClarificationContent(dcOrVars, vars) {
  return executeMutation(updateClarificationContentRef(dcOrVars, vars));
}

export const listClarificationsByUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListClarificationsByUser');
}
listClarificationsByUserRef.operationName = 'ListClarificationsByUser';

export function listClarificationsByUser(dc) {
  return executeQuery(listClarificationsByUserRef(dc));
}

