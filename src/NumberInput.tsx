import * as React from 'react';
import './App.css';

interface INumberInputProps {
  defaultVal?: number | null | undefined;
  formClassName?: string;
  formTitle?: string;
  id: string;
  inputClassName?: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  value: number | undefined | null;
};

interface INumberInputState {
  inputVal: string | undefined;
}

export class NumberInput extends React.Component <INumberInputProps, INumberInputState> {
  constructor(props: INumberInputProps) {
    super(props);

    this.state = {
      inputVal: this.props.defaultVal !== undefined && this.props.defaultVal !== null && this.props.defaultVal.toString() || '',
    };
  }

  public componentWillReceiveProps(nextProps: INumberInputProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        inputVal: nextProps.value && nextProps.value.toString() || '', });
    }
  }

  // This isn't necessary and is slightly inefficient, but separates concerns a little bit, which can be helpful
  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();

    const val = e.currentTarget.value;

    this.setState({ inputVal: val }, () => this.props.onChange(e));
  }

  public render() {
    const { id, label, } = this.props;
    const input = [
      this.props.label 
        ? <label key={0} htmlFor={id} className="numberInputLabel">
            {label}
          </label>
        : null,
      <input key={1} className={this.props.inputClassName || "numberInput"}
        {...{
          autoComplete: "new-password",
          id,
          name,
          onChange: this.handleChange,
          title: this.props.title,
          value: this.state.inputVal,
        }}
      />,
    ];

    if (this.props.onSubmit !== undefined) {
      return (
        <form className={this.props.formClassName} title={this.props.formTitle} onSubmit={this.props.onSubmit}>
          {input}
        </form>
      );
    }

    return(
      <div className="numberInputContainer">
        {input}
      </div>
    );
  }
}