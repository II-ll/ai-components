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

function ai_components_uninstall(req, resp) {

  const CACHE_KEY = 'google-bigquery-config'
  const PROJECT_ID = 'clearblade-ipm'
  const DATASET_ID = 'clearblade_components'

  const params = req.params;
  const col = ClearBladeAsync.Collection('ai_components_ml_pipelines');
  const query = ClearBladeAsync.Query().equalTo('component_id', params.component_id).equalTo('asset_type_id', params.entity_id);
  
  col.remove(query).then(function() {
    return getAccessToken();
  }).then(function(token) {
    if (!token) {
      resp.error('No access token found');
    }
    return removeBQData(token.accessToken, params.entity_id);
  }).then(resp.success).catch(resp.error);

  function getAccessToken() {
    const cache = ClearBladeAsync.Cache('AccessTokenCache');
    return cache.get(CACHE_KEY);
  }

  function removeBQData(token, id) {
    const query = 'DELETE FROM ' + PROJECT_ID + '.' + DATASET_ID + '.' + cbmeta.system_key + 'WHERE asset_type_id = ' + id + 'AND date_time < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 MINUTE;';
    const jobConfig = {
      configuration: {
        query: {
          query: query,
          useLegacySql: false,
        },
      },
    };

    return fetch('https://bigquery.googleapis.com/bigquery/v2/projects/' + PROJECT_ID + '/jobs', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobConfig),
    }).then(function(response) {
      if (!response.ok) {
        return Promise.reject(response.text());
      }
      return Promise.resolve('Deleted BQ data');
    }).catch(function(error) {
      return Promise.reject(error);
    });
  }
}
