/* global google */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import CustomInfoWindow from "./CustomInfoWindow";

const useStyles = makeStyles((theme) => ({
  divMapContainer: {
    margin: theme.spacing(0, 2, 0, 2),
    position: "sticky",
    display: "inherit",
    width: "73vw",
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

function MapContainerF(props) {
  const classes = useStyles();

  const { setOpenCall, setLatCall, setLongCall } = props;
  const [mapInstance, setMapInstance] = useState(null);
  const [showRouteOnMap, setShowRouteOnMap] = useState(false);
  const [displayServiceInstance, setDisplayServiceInstance] = useState(null);

  const handleMapReady = (mapProps, map) => {
    setMapInstance(map);
    calculateAndDisplayRoute(map, props.dataToShowRoute);
  };

  const handleRouteOff = () => {
    let directionsDisplay = displayServiceInstance;

    if (directionsDisplay !== null) {
      directionsDisplay.set("directions", null);
      setDisplayServiceInstance(directionsDisplay);
    }
  };

  useEffect(() => {
    if (props.dataToShowRoute && showRouteOnMap) {
      calculateAndDisplayRoute(mapInstance, props.dataToShowRoute);
    }
  }, [props.dataToShowRoute]);

  useEffect(() => {
    if (props.showRoute) {
      setShowRouteOnMap(true);
      if (mapInstance) {
        calculateAndDisplayRoute(mapInstance, props.dataToShowRoute);
      }
    } else {
      setShowRouteOnMap(false);
      handleRouteOff();
    }
  }, [props.showRoute]);

  const calculateAndDisplayRoute = (map, data) => {
    const directionsService = new google.maps.DirectionsService();
    let directionsDisplay = displayServiceInstance;

    if (displayServiceInstance == null) {
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);

      setDisplayServiceInstance(directionsDisplay);
    }

    const waypoints = data.map((item) => {
      return {
        location: { lat: item.lat, lng: item.lng },
        stopover: false,
      };
    });
    if (waypoints.length > 0) {
      const origin = waypoints.shift().location;
      const destination = waypoints.pop().location;
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            directionsDisplay.setDirections(response);
            directionsDisplay.setOptions({ suppressMarkers: true });
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  };

  const onMapClick = (props) => {
    if (props.showingInfoWindow) {
      props.setshowingInfoWindow(false);
      // setactiveMarker(null);
    }
  };

  let lastUpdates = props.transformed ? props.transformed.slice() : [];
  lastUpdates = lastUpdates.filter(
    (el) => el.lastPosition.latitude !== 0 && el.lastPosition.longitude !== 0
  );

  let destinations = props.transformed ? props.transformed.slice() : [];
  destinations = destinations
    .filter((el) => el.currentRoute !== null)
    .filter((el) => el.currentRoute.order.destination !== null);

  return (
    <div className={classes.divMapContainer}>
      <Map
        item
        xs={6}
        google={props.google}
        // className={"map"}
        mapTypeControl={false}
        zoom={props.mapZoom}
        initialCenter={{ lat: props.latitud, lng: props.longitud }}
        center={{ lat: props.latitud, lng: props.longitud }}
        onReady={handleMapReady}
        onClick={(props, marker, event) => {
          onMapClick(props);
        }}
        onRightclick={(props, marker, event) => {
          setOpenCall(true);
          setLatCall(event.latLng.lat());
          setLongCall(event.latLng.lng());
        }}
      >
        {destinations.map((elTrack, index) => {
          // LUGAR DE LLEGADA
          return (
            <Marker
              key={index}
              onClick={(prop, marker, e) => {
                props.callSetActiveMarker(marker);
                props.setshowingInfoWindow(true);
              }}
              title={elTrack.name}
              transact={elTrack.transact}
              recibe={
                elTrack.currentRoute.order.client.name +
                " " +
                elTrack.currentRoute.order.client.lastName
              }
              status={1}
              location={
                "Lat: " +
                elTrack.currentRoute.order.destination.latitude +
                " Long: " +
                elTrack.currentRoute.order.destination.longitude
              }
              position={{
                lat: elTrack.currentRoute.order.destination.latitude,
                lng: elTrack.currentRoute.order.destination.longitude,
              }}
            />
          );
        })}
        {lastUpdates.map((elTrack, index) => {
          // LAST POSITION
          return (
            <Marker
              key={index}
              onClick={(prop, marker, e) => {
                props.callSetActiveMarker(marker);
                props.setshowingInfoWindow(true);
              }}
              title={elTrack.name}
              actual={elTrack.hasActiveDeliveries?elTrack.currentRoute.order.transact:null}
              espera={elTrack.ordersAssigned.length}
              status={0}
              location={
                "Lat: " +
                elTrack.lastPosition.latitude +
                " Long: " +
                elTrack.lastPosition.longitude
              }
              icon={{
                url: "/img/blueIcon.png",
              }}
              position={{
                lat: elTrack.lastPosition.latitude,
                lng: elTrack.lastPosition.longitude,
              }}
            />
          );
        })}
        <InfoWindow
          marker={props.activeMarker}
          visible={props.showingInfoWindow}
        >
          <div>
            {props.activeMarker.status === 0 ? (
              <CustomInfoWindow
                title={props.activeMarker.title}
                actual={props.activeMarker.actual}
                espera={props.activeMarker.espera}
              />
            ) : (
              <CustomInfoWindow
                title={props.activeMarker.title}
                recibe={props.activeMarker.recibe}
                transact={props.activeMarker.transact}
              />
            )}
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGA3CpMqhCRFj6RPuQkfkHnw9l0sGTUx4",
  libraries: [],
})(MapContainerF);
