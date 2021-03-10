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
          },
        ];
      }
      element.Orders.forEach((el) => {
        newOrders.push({
          DeliveryId: element.DeliveryId,
          Transact: el.Transact,
          DeliveryStatus: el.DeliveryStatus,
          Shop: el.Shop,
        });
      });

      if (element.Auths.length === 0) {
        element.Auths = [{ EventName: "", Date: "" }];
      }
      element.Auths.forEach((au) => {
        newAuths.push({
          DeliveryId: element.DeliveryId,
          EventName: au.EventName,
          Date: au.Date,
        });
      });
    });

    return (
      <ExcelFile element={<button>Descargar Datos</button>}>
        <ExcelSheet data={newOrders} name="Orders">
          <ExcelColumn label="Delivery" value="DeliveryId" />
          <ExcelColumn label="Transact" value="Transact" />
          <ExcelColumn label="Shop" value="Shop" />
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
