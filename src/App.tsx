import * as React from 'react';
import './App.css';

const data = require('./data/data-0.json');

interface Item extends JSON {
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

// Returns date as a string of the following format: YYYY-MM-DD
function getStrDate (date: Date) { return date.toISOString().slice(0, 10); }

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
    columns: string[],
    boughtAfterExpiration: Item[]
    data: Item[],
    dataByDateAndItemName: Array<{ [key: string]: {[key: string]: number }}>,
    values: {
      types: string[],
      names: string[],
      stores: string[],
      purchase: {
        min: number,
        max: number,
      },
      exp: {
        min: number,
        max: number,
      },
      qty: {
        min: number,
        max: number,
      },
    },
    filteredNames: string[],
    filteredTypes: string[],
    filteredStores: string[],
    purchaseMin: null | number,
    purchaseMax: null | number,
    expMin: null | number,
    expMax: null | number,
    qtyMin: null | number,
    qtyMax: null | number,
};


class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    // Sorts data by date, ascending
    const sortedByDate = data
      .sort((a: Item, b: Item) => 
        new Date(a.purchaseDate).valueOf() - new Date(b.purchaseDate).valueOf()
      );

    // Returns object. 
    // Keys are string dates (ex '2015-01-01'). 
    // Values are an object: keys are names of items; values are quantities purchased on that date.
    const dataByDateAndItemName = data.reduce((acc, item, i) => {
      const stringPurchaseDate = getStrDate(new Date(item.purchaseDate));

      if (!(stringPurchaseDate in acc)) {
        acc[stringPurchaseDate] = {};
      }

      if (!(item.name in acc[stringPurchaseDate])) {
        acc[stringPurchaseDate][item.name] = 0;
      }

      acc[stringPurchaseDate][item.name] += item.quantity;      

      return acc;
    }, {});
  
    // Return array of types included in data
    // const types = 

    const expMax = Math.max(...data.map((v: Item) => new Date(v.expirationDate).valueOf()));
    const expMin = Math.min(...data.map((v: Item) => new Date(v.expirationDate).valueOf()));
    const purchaseMax = Math.max(...data.map((v: Item) => new Date(v.purchaseDate).valueOf()));
    const purchaseMin = Math.min(...data.map((v: Item) => new Date(v.purchaseDate).valueOf()));
    const qtyMax = Math.max(...data.map((v: Item) => v.quantity));
    const qtyMin = Math.min(...data.map((v: Item) => v.quantity));
    this.state = {
      boughtAfterExpiration: [],
      columns: Object.keys(data[0]),
      // showAbsTimes: true,
      // sortBy: "name",
      // sortAscending: true,
      data: sortedByDate,
      dataByDateAndItemName,
      expMax,
      expMin,
      filteredNames: [],
      filteredStores: [],
      filteredTypes: [],
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
  }

  // Applies filters. If any return false, item is filtered out; it won't be included in the displayed list.
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
      filterByMinMax(new Date(fridgeItem.expirationDate).valueOf(), this.state.expMin, this.state.expMax) &&
      filterByMinMax(fridgeItem.quantity, this.state.qtyMin, this.state.qtyMax)
    );
  }

  public componentDidMount() {
    this.setState({
      boughtAfterExpiration: data.filter((v: Item) => 0 < (new Date(v.purchaseDate).valueOf() - new Date(v.expirationDate).valueOf()) ),
      data: data.filter(this.filterItem),
    }, () => console.log(this.state));
  }


  // returns an array grouped by a given key/val.
  // groupBy = (groupByVal, arr, computeGroupByVal) => {

  // }

  // Argument is key of objects in 'data': 'name', 'type', 'store', etc
  // resort = (key: string) => {
  //   if (this.state.sortDirection === 'asc')
  //     this.setState({
  //       data: data.sortBy(v => v[key]),
  //     });
  //   else
  //     this.setState({
  //       data: data.sortBy(v => v[key]).reverse(),
  //     });
  // }

  // setAndSort = (key: string) => {
  //   if (this.state.sortBy !== key) {
  //     this.setState({
  //       sortBy: key,
  //       sortAscending: true,
  //     }, () => {
  //       this.resort
  //     });
  //   } else {
  //     this.setState({sortAscending: !this.state})
  //   }
  // }

  public setExclude = (val: string, exclude: string[]) => {
    const valIdx = exclude.indexOf(val);

    if (valIdx === -1) {
      exclude.push(val);

      return exclude;
    } else {
      return exclude.filter(v => v !== val);
    }
  }

  public testValidDate = (dateStringISO: string, dateChange: (date: Date) => void) => {
    const date = Date.parse(dateStringISO);

    if (!isNaN(date)) {
      dateChange(new Date(date));
    }
  }

  public render() {
    return (
      <main className="App">
        <div className="results">
        <section className="filters">
          <div className="filtersHeader">Filter</div>
          <Filter {...{label: "Name"}}>
            <ExcludeValues 
              {...{
                exclude: this.state.filteredNames,
                key: "name",
                onClick: (val: string) => {
                  this.setState({
                    filteredNames: this.setExclude(val, this.state.filteredNames),
                  })
                },
                values: this.state.values.names,
              }}
            />
          </Filter>
          <Filter {...{label: "Type"}}>
            <ExcludeValues 
              {...{
                exclude: this.state.filteredTypes,
                key: "type",
                onClick: (val: string) => {
                  this.setState({
                    filteredTypes: this.setExclude(val, this.state.filteredTypes),
                  })
                },
                values: this.state.values.types,
              }}
            />
          </Filter>
          <Filter {...{label: "Store"}}>
            <ExcludeValues 
              {...{
                exclude: this.state.filteredStores,
                key: "store",
                onClick: val => {
                  this.setState({
                    filteredStores: this.setExclude(val, this.state.filteredStores),
                  })
                },
                values: this.state.values.stores,
              }}
            />
          </Filter>
          <Filter {...{label: "Purchase date"}}>
            <div className="excludeContainer">
              <DatePicker 
                id="purchaseDateMin"
                label="On or after"
                min={this.state.values.purchase.min}
                max={this.state.values.purchase.max}
                name="purchaseMin"
                onValidDate={this.setPurchaseMin}
                testValidDate={this.testValidDate}
                value={this.state.purchaseMin  || undefined}
              />
              <DatePicker
                id="purchaseDateMax"
                label="On or before"
                min={this.state.purchaseMin || this.state.values.purchase.min}
                max={this.state.values.purchase.max}
                name="purchaseMax"
                onValidDate={this.setPurchaseMax}
                testValidDate={this.testValidDate}
                value={this.state.purchaseMax || undefined}
              />
            </div>
          </Filter>
          <Filter {...{label: "Expiration date"}}>
            <div className="excludeContainer">
              <DatePicker
                label="On or after"
                id="expDateMin"
                min={this.state.values.exp.min}
                max={this.state.values.exp.max}
                name="expMin"
                onValidDate={this.setExpMin}
                testValidDate={this.testValidDate}
                value={this.state.expMin || undefined}

              />
              <DatePicker
                label="On or before"
                id="expDateMax"
                min={this.state.expMin || this.state.values.exp.min}
                max={this.state.values.exp.max}
                name="expMax"
                onValidDate={this.setExpMax}
                testValidDate={this.testValidDate}
                value={this.state.expMax || undefined}
              />
            </div>
          </Filter>
          <Filter {...{label: "Quantity"}}>
            <div className="excludeContainer">
              <div>
                <label htmlFor="quantityMin">
                  At least
                </label>
                <input
                  id="quantityMin"
                  min={this.state.values.qty.min}
                  max={this.state.values.qty.max}
                  value={this.state.values.qty.min}
                  onChange={this.setQtyMin}
                />
              </div>
              <div>
                <label htmlFor="quantityMax">
                  At most
                </label>
                <input
                  id="quantityMax"
                  min={this.state.qtyMin || this.state.values.qty.min}
                  max={this.state.values.qty.max}
                  value={this.state.qtyMax || undefined}
                  onChange={this.setQtyMax}
                />
              </div>
            </div>
          </Filter>

        </section>
        <section className="tableContainer">
          <table className="table">
            <thead>
              <tr className="tableHeader">
                {this.state.columns.map((key, i) =>
                  <th key={i} /* onClick={this.setAndSort} */>
                    {keyToLabel[key]}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data
                .filter(this.filterItem)
                .slice(0, 100)
                .map((item: Item, i: number) => {

                  return <tr key={i} className={["row", i % 2 === 0 ? "rowEven" : ""].join(" ")}>
                    {this.state.columns.map((key, j) => 
                      cell(key, j, item)
                    )}
                  </tr>
                })
              }
            </tbody>
          </table>
        </section>
        </div>
      </main>
    );
  }

  private setPurchaseMin = (date: Date) => { this.setState({ purchaseMin: date.valueOf() }); }
  private setPurchaseMax = (date: Date) => { this.setState({ purchaseMax: date.valueOf() }); }
  private setExpMax      = (date: Date) => { this.setState({ expMax: date.valueOf() }); }
  private setExpMin      = (date: Date) => { this.setState({ expMin: date.valueOf() }); }
  private setQtyMin = (e: React.ChangeEvent<HTMLInputElement>) => { 
    this.setState({ qtyMin: parseInt(e.currentTarget.value, 10) || null, }); 
  }
  private setQtyMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ qtyMax: parseInt(e.currentTarget.value, 10) || null, });
  }
}

