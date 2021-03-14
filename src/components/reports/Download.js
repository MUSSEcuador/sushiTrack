import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {
  render() {
    let data = this.props.element.slice();
    let newOrders = [];
    let newAuths = [];
    data.forEach((element) => {
      if (!element.Orders) {
        element.Orders = [
          {
            Transact: "",
            DeliveryStatus: "",
            Shop: "",
            Date: "",
          },
        ];
      }
      element.Orders.forEach((el) => {

        if (el.JournalInfo) {
          el.JournalInfo.forEach((j) => {
   
            newOrders.push({
              DeliveryId: element.DeliveryId,
              Transact: el.Transact,
              DeliveryStatus: el.DeliveryStatus,
              Shop: el.Shop,
              EventName: j.EventName,
              Date: new Date(Date.parse(j.Date)).toLocaleString(),
            });
          });
        } else {
          newOrders.push({
            DeliveryId: element.DeliveryId,
            Transact: el.Transact,
            DeliveryStatus: el.DeliveryStatus,
            Shop: el.Shop,
            EventName: "",
            Date: "",
          });
        }
      });

      if (element.Auths.length === 0) {
        element.Auths = [{ EventName: "", Date: "" }];
      }
      element.Auths.forEach((au) => {
        newAuths.push({
          DeliveryId: element.DeliveryId,
          EventName: au.EventName,
          Date: new Date(Date.parse(au.Date)).toLocaleString(),
        });
      });
    });

    return (
      <ExcelFile element={<button>Descargar Datos</button>}>
        <ExcelSheet data={newOrders} name="Orders">
          <ExcelColumn label="Delivery" value="DeliveryId" />
          <ExcelColumn label="Transact" value="Transact" />
          <ExcelColumn label="Shop" value="Shop" />
          <ExcelColumn label="EventName" value="EventName" />
          <ExcelColumn label="Date" value="Date" />
        </ExcelSheet>
        <ExcelSheet data={newAuths} name="Auths">
          <ExcelColumn label="Delivery" value="DeliveryId" />
          <ExcelColumn label="EventName" value="EventName" />
          <ExcelColumn label="Date" value="Date" />
        </ExcelSheet>
      </ExcelFile>
    );
  }
}

export default Download;
