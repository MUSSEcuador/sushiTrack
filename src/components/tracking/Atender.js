import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "5vh 5vw",
    height: "100%",
    width: "100%",
    backgroundColor: theme.palette.primary.light,
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "9%",
    paddingTop: "1vh",
  },
  contentContainer: {
    padding: "3vh 8vw",
  },
  title: {
    color: theme.palette.secondary.light,
    [theme.breakpoints.down("md")]: {
      fontSize: "0.9em",
    },
    paddingBottom: "2vh",
  },
  textField: {
    margin: "2vh, 0",
  },
  button: {
    marginTop: "2vh",
    width: "40%",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontWeight: 900,
    fontSize: "1.2em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
      width: "80%"
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));

const FINALIZE = gql`
  mutation FinalizeIssue($finalizeIssue: FinalizeIssue, $token: String!) {
    finalizeOpenIssue(finalizeIssue: $finalizeIssue, token: $token)
  }
`;

function Atender(props) {
  const classes = useStyles();
  const { seleccionado, closeAtender } = props;

  const [solucion, setSolucion] = React.useState("");

  const [finalizeOpenIssue] = useMutation(FINALIZE);

  const handleSolution = (e) => {
    setSolucion(e.target.value);
  };

  const terminar = () => {
    finalizeOpenIssue({
      variables: {
        finalizeIssue: {
          issueId: seleccionado.id,
          solution: solucion,
        },
        token: sessionStorage.token,
      },
    })
      .then((result) => {
        if (result.data) {
          closeAtender();
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          Atender la alerta: {seleccionado.eventName}
        </Typography>
      </div>
      <div className={classes.contentContainer}>
        <Typography>{seleccionado.eventDescription}</Typography>
      </div>
      <TextField
        size="small"
        fullWidth
        multiline
        placeholder="Acciones realizadas"
        label="Acciones realizadas"
        className={classes.textField}
        value={solucion}
        onChange={(e) => {
          handleSolution(e);
        }}
      />
      <Button
        variant="contained"
        className={classes.button}
        onClick={() => {
          terminar();
        }}
      >
        DAR POR TERMINADO
      </Button>
    </div>
  );
}

export default Atender;
