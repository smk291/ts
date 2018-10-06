import * as React from 'react';
import './App.css';
import { DatePicker, IDatePickerProps as DatePickerProps } from './DatePicker';
import { Collapsible } from './Filter';
import { Filter, IExcludeProps as FilterProps } from './FilterInput';
import { GroupAndSelectData, ISetDataAndGroupingProps as GroupingProps } from './GroupAndSelectData';
import { INumberInputProps as NumberInputProps, NumberInput } from './NumberInput';
import { IProps as PaginationProps, Pagination } from './Pagination';
import { ITableProps as TableProps, Table } from './Table';

const data0 = require('./data/data-0.json');
const data1 = require('./data/data-1.json');
const data2 = require('./data/data-2.json');
const data3 = require('./data/data-3.json');
const data4 = require('./data/data-4.json');
const data5 = require('./data/data-5.json');
const data6 = require('./data/data-6.json');
const data7 = require('./data/data-7.json');
const data8 = require('./data/data-8.json');
const data9 = require('./data/data-9.json');

const datasets = [ data0, data1, data2, data3, data4, data5, data6, data7, data8, data9, ] as Item[][];



class App extends React.Component<{}, IState> {
  // Comments needed
  public changeDataset:         (e: React.ChangeEvent<HTMLSelectElement>) => void;
  public changePage:            (e: React.MouseEvent<HTMLDivElement | HTMLInputElement> | React.FormEvent<HTMLFormElement>,) => void;
  public filterByQty:           (qty: number) => boolean;
  public filterInputs:          () => Array<{ defaultOpen?: boolean; form: JSX.Element; label: string; }>;
  public filterItem:            (fridgeItem: Item, ignoreQty?: boolean) => boolean;
  public getDateObjIfValidISO:  (dateStringISO: string | null | undefined, dateChange: (date: Date | null) => void, ) => void;
  public resetFilters:          () => void;
  public setDataGrouping:       (e: React.MouseEvent<HTMLLabelElement>) => void;
  public setExpMax:             (date: Date | null) => void;
  public setExpMin:             (date: Date | null) => void;
  public setPageSize:           (e: React.FormEvent<HTMLFormElement>) => void;
  public setPurchaseMax:        (date: Date) => void;
  public setPurchaseMin:        (date: Date) => void;
  public setQtyMax:             (e: React.ChangeEvent<HTMLInputElement>) => void;
  public setQtyMin:             (e: React.ChangeEvent<HTMLInputElement>) => void;
  public setTableData:          () => void;
  public toggleExpiredDataOnly: (e: React.MouseEvent<HTMLLabelElement>) => void;
  public toggleFilter:          (val: string, exclude: string[]) => string[];

  public groupAndSelectDataProps: () => GroupingProps;
  public nameFilterProps:         () => FilterProps;
  public typeFilterProps:         () => FilterProps;
  public storeFilterProps:        () => FilterProps;
  public purchaseMinDateProps:    () => DatePickerProps;
  public purchaseMaxDateProps:    () => DatePickerProps;
  public expDateMinProps:         () => DatePickerProps;
  public expDateMaxProps:         () => DatePickerProps
  public qtyMinProps:             () => NumberInputProps
  public qtyMaxProps:             () => NumberInputProps;
  public tableProps:              () => TableProps;
  public paginationProps:         () => PaginationProps;

