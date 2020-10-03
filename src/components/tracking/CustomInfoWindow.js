import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    color: theme.palette.secondary.main,
    backgroundColor: "white",
    textAlign: "center",
  },
  titleContainer: {
    backgroundColor: "black",
    height: "20%",
    paddingTop: "1vh",
  },
  contentContainer: {
    padding: "1vh 2vw",
  },
  title: {
    padding: "2vh 0",
    color: "red",
    fontWeight: 300,
    fontSize: "1.3em",
  },
  subtitle: {
    padding: "1vh",
    color: "black",
    fontWeight: 100,
    fontSize: "1em",
  },
}));

function CustomInfoWindow(props) {
  const { title, local, actual, espera, transact, recibe, eventName, eventDescription } = props;

  const classes = useStyles();
  return (
    <div className={classes.root}>
      {title && !local ? (
        <div className={classes.titleContainer}>
          <Typography className={classes.title} align="center">
            {"Delivery: " + title}
          </Typography>
        </div>
      ) : null}
      {local ? (
        <div className={classes.titleContainer}>
          <Typography className={classes.title} align="center">
            {"Local: " + local}
          </Typography>
        </div>
      ) : null}
      <div className={classes.contentContainer}>
        {actual ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Orden actual:</b> {" " + actual}
          </Typography>
        ) : null}
        {espera ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Ordenes Espera:</b> {espera}
          </Typography>
        ) : null}
        {transact ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Número de orden:</b> {transact}
          </Typography>
        ) : null}
        {recibe ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Cliente:</b> {recibe}
          </Typography>
        ) : null}
        {eventName ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Alerta:</b> {eventName}
          </Typography>
        ) : null}
        {eventDescription ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Detalle:</b> {eventDescription}
          </Typography>
        ) : null}
      </div>
    </div>
  );
}

export default CustomInfoWindow;
