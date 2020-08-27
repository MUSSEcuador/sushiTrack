import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    height: "56vh",
    width: "56vw",
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
    textAlign: "center",
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "20%",
    paddingTop: "1vh",
  },
  contentContainer: {
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
    fontWeight: 700,
  },
  subtitle: {
    padding: "1vh",
    color: theme.palette.secondary.contrastText,
    fontWeight: 100,
    fontSize: "1.2em",
  },
  items: {
    maxHeight: "45%",
    margin: "0vh 1vw 2vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "lightgrey"
  },
  itemsText: {
    padding: "0.5vh",
    color: theme.palette.secondary.contrastText,
    fontWeight: 100,
    fontSize: "1.1em",
  },
}));

function EsperaInfo(props) {
  const { ordersAssigned } = props;
  const classes = useStyles();

  const getDireccion = () => {
    let dir = "";
    if (ordersAssigned.order.clientAddress.principalStreet) {
      dir = dir + ordersAssigned.order.clientAddress.principalStreet + " ";
    }
    if (ordersAssigned.order.clientAddress.number) {
      dir = dir + ordersAssigned.order.clientAddress.number + " ";
    }
    if (ordersAssigned.order.clientAddress.secondaryStreet) {
      if (ordersAssigned.order.clientAddress.number) {
        dir = dir + ordersAssigned.order.clientAddress.secondaryStreet;
      } else
        dir = dir + " y " + ordersAssigned.order.clientAddress.secondaryStreet;
    }
    return dir;
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          {"Orden #: " + ordersAssigned.order.tripId}
        </Typography>
      </div>
      <div className={classes.contentContainer}>
        <Typography align="justify" className={classes.subtitle}>
          <b>Cliente:</b>{" "}
          {" " +
            ordersAssigned.order.client.name +
            " " +
            ordersAssigned.order.client.lastname}
        </Typography>
        {ordersAssigned.order.clientAddress.sector ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Sector:</b> {" " + ordersAssigned.order.clientAddress.sector}
          </Typography>
        ) : null}
        {ordersAssigned.order.clientAddress.principalStreet ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Dirección:</b> {getDireccion()}
          </Typography>
        ) : null}
        {ordersAssigned.order.clientAddress.cellphone ? (
          <Typography align="justify" className={classes.subtitle}>
            <b>Teléfono:</b>{" "}
            {" " + ordersAssigned.order.clientAddress.cellphone}
          </Typography>
        ) : null}
        <Typography >
          <b>Orden</b>
        </Typography>
      </div>
      <div className={classes.items}>
        {ordersAssigned.order.items
          ? ordersAssigned.order.items.map((item, index) => {
              return (
                <Typography key={index} className={classes.itemsText}>
                  {" "}
                  {item.quantity + " " + item.description}
                </Typography>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default EsperaInfo;
