import * as React from 'react';
import './App.css';
import { NumberInput } from './NumberInput';

interface IProps {
  changePage: (
    e:
      | React.MouseEvent<HTMLDivElement | HTMLInputElement>
      | React.FormEvent<HTMLFormElement>,
  ) => void;
  changePageSize: (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>,
  ) => void;
  pageOffset: number;
  pageSize: number;
  tableRowCount: number;
}

interface IState {
  pageNumber: number;
  pageSize: number;
}

export class Pagination extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      pageNumber: this.getPageNumber(this.props),
      pageSize: this.props.pageSize,
    };
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (this.props.tableRowCount !== nextProps.tableRowCount) {
      this.setState({
        pageNumber: this.getPageNumber(nextProps),
      });
    }

    if (
      this.props.pageOffset !== nextProps.pageOffset ||
      this.props.pageSize !== nextProps.pageSize
    ) {
      this.setState({
        pageNumber: this.getPageNumber(nextProps),
        pageSize: nextProps.pageSize,
      });
    }
  }

  public render() {
    return (
      <div
        className={[
          'paginationContainer',
          'backgroundDarkest',
          'paginationInput',
        ].join(' ')}
      >
        <div
          onClick={this.props.changePage}
          title="prev"
          className="pageIncrementer"
        >
          «
        </div>
        <div
          className={['pageChangeContainer', 'paginationInputFlex'].join(' ')}
        >
          <span>Page&nbsp;</span>
          <NumberInput
            defaultVal={this.state.pageNumber}
            inputClassName="pageInput"
            value={this.state.pageNumber}
            label=""
            id="changePage"
            title="setPage"
            onChange={this.pageChange}
            onSubmit={this.props.changePage}
            formTitle={
              (this.state.pageNumber && this.state.pageNumber.toString()) ||
              undefined
            }
          />
          <span>
            &nbsp;/&nbsp;{Math.ceil(
              this.props.tableRowCount / this.props.pageSize,
            )}
          </span>
        </div>
        <div className="paginationInputFlex">
          <span>Items per page&nbsp;</span>
          <NumberInput
            defaultVal={this.state.pageSize}
            onSubmit={this.props.changePageSize}
            formTitle={
              (this.state.pageSize && this.state.pageSize.toString()) || 'null'
            }
            inputClassName="pageInput"
            value={this.state.pageSize}
            id="changePageSize"
            title="setPageSize"
            onChange={this.pageSizeChange}
          />
        </div>
        <div
          onClick={this.props.changePage}
          title="next"
          className="pageIncrementer"
        >
          »
        </div>
      </div>
    );
  }

  private getPageNumber = (props: IProps) => {
    return props.pageOffset / props.pageSize + 1;
  };

  private pageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      pageNumber: parseInt(e.target.value, 10) || 0,
    });
  };

  private pageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numVal = parseInt(e.target.value, 10) || NaN;

    if (!isNaN(numVal) && numVal !== 0) {
      this.setState({
        pageSize: numVal,
      });
    }
  };
}
