import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Typography, Link, Modal, Paper, IconButton } from "@material-ui/core";

import CloseIcon from '@material-ui/icons/Close';

import EsperaInfo from "./EsperaInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    height: "75vh",
    width: "80vw",
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
    textAlign: "center",
    outline: 0,
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "15%",
    paddingTop: "1vh",
    position: "relative"
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2,
    color: theme.palette.secondary.light
  },
  contentContainer: {
    padding: "1vh 2vw",
  },
  title: {
    padding: "2vh 0",
    color: theme.palette.secondary.light,
    fontWeight: 300,
    fontSize: "2em",
    [theme.breakpoints.down("sm")]: {
      fontWeight: 500,
      fontSize: "1.2em",
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
    padding: "0.5vh",
    margin: "0 2vw",
    color: theme.palette.secondary.contrastText,
    fontWeight: 100,
    fontSize: "1.2em",
    [theme.breakpoints.down("sm")]: {
      fontWeight: 500,
      fontSize: "0.8em",
    },
  },
  espera: {
    maxHeight: "12vh",
    margin: "2vh 1vw",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "lightgrey",
  },
  modal: {
    marginLeft: "22vw",
    marginTop: "20vh",
    marginRight: "52vw",
  },
}));

function OrderInfo(props) {
  const {
    order,
    setAuxMarkerToShow,
    closeOrderInfo,
    auxMarkerToShowCenter,
  } = props;
  const classes = useStyles();

  const [openEspera, setOpenEspera] = React.useState(false);
  const [esperaToShow, setEsperaToShow] = React.useState({});

  const closeEspera = () => {
    setOpenEspera(false);
  };

  const getDireccion = () => {
    let dir = "";
    if (order.currentRoute.order.clientAddress.principalStreet) {
      dir = dir + order.currentRoute.order.clientAddress.principalStreet + " ";
    }
    if (order.currentRoute.order.clientAddress.number) {
      dir = dir + order.currentRoute.order.clientAddress.number + " ";
    }
    if (order.currentRoute.order.clientAddress.secondaryStreet) {
      if (order.currentRoute.order.clientAddress.number) {
        dir = dir + order.currentRoute.order.clientAddress.secondaryStreet;
      } else
        dir =
          dir + " y " + order.currentRoute.order.clientAddress.secondaryStreet;
    }
    return dir;
  };

  const getEsperaToShow = (id) => {
    const found = order.ordersAssigned.find((d) => d.transact === id);
    if (found) {
      setEsperaToShow(found);
    }
    setOpenEspera(true);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          {order.name}
        </Typography>
        <IconButton className={classes.closeButton} onClick={closeOrderInfo}>
          <CloseIcon/>
        </IconButton>
      </div>
      {order.currentRoute ? (
        <div className={classes.contentContainer}>
          <Typography className={classes.divisionText}>ORDEN ACTUAL</Typography>
          {order.currentRoute.order.transact ? (
            <Typography align="justify" className={classes.subtitle}>
              <b>Identificador:</b> {" " + order.currentRoute.order.transact}
            </Typography>
          ) : null}
          {order.currentRoute.order.client.name &&
          order.currentRoute.order.client.lastname ? (
            <Typography align="justify" className={classes.subtitle}>
              <b>Cliente:</b>{" "}
              {" " +
                order.currentRoute.order.client.name +
                " " +
                order.currentRoute.order.client.lastname}
            </Typography>
          ) : null}
          {order.currentRoute.order.clientAddress.sector ? (
            <Typography align="justify" className={classes.subtitle}>
              <b>Sector:</b>{" "}
              {" " + order.currentRoute.order.clientAddress.sector}
            </Typography>
          ) : null}
          {order.currentRoute.order.clientAddress.principalStreet ? (
            <Typography align="justify" className={classes.subtitle}>
              <b>Dirección:</b> {getDireccion()}
            </Typography>
          ) : null}
          {order.currentRoute.order.clientAddress.cellphone ? (
            <Typography align="justify" className={classes.subtitle}>
              <b>Teléfono:</b>{" "}
              {" " + order.currentRoute.order.clientAddress.cellphone}
            </Typography>
          ) : null}
          {order.currentRoute.order.clientAddress.directions ? (
            <Typography align="justify" className={classes.subtitle}>
              <b>Referencia:</b>{" "}
              {" " + order.currentRoute.order.clientAddress.directions}
            </Typography>
          ) : null}
        </div>
      ) : null}
      <div className={classes.contentContainer}>
        <Typography className={classes.divisionText}>
          {"ORDENES EN ESPERA (" + order.ordersAssigned.length + ")"}
        </Typography>
        <div className={classes.espera}>
          {order.ordersAssigned.map((asigned, index) => {
            return (
              <Typography
                align="justify"
                className={classes.subtitle}
                key={index}
              >
                <Link
                  onClick={(e) => {
                    getEsperaToShow(asigned.transact);
                  }}
                >
                  <b>Orden:</b>{" "}
                  {" " +
                    asigned.order.transact +
                    " - " +
                    asigned.order.client.name +
                    " " +
                    asigned.order.client.lastname}
                </Link>
              </Typography>
            );
          })}
        </div>
      </div>
      <Modal open={openEspera} onClose={closeEspera} className={classes.modal}>
        <div>
          <EsperaInfo
            ordersAssigned={esperaToShow}
            setAuxMarkerToShow={setAuxMarkerToShow}
            closeEspera={closeEspera}
            closeOrderInfo={closeOrderInfo}
            auxMarkerToShowCenter={auxMarkerToShowCenter}
          />
        </div>
      </Modal>
    </Paper>
  );
}

export default OrderInfo;
