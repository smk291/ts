import * as React from 'react';
import './App.css';
import { DatePicker } from './DatePicker';
import { Collapsible } from './Filter';
import { Filter } from './FilterInput';
import { GroupAndSelectData } from './GroupAndSelectData';
import { NumberInput } from './NumberInput';
import { groupDataByDay, Table } from './Table';

const data = require('./data/data-0.json');

// All elements in the data are of this type
export interface Item extends JSON {
  name: string,
  type: string,
  store: string,
  purchaseDate: string,
  expirationDate: string,
  quantity: number
}

// If value is present in 'filteredVals', it will be filtered out
function filterByVal (val: string, filteredVals: string[]) {
  return filteredVals.indexOf(val) === -1;
};

// 'filterByMinMax' tests whether a value is within the bounds of a min and/or a max value
// Only 'min' or 'max' is required for the function to filter
// If neither is defined/nonnull, no value will be filtered
function filterByMinMax (val: number, min: number | null | undefined, max: number | null | undefined) {
  if (
    (val < (min || -Infinity)) || // If there's a min and val is smaller
    (val > (max || Infinity))     // or there's a max and val is greater
  ) {
    return false;                 // return false
  }

  return true;                    // else return true
};

// Similar to Underscore.JS's pluck(). Takes a 'key', and returns set of all values contained on that key in the array of refrigerator items
function pluckSet (key: string) {
  return data
    .reduce((acc: string[], v: Item) => {
      if (acc.indexOf(v[key]) === -1) {
        acc.push(v[key]);
      }

      return acc;
    }, [] as string[])
    .sort();
}

interface IState {
  boughtAfterExpiration: Item[];
  dataByDate: Item[];
  dataByDateAndItemName: { [key: string]: {[key: string]: number }};
  expiredDataOnly: boolean;
  filteredNames: string[];
  filteredTypes: string[];
  filteredStores: string[];
  groupDataBy: "day" | "purchase" | "item";
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
      min: number;
      max: number;
    };
  };
  pageOffset: number;
  pageSize: number;
  purchaseMin: null | number;
  purchaseMax: null | number;
  expMin: null | number;
  expMax: null | number;
  qtyMin: null | number;
  qtyMax: null | number;
};


