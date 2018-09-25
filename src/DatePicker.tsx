import * as React from 'react';
import { getISODateString } from './App';
import './App.css';

interface IDatePickerProps {
  id: string;
  label: string;
  max: number;
  min: number;
  name: string;
  testValidDate: (strDate: string | null | undefined, onValidDate: (date: Date | null) => void) => void;
  onValidDate: (date: Date | null) => void;
  value: number | undefined;
};

interface IDatePickerState {
  inputVal: string | undefined;
}

export class DatePicker extends React.Component <IDatePickerProps, IDatePickerState> {
  constructor(props: IDatePickerProps) {
    super(props);

    this.state = {
      inputVal: ''
    };
  }

  public render() {
    const { id, label, min, max, name, } = this.props;

    return(
      <div className="datepickerContainer">
        <label className="datepickerLabel" htmlFor={id}>
          {label}
        </label>
        <input className="datepickerInput"
          {...{
            id,
            max: getISODateString(new Date(max)),
            min: getISODateString(new Date(min)),
            name,
            onChange: this.handleChange,
            type: "date",
            value: this.state.inputVal,
          }}
        />
      </div>
    );
  }
  
  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;

    this.setState({inputVal: val}, () => {
      this.props.testValidDate(val, this.props.onValidDate)
    });

  }
}