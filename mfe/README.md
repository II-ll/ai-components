Custom components for asset types. To add a new component follow these steps - 
- Create a new component folder under aiComponents folder
- Your component folder should have the UI to render as a plugin in IA (refer to Anomaly Detection component)
- Your component will get following props/data from IA - 
  - `schema`: Asset type schema for choosing attributes 
  - `component`: Component id, name and meta 
  - `assetTypeName`: Asset Type on which this component is being configured
  - `setValues`: Setter function to store data in IA
- Additionally, your component folder can have a settings.json file of type settings.d.ts (NOT YET UPDATED TO THE LATEST. See settings.json from Anomaly Detection for reference.) from root folder. You can specify IA entities you want to create when this component is configured in IA.
- If you component is an ClearBlade Internal Component, you can use `<InternalComponents>` component from the helpers folder and you can add your own custom fields if needed. Refer the following example for adding new fields - 

```jsx
export default function MyNewComponent(props: AiComponentsProps) {
  const { component, setValues } = props;
  return (<InternalComponents {...props}> 
    /* New custom field added */
    <Grid item xs={6}>
        <FormControl fullWidth margin="normal">
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormLabel>
              <Typography variant="body2">
                <span style={{ fontWeight: "bold" }}>
                  My New Custom Field
                </span>
              </Typography>
            </FormLabel>
            <Tooltip title="This is an optional field.">
              <IconButton
                size="small"
                aria-label="help"
                style={{ marginLeft: "4px" }}
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <Field
            size="small"
            value={component.meta.customFieldValue}
            component={TextField}
            variant="outlined"
            onChange={(e) => {
              setValues((c) => ({
                ...c,
                componentsMeta: {
                  ...c.componentsMeta,
                  customFieldValue: e.target.value,
                },
              }));
            }}
            fullWidth
          />
        </FormControl>
      </Grid>
  </InternalComponents>);
}
```
- If you component is an External Component, you can use `<ExternalComponents>` component from the helpers folder and you can add your own custom fields if needed in the same way as mentioned above.