class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultState(this.filterItem);
  }

  // Returns false if item is to be filtered out
  public filterItem = (fridgeItem: Item) => {
    return(
      filterByVal(fridgeItem.name, this.state.filteredNames) &&
      filterByVal(fridgeItem.store, this.state.filteredStores) &&
      filterByVal(fridgeItem.type, this.state.filteredTypes) &&
      filterByMinMax(
        new Date(fridgeItem.purchaseDate).valueOf(),
        this.state.purchaseMin,
        this.state.purchaseMax
      ) &&
      filterByMinMax(
        new Date(fridgeItem.expirationDate).valueOf(),
        this.state.expMin,
        this.state.expMax
      ) &&
      filterByMinMax(fridgeItem.quantity, this.state.qtyMin, this.state.qtyMax)
    );
  }

  // Add or remove value from filter
  public toggleValueFilter = (val: string, exclude: string[]) => {
    if (exclude.indexOf(val) === -1) {
      exclude.push(val);

      return exclude;
    } else {
      return exclude.filter(v => v !== val);
    }
  }

  // If string has valid ISO format, call 'dateChange' with new Date, else call function with null argument; 
  public getDateObjIfValidISO = (dateStringISO: string | null | undefined, dateChange: (date: Date | null) => void) => {
    if (!dateStringISO){
      dateChange(null);
    } else {
      const date = Date.parse(dateStringISO);

      if (!isNaN(date)) {
        dateChange(new Date(date));
      }
    }
  }

  // Determines whether table will display data grouped by item-purchase, by day and item, or by item and quanity
  public setDataGrouping = (e: React.MouseEvent<HTMLLabelElement>) => 
    this.setState({ groupDataBy: e.currentTarget.title as "day" | "purchase" | "item", });

  public toggleExpiredDataOnly = (e: React.MouseEvent<HTMLLabelElement>) =>
    this.setState({ expiredDataOnly: !this.state.expiredDataOnly, });

  public resetFilters = () =>
    this.setState(getDefaultState(this.filterItem));

  public render() {
    return (
      <main className="App">
        <div className="results">
          <section className="filters">
            <div className="filtersHeader">
              <span>Filter</span>
              <span>↻ Reset filters</span>
            </div>
            <Collapsible {...{label: "Choose data/table", defaultOpen: true, }}>
              <GroupAndSelectData {...this.groupAndSelectDataProps()}/>
            </Collapsible> 
            <Collapsible {...{label: "Name"}}>
              <Filter {...this.nameFilterProps()} />
            </Collapsible>
            <Collapsible {...{label: "Type"}}>
              <Filter  {...this.typeFilterProps()} />
            </Collapsible>
            <Collapsible {...{label: "Store"}}>
              <Filter {...this.storeFilterProps()}/>
            </Collapsible>
            <Collapsible {...{label: "Purchase date"}}>
              <div className="excludeContainer">
                <DatePicker {...this.purchaseMinDateProps()} />
                <DatePicker {...this.purchaseMaxDateProps()} />
              </div>
            </Collapsible>
            <Collapsible {...{label: "Expiration date"}}>
              <div className="excludeContainer">
                <DatePicker {...this.expDateMinProps()} />
                <DatePicker {...this.expDateMaxProps()} />
              </div>
            </Collapsible>
            <Collapsible {...{label: "Quantity"}}>
              <div className="excludeContainer">
                <NumberInput {...this.qtyMinProps()} />
                <NumberInput {...this.qtyMaxProps()} />
              </div>
            </Collapsible>

          </section>
          <Table {...this.tableProps()}
          /> 
        </div>
      </main>
    );
  }

  // Set min/max filter values
  private setPurchaseMin = (date: Date | null) => this.setState({ purchaseMin: date && date.valueOf() || null });
  private setPurchaseMax = (date: Date | null) => this.setState({ purchaseMax: date && date.valueOf() || null });
  private setExpMax      = (date: Date | null) => this.setState({ expMax: date && date.valueOf() || null });
  private setExpMin      = (date: Date | null) => this.setState({ expMin: date && date.valueOf() || null });
  private setQtyMin = (val: string | null) => this.setState({ qtyMin: val && parseInt(val, 10) || null, });
  private setQtyMax = (val: string | null) => this.setState({ qtyMax: val && parseInt(val, 10) || null, });

  // Get props
  private nameFilterProps = () => ({
    exclude: this.state.filteredNames,
    key: "name",
    onClick: (val: string) =>
      this.setState({ filteredNames: this.toggleValueFilter(val, this.state.filteredNames), }),
    values: this.state.values.names,
  })
  private typeFilterProps = () => ({
    exclude: this.state.filteredTypes,
    key: "type",
    onClick: (val: string) =>
    this.setState({ filteredTypes: this.toggleValueFilter(val, this.state.filteredTypes), }),
    values: this.state.values.types
  })
  private storeFilterProps = () => ({
    exclude: this.state.filteredStores,
    key: "store",
    onClick: (val: string) =>
    this.setState({ filteredStores: this.toggleValueFilter(val, this.state.filteredStores), }),
    values: this.state.values.stores,
  })
  private purchaseMinDateProps = () => ({
    id: "purchaseDateMin",
    label: "Purchased on or after",
    max: this.state.values.purchase.max,
    min: this.state.values.purchase.min,
    name: "purchaseMin",
    onValidDate: this.setPurchaseMin,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.purchaseMin  || undefined,
  })
  private purchaseMaxDateProps = () => ({
    id: "purchaseDateMax",
    label: "Purchased on or before",
    max: this.state.values.purchase.max,
    min: this.state.purchaseMin || this.state.values.purchase.min,
    name: "purchaseMax",
    onValidDate: this.setPurchaseMax,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.purchaseMax || undefined,
  })
  private expDateMinProps = () => ({
    id: "expDateMin",
    label: "Expires on or after",
    max: this.state.values.exp.max,
    min: this.state.values.exp.min,
    name: "expMin",
    onValidDate: this.setExpMin,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.expMin || undefined,
  })
  private expDateMaxProps = () => ({
    id: "expDateMax",
    label: "Expires on or before",
    max: this.state.values.exp.max,
    min: this.state.expMin || this.state.values.exp.min,
    name: "expMax",
    onValidDate: this.setExpMax,
    testValidDate: this.getDateObjIfValidISO,
    value: this.state.expMax || undefined,
  })
  private qtyMinProps = () => ({
    id: "quantityMin",
    label: "Quantity at least",
    // max: this.state.values.qty.max,
    // min: this.state.values.qty.min,
    onChange: this.setQtyMin,
    value: this.state.values.qty.min,
  })
  private qtyMaxProps = () => ({
    id: "quantityMax",
    label: "Quantity at most",
    // max: this.state.values.qty.max,
    // min: this.state.qtyMin || this.state.values.qty.min,
    onChange: this.setQtyMax,
    value: this.state.qtyMax || undefined,
  })
  private groupAndSelectDataProps = () => ({
    expiredDataOnly: this.state.expiredDataOnly,
    groupDataBy: this.state.groupDataBy,
    setDataGrouping: this.setDataGrouping,
    toggleExpiredDataOnly: this.toggleExpiredDataOnly,
  })
  private tableProps = () => {
    const {
      groupDataBy,
      expiredDataOnly,
      boughtAfterExpiration,
      dataByDate,
      pageSize,
      pageOffset,
    } = this.state;

    return({
      boughtAfterExpiration,
      dataByDate,
      expiredDataOnly,
      filterItem: this.filterItem,
      groupDataBy,
      pageOffset,
      pageSize,
    })
  }
}