export default App;

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
  expirationDate: "Expires on",
  name: "Item",
  purchaseDate: "Purchased on",
  quantity: "Qty",
  store: "Origin",
  type: "Type",
};


interface IFilterProps {
  label: string,
};

interface IFilterState {
  expand: boolean;
}

class Filter extends React.Component<IFilterProps, IFilterState> {
  constructor(props: IFilterProps) {
    super(props);

    this.state = {
      expand: false
    }

    this.handleExpand = this.handleExpand.bind(this);
  }

  public handleExpand = () => this.setState({expand: !this.state.expand})

  public render() {
    return(
      <div className="filterContainer">
        <div
          className="filterLabel"
          onClick={this.handleExpand}
        >
          <span>{this.props.label}</span>
          <span>{this.state.expand ? "▼" : "▶"}</span>
        </div>
        {this.state.expand && this.props.children || null}
      </div>
    );
  }
}


interface IExcludeProps {
  values: string[],
  exclude: string[]
  onClick: (e: string) => void;
};

class ExcludeValues extends React.Component<IExcludeProps, {}> {
  constructor(props: IExcludeProps) {
    super(props);

    this.handleExclude = this.handleExclude.bind(this);
  }

  public handleExclude = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    this.props.onClick(e.currentTarget.title);
  }

  public render() {
    return(
      <div className="excludeContainer">
        {this.props.values.map((val, i) => {
          const id = val + "-" + i;

          return([
            <div
              className={
                [
                  "exclude",
                  this.props.exclude.indexOf(val) === -1 ? "notFilteredOut" : "filteredOut"
                ].join(" ")
              }
              onClick={this.handleExclude}
              key={id}
              title={val}
            >
              <div className="excludeText">{val}</div>
            </div>
          ]);
        })}
      </div>
    );
  }
}

