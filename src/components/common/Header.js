import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, ButtonGroup } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: "4vw",
    marginTop: "1vh",
  },
  buttonsContainer: {
    textAlign: "right",
  },
  buttonGroup: {
    color: "rgb(255,255,255)",
  },
  button: {
    color: theme.palette.primary.contrastText
  },
  logoContainer: {
    textAlign: "left",
  },
  logo: {
    margin: "1vh 3vw",
    width: "15vw",
  },
}));
function Header(props) {
  const classes = useStyles();

  const {openCallModal} = props;
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6} className={classes.logoContainer}>
          <img alt="logo" src="/img/logo.png" className={classes.logo}></img>
        </Grid>
        <Grid item xs={6} className={classes.buttonsContainer}>
          <ButtonGroup
            variant="text"
            color="secondary"
            aria-label="text primary button group"
            className={classes.buttonGroup}
          >
            <Button className={classes.button} onClick={openCallModal}>Llamar a Motorizado</Button>
            <Button className={classes.button} >Cerrar Sesión</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </div>
  );
}

export default Header;
