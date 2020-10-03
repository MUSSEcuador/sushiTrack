import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Typography,
  Grid,
  IconButton,
  Tooltip,
  InputAdornment,
  Box,
  TextField
} from "@material-ui/core";

import CloseIcon from '@material-ui/icons/Close';
import LinkIcon from "@material-ui/icons/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    height: "25vh",
    width: "80vw",
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
    textAlign: "center",
    outline: 0,
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "25%",
    paddingTop: "1vh",
    position: 'relative'
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2,
    color: theme.palette.secondary.light
  },
  contentContainer: {
    padding: "5vh 2vw",
  },
  title: {
    padding: "1vh 0",
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
  urlContainer:{
    width: "80%"
  },
  iconContainer:{
    marginTop: "50%"
  }
}));
function TrackURL(props) {
  const classes = useStyles();
  const {closeURL} = props;

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          {"Enlace para el Rastreo"}
        </Typography>
        <IconButton className={classes.closeButton} onClick={closeURL}>
          <CloseIcon/>
        </IconButton>
      </div>
      <div className={classes.contentContainer}>
        <Grid container>
          <Grid item xs={10}>
            <Box>
              <TextField
                id="urlLookUp"
                value={props.url}
                label="URL"
                className={classes.urlContainer}
              />
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Copiar" enterDelay={400} leaveDelay={200}  className={classes.iconContainer}>
              <InputAdornment position="start">
                <IconButton
                  onClick={(e) => {
                    const el = document.getElementById("urlLookUp");
                    el.select();
                    document.execCommand("copy");
                  }}
                >
                  {<LinkIcon color="secondary" />}
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default TrackURL;
