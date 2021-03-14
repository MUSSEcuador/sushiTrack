import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Typography, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    backgroundColor: theme.palette.background.default,
  },
}));

function DeliveryAuths(props) {
  const classes = useStyles();

  const { deliveryAuths } = props;
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6}>
          <Typography>Evento</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography> Fecha</Typography>
        </Grid>
       
      </Grid>
      {deliveryAuths.map((el, index) => {
        return (
          <Grid container key={index}>
            <Grid item xs={6}>
              <Typography> {el.EventName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography> {new Date(Date.parse(el.Date)).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}

export default DeliveryAuths;
