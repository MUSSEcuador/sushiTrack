/* global google */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Map, GoogleApiWrapper } from "google-maps-react";

const useStyles = makeStyles((theme) => ({
  divMapContainer: {
    margin: "2vh 2vw",
    position: "sticky",
    display: "inherit",
    width: "96vw",
    //inicia styles
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "lightgrey",
    height: "80vh",
    align: "center",
    //fin styles

  },

  infoWindowTitle: {
    color: "black",
    fontSize: "1.2rem",
  },
  infoWindowText: {
    color: "black",
  },
}));

function MapContainerR(props) {

  console.log(props.dataToShowRoute)
  const classes = useStyles();

  const [latitude, setLatitude] = useState(-0.176663);
  const [longitude, setLongitude] = useState(-78.4845227);
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
      setLatitude(props.dataToShowRoute.shift().location.lat);
      setLongitude(props.dataToShowRoute.shift().location.lng);
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
    if (waypoints.length > 1) {
      const origin = waypoints.shift().location;
      const destination = waypoints.pop().location;
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            directionsDisplay.setDirections(response);
            directionsDisplay.setOptions({ suppressMarkers: false });
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  };
  return (
    <div className={classes.divMapContainer}>
      <Map
        item
        xs={6}
        google={props.google}
        mapTypeControl={false}
        zoom={12}
        initialCenter={{ lat: latitude, lng: longitude}}
        center={{ lat: latitude, lng: longitude}}
        onReady={handleMapReady}
      >

      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  //apiKey: "AIzaSyDGA3CpMqhCRFj6RPuQkfkHnw9l0sGTUx4",
  apiKey: "AIzaSyDgsuPP6lq7UZnKlxnC5bTAKvRiQe-He74",
  //libraries: [],
})(MapContainerR);
