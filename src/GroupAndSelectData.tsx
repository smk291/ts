import * as React from 'react';

export interface ISetDataAndGroupingProps {
  changeDataset: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  expiredDataOnly: boolean;
  groupDataBy: 'purchase' | 'day' | 'item';
  setDataGrouping: (e: React.MouseEvent<HTMLLabelElement>) => void;
  toggleExpiredDataOnly: (e: React.MouseEvent<HTMLLabelElement>) => void;
}

export const GroupAndSelectData = (props: ISetDataAndGroupingProps) => {
  return (
    <div className="formContainer">
      <label
        htmlFor="chooseData"
        className={['filterLabel', 'dataSelection'].join(' ')}
        onChange={props.setDataGrouping}
        title="purchase"
      >
        <select
          className="dataSelectionInput"
          id="chooseData"
          name="chooseData"
          onChange={props.changeDataset}
        >
          {[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ].map((v, i) => {
            return(
              <option key={i} value={i}>{i}</option>
            );
          })}
        </select>
        Choose a dataset&nbsp;
      </label>
      <label
        htmlFor="byPurchase"
        className={['filterLabel', 'dataSelection'].join(' ')}
        onChange={props.setDataGrouping}
        title="purchase"
      >
        <input
          checked={props.groupDataBy === 'purchase'}
          className="dataSelectionInput"
          id="byPurchase"
          name="tableChoices"
          type="radio"
          value="true"
        />
        Individual Purchases by timestamp
      </label>
      <label
        htmlFor="byDay"
        className={['filterLabel', 'dataSelection'].join(' ')}
        title="day"
        onChange={props.setDataGrouping}
      >
        <input
          checked={props.groupDataBy === 'day'}
          className="dataSelectionInput"
          id="byDay"
          name="tableChoices"
          type="radio"
          value="true"
        />
        Group purchases by day
      </label>
      <label
        htmlFor="byItem"
        className={['filterLabel', 'dataSelection'].join(' ')}
        title="item"
        onChange={props.setDataGrouping}
      >
        <input
          checked={props.groupDataBy === 'item'}
          className="dataSelectionInput"
          id="byItem"
          name="tableChoices"
          type="radio"
          value="true"
        />
        Group purchases by Item
      </label>

      <label
        htmlFor="expiredOnly"
        className={['filterLabel', 'dataSelection'].join(' ')}
        onChange={props.toggleExpiredDataOnly}
      >
        <input
          className={["dataSelectionInput", "expiredCheckbox"].join(" ")}
          checked={props.expiredDataOnly}
          id="expiredOnly"
          type="checkbox"
          value="true"
          style={{height: "unset", lineHeight: "14px"}}
        />
        Show only items purchased after expirationDate
      </label>
    </div>
  );
};
