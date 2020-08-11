import React, { useEffect } from "react";

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

const DATOS = gql`
  query GetSystemStats($token: String!) {
    getSystemStats(token: $token) {
      deliveries {
        hasActiveDeliveries
        name
        firstName
        lastName
        cellphone
        currentRoute {
          tripId
          name
          lastName
          sector
          principalStreet
          secondaryStreet
          number
          city
          cellphone
          timeIn
          timeOut
          openDate
        }
        ordersAssigned {
          tripId
        deliveryStatus
         name
        lastName
        sector
        principalStreet
        secondaryStreet
        number
        city
        cellphone
        }
      }
      deliveriesWithActiveRoutes {
        remainOrdersAssigned
        delivery
        lastUpdate
        lastLatitude
        lastLongitude
        destinationLatitude
        destinationLongitude
        receipment
        tripId
      }
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
  modal:{
    marginLeft: "30vw",
    marginTop:"20vh",
    marginRight: "30vw"
  }
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
  const [token] = React.useState(sessionStorage.token);
  const { loading, error, data } = useQuery(DATOS, {
    variables: { token },
    pollInterval: 3000
  });

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
  const recenter = (order) => {
    console.log(order);
    setMapZoom(16);
    setLatitud(order.lastLatitude);
    setLongitud(order.lastLongitude);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data) {
    let transformed = data.getSystemStats.deliveriesWithActiveRoutes;
    const deliveriesData = data.getSystemStats.deliveries;
    transformed = transformed.map((summary) => {
      const found = deliveriesData.find((d) => d.name === summary.delivery);
      if (found) {
        summary.receipment = found.currentRoute;
        summary.ordersAssigned = found.ordersAssigned;
      }

      return summary;
    });

    return (
      <div className={classes.root}>
        <Header openCallModal={openCallModal} history={props.history} />
        <Grid container>
          <Grid item xs={12} md={3} className={classes.controlPanel}>
            <div className={classes.vehMap}>
              {transformed
                ? transformed.map((order) => {
                    return (
                      <MotorizadoInfo
                        order={order}
                        key={order.tripId}
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
                {transformed
                  ? transformed.map((elTrack) => {
                      return (
                        <Marker
                          key={elTrack.tripId}
                          onClick={onMarkerClick}
                          title={elTrack.delivery}
                          tripId={elTrack.tripId}
                          location={
                            "Lat: " +
                            elTrack.destinationLatitude +
                            " Long: " +
                            elTrack.destinationLongitude
                          }
                          //   icon={
                          //       {
                          //           url: "/img/truckIcon.png",
                          //         }
                          //   }
                          position={{
                            lat: elTrack.destinationLatitude,
                            lng: elTrack.destinationLongitude,
                          }}
                        />
                      );
                    })
                  : null}
                <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
                  <div>
                    <p align="center" className={classes.infoWindowTitle}>
                      {" "}
                      {"Delivery: " + activeMarker.title}
                    </p>
                    <p
                      align="justify"
                      variant="caption"
                      className={classes.infoWindowText}
                    >
                      {"Id Entrega Actual: " + activeMarker.tripId}
                    </p>
                  </div>
                </InfoWindow>
              </Map>
            </div>
          </Grid>
        </Grid>
        <Modal open={openCall} onClose={closeCallModal} className={classes.modal}>
          <div>
            <CallMotorizado motorizados={data.getSystemStats.deliveries} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGA3CpMqhCRFj6RPuQkfkHnw9l0sGTUx4",
})(Track);