  constructor(props: {}) {
    super(props);

    this.state = getDefaultState(datasets[0], this.filterItem);

    this.changeDataset = this.changeDataset.bind(this);
    this.changePage = this.changePage.bind(this);
    this.filterByQty = this.filterByQty.bind(this);
    this.filterInputs = this.filterInputs.bind(this);
    this.filterItem = this.filterItem.bind(this);
    this.getDateObjIfValidISO = this.getDateObjIfValidISO.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.setDataGrouping = this.setDataGrouping.bind(this);
    this.setExpMax = this.setExpMax.bind(this);
    this.setExpMin = this.setExpMin.bind(this);
    this.setPageSize = this.setPageSize.bind(this);
    this.setPurchaseMax = this.setPurchaseMax.bind(this);
    this.setPurchaseMin = this.setPurchaseMin.bind(this);
    this.setQtyMax = this.setQtyMax.bind(this);
    this.setQtyMin = this.setQtyMin.bind(this);
    this.setTableData = this.setTableData.bind(this);
    this.setTableData = this.setTableData.bind(this);
    this.toggleExpiredDataOnly = this.toggleExpiredDataOnly.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  public render() {
    return (
      <main className="App">
        <div className="results">
          <section className="filters">
            <div className="filtersHeader">
              <span>Filters</span>
              <span onClick={this.resetFilters} className="resetFilters">
                ↻ Reset filters
              </span>
            </div>
            <div className="filterSections">
              {this.filterInputs().map((input, i) => (
                <Collapsible
                  {...{
                    defaultOpen: input.defaultOpen,
                    key: i,
                    label: input.label,
                  }}
                >
                  {input.form}
                </Collapsible>
              ))}
            </div>
          </section>
          <section>
            <Table {...this.tableProps()} />
            <Pagination {...this.paginationProps()} />
          </section>
        </div>
      </main>
    );
  }
}

function setDate(this: App, key: "purchaseMax" | "purchaseMin", date: Date | null, ) {
  const newState = {[key]: date};

  this.setState({...newState, ...App.prototype.state}, () => this.setTableData);
}

App.prototype.setPurchaseMax = function (this: App, date: Date | null) {
  setDate.call(this, 'purchaseMax', date);
};

App.prototype.setPurchaseMin = function (this: App, date: Date | null) {
  setDate.call(this, 'purchaseMin', date);
};

function setExpirationDate (this: App, key: "expMax" | "expMin", date: Date | null) {
  const newState = { [key]: (date && date.valueOf()) || null };

  this.setState({...newState, ...App.prototype.state}, this.setTableData);
}

App.prototype.setExpMax = function (this: App, date: Date | null) {
  setExpirationDate.call(this, 'expMax', date);
}

App.prototype.setExpMin = function (this: App, date: Date | null) {
  setExpirationDate.call(this, 'expMin', date);
}

App.prototype.filterInputs = function(this: App) {
  return [
    {
      defaultOpen: true,
      form: <GroupAndSelectData {...this.groupAndSelectDataProps()} />,
      label: 'Choose data/table',
    },
    {
      form: <Filter {...this.nameFilterProps()} />,
      label: 'Name',
    },
    {
      form: <Filter {...this.typeFilterProps()} />,
      label: 'Type',
    },
    {
      form: <Filter {...this.storeFilterProps()} />,
      label: 'Store',
    },
    {
      form: (
        <div className="excludeContainer">
          <DatePicker {...this.purchaseMinDateProps()} />
          <DatePicker {...this.purchaseMaxDateProps()} />
        </div>
      ),
      label: 'Purchase date',
    },
    {
      form: (
        <div className="excludeContainer">
          <DatePicker {...this.expDateMinProps()} />
          <DatePicker {...this.expDateMaxProps()} />
        </div>
      ),
      label: 'Expiration date',
    },
    {
      form: (
        <div className="excludeContainer">
          <NumberInput {...this.qtyMinProps()} />
          <NumberInput {...this.qtyMaxProps()} />
        </div>
      ),
      label: 'Quantity',
    },
  ];
}

App.prototype.resetFilters = function(this: App, ) {
    this.setState(getDefaultState(datasets[0], this.filterItem));
  };

App.prototype.filterItem = function(this: App, fridgeItem: Item, ignoreQty?: boolean) {
  return (
    filterByVal(fridgeItem.name, this.state.filteredNames) &&
    filterByVal(fridgeItem.store, this.state.filteredStores) &&
    filterByVal(fridgeItem.type, this.state.filteredTypes) &&
    filterByMinMax(
      new Date(fridgeItem.purchaseDate).valueOf(),
      this.state.purchaseMin,
      this.state.purchaseMax,
    ) &&
    filterByMinMax(
      new Date(fridgeItem.expirationDate).valueOf(),
      this.state.expMin,
      this.state.expMax,
    ) &&
    (ignoreQty
      ? true
      : filterByMinMax(
          fridgeItem.quantity,
          this.state.qtyMin,
          this.state.qtyMax,
        ))
  );
};

App.prototype.filterByQty = function(this: App, qty: number) {
  return filterByMinMax(qty, this.state.qtyMin, this.state.qtyMax);
};

// Add or remove value from filter
App.prototype.toggleFilter = function(this: App, val: string, exclude: string[]) {
    if (exclude.indexOf(val) === -1) {
      exclude.push(val);

      return exclude.sort();
    } else {
      return exclude.filter(v => v !== val).sort();
    }
  };

// If string has valid ISO format, call 'dateChange' with new Date, else call function with null argument;
App.prototype.getDateObjIfValidISO = function(this: App,
    dateStringISO: string | null | undefined,
    dateChange: (date: Date | null) => void,
  ) {
    if (!dateStringISO) {
      dateChange(null);
    } else {
      const date = Date.parse(dateStringISO);

      if (!isNaN(date)) {
        dateChange(new Date(date));
      }
    }
  };


App.prototype.changeDataset = function(this: App, e: React.ChangeEvent<HTMLSelectElement>) {
  const val = parseInt(e.target.value, 10);
  const dataset = !isNaN(val) && datasets[val];

  if (dataset) {
    this.setState({...getDefaultState(datasets[val], this.filterItem)})
  }
}

// Determines whether table will display
// 1. purchases ungrouped ('purchase') or
// 2. purchases grouped by date and display items purchase and quantities purchased on that date or
// 3. Items alphabetically with quantities purchased
App.prototype.setDataGrouping = function(this: App, e: React.MouseEvent<HTMLLabelElement>) {
  this.setState(
    { groupDataBy: e.currentTarget.title as 'day' | 'purchase' | 'item' },
    () => this.setTableData(),
  );
};

App.prototype.toggleExpiredDataOnly = function(this: App, e: React.MouseEvent<HTMLLabelElement>) {
  this.setState({ expiredDataOnly: !this.state.expiredDataOnly }, () =>
    this.setTableData(),
  );
};

App.prototype.changePage = function(
  this: App,
  e: React.MouseEvent<HTMLDivElement | HTMLInputElement> | React.FormEvent<HTMLFormElement>,
) {
  e.preventDefault();

  const { title } = e.currentTarget;
  const manualInput = parseInt(title, 10);

  if (
    manualInput &&
    (manualInput - 1) * this.state.pageSize < this.state.tableRowCount
  ) {
    this.setState({
      pageOffset: this.state.pageSize * (manualInput - 1),
    });
  } else if (title === 'prev') {
    if (this.state.pageOffset >= this.state.pageSize) {
      this.setState({
        pageOffset: this.state.pageOffset - this.state.pageSize,
      });
    } else {
      this.setState({
        pageOffset:
          (Math.floor(this.state.tableRowCount / this.state.pageSize) - 1) *
          this.state.pageSize,
      });
    }
  } else if (title === 'next') {
    const newPageOffset = this.state.pageOffset + this.state.pageSize;
    const notOnLastPage = newPageOffset < this.state.tableRowCount;

    if (notOnLastPage) {
      this.setState({
        pageOffset: newPageOffset,
      });
    } else {
      this.setState({
        pageOffset: 0,
      });
    }
  }
};

App.prototype.setPageSize = function(this: App, e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const val = parseInt(e.currentTarget.title, 10);

  if (!isNaN(val)) {
    const newPageSize = val;

    this.setState({
      pageOffset:
        Math.floor(this.state.pageOffset / newPageSize) * newPageSize,
      pageSize: newPageSize,
    });
  }
};
  // Set min/max filter values

App.prototype.setQtyMin = function(this: App, e: React.ChangeEvent<HTMLInputElement>) {
  this.setState({ qtyMin: parseInt(e.target.value, 10) || null }, () =>
    this.setTableData(),
  );
}

App.prototype.setQtyMax = function(this: App, e: React.ChangeEvent<HTMLInputElement>) {
  this.setState({ qtyMax: parseInt(e.target.value, 10) || null }, () =>
    this.setTableData(),
  );
}

App.prototype.setTableData = function(this: App, ) {
  const dataToRender = this.state.expiredDataOnly
    ? this.state.boughtAfterExpiration
    : this.state.dataByDate;

  switch (this.state.groupDataBy) {
    case 'purchase':
      this.setState(
        { dataByPurchase: getPageData(dataToRender, this.filterItem) },
        () =>
          this.setState({
            tableRowCount:
              (this.state.dataByPurchase &&
                this.state.dataByPurchase.length) ||
              0,
          }),
      );
      break;
    case 'day':
      this.setState(
        {
          dataByDateAndItemName: groupDataByDay(
            dataToRender,
            this.filterItem,
            this.filterByQty,
          ),
        },
        () =>
          this.setState({
            tableRowCount:
              (this.state.dataByDateAndItemName &&
                Object.keys(this.state.dataByDateAndItemName).length) ||
              0,
          }),
      );
      break;
    case 'item':
      this.setState(
        {
          dataByItem: dataGroupedByItem(
            dataToRender,
            this.filterItem,
            this.filterByQty,
          ),
        },
        () =>
          this.setState({
            tableRowCount:
              (this.state.dataByItem &&
                Object.keys(this.state.dataByItem).length) ||
              0,
          }),
      );
      break;
  }
};

App.prototype.groupAndSelectDataProps = function (this: App) {
  return {
    changeDataset: this.changeDataset,
    expiredDataOnly: this.state.expiredDataOnly,
    groupDataBy: this.state.groupDataBy,
    setDataGrouping: this.setDataGrouping,
    toggleExpiredDataOnly: this.toggleExpiredDataOnly,
  };
};
App.prototype.nameFilterProps = function (this: App) {
  return {
    exclude: this.state.filteredNames,
    key: 'name',
    onClick: (val: string) =>
      this.setState(
        { filteredNames: this.toggleFilter(val, this.state.filteredNames) },
        () => this.setTableData(),
      ),
    values: this.state.values.names,
  };
};
App.prototype.typeFilterProps = function (this: App) {
  return {
    exclude: this.state.filteredTypes,
    key: 'type',
    onClick: (val: string) =>
      this.setState(
        { filteredTypes: this.toggleFilter(val, this.state.filteredTypes) },
        () => this.setTableData(),
      ),
    values: this.state.values.types,
  };
};
App.prototype.storeFilterProps = function (this: App) {
  return {
    exclude: this.state.filteredStores,
    key: 'store',
    onClick: (val: string) =>
      this.setState(
        { filteredStores: this.toggleFilter(val, this.state.filteredStores) },
        () => this.setTableData(),
      ),
    values: this.state.values.stores,
  };
};
App.prototype.purchaseMinDateProps = function (this: App) {
  return {
    id: 'purchaseDateMin',
    label: 'Purchased on or after',
    max: this.state.values.purchase.max,
    min: this.state.values.purchase.min,
    name: 'purchaseMin',
    onValidDate: this.setPurchaseMin,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.purchaseMin || undefined,
  };
};
App.prototype.purchaseMaxDateProps = function (this: App) {
  return {
    id: 'purchaseDateMax',
    label: 'Purchased on or before',
    max: this.state.values.purchase.max,
    min: this.state.purchaseMin || this.state.values.purchase.min,
    name: 'purchaseMax',
    onValidDate: this.setPurchaseMax,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.purchaseMax || undefined,
  };
};
App.prototype.expDateMinProps = function (this: App) {
  return {
    id: 'expDateMin',
    label: 'Expires on or after',
    max: this.state.values.exp.max,
    min: this.state.values.exp.min,
    name: 'expMin',
    onValidDate: this.setExpMin,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.expMin || undefined,
  };
};
App.prototype.expDateMaxProps = function (this: App) {
  return {
    id: 'expDateMax',
    label: 'Expires on or before',
    max: this.state.values.exp.max,
    min: this.state.expMin || this.state.values.exp.min,
    name: 'expMax',
    onValidDate: this.setExpMax,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.expMax || undefined,
  };
};
App.prototype.qtyMinProps = function (this: App) {
  return {
    id: 'quantityMin',
    label: 'Quantity at least',
    onChange: this.setQtyMin,
    value: this.state.values.qty.min,
  };
};
App.prototype.qtyMaxProps = function (this: App) {
  return {
    id: 'quantityMax',
    label: 'Quantity at most',
    onChange: this.setQtyMax,
    value: this.state.qtyMax || undefined,
  };
};
App.prototype.tableProps = function (this: App) {
  return {
    boughtAfterExpiration: this.state.boughtAfterExpiration,
    dataByDateAndItemName: this.state.dataByDateAndItemName,
    dataByItem: this.state.dataByItem,
    dataByPurchase: this.state.dataByPurchase,
    groupDataBy: this.state.groupDataBy,
    pageOffset: this.state.pageOffset,
    pageSize: this.state.pageSize,
    tableRowCount: this.state.tableRowCount,
  };
};
App.prototype.paginationProps = function (this: App) {
  return {
    changePage: this.changePage,
    changePageSize: this.setPageSize,
    expMax: this.state.expMax,
    expMin: this.state.expMin,
    expiredDataOnly: this.state.expiredDataOnly,
    filteredNames: this.state.filteredNames,
    filteredStores: this.state.filteredStores,
    filteredTypes: this.state.filteredTypes,
    groupDataBy: this.state.groupDataBy,
    itemCount: this.state.tableRowCount,
    pageOffset: this.state.pageOffset,
    pageSize: this.state.pageSize,
    purchaseMax: this.state.purchaseMax,
    purchaseMin: this.state.purchaseMin,
    qtyMax: this.state.qtyMax,
    qtyMin: this.state.qtyMin,
    tableRowCount: this.state.tableRowCount,
  };
};

export default App;

// All elements in the data are of this type
export interface Item extends JSON {
  name: string;
  type: string;
  store: string;
  purchaseDate: string;
  expirationDate: string;
  quantity: number;
}

interface IState {
  boughtAfterExpiration: Item[];
  dataByDate: Item[];
  dataByDateAndItemName: { [key: string]: { [key: string]: number } };
  dataByPurchase: Item[];
  dataByItem: { [key: string]: number };
  expMin: null | number;
  expMax: null | number;
  expiredDataOnly: boolean;
  filteredNames: string[];
  filteredStores: string[];
  filteredTypes: string[];
  groupDataBy: 'day' | 'purchase' | 'item';
  pageOffset: number;
  pageSize: number;
  purchaseMin: null | number;
  purchaseMax: null | number;
  qtyMin: null | number;
  qtyMax: null | number;
  tableRowCount: number;
  values: {
    types: string[];
    names: string[];
    stores: string[];
    purchase: {
      min: number;
      max: number;
    };
    exp: {
      min: number;
      max: number;
    };
    qty: {
      min: null | number;
      max: null | number;
    };
  };
}

const getDefaultState = (data: Item[], filterData: (item: Item) => boolean): IState => {
  // Sorts data by date, ascending
  const dataByDate = data.sort(
    (a: Item, b: Item) =>
      new Date(a.purchaseDate).valueOf() - new Date(b.purchaseDate).valueOf(),
  );

  const expMax = Math.max(
    ...data.map((v: Item) => new Date(v.expirationDate).valueOf()),
  );
  const expMin = Math.min(
    ...data.map((v: Item) => new Date(v.expirationDate).valueOf()),
  );
  const purchaseMax = Math.max(
    ...data.map((v: Item) => new Date(v.purchaseDate).valueOf()),
  );
  const purchaseMin = Math.min(
    ...data.map((v: Item) => new Date(v.purchaseDate).valueOf()),
  );

  return {
    boughtAfterExpiration: dataByDate.filter(
      (v: Item) =>
        0 <
        new Date(v.purchaseDate).valueOf() -
          new Date(v.expirationDate).valueOf(),
    ),
    dataByDate,
    dataByDateAndItemName: groupDataByDay(dataByDate),
    dataByItem: dataGroupedByItem(data),
    dataByPurchase: dataByDate,
    expMax,
    expMin,
    expiredDataOnly: false,
    filteredNames: [],
    filteredStores: [],
    filteredTypes: [],
    groupDataBy: 'purchase',
    pageOffset: 0,
    pageSize: 50,
    purchaseMax,
    purchaseMin,
    qtyMax: null,
    qtyMin: null,
    tableRowCount: dataByDate.length,
    values: {
      exp: {
        max: expMax,
        min: expMin,
      },
      names: pluck(data, 'name'),
      purchase: {
        max: purchaseMax,
        min: purchaseMin,
      },
      qty: {
        max: null,
        min: null,
      },
      stores: pluck(data, 'store'),
      types: pluck(data, 'type'),
    },
  };
};

// If value is present in 'filteredVals', it will be filtered out
function filterByVal(val: string, filteredVals: string[]) {
  return filteredVals.indexOf(val) === -1;
}

function filterByMinMax(
  val: number,
  min: number | null | undefined,
  max: number | null | undefined,
) {
  return ! // Filter out if val is smaller than min or is greater than max
  (
    val < (min || -Infinity) || val > (max || Infinity)
  );
}

// Similar to Underscore.JS's pluck(). Takes a 'key', and returns array of all values contained on that key in the array of refrigerator items
// Used to generate filtering options
function pluck(data: Item[], key: string) {
  return(
    data.reduce(
      (acc: string[], v: Item) => {
        if (acc.indexOf(v[key]) === -1) {
          acc.push(v[key]);
        }

        return acc;
      },
      [] as string[],
    )
    .sort()
  );
}

function getPageData(items: Item[], filter: (item: Item) => boolean) {
  const tablePageData = [];
  let i = 0;

  while (i <= items.length && items[i]) {
    if (filter(items[i])) {
      tablePageData.push(items[i]);
    }

    i++;
  }

  return tablePageData;
}

export function getISODateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function groupDataByDay(
  dataByDate: Item[],
  filter?: (item: Item, ignoreQty?: true) => boolean,
  qtyFilter?: (qty: number) => boolean,
) {
  const dataByDay = dataByDate.reduce(
    (acc: { [key: string]: { [key: string]: number } }, item: Item) => {
      if (filter !== undefined && !filter(item, true)) {
        return acc;
      }

      const purchaseDate = getISODateString(new Date(item.purchaseDate));

      if (!(purchaseDate in acc)) {
        acc[purchaseDate] = {};
      }

      if (!(item.name in acc[purchaseDate])) {
        acc[purchaseDate][item.name] = 0;
      }

      acc[purchaseDate][item.name] += item.quantity;

      return acc;
    },
    {},
  );

  return qtyFilter
    ? Object.keys(dataByDay).reduce((acc, key) => {
        if (!qtyFilter) {
          return acc;
        }

        acc[key] = dataByDay[key];

        return acc;
      }, {})
    : dataByDay;
}

function dataGroupedByItem(
  dataByItem: Item[],
  filter?: (item: Item, ignoreQty?: true) => boolean,
  qtyFilter?: (qty: number) => boolean,
) {
  const itemData = dataByItem.reduce(
    (acc: { [key: string]: number }, item: Item) => {
      if (filter !== undefined && !filter(item, true)) {
        return acc;
      }

      if (!acc[item.name]) {
        acc[item.name] = 0;
      }

      acc[item.name] += item.quantity;

      return acc;
    },
    {},
  );

  return qtyFilter !== undefined
    ? Object.keys(itemData).reduce((acc, key) => {
        if (!qtyFilter(itemData[key])) {
          return acc;
        }

        acc[key] = itemData[key];

        return acc;
      }, {})
    : itemData;
}

export interface IFilters {
  groupDataBy: 'purchase' | 'day' | 'item';
  expiredDataOnly: boolean;
  filteredNames: string[];
  filteredTypes: string[];
  filteredStores: string[];
  tableRowCount: number;
  pageSize: number;
  pageOffset: number;
  purchaseMin: null | number;
  purchaseMax: null | number;
  expMin: null | number;
  expMax: null | number;
  qtyMin: null | number;
  qtyMax: null | number;
}
