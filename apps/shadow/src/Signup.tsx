import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Field, FormikContext, FormikProvider, useFormik } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import { useParams } from "react-router-dom";

function Signup() {
  const { group, game_id } = useParams<{ group: string; game_id: string }>();
  const [status, setStatus] = useState("input");
  const [failureMessage, setFailureMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      username: "",
      properties: {
        targetLevels: [],
        qrates: "",
        admin: false,
        qrew: false,
        notes: "",
      },
    },
    onSubmit: async data => {
      setStatus("loading");
      setFailureMessage("");
      console.log(data);
      try {
        const response = await fetch(
          `https://api.cuppazee.app/shadow/admin/${group}/${game_id}/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          setStatus("success");
        } else {
          setStatus("failed");
          setFailureMessage(json.error?.message ?? "");
        }
      } catch {
        setStatus("failed");
      }
    },
  });

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <h1>Submitting...</h1>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <h1>Submitted!</h1>
        <Button onClick={() => {
          formik.resetForm();
          setStatus("input")
        }}>Submit again</Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div
        style={{
          width: "100%",
          maxWidth: 350,
          display: "flex",
          flexDirection: "column",
          padding: 8,
        }}>
        <form
          style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 16 }}
          onSubmit={formik.handleSubmit}>
          {status === "failed" && (
            <Alert severity="error">
              <AlertTitle>Submission failed.</AlertTitle>
              {failureMessage}
            </Alert>
          )}
          <TextField
            required
            value={formik.values.username}
            onChange={formik.handleChange}
            name="username"
            label="Munzee Username"
            variant="outlined"
          />
          <Paper
            variant="outlined"
            style={{
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 8,
              paddingRight: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}>
            <FormikProvider value={formik}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Target Levels</FormLabel>
                <FormGroup>
                  {[
                    [1, "#ef6500"],
                    [2, "#fa9102"],
                    [3, "#fcd302"],
                    [4, "#bfe913"],
                    [5, "#55f40b"],
                  ].map(level => (
                    <Field
                      key={level[0]}
                      component={CheckboxWithLabel}
                      type="checkbox"
                      sx={{
                        "&.Mui-checked": {
                          color: level[1],
                        },
                      }}
                      name="properties.targetLevels"
                      value={level[0].toString()}
                      Label={{ label: `Level ${level[0]}` }}
                    />
                  ))}
                </FormGroup>
                <FormHelperText>What level(s) do you think you can reach?</FormHelperText>
              </FormControl>
            </FormikProvider>
          </Paper>
          <Paper
            variant="outlined"
            style={{
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 8,
              paddingRight: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}>
            <FormikProvider value={formik}>
              <FormControl required component="fieldset" variant="standard">
                <FormGroup>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="properties.admin"
                    Label={{ label: "Admin" }}
                  />
                </FormGroup>
                <FormHelperText>Are you happy to be an Admin?</FormHelperText>
              </FormControl>
            </FormikProvider>
          </Paper>
          <Paper
            variant="outlined"
            style={{
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 8,
              paddingRight: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}>
            <FormikProvider value={formik}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="properties.qrew"
                    Label={{ label: "QRew" }}
                  />
                </FormGroup>
                <FormHelperText>Will you be QRew or ZeeQRew for the month?</FormHelperText>
              </FormControl>
            </FormikProvider>
          </Paper>

          <TextField
            required
            value={formik.values.properties.qrates}
            onChange={formik.handleChange}
            name="properties.qrates"
            label="QRates"
            helperText="How many QRates will you be able to fill?"
            variant="outlined"
          />

          <TextField
            value={formik.values.properties.notes}
            onChange={formik.handleChange}
            name="properties.notes"
            label="Notes"
            helperText="Anything else you'd like to tell us."
            variant="outlined"
            multiline
            rows={4}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
