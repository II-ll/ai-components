import { AssetType } from "@clearblade/ia-mfe-core";

export type AiComponentsProps = {
  schema: Record<string, unknown>[];
  component: {
    id: string;
    name: string;
    meta: Record<string, unknown>;
  }
  assetTypeName: string;
  setValues: React.Dispatch<
    React.SetStateAction<{
      schema: Record<string, unknown>[];
      componentsMeta?: Record<string, unknown>;
    }>
  >
};
