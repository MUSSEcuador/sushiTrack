import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";

import Header from "../common/Header";

import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Badge,
  Divider,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Pagination from "@material-ui/lab/Pagination";
import DeliveryOrder from "./DeliveryOrder";
import DeliveryAuths from "./DeliveryAuths";
import Download from "./Download";
import Loading from "../common/Loading";

const sizeOptions = ["10", "20", "30", "TODOS"];

const DELIVERY_REPORTS = gql`
  query GeneralReports($token: String!, $queryData: GeneralReportQuery!) {
    getGeneralReport(token: $token, generalInputQuery: $queryData) {
      Total
      Data {
        DeliveryId
        Orders {
          Transact
          DeliveryStatus
          Shop
          JournalInfo {
            Date
            EventName
            TripId
          }
        }
        Auths {
          EventName
          Date
          UserName
          Data {
            EmpNum
            Alias
          }
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    paddingTop: "2vh",
    //height: "100vh",
    width: "100vw",
    backgroundColor: theme.palette.primary.dark,
    [theme.breakpoints.up("md")]: {
      //height: "100vh",
    },
  },
  textField: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.secondary.main,
    padding: "1vh 1vw",
    width: "70%",
    borderRadius: 5,
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
      width: "50vw",
    },
  },
  hasInfo: {
    marginTop: "2vh",
  },
  inputLabel: {
    color: theme.palette.secondary.light,
    fontWeight: 900,
    marginLeft: "3px",
  },
  select: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.secondary.main,
    padding: "1vh 1vw",
    margin: "2vh 15%",
    width: "70%",
    height: "7vh",
    borderRadius: 5,
  },
  pagination: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.secondary.main,
    borderRadius: 5,
    margin: "2vh 15%",
    padding: "2vh 1vw",
    height: "8vh",
    width: "70%",
    alignItems: "center",
  },
  mainReport: {
    backgroundColor: theme.palette.background.default,
    margin: "1vh 0 5vh 0",
  },
  card: {
    border: "solid",
    borderWidth: "2px",
    borderRadius: 5,
    margin: "10px",
    backgroundColor: theme.palette.background.paper,
    // width: "100%"
  },
  heading: {
    padding: "0 4px",
  },
}));

function DeliveriesReport(props) {
  const classes = useStyles();
  const [initialDate, setInitialDate] = React.useState(
    moment().format("yyyy-MM-DD")
  );
  const [finalDate, setFinalDate] = React.useState(
    moment().format("yyyy-MM-DD")
  );
  const [pageSize, setPageSize] = React.useState(10);
  const [pageSizeSelected, setPageSizeSelected] = React.useState("10");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const [cargandoDatos, setCargandoDatos] = React.useState(false);

  let auxInitialValue = new Date();
  let auxStartEndDte = auxInitialValue;
  auxInitialValue.setMinutes(0);
  auxInitialValue.setSeconds(0);
  auxInitialValue.setMilliseconds(0);
  auxInitialValue.setHours(-5);

  const [initFormatDate, setIFD] = React.useState(auxInitialValue.getTime());
  const [endFormatDate, setEFD] = React.useState(auxStartEndDte.getTime());

  const [hasInfoToShow, setHasInfoToShow] = React.useState(false);

  const [generalInputQuery, setGeneralInputQuery] = React.useState({
    StartDate: initFormatDate,
    EndDate: endFormatDate,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [getGeneralReport, report] = useLazyQuery(DELIVERY_REPORTS, {
    variables: {
      queryData: generalInputQuery,
      token: sessionStorage.token,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (generalInputQuery) {
      
      getGeneralReport();
    }
  }, [generalInputQuery, getGeneralReport]);

  useEffect(() => {
    if (report.data?.getGeneralReport) {
      setHasInfoToShow(true);
      changePageSize(pageSizeSelected, false);
    }
    if(report.data && cargandoDatos){
      setCargandoDatos(false);
    }
  }, [report.data]);

  const buscar = (e) => {
    const newQuery = {
      StartDate: initFormatDate,
      EndDate: endFormatDate,
      PageNumber: pageNumber,
      PageSize: pageSize,
    };
    e.preventDefault();
    setHasInfoToShow(false);
    setGeneralInputQuery(newQuery);
    setCargandoDatos(true);
  };

  const changePageNumber = (e, value) => {
    const newQuery = {
      StartDate: initFormatDate,
      EndDate: endFormatDate,
      PageNumber: value,
      PageSize: pageSize,
    };
    e.preventDefault();
    setHasInfoToShow(false);
    setPageNumber(value);
    setGeneralInputQuery(newQuery);
    setCargandoDatos(true);
  };

  const changePageSize = (value, sendFromChangePage) => {
    const val = value;
    let auxPageSize = 10;
    setPageSizeSelected(val);
    setCargandoDatos(true);

    switch (val) {
      case "10":
        auxPageSize = 10;
        setTotalPages(Math.ceil(report.data.getGeneralReport.Total / 10));
        break;
      case "20":
        auxPageSize = 20;
        setTotalPages(Math.ceil(report.data.getGeneralReport.Total / 20));
        break;
      case "30":
        auxPageSize = 30;
        setTotalPages(Math.ceil(report.data.getGeneralReport.Total / 30));
        break;
      case "TODOS":
        if (report.data?.getGeneralReport) {
          auxPageSize = report.data.getGeneralReport.Total;
          setTotalPages(
            Math.ceil(
              report.data.getGeneralReport.Total /
                report.data.getGeneralReport.Total
            )
          );
        }
        break;
      default:
        setPageSize(10);
        break;
    }
    setPageSize(auxPageSize);
    if (sendFromChangePage) {
      const newQuery = {
        StartDate: initFormatDate,
        EndDate: endFormatDate,
        PageNumber: pageNumber,
        PageSize: auxPageSize,
      };

      setGeneralInputQuery(newQuery);
    }
  };

  if (cargandoDatos) {
    return <Loading text={"Cargando Datos"}/>;
  } else {
    return (
      <div className={classes.root}>
        <Header isReport={true} history={props.history} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              id="initialDate"
              value={initialDate}
              label="Fecha Inicial"
              type="date"
              onChange={(e) => {
                let auxDate = new Date(e.target.value);
                auxDate = auxDate.getTime();
                setIFD(auxDate);
                setInitialDate(e.target.value);
                setHasInfoToShow(false);
              }}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "#ff0000",
                  fontWeight: 900,
                  paddingLeft: "1vw",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              id="finalDate"
              value={finalDate}
              label="Fecha Final"
              type="date"
              onChange={(e) => {
                let auxDate = new Date(e.target.value);
                auxDate.setDate(auxDate.getDate() + 1);
                auxDate = auxDate.getTime();

                setEFD(auxDate);
                setHasInfoToShow(false);
                setFinalDate(e.target.value);
              }}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "#ff0000",
                  fontWeight: 900,
                  paddingLeft: "1vw",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={(e) => {
                buscar(e);
              }}
            >
              BUSCAR
            </Button>
          </Grid>
        </Grid>

        {hasInfoToShow ? (
          <div className={classes.hasInfo}>
            <Grid container>
              <Grid item xs={3}>
                <FormControl className={classes.select}>
                  <InputLabel shrink className={classes.inputLabel}>
                    Tamaño de página
                  </InputLabel>
                  <Select
                    value={pageSizeSelected}
                    onChange={(e) => {
                      changePageSize(e.target.value, true);
                    }}
                  >
                    {sizeOptions.map((p) => {
                      return (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={9}>
                <Pagination
                  count={totalPages}
                  page={pageNumber}
                  onChange={(e, value) => {
                    changePageNumber(e, value);
                  }}
                  variant="outlined"
                  showFirstButton
                  showLastButton
                  className={classes.pagination}
                  color="secondary"
                />
              </Grid>
            </Grid>
            <Divider />
            {report.data?.getGeneralReport?.Data ? (
              <div className={classes.mainReport}>
                {report.data.getGeneralReport.Data.map((element, index) => {
                  return (
                    <div key={index} className={classes.card}>
                      <Typography>{element.DeliveryId}</Typography>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Badge
                            badgeContent={
                              element.Orders ? element.Orders.length : 0
                            }
                            color="secondary"
                          >
                            <Typography className={classes.heading}>
                              Ordenes
                            </Typography>
                          </Badge>
                        </AccordionSummary>
                        <AccordionDetails className={classes.card}>
                          {element.Orders ? (
                            <DeliveryOrder deliveryOrders={element.Orders} />
                          ) : null}
                        </AccordionDetails>
                      </Accordion>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Badge
                            badgeContent={
                              element.Auths ? element.Auths.length : 0
                            }
                            color="primary"
                          >
                            <Typography className={classes.heading}>
                              Autenticaciones
                            </Typography>
                          </Badge>
                        </AccordionSummary>
                        <AccordionDetails className={classes.card}>
                          {element.Auths ? (
                            <DeliveryAuths deliveryAuths={element.Auths} />
                          ) : null}
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  );
                })}
                <Download element={report.data.getGeneralReport.Data} />
              </div>
            ) : (
              <Typography>No se encuentran datos</Typography>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default DeliveriesReport;
