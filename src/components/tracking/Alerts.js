import React, { useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  List,
  ListItem,
  Divider,
  Button,
  CircularProgress,
  Modal,
  IconButton,
  Grid
} from "@material-ui/core";

import RoomIcon from "@material-ui/icons/Room";
import CloseIcon from '@material-ui/icons/Close';

import Zoom from "./Zoom";
import Atender from "./Atender";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "90vh",
    width: "70vw",
    backgroundColor: theme.palette.primary.light,
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    position: "relative",
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "9%",
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
    padding: "3vh 8vw",
  },
  title: {
    color: theme.palette.secondary.light,
    fontWeight: 300,
    fontSize: "1.3em",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.9em",
    },
  },
  alertasContainer: {
    minHeight: "20vh",
    maxHeight: "25vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    boxShadow: "1px 1px 2px rgb(220,220,220)",
    marginBottom: "2vh",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "20vh",
      fontSize: "0.9em",
    },
  },
  descripcion: {
    minHeight: "8vh",
    maxHeight: "8vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    marginBottom: "2vh",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9em",
    },
  },
  listItem: {
    fontSize: "1em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
    },
  },
  seleccionado: {
    padding: "0 2vw",
    fontSize: "1em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
    },
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: "2vh",
    left: "35%",
    width: "30%",
    height: "4vh",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontWeight: 900,
    fontSize: "1.2em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9em",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  resumen: {
    padding: "2vh 2vw 2vh 2vw",
    boxShadow: "1px 1px 2px rgb(220,220,220)",
    backgroundColor: theme.palette.info.main,
  },
  imagenVertical: {
    maxHeight: "25vh",
    maxWidth: "45vw",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "30vh",
    },
  },
  imagenHorzontal: {
    maxWidth: "50%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  imgContainer: {
    textAlign: "center",
    maxWidth: "100%",
  },
  modal: {
    marginLeft: "20vw",
    marginTop: "10vh",
    marginRight: "25vw",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "10vw",
    },
  },
  modalH: {
    marginLeft: "20vw",
    marginTop: "10vh",
    marginRight: "25vw",
    [theme.breakpoints.down("sm")]: {
      marginTop: "40vh",
      marginRight: "35vw",
    },
  },
  modalV: {
    marginLeft: "35vw",
    marginTop: "30vh",
    marginRight: "50vw",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "20vw",
      marginRight: "30vw",
    },
  },
}));

const PICTURE = gql`
  query GetPicture($imageId: String!, $token: String!) {
    getPicture(imageId: $imageId, token: $token)
  }
`;

function Alerts(props) {
  const {
    alerts,
    closeModal,
    auxMarkerToShowCenter,
    setAuxMarkerToShow,
  } = props;
  const classes = useStyles();
  const [seleccionado, setSeleccionado] = React.useState(null);
  const [openZoom, setOpenZoom] = React.useState(false);
  const [openAtender, setOpenAtender] = React.useState(false);
  const [proporcion, setProporcion] = React.useState(1);
  const [alertasToList, setAlertas] = React.useState(alerts);
  const { data } = useQuery(PICTURE, {
    variables: {
      token: sessionStorage.token,
      imageId: seleccionado ? seleccionado.photo : "",
    },
  });

  const closeZoom = () => {
    setOpenZoom(false);
  };

  const closeAtender = () => {
    setOpenAtender(false);
    closeModal();
  };


  useEffect(() => {
    setAlertas(alerts);
  }, [alerts]);

  useEffect(() => {
    if (data && data.getPicture) {
      let img = new Image();
      img.onload = function () {
        setProporcion(img.width - img.height);
      };
      img.src = `data:image/jpeg;base64,${data.getPicture}`;
    }
  }, [data]);

  const goToMap = (al) => {
    console.log(al);
    const auxToMap = {
      latitude: al.location.latitude,
      longitude: al.location.longitude,
      eventDescription: al.eventDescription,
      eventName: al.eventName,
      reportedBy: al.reportedBy,
    };
    setAuxMarkerToShow([auxToMap]);
    auxMarkerToShowCenter(auxToMap);
    closeAtender();
    // closeEspera();
    // closeOrderInfo()
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          Alertas activas
        </Typography>
        <IconButton className={classes.closeButton} onClick={closeModal}>
          <CloseIcon/>
        </IconButton>
      </div>
      <div className={classes.contentContainer}>
        <div className={classes.alertasContainer}>
          <List>
            {alertasToList.map((al, index) => {
              return (
                <React.Fragment key={index}>
                  <Divider />
                  <ListItem
                    alignItems="flex-start"
                    onClick={() => {
                      setSeleccionado(al);
                    }}
                  >
                    <Grid container>
                      <Grid item xs={11}>
                        <Typography className={classes.listItem}>
                          {al.reportedBy +
                            " " +
                            al.eventDescription}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            goToMap(al);
                          }}
                        >
                          <RoomIcon color="secondary" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </div>
        <div className={classes.titleContainer}>
          {seleccionado ? (
            <Typography className={classes.title} align="center">
              {seleccionado.reportedBy}
            </Typography>
          ) : null}
        </div>

        <div className={classes.resumen}>
          {seleccionado ? (
            <div>
              <Typography className={classes.seleccionado}>
                <b> {seleccionado.eventName}</b>
              </Typography>
              <div className={classes.descripcion}>
                <Typography className={classes.seleccionado}>
                  {seleccionado.eventDescription}
                </Typography>
              </div>
              <div className={classes.imgContainer}>
                {data?.getPicture ? (
                  <img
                    onClick={() => {
                      setOpenZoom(true);
                    }}
                    className={
                      proporcion > 0
                        ? classes.imagenHorzontal
                        : classes.imagenVertical
                    }
                    src={`data:image/jpeg;base64,${data.getPicture}`}
                    alt="imagen"
                  />
                ) : (
                  <CircularProgress color="primary" />
                )}
              </div>
            </div>
          ) : null}
        </div>
        <Button
          className={classes.button}
          disabled={!seleccionado}
          variant="contained"
          onClick={() => {
            setOpenAtender(true);
          }}
        >
          ATENDER
        </Button>
      </div>
      <Modal
        open={openZoom}
        onClose={closeZoom}
        className={proporcion > 0 ? classes.modalH : classes.modalV}
      >
        <div>
          <Zoom
            closeZoom={closeZoom}
            proporcion={proporcion}
            imagenToZoom={data ? data.getPicture : ""}
          />
        </div>
      </Modal>
      <Modal
        open={openAtender}
        onClose={closeAtender}
        className={classes.modal}
      >
        <div>
          <Atender closeAtender={closeAtender} seleccionado={seleccionado} />
        </div>
      </Modal>
    </div>
  );
}

export default Alerts;
