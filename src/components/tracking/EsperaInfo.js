import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";

import { Typography, Fab, Tooltip, Modal, IconButton } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import RoomIcon from '@material-ui/icons/Room';
import CloseIcon from '@material-ui/icons/Close';

import TrackURL from "./TrackURL";


const GET_URL = gql`
  query GetEncrypted($transact: String!, $token: String!) {
    getEncryptedTransact(transact: $transact, token: $token)
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    height: "56vh",
    width: "56vw",
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
    textAlign: "center",
    position: "relative",
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "20%",
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
  callURL: {
    position: "absolute",
    top: "18%",
    right: 5,
  },
  showOnMap: {
    position: "absolute",
    top: "28%",
    right: 5,
  },
  title: {
    padding: "2vh 0",
    color: theme.palette.secondary.light,
    fontWeight: 300,
    fontSize: "1.9em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9em",
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
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
    },
  },
  items: {
    maxHeight: "45%",
    margin: "0vh 1vw 2vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "lightgrey",
  },
  itemsText: {
    padding: "0.5vh",
    color: theme.palette.secondary.contrastText,
    fontWeight: 100,
    fontSize: "1.1em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
    },
  },
  modal: {
    marginLeft: "10vw",
    marginTop: "15vh",
    marginRight: "20vw",
  },
}));

function EsperaInfo(props) {
  const { ordersAssigned, setAuxMarkerToShow, closeEspera, closeOrderInfo, auxMarkerToShowCenter } = props;
  const classes = useStyles();

  const [transact, setTransact] = React.useState(null);
  const [urlToShow, setURL] = React.useState(null);
  const [openURL, setOpenURL] = React.useState(false);
  const [sendOpenURL, setSendOpenURL] = React.useState(false);

  const [getURL, url] = useLazyQuery(GET_URL, {
    // variables: {
    //   token: sessionStorage.token,
    //   transact: transact,
    // },
  });

  // useEffect(() => {
  //   if (openURL) {
  //     setTransact(ordersAssigned.order.transact);
  //   }
  // }, [openURL]);

  useEffect(() => {
    if (transact) {
      getURL({variables: {
        token: sessionStorage.token,
        transact: transact,
      }});
    }
  }, [transact]);

  useEffect(() => {
    if (url.data) {
      setURL(url.data?.getEncryptedTransact);
      setSendOpenURL(true);
    }
  }, [url]);

  const closeURL = () => {
    setOpenURL(false);
    setSendOpenURL(false);
    setTransact(null);
    
  };

  const goToMap =()=>{

    const auxToMap = {
      latitude : ordersAssigned.order.destination.latitude,
      longitude : ordersAssigned.order.destination.longitude,
      client: ordersAssigned.order.client
    }
    setAuxMarkerToShow([auxToMap]);
    auxMarkerToShowCenter(auxToMap)
    closeURL();
    closeEspera();
    closeOrderInfo()
  }

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
      <Tooltip
        className={classes.callURL}
        title="Generar URL"
        enterDelay={400}
        leaveDelay={200}
      >
        <Fab
          size="small"
          onClick={(e) => {
            e.preventDefault();
            setTransact(ordersAssigned.order.transact);
            //setOpenURL(true);
          }}
        >
          <LinkIcon />
        </Fab>
      </Tooltip>
      <Tooltip
        className={classes.showOnMap}
        title="Ir al mapa"
        enterDelay={400}
        leaveDelay={200}
      >
        <Fab
          size="small"
          onClick={(e) => {
            e.preventDefault();
            goToMap();
          }}
        >
          <RoomIcon />
        </Fab>
      </Tooltip>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          {"Orden #: " + ordersAssigned.order.tripId}
        </Typography>
        <IconButton className={classes.closeButton} onClick={closeEspera}>
          <CloseIcon/>
        </IconButton>
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
        <Typography>
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
      <Modal
        open={sendOpenURL}
        onClose={closeURL}
        className={classes.modal}
        disableAutoFocus={true}
      >
        <div>
          <TrackURL url={urlToShow} closeURL={closeURL}/>
        </div>
      </Modal>
    </div>
  );
}

export default EsperaInfo;