interface IDatePickerProps {
  id: string;
  label: string;
  max: number;
  min: number;
  name: string;
  testValidDate: (strDate: string, onValidDate: (date: Date) => void) => void;
  onValidDate: (date: Date) => void;
  value: number | undefined;
};

interface IDatePickerState {
  inputVal: string | undefined;
}

class DatePicker extends React.Component <IDatePickerProps, IDatePickerState> {
  constructor(props: IDatePickerProps) {
    super(props);

    this.state = {
      inputVal: ''
    };
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;

    this.setState({inputVal: val}, () => {
      this.props.testValidDate(val, this.props.onValidDate)
    });

  }

  public render() {
    const { id, label, min, max, name, } = this.props;

    return(
      <div>
        <label htmlFor={id}>
          {label}
        </label>
        <input {...{
          id,
          max: getStrDate(new Date(max)),
          min: getStrDate(new Date(min)),
          name,
          onChange: this.handleChange,
          type: "date",
          value: this.state.inputVal,
          
        }}
        />
      </div>
    );
  }
}

  // <input
  //   type="checkbox"
  //   id={id}
  //   checked={props.exclude.indexOf(val) === -1}
  // />
  // <label htmlFor={id}>
  //  {val}
  // </label>

  // <div className="filterContainer">
  //   <div className="filterLabel">
  //     <span>Type</span>
  //     <span>▼</span>
  //   </div>
  // </div>
  // <div className="filterContainer">
  //   <div className="filterLabel">
  //     <span>Store</span>
  //     <span>▼</span>
  //   </div>
  // </div>
  // <div className="filterContainer">
  //   <div className="filterLabel">
  //     <span>Purchase date</span>
  //     <span>▼</span>
  //   </div>
  // </div>
  // <div className="filterContainer">
  //   <div className="filterLabel">
  //     <span>Expiration date</span>
  //     <span>▼</span>
  //   </div>
  // </div>