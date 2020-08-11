import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    height: "35vh",
    width: "30vw",
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
    textAlign: "center",
  },
  titleContainer:{
    backgroundColor: theme.palette.primary.main,
    height: "20%",
    paddingTop: "1vh"
  },
  contentContainer:{
    padding: "1vh 2vw",
  },
  title: {
    padding: "2vh 0",
    color: theme.palette.secondary.light,
    fontWeight: 300,
    fontSize: "1.9em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.3em",
    },
  },
  divisionText: {
    padding: "1vh",
    color: theme.palette.secondary.contrastText,
    textDecoration: "underline",
    fontSize: "1.3em",
    fontWeight: 700
  },
  subtitle: {
    padding: "1vh",
    color: theme.palette.secondary.contrastText,
    fontWeight: 100,
    fontSize: "1.2em",
  },
}));

function EsperaInfo(props) {
  const {ordersAssigned } = props;
  const classes = useStyles();

  const getDireccion = () => {
    let dir = "";
    if (ordersAssigned.principalStreet) {
      dir = dir + ordersAssigned.principalStreet + " ";
    }
    if (ordersAssigned.number) {
      dir = dir + ordersAssigned.number + " ";
    }
    if (ordersAssigned.secondaryStreet) {
      if (ordersAssigned.number) {
        dir = dir + ordersAssigned.secondaryStreet;
      } else dir = dir + " y " + ordersAssigned.secondaryStreet;
    }
    return dir;
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
      <Typography className={classes.title} align="center">
      {"Orden #: "+ordersAssigned.tripId}
      </Typography>
      </div>
      <div className={classes.contentContainer}>
      
      <Typography align="justify" className={classes.subtitle}>
        <b>Cliente:</b> {" " + ordersAssigned.name + " " + ordersAssigned.lastName}
      </Typography>
      {ordersAssigned.sector ? (
        <Typography align="justify" className={classes.subtitle}>
          <b>Sector:</b> {" " + ordersAssigned.sector}
        </Typography>
      ) : null}
      {ordersAssigned.principalStreet ? (
        <Typography align="justify" className={classes.subtitle}>
          <b>Dirección:</b> {getDireccion()}
        </Typography>
      ) : null}
      {ordersAssigned.cellphone ? (
        <Typography align="justify" className={classes.subtitle}>
          <b>Teléfono:</b> {" " + ordersAssigned.cellphone}
        </Typography>
      ) : null}
      </div>
    </div>
  );
}

export default EsperaInfo;
