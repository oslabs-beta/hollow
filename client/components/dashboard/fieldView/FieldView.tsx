// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

import { FieldViewState, FieldViewProps } from './interface.ts';

class FieldView extends React.Component<FieldViewProps, FieldViewState> {
  constructor(props: FieldViewProps) {
    super(props);
    this.state = { saveFail: false, saveSuccess: false, loading: false, activeEntryValues: {} };
    this.handleSave = this.handleSave.bind(this);
  }

  // TODO:
  // add handlers to check for correct data type on edit of field values
  // make request to update and handle loading state correctly


  handleSave(event: React.MouseEvent) {
    event.preventDefault();
    this.setState({ ...this.state, loading: true });
    //@ts-ignore
    const inputCount = event.target.form.childElementCount;
    const data: any = {};
    let count = 1;
    while (count <= inputCount) {
      //@ts-ignore
      const inputName = event.target.form[count].labels[0].innerText;
      //@ts-ignore
      const value = event.target.form[count].value;
      data[inputName] = value;
      count += 1;
    }
    console.log(data);
  };

  componentDidMount() {
    this.setState({ ...this.state, activeEntryValues: this.props.activeEntry });
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target);
    // @ts-ignore
    const field = event.target.name;
    // @ts-ignore
    const value = event.target.value;

    const copy = this.state.activeEntryValues;
    copy[field] = value;
    this.setState({ ...this.state, activeEntryValues: copy });
  }

  render () {

    // destructure props
    const { activeEntry, activeItem } = this.props;
    console.log(activeEntry);
    const entryDataArr = Object.entries(activeEntry).map(([field, value], index) => (
      <div className='fieldViewSect' key={`${field}-${index}`}>
        <label className='fieldViewLabel' htmlFor={field}>{field}</label>
        <input className='fieldViewInput' type='text' id={field} name={field} value={this.state.activeEntryValues[field]} onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)} />
      </div>
    ));

    console.log(entryDataArr);
    let loader;

    if (this.state.loading) {
      loader = <div className='saveFieldBtnLoader'></div>;
    } else if (this.state.saveFail) {
      loader = (
        <svg className='saveFieldFailSVG' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
        </svg>
      );
    } else if (this.state.saveSuccess) {
      loader = (
        <svg className='saveFieldSuccessSVG' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
          <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z"/>
        </svg>
      );
    }

    return (
      <div className='fieldViewContainer'>
        <div className='fieldViewHeader'>
          <div className='fieldViewDetails'>
            <p className='fieldViewName'>{Object.keys(activeEntry)[0]}</p>
            <p className='fieldViewCollection'>{activeItem}</p>
          </div>
          <div className='saveFieldBtnContainer'>
            {loader}            
            <button onClick={this.handleSave} type='submit' form='fieldViewForm' className='saveFieldBtn'>Save</button>
          </div>
          
        </div>
        <form id='fieldViewForm' className='fieldViewForm'>
          {entryDataArr}
        </form>
      </div>
    );
  }
 
};

export default FieldView;