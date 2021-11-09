import React, { Fragment,useState } from 'react';
import {
  Col,
  Row,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  UncontrolledTooltip,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,Label
} from "reactstrap";
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import AutoSuggestComponent from '../AutoSuggest/AutoSuggestComponent';
import '../css/search_component.css';
import '../../fw/css/font-awesome.min.css';
import '../css/topbar_search.css';
import SortComponent from '../../sb/Sort/SortComponent';
import { facets, facetFiltersOrder,customDateSettings,voiceSearch,showAutoSuggest } from '../Common/Defaults';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBDropdownLink } from 'mdb-react-ui-kit';
import VoiceSearch from '../SearchInput/VoiceSearchInput';
import useSpeechToText from "../Hooks";
import { VoiceContext } from '../../App.js';

class SearchComponent extends React.Component{
  constructor(){
    super();
    this.changeSearchInput = this.changeSearchInput.bind(this);
    this.clearSearchInput = this.clearSearchInput.bind(this);
    this.searchOnEnter = this.searchOnEnter.bind(this);
    this.searchInputBlur = this.searchInputBlur.bind(this);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.voiceSearch = this.voiceSearch.bind(this);
    this.isRecording = this.isRecording.bind(this);
    this.iconsearchtrigger = this.iconsearchtrigger.bind(this);
    this.orderedFacets = [];
    this.state = {
      query: "",
      focusSuggest: false,
      showAutoSuggest: false,
      response: false,
      parameters: Object.assign({}, qs.parse(window.location.search)),
      showSuggest:false,
      isRecording:false,
      index: -1,
    };
  }


  componentWillMount(){
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    if(urlParameters.query){
      this.setState({
        query: urlParameters.query
      });
      // this.triggerSearch(this.urlParameters.query);
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({
      query: (newProps.query).replace(/&quot;/g, '"').replace(/&amp;/g, "&")
    });
  }

  clearSearchInput(e) {
    e.preventDefault();
    let urlParameters = Object.assign({}, qs.parse(window.location.search),urlParameters);
      let locationHref = document.location.href.split("?")[0];
      document.location.href = locationHref;
    // this.setState({
    //   query: ""
    // });
  }

  searchOnEnter(e){
    if(e.keyCode === 40 || e.keyCode === 38){
      e.preventDefault();
      if(!this.state.focusSuggest){
        this.setState({
          focusSuggest: true
        });
      }
    }else{
      if(this.state.focusSuggest){
        this.setState({
          focusSuggest: false
        });
      }
      if(e.keyCode === 13){
        this.triggerSearch(e.target.value);
      }
    }
  }

  changeSearchInput(e){
    this.setState({
      query: e.target.value
    });
    if(!this.state.showAutoSuggest){
      this.setState({
        showAutoSuggest: true
      });
    }
  }

  searchInputBlur(fromAutoSuggest){
    if((!this.state.focusSuggest && !fromAutoSuggest) || fromAutoSuggest){
      setTimeout(()=>{
        this.setState({
          showAutoSuggest: false
        });
      }, 200);
    }
  }

  voiceSearch(data){
    if(data.length!==0){
      this.setState({
        query: data[data.length - 1],
      });
      this.triggerSearch(data[data.length - 1]);
    }
  }

  isRecording(isRecording){
    this.setState({
      isRecording: isRecording,
    });
  }


  triggerSearch(query){
    this.props.resetActualQuery();
    this.setState({
      focusSuggest: false,
      showAutoSuggest: false,
      query: query
    });
    let params = parser.getInitialUrlParameters(query);
    params.page = 1;
    delete params.mlt_id;
    delete params.mlt_col;
    delete params.XPC;
    parser.getResults(params);
  }

  triggerSearch_btn(query){
    this.setState({
      query: '',
      isRecording: true
    });
  }
  iconsearchtrigger(e){
    if(e.keyCode === 13){
        this.triggerSearch(this.state.query);
      }
  }
  render(){
    let { response} = this.state;
    let {securityResponse} = this.props;
    let parameters = Object.assign({}, qs.parse(window.location.search));
    let queryTemp = "";
    if(response.resultInfo && parameters.XPC) {
        if(response.resultInfo.query.length > 100){
          queryTemp = response.resultInfo.query.substring(0, 100).split(" ");
          queryTemp.splice(queryTemp.length - 1, 1);
          response.resultInfo.query = queryTemp.join(" ") + " ...";
        }
    }
    let recordPlaceHolder = "";
    if(this.state.isRecording) {
     recordPlaceHolder = "Listening..." ;
    }
     else {
       recordPlaceHolder = "Type or use your voice to search";
     }


    return (

      <Fragment>
        <div className="search-container">
          <section id="search">
            <label htmlFor="search-input" >
                <i className="fa fa-search opacity-1" tabIndex="0" style={{color: 'grey'}} aria-hidden="true" onClick={()=>this.triggerSearch(this.state.query)}   onKeyDown={(e)=>this.iconsearchtrigger(e)}/>
                <span className="sr-only">Search icons</span>
            </label>
            <VoiceContext.Consumer>
            {
              value => {
                return (
                  <>
                  <input id="search-input" className={(this.state.query.length>=3 && this.state.showAutoSuggest)?"form-control justify-content-between":"form-control justify-content-between "} autoComplete="off"
                      placeholder={((value && value["voice-enabled"]) || (Object.keys(value).length === 0 && voiceSearch)) ? recordPlaceHolder:"Search"}
                      {...this.props.inputProps}
                      onKeyDown={(e)=>this.searchOnEnter(e)}
                      onChange={this.changeSearchInput}
                      onBlur={() => this.searchInputBlur(false)}
                      onFocus={()=>(this.state.focusSuggest && this.state.autoSuggest)?this.setState({focusSuggest: false}):""}
                      value={this.state.query}/>
                  {
                    ((value && value["voice-enabled"]) || (Object.keys(value).length === 0 && voiceSearch)) &&
                    <div onClick={(e)=>this.triggerSearch_btn(e)} className="input-mic-container" style={{display:'flex'}}>
                      <VoiceSearch voiceSearch={this.voiceSearch} isRecording={this.isRecording}/>
                    </div>
                  }
                  </>
                );
              }
            }
            </VoiceContext.Consumer>
            {/*
              (this.state.isRecording) ?
                <div className="loader-1">
                  <div className="audio_dot">{}</div>
                  <div className="audio_dot">{}</div>
                  <div className="audio_dot">{}</div>
                </div>
                :
                null
            */}
            {/*
              (this.state.query.length > 0) &&
                <a href="" id="search-clear" onClick={(e)=>this.clearSearchInput(e)} className="fa fa-times-circle hide" aria-hidden="true">
                  <span className="sr-only">Clear search</span>
                </a>
          */}
            {
              ((parameters.autoSuggestDisplay && parameters.autoSuggestDisplay === "true") || (!parameters.autoSuggestDisplay && showAutoSuggest)) && <AutoSuggestComponent q={this.state.query} searchOnEnter={this.searchOnEnter} focusSuggest={this.state.focusSuggest} showAutoSuggest={this.state.showAutoSuggest}/>
            }
          </section>
        </div>
      </Fragment>
    );
  }
}

export default SearchComponent;
SearchComponent.contextType = VoiceContext;
SearchComponent.propTypes = {
  inputProps: PropTypes.object,
  resetActualQuery:PropTypes.func,
  securityResponse:PropTypes.func
  // isLoading: PropTypes.boolean
};
