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

function ai_components_setup(req, resp) {

  const SECRET_KEY = 'gcp-bigquery-service-account'
  const CACHE_KEY = 'google-bigquery-config'
  const PROJECT_ID = 'clearblade-ipm'
  const DATASET_ID = 'clearblade_components'
  
  var mySecret = {}

  checkForSubscription().then(function(subscriptionExists) {
    if (subscriptionExists) {
      resp.success('Done');
    }
    return Promise.resolve();
  }).then(function() {
    return readSecret();
  }).then(function(secret) {
    mySecret = secret;
    return addSubscriptionRow(secret);
  }).then(function (){
    return restartAccessTokenManager();
  }).then(function() {
    return Promise.all([
      createBQTable(),
      createExternalDB(mySecret),
      createBucketSet(mySecret),
    ]);
  }).then(function() {
    resp.success('Setup completed successfully!');
  }).catch(function(err) {
    resp.error(err);
  });


  function readSecret() {
    const secret = ClearBladeAsync.Secret();
    return secret.read(SECRET_KEY);
  }

  function checkForSubscription() {
    const col = ClearBladeAsync.Collection('subscriptions');
    return col.fetch({ id: CACHE_KEY }).then(function(data) {
      if (data.DATA.length > 0) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  }

  function addSubscriptionRow(secret) {
    const col = ClearBladeAsync.Collection('subscriptions');
    return col.create({
      details: 'Google Vertex AI Anomaly Detection',
      type: 'googlevertexai',
      config: JSON.stringify({
        SUBSCRIPTION_SERVICE_ACCOUNT_PRIVATE_KEY: secret.private_key,
        SERVICE_EMAIL: secret.client_email,
        API_ENDPOINT: 'https://bigquery.googleapis.com/bigquery/v2/projects/' + PROJECT_ID + '/datasets/' + DATASET_ID,
        ALGORITHM: 'RS256',
        AUTH_SCOPE: 'https://www.googleapis.com/auth/cloud-platform',
        TOKEN_EXPIRY_PERIOD_IN_SECS: 3600,
      }),
      id: CACHE_KEY,
    });
  }

  function restartAccessTokenManager() {
    fetch('https://' + cbmeta.platform_url + '/api/v/1/code/' + cbmeta.system_key + '/accessTokenManager', {
      method: 'POST',
      headers: {
        'ClearBlade-UserToken': req.userToken,
      },
    }).then(function(response) {
      if (!response.ok) {
        return Promise.reject(response.text());
      }
      return Promise.resolve('Access token manager restarted!');
    }).catch(function(error) {
      return Promise.reject(error);
    });
  }

  function createBQTable() {
    const cache = ClearBladeAsync.Cache('AccessTokenCache');
    return cache.get(CACHE_KEY).then(function(data) {
      const bigQueryToken = data.accessToken;
      if (typeof bigQueryToken === 'undefined' || bigQueryToken === '') {
        return Promise.reject("BigQuery Token is undefined or empty. Please check the subscription: " + CACHE_KEY);
      }

      const tableResource = {
        tableReference: {
          projectId: PROJECT_ID,
          datasetId: DATASET_ID,
          tableId: cbmeta.system_key,
        },
        schema: {
          fields: [
            { name: 'date_time', type: 'TIMESTAMP', mode: 'NULLABLE' },
            { name: 'asset_type_id', type: 'STRING', mode: 'NULLABLE' },
            { name: 'asset_id', type: 'STRING', mode: 'NULLABLE' },
            { name: 'data', type: 'STRING', mode: 'NULLABLE' },
          ],
        },
      };
      return tableResource;
    }).then(function(body) {
      return fetch("https://bigquery.googleapis.com/bigquery/v2/projects/" + PROJECT_ID + "/datasets/" + DATASET_ID + "/tables", {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + bigQueryToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(function(response) {
        if (!response.ok) {
          return Promise.reject(response.text());
        }
        return Promise.resolve('BigQuery table created!');
      }).catch(function(error) {
        return Promise.reject(error);
      });
    })
  }

  function createExternalDB() {
    return fetch('https://' + cbmeta.platform_url + '/api/v/4/external-db/' + cbmeta.system_key, {
      headers: {
        'ClearBlade-DevToken': req.userToken,
      },
      body: JSON.stringify({
        name: 'IAComponentsBQDB',
        dbtype: 'bigquery',
        credentials: {
          authentication_type: 'json',
          dbtype: 'bigquery',
          project_id: 'clearblade-ipm',
          credentials: JSON.stringify(secret),
        },
      }),
      method: 'POST',
    })
      .then(function(response) {
        if (!response.ok) {
          return Promise.reject(response.text());
        }
        return Promise.resolve('External DB created!');
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  }

  function createBucketSet() {
    return fetch('https://' + cbmeta.platform_url + '/api/v/4/bucket_sets/' + cbmeta.system_key, {
      headers: {
        'ClearBlade-DevToken': req.userToken,
      },
      body: JSON.stringify({
        name: 'ia-components',
        platform_storage: 'google',
        edge_storage: 'local',
        platform_config: {
          bucket_name: 'clearblade_components',
          credentials: secret,
        },
        edge_config: {
          root: '/tmp/clearblade_platform_buckets',
        },
      }),
      method: 'POST',
    })
      .then(function(response) {
        if (!response.ok) {
          return Promise.reject(response.text());
        }
        return Promise.resolve('Bucket set created!');
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  }
}
