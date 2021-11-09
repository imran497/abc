import React, { Component } from 'react';
import * as qs from 'query-string';
import PropTypes from 'prop-types';

import * as parser from '../Common/SbCore';
import { sortButtons } from '../Common/Defaults';
import { Button, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,UncontrolledTooltip } from 'reactstrap';

import '../css/low_level_components/sort_component.css';

export default class SortComponent extends Component{

  constructor(){
    super();
    this.state = {
      showDropdown: false
    };
    this.doSort = this.doSort.bind(this);
  }

  doSort(sorttype, sortdir,e){
    e.preventDefault();
    document.getElementById("myDropdown").classList.remove("show");
    document.getElementById("caret").classList.remove("open");
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    urlParameters.sort = sorttype;
    urlParameters.sortdir = sortdir;
    urlParameters.page = 1;
    this.setState({
      showDropdown: false
    });
    parser.getResults(urlParameters);
  }

  render(){
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    const style1={
      textDecoration: 'none',
      color:'#000',
      pointerEvents:'none'
    };
    const style2={
      color: '#0a4a69',
      cursor:'pointer',
    };
    const style3={
      cursor:'text'
    };
    const style4={
      cursor:'pointer'
    };

    return(


          sortButtons.map(sortbutton => {
            return <a href="" key={sortbutton.field} className="dd-heading"  onClick={(e) => this.doSort(sortbutton.field, this.props.sortdir,e)}>
              {sortbutton.display}
            </a>;
          })


    );
  }
}

SortComponent.propTypes = {
  sort: PropTypes.string,
  sortdir: PropTypes.string
};
