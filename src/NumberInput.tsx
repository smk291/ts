import * as React from 'react';
import './App.css';

interface INumberInputProps {
  id: string;
  label: string;
  // max: number;
  // min: number;
  onChange: (e: string | null | undefined) => void;
  value: number | undefined;
};

interface INumberInputState {
  inputVal: string | undefined;
}

export class NumberInput extends React.Component<
  INumberInputProps,
  INumberInputState
> {
  constructor(props: INumberInputProps) {
    super(props);

    this.state = {
      inputVal: ''
    };
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const val = e.target.value;

    this.setState({inputVal: val}, () => this.props.onChange(e.target.value));
  }

  public render() {
    const { id, label, } = this.props;

    return(
      <div className="numberInputContainer">
        <label htmlFor={id} className="numberInputLabel">
          {label}
        </label>
        <input className="numberInput"
          {...{
            id,
            // max: max,
            // min: min,
            name,
            onChange: this.handleChange,
            value: this.state.inputVal,
          }}
        />
      </div>
    );
  }
}
