import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import * as moment from 'moment';
import * as $ from 'jquery';
import { facets, facetFiltersOrder,customDateSettings } from '../Common/Defaults';
import CustomDateFilters from './CustomDateFilters';
import '../css/facet_filters_component.css';
import {Collapse, Button } from 'reactstrap';

export default class FacetFilterHeader extends Component{
    constructor(){
    super();
    this.orderedFacets = [];
    this.targetForMovableId  = "";
    this.toggleFilter = this.toggleFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.facetToggle = this.facetToggle.bind(this);
    this.mobileFacets = this.mobileFacets.bind(this);
    this.state = {
      clearAllBtn:false,
      mobileFacets:false,
      dateNew:"",
    };
  }

  componentWillMount(){
    this.customizeOrderOfFacets(this.props.facets);
  }

  componentDidMount(){
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
  }

  componentWillReceiveProps(newProps){
    this.customizeOrderOfFacets(newProps.facets);
  }

  customizeOrderOfFacets(facetsInProps){
    // TO REORDER THE FACETS AS CONFIGURED IN FACET.JSON FILE
    let toBeOrder = [];
    let firstOrder = [];
    let nextOrder = [];
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));


    let regex = /^f+\.[A-Za-z]+\.filter+$/g;
    // if(sessionStorage.sessionFacetsOrder && sessionStorage.sessionFacetsOrder !== undefined && sessionStorage.sessionFacetsOrder !== null && sessionStorage.sessionFacetsOrder !== ""){
    //   toBeOrder = Object.assign([], JSON.parse(sessionStorage.sessionFacetsOrder));
    // }else{
    // }
    toBeOrder = Object.assign([], facetFiltersOrder);
    if(facetsInProps.constructor === Array){
      facetsInProps.forEach(function(key,val) {
        let index = toBeOrder.indexOf(Object.keys(key)[0]);
        (index !== -1)
        ?
        firstOrder[index] = facetsInProps[val]
        :
        nextOrder.push(facetsInProps[val]);
      });
      this.orderedFacets = firstOrder.concat(nextOrder);
    }else{
      this.orderedFacets.push(facetsInProps.facet);
    }
    let reorderedFacets = [];
    for (let i=0;i<this.orderedFacets.length;i++){
      for( let j=0;j<facets.length;j++){
        if(this.orderedFacets[i]!==undefined && this.orderedFacets[i].facetField===facets[j].field){
          reorderedFacets.push(this.orderedFacets[i]);
        }
      }
    }
    this.orderedFacets = reorderedFacets;
    let filterApplied = false;
    Object.keys(this.urlParameters).map((paramItem,index) => {
     if(paramItem !== "f.Lang.filter" && paramItem !== "f.language.filter" && regex.test(paramItem)) {
       filterApplied = true;
       this.setState({
         clearAllBtn:true
       });
     }
     return <span key={index}/>;
   });
   if(!filterApplied) {
     this.setState({
       clearAllBtn:false
     });
   }
  }

  /* TOGGLES THE FILTERS
  | CHECKS IF FILTERS ALREADY EXIST. CHECKS ARE BASED ON CURRENT URL
  | IF FILTER EXIST THEN CHECKS ARE DONE IF ARRAY OR STRING AND EXISTING FILTERS ARE REMOVED
  | IF FILTER DOESNT EXIST THEN ADDED AS STRING. IF ALREADY DIFF FILTER EXIST IN SAME TYPE THEN ADDED TO ARRAY
  */

  toggleFilter(e,facetName, filterName){
    e.preventDefault();
    let parserDOM = new DOMParser();
    let regX = /^\[[0-9-]+T[0-9:]+TO([0-9-]+T[0-9:]+|\*)\]$/g;
    let facetFields = [];
    facetFields = Object.assign([], facets);

    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
    if(this.urlParameters[`f.${facetName}.filter`]){
      if(regX.test(this.urlParameters[`f.${facetName}.filter`]) || facetName==customDateSettings.customDateField){
        if(this.urlParameters[`f.${facetName}.filter`] === filterName){
          delete this.urlParameters[`f.${facetName}.filter`];
          if(this.urlParameters.customDate){
            delete this.urlParameters.customDate;
          }
          delete this.urlParameters['facet.field'];
          delete this.urlParameters[`f.${customDateSettings.customDateField}.range`];
          this.urlParameters['facet.field'] = [];
          for(let i=0, len = facetFields.length; i<len; i++){
            this.urlParameters['facet.field'].push(facetFields[i].field);
            if(facetFields[i].dateRange){
              this.urlParameters[`f.${facetFields[i].field}.range`] = [];
              this.urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
                return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";

              });
            }
          }
        }else{
          this.urlParameters[`f.${facetName}.filter`] = filterName;
          if(this.urlParameters.customDate){
            delete this.urlParameters.customDate;
          }
        }
      }
      else if(this.urlParameters[`f.${facetName}.filter`].constructor === Array){
        let indexOfFilter = -1;
        for(let i = 0, len = this.urlParameters[`f.${facetName}.filter`].length; i < len; i++){
          if(encodeURIComponent(parserDOM.parseFromString(this.urlParameters[`f.${facetName}.filter`][i], 'text/html').body.textContent) === encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent)){
            indexOfFilter = i;
          }
        }
        if(indexOfFilter === -1){
          this.urlParameters[`f.${facetName}.filter`].push(encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent));
        }else{
          this.urlParameters[`f.${facetName}.filter`].splice(indexOfFilter, 1);
          if(this.urlParameters[`f.${facetName}.filter`].length === 0)delete this.urlParameters[`f.${facetName}.filter`];
        }
      }else{
        if(encodeURIComponent(parserDOM.parseFromString(this.urlParameters[`f.${facetName}.filter`], 'text/html').body.textContent) === encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent)){
          delete this.urlParameters[`f.${facetName}.filter`];
        }else{
          let temp = this.urlParameters[`f.${facetName}.filter`];
          this.urlParameters[`f.${facetName}.filter`] = [];
          this.urlParameters[`f.${facetName}.filter`].push(temp, encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent));
        }
      }
    }else{
      if(regX.test(filterName)){
        this.urlParameters[`f.${facetName}.filter`] = filterName;
      }else{
        this.urlParameters[`f.${facetName}.filter`] = encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent);
      }
    }
    this.urlParameters.page=1;
    parser.getResults(this.urlParameters);
    this.setState({mobileFacets:false});
  }

  facetToggle(e) {
    e.preventDefault();
    $(e.target).next().slideToggle();
  }
  mobileFacets(e) {
    this.setState({mobileFacets:!this.state.mobileFacets});
  }

  clearAllFilters(e) {
    e.preventDefault();
    // let urlParameters = Object.assign({}, qs.parse(window.location.search));
      let facetFields = [];
      facetFields = Object.assign([], facets);
      let customDateField = "";
      customDateField = customDateSettings.customDateField;
      delete this.urlParameters['facet.field'];
      this.urlParameters['facet.field'] = [];
      for(let i=0, len = facetFields.length; i<len; i++){
        this.urlParameters['facet.field'].push(facetFields[i].field);
        if(`${facetFields[i]['field']}` !== "Lang" && `${facetFields[i]['field']}` !== "language") {
          delete this.urlParameters[`f.${facetFields[i]['field']}.filter`];
        }
        if(this.urlParameters[`f.${customDateField}.filter`]){
          delete this.urlParameters[`f.${customDateField}.filter`];
          delete this.urlParameters[`f.${customDateField}.range`];
        }
        if(facetFields[i].dateRange){
          this.urlParameters[`f.${facetFields[i].field}.range`] = [];
          this.urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
            return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
          });
        }
      }

      if(this.urlParameters.customDate){
        delete this.urlParameters.customDate;
      }
      this.urlParameters.page=1;
      parser.getResults(this.urlParameters);
  }

  render(){
    let { facets } = this.props;
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    // RENDERS THE FACETS AND HAS <Facet /> COMPONENT FOR EACH FACET IN FACETS
    return(
      <Fragment>
        {
          this.orderedFacets.map((facet, index) => {
            let field = Object.keys(facet)[0];
            return(
              <Fragment key={index}>
                  {
                    facet[field].map((filter, index) => {
                      if(filter.rangeField && filter.fromValue.includes("*")){
                        return <p key={index} className="dd-heading">
                          <a href="" onClick={(e) => this.toggleFilter(e,field,filter.fromValue)}
                        className={[filter.filterSelect ?'activeFilter':'inactiveFilter'].join(" ")}
                        >{filter.filterName.replace(/&quot;/g, '"').replace(/&amp;/g, "&")} ({filter.count})
                        {
                          (filter.filterSelect) &&
                          <span><i className="fa fa-close" aria-hidden="true">{' '}</i></span>
                        }
                        </a>
                        </p>;
                      }
                    })
                  }
              </Fragment>
            );
          })
        }
      </Fragment>
    );
  }

}

FacetFilterHeader.propTypes = {
  facets: PropTypes.array
};
