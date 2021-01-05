import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, IconButton, Grid } from "@material-ui/core";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import CloseIcon from "@material-ui/icons/Close";

const DISABLE_USER = gql`
  mutation StopAccount($userName: String!, $token: String!) {
    stopAccount(userName: $userName, token: $token) {
      succeeded
      errors
    }
  }
`;

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
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2,
    color: theme.palette.secondary.light,
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
  buttonAceptar: {
    marginTop: "2vh",
    width: "40%",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: 900,
    fontSize: "1.2em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
      width: "80%",
    },
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
      // color: theme.palette.primary.contrastText,
    },
  },
  buttonCancelar: {
    marginTop: "2vh",
    width: "40%",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontWeight: 900,
    fontSize: "1.2em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
      width: "80%",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));



function ConfirmDeleteDelivery(props) {
  const classes = useStyles();
  const { seleccionado, closeConfirm } = props;

  const [disableUser] = useMutation(DISABLE_USER);

  const terminar = () => {
    disableUser({
      variables: {
        userName: seleccionado.name,
        token: sessionStorage.token,
      },
    })
      .then((result) => {
        if (result.data) {
            closeConfirm();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          ELIMINAR MOTORIZADO DEL SISTEMA
        </Typography>
        <IconButton className={classes.closeButton} onClick={closeConfirm}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className={classes.contentContainer}>
        <Typography align="center">
          {`Está seguro de retirar a ${seleccionado.firstName} ${seleccionado.lastName}  del sistema`}
        </Typography>
        {/* <Typography>{seleccionado.eventDescription}
        </Typography> */}
      </div>
      <Grid container>
        <Grid item xs={6}>
          <Button
            variant="contained"
            className={classes.buttonCancelar}
            onClick={() => {
              closeConfirm();
            }}
          >
            CANCELAR
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            className={classes.buttonAceptar}
            onClick={() => {
              terminar();
            }}
          >
            ACEPTAR
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ConfirmDeleteDelivery;
