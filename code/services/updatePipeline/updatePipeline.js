/**
 * Type: Micro Service
 * Description: A short-lived service which is expected to complete within a fixed period of time.
 * @param {CbServer.BasicReq} req
 * @param {string} req.systemKey
 * @param {string} req.systemSecret
 * @param {string} req.userEmail
 * @param {string} req.userid
 * @param {string} req.userToken
 * @param {boolean} req.isLogging
 * @param {[id: string]} req.params
 * @param {CbServer.Resp} resp
 */

function updatePipeline(req, resp) {
  const params = req.params;
  const col = ClearBladeAsync.Collection('ml_pipelines');
  const query = ClearBladeAsync.Query().equalTo('component_id', params.component_id).equalTo('asset_type_id', params.asset_type_id);
  col.update(query, params).then(resp.success).catch(resp.error);
}
