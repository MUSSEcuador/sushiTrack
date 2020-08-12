/* global google */
import React, { useState, useEffect } from "react";
import {makeStyles} from "@material-ui/core/styles";

import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";

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
        width: "90vw"
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
    const classes = useStyles()
  const [mapInstance, setMapInstance] = useState(null);

  const handleMapReady = (mapProps, map) => {
    setMapInstance(map);
    calculateAndDisplayRoute(map, props.dataToShowRoute);
  };

  useEffect(() => {
    if (props.showRoute) {
      if(mapInstance){
        calculateAndDisplayRoute(mapInstance, props.dataToShowRoute);
      }
    }
  }, [props.showRoute]);

  const calculateAndDisplayRoute = (map, data) => {
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(map);

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

  console.log(props);
  return (
    <div  className={classes.divMapContainer}>
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
          onMapClick();
        }}
      >
        {props.transformed
          ? props.transformed.map((elTrack) => {
              return (
                <Marker
                  key={elTrack.tripId}
                  onClick={(prop, marker, e) => {
                    props.callSetActiveMarker(marker);
                    props.setshowingInfoWindow(true);
                  }}
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
        {props.transformed
          ? props.transformed.map((elTrack) => {
              return (
                <Marker
                  key={elTrack.tripId}
                  onClick={(prop, marker, e) => {
                    props.callSetActiveMarker(marker);
                    props.setshowingInfoWindow(true);
                  }}
                  title={elTrack.delivery}
                  tripId={elTrack.tripId}
                  location={
                    "Lat: " +
                    elTrack.lastLatitude +
                    " Long: " +
                    elTrack.lastLongitude
                  }
                  //   icon={
                  //       {
                  //           url: "/img/truckIcon.png",
                  //         }
                  //   }
                  position={{
                    lat: elTrack.lastLatitude,
                    lng: elTrack.lastLongitude,
                  }}
                />
              );
            })
          : null}
        <InfoWindow
          marker={props.activeMarker}
          visible={props.showingInfoWindow}
        >
          <div>
            <p align="center" style={{ color: "black", fontSize: "1.2em" }}>
              {" "}
              {"Delivery: " + props.activeMarker.title}
            </p>
            <p
              align="justify"
              variant="caption"
              style={{ color: "black", fontSize: "1.2em" }}
            >
              {"Id Entrega Actual: " + props.activeMarker.tripId}
            </p>
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
