import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import moment from "moment";
import {
  Grid,
  IconButton,
  Box,
  Typography,
  Tooltip,
  Modal,
} from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import CallEndIcon from "@material-ui/icons/CallEnd";
import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";

import OrderInfo from "./OrderInfo";

const CANCEL_CALL = gql`
  mutation StopCallDeliveryToOffice(
    $callDeliveryDetail: CallDelivery
    $token: String!
  ) {
    stopCallDeliveryToOffice(
      callDeliveryDetail: $callDeliveryDetail
      token: $token
    )
  }
`;

const useStyles = makeStyles((theme) => ({
  withRoute: {
    margin: "0.5vh 0vw ",
    width: "100%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.primary.light,
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    position: "relative",
  },
  withoutRoute: {
    margin: "0.5vh 0vw",
    width: "100%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.error.light,
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    position: "relative",
  },
  alerta: {
    position: "absolute",
    right: "4px",
    top: "1px",
    width: "30%",
    fontWeight: 500,
    fontSize: "9px",
    color: theme.palette.secondary.dark,
    padding: "0 0",
    boxShadow: "2px 2px 3px rgb(100,100,100)",
  },
  called: {
    position: "absolute",
    left: "5px",
    top: "2px",
    width: "5px",
    color: theme.palette.primary.main,
  },
  cancelCall: {
    position: "absolute",
    left: "45px",
    top: "2px",
    width: "5px",
    color: theme.palette.primary.main,
  },
  vehTitle: {
    fontSize: 16,
    fontWeight: 800,
    paddingTop: "1vh",
    color: theme.palette.secondary.contrastText,
    marginBottom: "2vh",
  },
  vehData: {
    fontSize: 13,
    margin: "1vh 0 1vh 1vw",
    color: theme.palette.secondary.contrastText,
  },
  activo: {
    color: theme.palette.secondary.main,
  },
  iconsList: {
    marginTop: "2px",
    marginBottom: "2px",
    paddingLeft: "1vw",
  },
  modal: {
    marginLeft: "10vw",
    marginTop: "15vh",
    marginRight: "20vw",
    
  },
}));

function MotorizadoInfo(props) {
  const classes = useStyles();

  const { order, recenter, destinoCenter, showOrderRoute, showOffice } = props;

  const [openInfo, setOpenInfo] = React.useState(false);
  const [stopCallDeliveryToOffice] = useMutation(CANCEL_CALL);

  const getLastUpdate = () => {
    if (order.lastUpdate) {
      let toTime = moment(order.lastUpdate).toLocaleString();
      toTime = toTime.split("G");
      toTime = toTime[0];
      return toTime;
    }
  };

  const calculateDelay = () => {
    let calc = moment.now() - moment(order.lastUpdate);
    let duration = moment.duration(calc).asMinutes();
    return duration;
  };

  const closeModal = () => {
    setOpenInfo(false);
  };

  const onCancelCall = (param) => {
    console.log(param);
    const auxCallData = {
      deliveryId: order.name,
      officeAddress: {
        principalStreet: order.returningToOffice.officeLocation.principalStreet,
        directions: order.returningToOffice.officeLocation.directions,
      },
      officePosition: {
        latitude: order.returningToOffice.officePosition.latitude,
        longitude: order.returningToOffice.officePosition.longitude,
      },
    };

    stopCallDeliveryToOffice({
      variables: {
        token: sessionStorage.token,
        callDeliveryDetail: auxCallData,
      },
    })
      .then((r) => {
        console.log(r.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Box
        className={
          order.hasActiveDeliveries ? classes.withRoute : classes.withoutRoute
        }
      >
        {calculateDelay() > 5 ? (
          <p className={classes.alerta}>
            <span>No se ha actualizado en:</span>
            <br />
            <b>{+calculateDelay().toFixed(0)}</b>
            <span> minutos</span>
          </p>
        ) : null}
        {order.returningToOffice ? (
          <div>
            <Tooltip
              title="Regresando a local"
              enterDelay={400}
              leaveDelay={200}
            >
              <InputAdornment position="start">
                <IconButton
                  className={classes.called}
                  onClick={(e) => {
                    if (order.returningToOffice.officePosition) {
                      showOffice(order.returningToOffice.officePosition);
                    }
                  }}
                >
                  <EmojiTransportationIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
            <Tooltip title="Cancelar llamada" enterDelay={400} leaveDelay={200}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.cancelCall}
                  onClick={(e) => {
                    onCancelCall(order);
                  }}
                >
                  <CallEndIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </div>
        ) : null}

        <Typography className={classes.vehTitle}> {order.name}</Typography>
        <Typography align="left" className={classes.vehData}>
          <b>Delivery: </b>
          {" " + order.firstName + " " + order.lastName}
        </Typography>
        <Typography align="left" className={classes.vehData}>
          <b>Ultima actualización: </b>
          {getLastUpdate()}
        </Typography>
        {order.currentRoute ? (
          <div>
            <Typography align="justify" className={classes.vehData}>
              <b>Orden actual Id: </b>
              {" " + order.currentRoute.order.transact}
            </Typography>
            <Typography align="justify" className={classes.vehData}>
              <b>Orden actual Cliente: </b>
              {" " +
                order.currentRoute.order.client.name +
                " " +
                order.currentRoute.order.client.lastname}
            </Typography>
          </div>
        ) : null}

        <Typography align="justify" className={classes.vehData}>
          <b>Ordenes en espera: </b>
          {" " + order.ordersAssigned.length}
        </Typography>
        <Grid container spacing={4} className={classes.iconsList}>
          <Grid item xs={1}>
            <Tooltip title="Detalle" enterDelay={400} leaveDelay={200}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    setOpenInfo(true);
                  }}
                >
                  <AirportShuttleIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Ruta" enterDelay={600} leaveDelay={150}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    e.preventDefault();
                    showOrderRoute(order);
                  }}
                  disabled={!order.currentRoute?.order?.destination}
                >
                  <DeviceHubIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Ub. Actual" enterDelay={600} leaveDelay={150}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    e.preventDefault();
                    recenter(order);
                  }}
                >
                  <LocationOnIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Destino" enterDelay={400} leaveDelay={200}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    e.preventDefault();
                    destinoCenter(order);
                  }}
                  disabled={!order.currentRoute?.order?.destination}
                >
                  {<VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      <Modal open={openInfo} onClose={closeModal} className={classes.modal} disableAutoFocus={true}>
        <div>
          <OrderInfo order={order} />
        </div>
      </Modal>
    </div>
  );
}

export default MotorizadoInfo;
