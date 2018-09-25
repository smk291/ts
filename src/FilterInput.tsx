import * as React from 'react';

interface IExcludeProps {
  values: string[];
  exclude: string[];
  onClick: (e: string) => void;
}

export class Filter extends React.Component<IExcludeProps, {}> {
  constructor(props: IExcludeProps) {
    super(props);

    this.handleExclude = this.handleExclude.bind(this);
  }

  public handleExclude = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    this.props.onClick(e.currentTarget.title);
  };

  public render() {
    return (
      <div className="excludeContainer">
        {this.props.values.map((val, i) => {
          const id = val + '-' + i;

          return [
            <div
              className={[
                'exclude',
                this.props.exclude.indexOf(val) === -1
                  ? 'notFilteredOut'
                  : 'filteredOut',
              ].join(' ')}
              onClick={this.handleExclude}
              key={id}
              title={val}
            >
              <div className="excludeText">{val}</div>
            </div>,
          ];
        })}
      </div>
    );
  }
}
