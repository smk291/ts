import * as React from 'react';
import { Item } from './App';

export const Table = (props: ITableProps) => {
  switch (props.groupDataBy) {
    case 'purchase':
      return (
        props.dataByPurchase && (
          <TableByPurchase
            {...{
              columns:
                (props.dataByPurchase[0] &&
                  Object.keys(props.dataByPurchase[0])) ||
                [],
              tableData: props.dataByPurchase.slice(
                props.pageOffset,
                props.pageOffset + props.pageSize - 1,
              ),
            }}
          />
        )
      );
    case 'day':
      const tableDataByDay =
        props.dataByDateAndItemName &&
        Object.keys(props.dataByDateAndItemName)
          .slice(props.pageOffset, props.pageOffset + props.pageSize - 1)
          .reduce((acc, key) => {
            acc[key] =
              (props.dataByDateAndItemName &&
                props.dataByDateAndItemName[key]) ||
              {};

            return acc;
          }, {});

      return (
        tableDataByDay && (
          <TableByDate
            {...{
              columns: ['Date', 'Purchases'],
              tableData: tableDataByDay,
            }}
          />
        )
      );
    case 'item':
      const tableDataByItem =
        props.dataByItem &&
        Object.keys(props.dataByItem)
          .slice(props.pageOffset, props.pageOffset + props.pageSize - 1)
          .reduce((acc, key) => {
            acc[key] = (props.dataByItem && props.dataByItem[key]) || {};

            return acc;
          }, {});
      return (
        tableDataByItem && (
          <TableByItem
            {...{
              columns: ['Name', 'Quantity'],
              tableData: tableDataByItem,
            }}
          />
        )
      );
  }
};

interface ITableProps {
  boughtAfterExpiration: Item[];
  dataByPurchase: Item[];
  dataByItem: { [key: string]: number };
  dataByDateAndItemName: { [key: string]: { [key: string]: number } };
  groupDataBy: 'day' | 'item' | 'purchase';
  pageSize: number;
  pageOffset: number;
}

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
        <tbody className="tableTbody">
          {props.tableData.map((item: Item, i: number) => (
            <tr
              key={i}
              className={['row', i % 2 === 0 ? 'rowEven' : ''].join(' ')}
            >
              {props.columns.map((key, j) => cell(key, j, item))}
            </tr>
          ))}
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
        <tbody className="tableTbody">
          {Object.keys(props.tableData).map((date: string, i: number) => {
            const currentDateItems = props.tableData[date];

            return Object.keys(currentDateItems)
              .sort()
              .map((item: string, j: number) => {
                return (
                  <tr key={j} className={['row', 'rowGrouped'].join(' ')}>
                    <td
                      className={[
                        'cell',
                        (j === 0 && 'backgroundDark') || 'backgroundLight',
                      ].join(' ')}
                    >
                      {j === 0 && date}
                    </td>
                    <td className={['cell', 'darkBackground'].join(' ')}>
                      {item}
                    </td>
                    <td className={['cell', 'darkBackground'].join(' ')}>
                      {currentDateItems[item]}
                    </td>
                  </tr>
                );
              });
          })}
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
        <tbody className="tableTbody">
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
