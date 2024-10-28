/**
 * Type: Library
 * Description: A library that contains a function which, when called, returns an object with a public API.
 */

import { BQDataSchema } from "./types";

export function ComponentsHelper() {
  const ARTIFACTS_BUCKET_SET = "ia-components";
  const ML_PIPELINES = "ml_pipelines";

  async function shouldInitializeArtifacts(id: string, data: BQDataSchema) {
    const query = ClearBladeAsync.Query()
      .equalTo("component_id", id)
      .equalTo("asset_type_id", data.asset_type_id);
    const colResp = await ClearBladeAsync.Collection<{
      last_pipeline_run: string;
      init_artifacts: boolean;
    }>(ML_PIPELINES).fetch(query);

    if (colResp.TOTAL === 0) {
      return false; // no pipeline found for this component
    }

    const pipelineData = colResp.DATA[0];
    if (!pipelineData.last_pipeline_run) {
      return false; // dont initialize since pipeline has not run yet
    }

    const currentDate = new Date();
    const lastRun = new Date(pipelineData.last_pipeline_run);

    // pipeline has run and we are checking if 1 hour has passed since last run
    if (
      pipelineData.init_artifacts &&
      currentDate > new Date(lastRun.setHours(lastRun.getHours() + 1))
    ) {
      await ClearBladeAsync.Collection<{
        last_pipeline_run: string;
        init_artifacts: boolean;
      }>(ML_PIPELINES).update(query, { init_artifacts: false });
      return true;
    }
    return false;
  }

  return {
    ARTIFACTS_BUCKET_SET,
    shouldInitializeArtifacts,
  };
}
