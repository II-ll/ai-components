import {
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { AiComponentsProps } from "../types";
import { Autocomplete } from "@material-ui/lab";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import GenerateEntityInformation from "../helpers/GenerateEntityInformation";
import React from "react";

export default function ExternalComponents(
  props: AiComponentsProps & { children?: React.ReactNode }
) {
  const { schema, component, assetTypeName, setValues } = props;
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const componentPath = component.id.split("_")[1];
        const settings = await import(`../${componentPath}/settings.json`);
        setSettings(settings);
      } catch (error) {
        console.error("Error loading settings: ", error);
      }
    };
    loadSettings();
  }, [component]);

  return (
    <Formik
      initialValues={{
        schema: schema.filter((attribute) => attribute.selected),
        componentsMeta: {},
      }}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, handleChange }) => {
        useEffect(() => {
          setValues((v) => ({ ...v, ...values }));
        }, [values]);

        return (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FormLabel>
                      <Typography variant="body2">
                        <span style={{ fontWeight: "bold" }}>Attributes*</span>
                      </Typography>
                    </FormLabel>
                    <Tooltip title="This is required field. The {{component_name}} component will...">
                      <IconButton
                        size="small"
                        aria-label="help"
                        style={{ marginLeft: "4px" }}
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Autocomplete
                    multiple
                    size="small"
                    limitTags={6}
                    id="multiple-limit-tags"
                    value={values.schema}
                    options={schema}
                    onChange={(event, newValue) =>
                      setFieldValue("schema", newValue)
                    }
                    getOptionSelected={(option, value) =>
                      option.uuid === value.uuid
                    }
                    getOptionLabel={(option) =>
                      (option.attribute_label as string) ||
                      (option.attribute_name as string)
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                    disableCloseOnSelect
                  />
                </FormControl>
              </Grid>
              {props.children}
              <Grid item xs={12}>
                {values.schema.length > 0 && (
                  <GenerateEntityInformation
                    settings={settings}
                    componentLabel={component.name}
                    assetTypeLabel={assetTypeName}
                  />
                )}
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
