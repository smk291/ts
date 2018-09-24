import * as React from 'react';


interface IFilterProps {
  label: string,
  defaultOpen?: boolean;
};

interface IFilterState {
  expand: boolean;
}

export class Collapsible extends React.Component<IFilterProps, IFilterState> {
  constructor(props: IFilterProps) {
    super(props);

    this.state = {
      expand: this.props.defaultOpen || false,
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
