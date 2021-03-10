import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";

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
import LinkIcon from "@material-ui/icons/Link";
import DeleteIcon from "@material-ui/icons/Delete";

import OrderInfo from "./OrderInfo";
import TrackURL from "./TrackURL";
import ConfirmDeleteDelivery from "./ConfirmDeleteDelivery";

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

const GET_URL = gql`
  query GetEncrypted($transact: String!, $token: String!) {
    getEncryptedTransact(transact: $transact, token: $token)
  }
`;

const useStyles = makeStyles((theme) => ({
  withRoute: {
    margin: "0.5vh 0vw ",
    width: "99%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.primary.light,
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    position: "relative",
  },
  withoutRoute: {
    margin: "0.5vh 0vw",
    width: "99%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.error.light,
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    position: "relative",
  },
  externalWithRoute: {
    margin: "0.5vh 0vw ",
    width: "99%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.info.light,
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    position: "relative",
  },
  externalWithoutRoute: {
    margin: "0.5vh 0vw",
    width: "99%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.warning.light,
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
    fontWeight: 200,
    fontSize: "9px",
    color: theme.palette.secondary.dark,
    lineHeight: "initial",
    padding: "0.5vh 0 0 0",
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
  tooltipMotorizado: {
    position: "absolute",
    right: "45px",
    bottom: "20px",
    width: "5px",
  },
  deleteMotorizado: {
    backgroundColor: "rgba(120,120,120, 0.4)",
    color: theme.palette.primary.light,
    boxShadow: "0px 0px 20px rgb(200,200,200)",
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

  const {
    order,
    recenter,
    destinoCenter,
    auxMarkerToShowCenter,
    showOrderRoute,
    showOffice,
    setAuxMarkerToShow,
  } = props;

  const [transact, setTransact] = React.useState(null);
  const [urlToShow, setURL] = React.useState(null);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openURL, setOpenURL] = React.useState(false);
  const [sendOpenURL, setSendOpenURL] = React.useState(false);

  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);

  const [stopCallDeliveryToOffice] = useMutation(CANCEL_CALL);

  const [getURL, url] = useLazyQuery(GET_URL, {
    // variables: {
    //   token: sessionStorage.token,
    //   transact: transact,
    // },
  });

  // useEffect(() => {
  //   if (openURL) {
  //     setTransact(order.currentRoute.order.transact);
  //   }
  // }, [openURL]);

  useEffect(() => {
    if (transact) {
      getURL({
        variables: {
          token: sessionStorage.token,
          transact: transact,
        },
      });
    }
  }, [transact]);

  useEffect(() => {
    if (url.data) {
      setURL(url.data?.getEncryptedTransact);
      setSendOpenURL(true);

    }
  }, [url]);

  const getLastUpdate = () => {
    if (order.lastUpdate) {
      if (order.lastUpdate.toString() === "0001-01-01T00:00:00") {
        return "no registra";
      }
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
  const closeConfirm = () => {
    setOpenConfirmModal(false);
  };

  const closeURL = () => {
    setOpenURL(false);
    setSendOpenURL(false);
    setTransact(null);
  };

  const onCancelCall = (param) => {

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
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getClass = (hasActiveDeliveries, externalPlatformToken) => {
    if (hasActiveDeliveries && externalPlatformToken === "SUSHICORP") {
      return classes.withRoute;
    }
    if (hasActiveDeliveries && externalPlatformToken !== "SUSHICORP") {
      return classes.externalWithRoute;
    }
    if (!hasActiveDeliveries && externalPlatformToken === "SUSHICORP") {
      return classes.withoutRoute;
    }
    if (!hasActiveDeliveries && externalPlatformToken !== "SUSHICORP") {
      return classes.externalWithoutRoute;
    }
  };

  return (
    <div>
      <Box
        className={getClass(
          order.hasActiveDeliveries,
          order.externalPlatformToken
        )}
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
          <b>Última actualización: </b>
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
          <b>Órdenes en espera: </b>
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
                    setAuxMarkerToShow([]);
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
                    setAuxMarkerToShow([]);
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
                    setAuxMarkerToShow([]);
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
          {order.currentRoute ? (
            <Grid item xs={1}>
              <Tooltip title="Generar URL" enterDelay={400} leaveDelay={200}>
                <InputAdornment position="start">
                  <IconButton
                    className={classes.activo}
                    onClick={(e) => {
                      setTransact(order.currentRoute.order.transact);
                    }}
                  >
                    {<LinkIcon />}
                  </IconButton>
                </InputAdornment>
              </Tooltip>
            </Grid>
          ) : null}
          {calculateDelay() > 500 ? (
            <>

              <Tooltip
                className={classes.tooltipMotorizado}
                title="Eliminar motorizado"
                enterDelay={400}
                leaveDelay={200}
              >
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    className={classes.deleteMotorizado}
                    onClick={(e) => {
                      setOpenConfirmModal(true);
                    }}
                  >
                    {<DeleteIcon />}
                  </IconButton>
                </InputAdornment>
              </Tooltip>
              {/* </Grid> */}
            </>
          ) : null}
        </Grid>
      </Box>
      <Modal
        open={openInfo}
        onClose={closeModal}
        className={classes.modal}
        disableAutoFocus={true}
      >
        <div>
          <OrderInfo
            order={order}
            setAuxMarkerToShow={setAuxMarkerToShow}
            closeOrderInfo={closeModal}
            auxMarkerToShowCenter={auxMarkerToShowCenter}
          />
        </div>
      </Modal>
      <Modal
        open={sendOpenURL}
        onClose={closeURL}
        className={classes.modal}
        disableAutoFocus={true}
      >
        <div>
          <TrackURL url={urlToShow} closeURL={closeURL} />
        </div>
      </Modal>
      <Modal
        open={openConfirmModal}
        onClose={closeConfirm}
        className={classes.modal}
      >
        <div>
          <ConfirmDeleteDelivery closeConfirm={closeConfirm}
           seleccionado={order} 
           />
        </div>
      </Modal>
    </div>
  );
}

export default MotorizadoInfo;