export default App;

const getDefaultState = (filterData: (item: Item) => boolean): IState => {
  // Sorts data by date, ascending
    const dataByDate = data
      .sort((a: Item, b: Item) => 
        new Date(a.purchaseDate).valueOf() - new Date(b.purchaseDate).valueOf()
      );

    const expMax = Math.max(...data.map((v: Item) => new Date(v.expirationDate).valueOf()));
    const expMin = Math.min(...data.map((v: Item) => new Date(v.expirationDate).valueOf()));
    const purchaseMax = Math.max(...data.map((v: Item) => new Date(v.purchaseDate).valueOf()));
    const purchaseMin = Math.min(...data.map((v: Item) => new Date(v.purchaseDate).valueOf()));
    const qtyMax = Math.max(...data.map((v: Item) => v.quantity));
    const qtyMin = Math.min(...data.map((v: Item) => v.quantity));

    return {
      boughtAfterExpiration: dataByDate.filter((v: Item) => 
        0 < (new Date(v.purchaseDate).valueOf()) - new Date(v.expirationDate).valueOf()),
      dataByDate,
      dataByDateAndItemName: groupDataByDay(dataByDate, 0, Infinity, filterData),
      expMax,
      expMin,
      expiredDataOnly: false,
      filteredNames: [],
      filteredStores: [],
      filteredTypes: [],
      groupDataBy: "purchase",
      pageOffset: 0,
      pageSize: Infinity,
      purchaseMax,
      purchaseMin,
      qtyMax,
      qtyMin,
      values: {
        exp: {
          max: expMax,
          min: expMin,
        },
        names: pluckSet('name'),
        purchase: {
          max: purchaseMax,
          min: purchaseMin,
        },
        qty: {
          max: qtyMax,
          min: qtyMin,
        },
        stores: pluckSet('store'),
        types: pluckSet('type'),
      },
    };
};
