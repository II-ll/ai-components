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

function ai_components_update(req, resp) {
  const params = req.params;
  const mfe_settings = params.mfe_settings;

  const col = ClearBladeAsync.Collection('ai_components_ml_pipelines');
  const query = ClearBladeAsync.Query().equalTo('component_id', params.component_id).equalTo('asset_type_id', params.entity_id);

  const updateData = {
    asset_type_id: params.entity_id,
    component_id: params.component_id,
  };

  if (mfe_settings.model_meta) {
    if (mfe_settings.model_meta.run_frequency) {
      updateData['run_frequency'] = mfe_settings.model_meta.run_frequency;
    }
    if (mfe_settings.model_meta.data_threshold) {
      updateData['data_threshold'] = mfe_settings.model_meta.data_threshold;
    }
  }

  if (mfe_settings.features) {
    updateData['feature_attributes'] = mfe_settings.features.map(function (feature) { return feature.attribute_name });
  }

  col.update(query, updateData).then(resp.success).catch(resp.error);
}
