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

  useEffect(() => {
    if(props.latitude){
      if(mapInstance){
        mapInstance.setCenter({lat:props.latitud, lng:props.longitud});
      }
    }
  }, [props.latitud])

  useEffect(() => {
    if(props.longitud){
      if(mapInstance){
        mapInstance.setCenter({lat:props.latitud, lng:props.longitud});
      }
    }
  }, [props.longitud])

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

    //console.log(mapInstance);
    //mapInstance.setCenter({lat:-0.179663, lng:-78.4945227});

    if (props.showingInfoWindow) {
      props.setshowingInfoWindow(false);
      // setactiveMarker(null);
    }
  };

  let auxMarkerToShow = props.auxMarkerToShow? props.auxMarkerToShow.slice():[];
  auxMarkerToShow = auxMarkerToShow.filter(
    (el) => el.latitude !== 0 && el.longitude !== 0
  );

  let lastUpdates = props.transformed ? props.transformed.slice() : [];
  lastUpdates = lastUpdates.filter(
    (el) => el.lastPosition.latitude !== 0 && el.lastPosition.longitude !== 0
  );

  let allLocales = props.locales ? props.locales.slice() : [];
  allLocales = allLocales.filter(
    (el) => el.location.latitude !== 0 && el.location.longitude !== 0
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
        //center={{ lat: props.latitud, lng: props.longitud }}
        onReady={handleMapReady}
        onClick={(props, marker, event) => {
          onMapClick(props);
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
              actual={
                elTrack.hasActiveDeliveries
                  ? elTrack.currentRoute.order.transact
                  : null
              }
              espera={elTrack.ordersAssigned.length}
              status={0}
              location={
                "Lat: " +
                elTrack.lastPosition.latitude +
                " Long: " +
                elTrack.lastPosition.longitude
              }
              icon={{
                url: "/img/blackFish.png",
                scaledSize: new google.maps.Size(30, 30),
              }}
              position={{
                lat: elTrack.lastPosition.latitude,
                lng: elTrack.lastPosition.longitude,
              }}
            />
          );
        })}
        {allLocales.map((elTrack, index) => {
          // LOCALES
          return (
            <Marker
              key={index}
              onClick={(prop, marker, e) => {
                props.callSetActiveMarker(marker);
                props.setshowingInfoWindow(true);
              }}
              title={elTrack.name?elTrack.name:null}
              local={elTrack.name?elTrack.name:null}
              status={2}
              location={
                "Lat: " +
                elTrack.location.latitude +
                " Long: " +
                elTrack.location.longitude
              }
              icon={{
                url: "/img/fish3.png",
                scaledSize: new google.maps.Size(20, 20),
              }}
              position={{
                lat: elTrack.location.latitude,
                lng: elTrack.location.longitude,
              }}
            />
          );
        })}
        {auxMarkerToShow.map((elTrack, index) => {
          // ADDITIONAL MARKERS TO SHOW
          return (
            <Marker
              key={index}
              onClick={(prop, marker, e) => {
                props.callSetActiveMarker(marker);
                props.setshowingInfoWindow(true);
              }}
              title={elTrack.reportedBy?elTrack.reportedBy:null}
              recibe={elTrack.client?elTrack.client.name + " " + elTrack.client.lastname + ", en espera":null}
              eventDescription={elTrack.eventDescription?elTrack.eventDescription:null}
              eventName={elTrack.eventName?elTrack.eventName:null}
              status={2}
              location={
                "Lat: " +
                elTrack.latitude +
                " Long: " +
                elTrack.longitude
              }
              position={{
                lat: elTrack.latitude,
                lng: elTrack.longitude,
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
                local={props.activeMarker.local}
                recibe={props.activeMarker.recibe}
                transact={props.activeMarker.transact}
                eventName={props.activeMarker.eventName}
                eventDescription={props.activeMarker.eventDescription}
              />
            )}
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDgsuPP6lq7UZnKlxnC5bTAKvRiQe-He74",
  //libraries: [],
})(MapContainerF);
