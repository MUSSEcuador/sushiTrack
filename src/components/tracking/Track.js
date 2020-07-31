import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Grid, Modal } from "@material-ui/core";

import { GoogleApiWrapper, InfoWindow, Map, Marker } from "google-maps-react";

import Loading from "../common/Loading";
import Error from "../common/Error";
import Header from "../common/Header";
import MotorizadoInfo from "./MotorizadoInfo";
import CallMotorizado from "./CallMotorizado";
//import { useStoreActions, useStoreState } from "easy-peasy";

const DATOS = gql`
  {
    orders {
      id
      latitude
      longitude
      cellphone
      name
      lastName
      principalStreet
      secondaryStreet
      number
      sector
      city
      areaCode
      countryCode
      motorizado {
        id
        name
        placa
        cedula
        phone
        latitude
        longitude
      }
    }
    motorizados {
      id
      name
      placa
      cedula
      phone
      latitude
      longitude
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "2vh",
    height: "100vh",
    backgroundColor: theme.palette.primary.dark,
  },
  controlPanel: {
    marginTop: "2vh",
  },
  vehMap: {
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
  },
  divMapContainer: {
    margin: theme.spacing(0, 2, 0, 2),
    position: "sticky",
    display: "inherit",
    width: "72vw",
    //inicia styles
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "lightgrey",
    height: "80vh",
    align: "center",
    //fin styles
    [theme.breakpoints.only("md")]: {
      margin: "2vh 2vw 0 2vw",
      width: "70vw",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "2vh 2vw 0 2vw",
      width: "90vw",
    },
  },
  infoWindowTitle: {
    color: "black",
    fontSize: "1.2rem",
  },
  infoWindowText: {
    color: "black",
  },
}));

function Track(props) {
  //import classes
  const classes = useStyles();

  //local variables
  const [latitudInicial] = React.useState(-0.21000068);
  const [longitudInicial] = React.useState(-78.493335);
  const [latitud, setLatitud] = React.useState(latitudInicial);
  const [longitud, setLongitud] = React.useState(longitudInicial);
  const [mapZoom, setMapZoom] = React.useState(13);
  const [showingInfoWindow, setshowingInfoWindow] = React.useState(false);
  const [activeMarker, setactiveMarker] = React.useState({});
  const { loading, error, data } = useQuery(DATOS);

  const [openCall, setOpenCall] = React.useState(false);

  //FUNCTIONS
  const onMarkerClick = (props, marker, e) => {
    console.log(marker);
    setactiveMarker(marker);
    setshowingInfoWindow(true);
  };

  const onMapClick = (props) => {
    if (showingInfoWindow) {
      setshowingInfoWindow(false);
      // setactiveMarker(null);
    }
  };

  const openCallModal = () => {
    setOpenCall(true);
  };
  const closeCallModal = () => {
    setOpenCall(false);
  };
  const recenter = (veh) => {
    setMapZoom(16);
    setLatitud(veh.motorizado.latitude);
    setLongitud(veh.motorizado.longitude);
  };

  if (loading) return (<Loading/>);
  if (error) return (<Error error={error}/>);
  return (
    <div className={classes.root}>
      <Header openCallModal={openCallModal} />
      <Grid container>
        <Grid item xs={12} md={3} className={classes.controlPanel}>
          <div className={classes.vehMap}>
            {data.orders
              ? data.orders.map((veh) => {
                  return (
                    <MotorizadoInfo
                      veh={veh}
                      key={veh.id}
                      recenter={recenter}
                    />
                  );
                })
              : null}
          </div>
        </Grid>
        <Grid item sm={12} md={9}>
          <div className={classes.divMapContainer}>
            <Map
              item
              xs={6}
              google={props.google}
              zoom={mapZoom}
              mapTypeControl={true}
              initialCenter={{ lat: latitudInicial, lng: longitudInicial }}
              center={{ lat: latitud, lng: longitud }}
              onClick={(props, marker, event) => {
                onMapClick();
              }}
            >
              {data.orders
                ? data.orders.map((elTrack) => {
                    return (
                      <Marker
                        key={elTrack.id}
                        onClick={onMarkerClick}
                        title={elTrack.motorizado.name}
                        placa={elTrack.placa}
                        location={
                          "Lat: " +
                          elTrack.motorizado.latitude +
                          " Long: " +
                          elTrack.motorizado.longitude
                        }
                        //   icon={
                        //       {
                        //           url: "/img/truckIcon.png",
                        //         }
                        //   }
                        position={{
                          lat: elTrack.motorizado.latitude,
                          lng: elTrack.motorizado.longitude,
                        }}
                      />
                    );
                  })
                : null}
              <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
                <div>
                  <p align="center" className={classes.infoWindowTitle}>
                    {" "}
                    {"Nombre: " + activeMarker.title}
                  </p>
                  {activeMarker.position ? (
                    <p
                      align="justify"
                      variant="caption"
                      className={classes.infoWindowText}
                    >
                      {activeMarker.location}
                    </p>
                  ) : null}
                  <p
                    align="justify"
                    variant="caption"
                    className={classes.infoWindowText}
                  >
                    {"Fecha: " + activeMarker.placa}
                  </p>
                </div>
              </InfoWindow>
            </Map>
          </div>
        </Grid>
      </Grid>
      <Modal open={openCall} onClose={closeCallModal}>
        <div>
          <CallMotorizado motorizados={data.motorizados} />
        </div>
      </Modal>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGA3CpMqhCRFj6RPuQkfkHnw9l0sGTUx4",
})(Track);
