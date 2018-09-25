import * as React from 'react';
import './App.css';
import { DatePicker } from './DatePicker';
import { Collapsible } from './Filter';
import { Filter } from './FilterInput';
import { GroupAndSelectData } from './GroupAndSelectData';
import { NumberInput } from './NumberInput';
import { Pagination } from './Pagination';
import { Table } from './Table';

const data = require('./data/data-0.json');

// All elements in the data are of this type
export interface Item extends JSON {
  name: string;
  type: string;
  store: string;
  purchaseDate: string;
  expirationDate: string;
  quantity: number;
}

class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultState(this.filterItem);

    this.setTableData = this.setTableData.bind(this);
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

  private filterInputs = () => [
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

  private resetFilters = () => {
    this.setState(getDefaultState(this.filterItem));
  };
  private filterItem = (fridgeItem: Item, ignoreQty?: boolean) => {
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
  private filterByQty = (qty: number) => {
    return filterByMinMax(qty, this.state.qtyMin, this.state.qtyMax);
  };
  // Add or remove value from filter
  private toggleFilter = (val: string, exclude: string[]) => {
    if (exclude.indexOf(val) === -1) {
      exclude.push(val);

      return exclude.sort();
    } else {
      return exclude.filter(v => v !== val).sort();
    }
  };
  // If string has valid ISO format, call 'dateChange' with new Date, else call function with null argument;
  private getDateObjIfValidISO = (
    dateStringISO: string | null | undefined,
    dateChange: (date: Date | null) => void,
  ) => {
    if (!dateStringISO) {
      dateChange(null);
    } else {
      const date = Date.parse(dateStringISO);

      if (!isNaN(date)) {
        dateChange(new Date(date));
      }
    }
  };
  // Determines whether table will display
  // 1. purchases ungrouped ('purchase') or
  // 2. purchases grouped by date and display items purchase and quantities purchased on that date or
  // 3. Items alphabetically with quantities purchased
  private setDataGrouping = (e: React.MouseEvent<HTMLLabelElement>) => {
    this.setState(
      { groupDataBy: e.currentTarget.title as 'day' | 'purchase' | 'item' },
      () => this.setTableData(),
    );
  };
  private toggleExpiredDataOnly = (e: React.MouseEvent<HTMLLabelElement>) => {
    this.setState({ expiredDataOnly: !this.state.expiredDataOnly }, () =>
      this.setTableData(),
    );
  };
  private changePage = (
    e:
      | React.MouseEvent<HTMLDivElement | HTMLInputElement>
      | React.FormEvent<HTMLFormElement>,
  ) => {
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
  private setPageSize = (e: React.FormEvent<HTMLFormElement>) => {
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
  private setPurchaseMin = (date: Date | null) =>
    this.setState({ purchaseMin: (date && date.valueOf()) || null }, () =>
      this.setTableData(),
    );
  private setPurchaseMax = (date: Date | null) =>
    this.setState({ purchaseMax: (date && date.valueOf()) || null }, () =>
      this.setTableData(),
    );
  private setExpMax = (date: Date | null) =>
    this.setState({ expMax: (date && date.valueOf()) || null }, () =>
      this.setTableData(),
    );
  private setExpMin = (date: Date | null) =>
    this.setState({ expMin: (date && date.valueOf()) || null }, () =>
      this.setTableData(),
    );
  private setQtyMin = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ qtyMin: parseInt(e.target.value, 10) || null }, () =>
      this.setTableData(),
    );
  private setQtyMax = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ qtyMax: parseInt(e.target.value, 10) || null }, () =>
      this.setTableData(),
    );
  // Apply filters to data
  private setTableData = () => {
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
  // All methods below get props for other components
  private nameFilterProps = () => ({
    exclude: this.state.filteredNames,
    key: 'name',
    onClick: (val: string) =>
      this.setState(
        { filteredNames: this.toggleFilter(val, this.state.filteredNames) },
        () => this.setTableData(),
      ),
    values: this.state.values.names,
  });
  private typeFilterProps = () => ({
    exclude: this.state.filteredTypes,
    key: 'type',
    onClick: (val: string) =>
      this.setState(
        { filteredTypes: this.toggleFilter(val, this.state.filteredTypes) },
        () => this.setTableData(),
      ),
    values: this.state.values.types,
  });
  private storeFilterProps = () => ({
    exclude: this.state.filteredStores,
    key: 'store',
    onClick: (val: string) =>
      this.setState(
        { filteredStores: this.toggleFilter(val, this.state.filteredStores) },
        () => this.setTableData(),
      ),
    values: this.state.values.stores,
  });
  private purchaseMinDateProps = () => ({
    id: 'purchaseDateMin',
    label: 'Purchased on or after',
    max: this.state.values.purchase.max,
    min: this.state.values.purchase.min,
    name: 'purchaseMin',
    onValidDate: this.setPurchaseMin,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.purchaseMin || undefined,
  });
  private purchaseMaxDateProps = () => ({
    id: 'purchaseDateMax',
    label: 'Purchased on or before',
    max: this.state.values.purchase.max,
    min: this.state.purchaseMin || this.state.values.purchase.min,
    name: 'purchaseMax',
    onValidDate: this.setPurchaseMax,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.purchaseMax || undefined,
  });
  private expDateMinProps = () => ({
    id: 'expDateMin',
    label: 'Expires on or after',
    max: this.state.values.exp.max,
    min: this.state.values.exp.min,
    name: 'expMin',
    onValidDate: this.setExpMin,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.expMin || undefined,
  });
  private expDateMaxProps = () => ({
    id: 'expDateMax',
    label: 'Expires on or before',
    max: this.state.values.exp.max,
    min: this.state.expMin || this.state.values.exp.min,
    name: 'expMax',
    onValidDate: this.setExpMax,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.expMax || undefined,
  });
  private qtyMinProps = () => ({
    id: 'quantityMin',
    label: 'Quantity at least',
    onChange: this.setQtyMin,
    value: this.state.values.qty.min,
  });
  private qtyMaxProps = () => ({
    id: 'quantityMax',
    label: 'Quantity at most',
    onChange: this.setQtyMax,
    value: this.state.qtyMax || undefined,
  });
  private groupAndSelectDataProps = () => ({
    expiredDataOnly: this.state.expiredDataOnly,
    groupDataBy: this.state.groupDataBy,
    setDataGrouping: this.setDataGrouping,
    toggleExpiredDataOnly: this.toggleExpiredDataOnly,
  });
  private tableProps = () => {
    const {
      boughtAfterExpiration,
      dataByItem,
      dataByPurchase,
      dataByDateAndItemName,
      groupDataBy,
      pageOffset,
      pageSize,
      tableRowCount,
    } = this.state;

    return {
      boughtAfterExpiration,
      dataByDateAndItemName,
      dataByItem,
      dataByPurchase,
      groupDataBy,
      pageOffset,
      pageSize,
      tableRowCount,
    };
  };
  private paginationProps = () => ({
    changePage: this.changePage,
    changePageSize: this.setPageSize,
    itemCount: this.state.tableRowCount,
    pageOffset: this.state.pageOffset,
    pageSize: this.state.pageSize,
    ...this.filterProps(),
  });
  private filterProps = () => {
    const {
      groupDataBy,
      expiredDataOnly,
      pageSize,
      pageOffset,
      filteredNames,
      filteredTypes,
      filteredStores,
      tableRowCount,
      purchaseMin,
      purchaseMax,
      expMin,
      expMax,
      qtyMin,
      qtyMax,
    } = this.state;

    return {
      expMax,
      expMin,
      expiredDataOnly,
      filteredNames,
      filteredStores,
      filteredTypes,
      groupDataBy,
      pageOffset,
      pageSize,
      purchaseMax,
      purchaseMin,
      qtyMax,
      qtyMin,
      tableRowCount,
    };
  };
}

export default App;

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

const getDefaultState = (filterData: (item: Item) => boolean): IState => {
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
      names: pluck('name'),
      purchase: {
        max: purchaseMax,
        min: purchaseMin,
      },
      qty: {
        max: null,
        min: null,
      },
      stores: pluck('store'),
      types: pluck('type'),
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
function pluck(key: string) {
  return data
    .reduce(
      (acc: string[], v: Item) => {
        if (acc.indexOf(v[key]) === -1) {
          acc.push(v[key]);
        }

        return acc;
      },
      [] as string[],
    )
    .sort();
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
