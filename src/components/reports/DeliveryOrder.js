import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Typography, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    backgroundColor: theme.palette.background.default,
   
  },
  row:{
    border: "solid",
    borderColor: "grey",
    borderWidth: "1px"
  }
}));

function DeliveryOrder(props) {
  const classes = useStyles();

  const { deliveryOrders } = props;
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={2}>
          <Typography> Transact</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography> Shop</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography> TripId</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Evento</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Fecha</Typography>
        </Grid>
      </Grid>
      {deliveryOrders.map((el, index) => {
        return (
          <Grid container key={index} className={classes.row}>
            <Grid item xs={2}>
              <Typography> {el.Transact}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography> {el.Shop}</Typography>
            </Grid>
            {
              el.JournalInfo?
              <Grid item xs={2}>
              <Typography> {el.JournalInfo[0].TripId}</Typography>
            </Grid>:null}
            <Grid item xs={6}>
              {el.JournalInfo?el.JournalInfo.map((j, index) => {
                return (
                  <Grid container key={index}>
                    <Grid item xs={6}>
                      <Typography>{j.EventName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{j.Date}</Typography>
                    </Grid>
                  </Grid>
                );
              }):null}
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}

export default DeliveryOrder;
