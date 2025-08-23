const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'claridx-diagnostic',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createNewClarificationRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewClarification');
}
createNewClarificationRef.operationName = 'CreateNewClarification';
exports.createNewClarificationRef = createNewClarificationRef;

exports.createNewClarification = function createNewClarification(dc) {
  return executeMutation(createNewClarificationRef(dc));
};

const listPublicClarificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicClarifications');
}
listPublicClarificationsRef.operationName = 'ListPublicClarifications';
exports.listPublicClarificationsRef = listPublicClarificationsRef;

exports.listPublicClarifications = function listPublicClarifications(dc) {
  return executeQuery(listPublicClarificationsRef(dc));
};

const updateClarificationContentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClarificationContent', inputVars);
}
updateClarificationContentRef.operationName = 'UpdateClarificationContent';
exports.updateClarificationContentRef = updateClarificationContentRef;

exports.updateClarificationContent = function updateClarificationContent(dcOrVars, vars) {
  return executeMutation(updateClarificationContentRef(dcOrVars, vars));
};

const listClarificationsByUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListClarificationsByUser');
}
listClarificationsByUserRef.operationName = 'ListClarificationsByUser';
exports.listClarificationsByUserRef = listClarificationsByUserRef;

exports.listClarificationsByUser = function listClarificationsByUser(dc) {
  return executeQuery(listClarificationsByUserRef(dc));
};
