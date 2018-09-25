import * as React from 'react';
import { Item } from './App';

interface ITable {
  groupDataBy: "purchase" | "day" | "item";
  expiredDataOnly: boolean;
  boughtAfterExpiration: Item[];
  dataByDate: Item[];
  pageSize: number;
  pageOffset: number;
  filterItem: (item: Item) => boolean;
}

export const Table = (props: ITable) => {
  const dataToRender = 
      props.expiredDataOnly ? props.boughtAfterExpiration : props.dataByDate;

  switch(props.groupDataBy) {
    case 'purchase':
      return (
        <TableByPurchase 
          {...{
            columns: Object.keys(props.dataByDate[0]),
            tableData: getPageData(dataToRender, props.pageSize, props.pageOffset, props.filterItem),
          }}
        />
      );
    case 'day':
      return(
        <TableByDate
          {...{
            columns: ['Date', 'Purchases'],
            tableData: groupDataByDay(dataToRender, props.pageSize, props.pageOffset, props.filterItem),
          }}
        />
      );
    case 'item':
      return(
        <TableByItem 
          {...{
            columns: ['Name', 'Quantity'],
            tableData: dataGroupedByItem(dataToRender, props.pageSize, props.pageOffset, props.filterItem),
          }}
        />
      );
  }
};

interface ITableByPurchase {
  columns: string[];
  tableData: Item[];
}

const TableByPurchase = (props: ITableByPurchase) => {
  return (
    <section className="tableContainer">
      <table className="table">
        <thead>
          <tr className="tableHeader">
            {props.columns.map((key, i) => <th key={i}>{keyToLabel[key]}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.tableData
            .map((item: Item, i: number) => 
              <tr key={i} className={["row", i % 2 === 0 ? "rowEven" : ""].join(" ")}>
                {props.columns.map((key, j) => 
                  cell(key, j, item)
                )}
              </tr>
            )
          }
        </tbody>
      </table>
    </section>
  );
};

interface ITableByDate {
  columns: string[];
  tableData: { [key: string]: { [key: string]: number } };
}

const TableByDate = (props: ITableByDate) => {
  return (
    <section className="tableContainer">
      <table className="table">
        <thead>
          <tr className="tableHeader">
            {props.columns.map((key, i) => <th key={i}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.tableData)
            .map((date: string, i: number) => {
              const currentDateItems = props.tableData[date];

              return(
                Object.keys(currentDateItems)
                  .sort()
                  .map((item: string, j: number) => {

                    return(
                      <tr key={j} className={["row", "rowGrouped"].join(" ")}>
                        <td className={["cell", j === 0 && "backgroundDark" || "backgroundLight"].join(" ")}>
                          {j === 0 && date}
                        </td>
                        <td className={["cell", "darkBackground"].join(" ")}>
                          {item}
                        </td>
                        <td className={["cell", "darkBackground"].join(" ")}>
                          {currentDateItems[item]}
                        </td>
                      </tr>
                    );
                  })
              );
            })
          }
        </tbody>
      </table>
    </section>
  );
};

interface ITableByItem {
  columns: string[];
  tableData: { [key: string]: number };
}

const TableByItem = (props: ITableByItem) => {
  return (
    <section className="tableContainer">
      <table className="table">
        <thead>
          <tr className="tableHeader">
            <th>Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.tableData)
            .sort()
            .map((item: string, i: number) => {
              return (
                <tr
                  key={i}
                  className={['row', i % 2 === 0 ? 'rowEven' : ''].join(' ')}
                >
                  <td className="cell">{item}</td>
                  <td className="cell">{props.tableData[item]}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
};

function getPageData (rawData: Item[], perPage: number, startFrom: number, doDisplayRow: (item: Item) => boolean) {
  const slicedData = rawData.slice(startFrom);
  const tablePageData = [];
  let i = 0;


  while ((tablePageData.length <= perPage) && slicedData[i]) {
    if (doDisplayRow(slicedData[i])) {
      tablePageData.push(slicedData[i]);
    }

    i++;
  }

  return tablePageData;
}

export function getISODateString (date: Date) { return date.toISOString().slice(0, 10); }


export function groupDataByDay (dataSortedByTimestamp: Item[], perPage: number, startFrom: number, doDisplayRow: (item: Item) => boolean) {
  const slicedData = dataSortedByTimestamp.slice(startFrom);
  const tablePageData = {};
  let i = 0;

  while (Object.keys(tablePageData).length <= perPage && slicedData[i]) {
    const item = slicedData[i];
    const purchaseDate = getISODateString(new Date(item.purchaseDate));

    if (!(purchaseDate in tablePageData)) {
      tablePageData[purchaseDate] = {};
    }

    const dataForPurchaseDate = tablePageData[purchaseDate]

    if (!(item.name in dataForPurchaseDate)) {
      dataForPurchaseDate[item.name] = 0;
    }

    dataForPurchaseDate[item.name] += item.quantity;


    i++;
  }

  return tablePageData;
}

function dataGroupedByItem (dataSortedByTimestamp: Item[], perPage: number, startFrom: number, doDisplayRow: (item: Item) => boolean) {
  const slicedData = dataSortedByTimestamp.slice(startFrom);
  const tablePageData = {};
  let i = 0;

  while (Object.keys(tablePageData).length <= perPage && slicedData[i]) {
    const item = slicedData[i];

    if (!tablePageData[item.name]) {
      tablePageData[item.name] = 0;
    }

    tablePageData[item.name] += item.quantity;

    i++;
  }

  return tablePageData; 
}

const cell = (key: string, j: number, item: Item) => {
  if (['purchaseDate', 'expirationDate'].indexOf(key) !== -1) {
    return (
      <td className="cell" key={j}>
        {new Date(item[key]).toLocaleDateString()}
      </td>
    );
  }

  return (
    <td className="cell" key={j}>
      {item[key]}
    </td>
  );
};

// Used to get ui labels from refrigerator-item key.
const keyToLabel = {
  expirationDate: 'Expires on',
  name: 'Item',
  purchaseDate: 'Purchased on',
  quantity: 'Qty',
  store: 'Origin',
  type: 'Type',
};
