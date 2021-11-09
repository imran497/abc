// let configObject = {};
// let facetFilters = [];
// let facetSettings = document.getElementById("sb_facet_settings");
// let commonSettings = document.getElementById("sb_common_settings");
// let tuningSettings = document.getElementById("tuning_settings");
// let predictSearchSettings = document.getElementById("predictResults");
// let sbId = document.getElementById("cid");
// if(facetSettings){
//   let requiredFacetsFields = Object.keys(facetSettings.dataset);
//
//   for(let i = 0, len = requiredFacetsFields.length; i < len; i++){
//     let facetFilter = {};
//     let fieldValue = facetSettings.dataset[requiredFacetsFields[i]];
//     let field = requiredFacetsFields[i];
//     let fieldValuesArray = fieldValue.split("|");
//     facetFilter["field"] = field;
//     if(fieldValuesArray[0]){
//       facetFilter["display"] = fieldValuesArray[0];
//     }else{
//       facetFilter["display"] = "";
//     }
//     if(fieldValuesArray[1]){
//       if(parseInt(fieldValuesArray[1]) > 0){
//         facetFilter["size"] = fieldValuesArray[1];
//       }else{
//         facetFilter["dateRange"] = [
//                     {"name":"Last 24 hours","calendar":"days","value":"1"},
//                     {"name":"Past Week","calendar":"days","value":"7"},
//                     {"name":"Past Month","calendar":"months","value":"1"},
//                     {"name":"Past Year","calendar":"years","value":"1"}
//                 ];
//       }
//     }
//     facetFilters.push(facetFilter);
//   }
// }
// if(commonSettings){
//   let collections = commonSettings.getAttribute("collections");
//   let pageSize = commonSettings.getAttribute("pageSize");
//   let autoSuggest = commonSettings.getAttribute("autosuggest");
//   let sortButtons = commonSettings.getAttribute("sortButtons");
//   let sortDirection = commonSettings.getAttribute("sortDirection");
//   let pluginDomain = commonSettings.getAttribute("sb_domain");
//   if(collections){
//     configObject.collections = collections.split("|");
//   }
//   if(pageSize){
//     configObject.pageSize = pageSize;
//   }
//   if(autoSuggest){
//     configObject.showAutoSuggest = autoSuggest;
//   }
//   if(pluginDomain){
//     configObject.pluginDomain = pluginDomain;
//   }
//   if(sortButtons){
//     let sortBtns = [];
//     let sortButtonsArray = sortButtons.split("|");
//     for(let i = 0, len = sortButtonsArray.length; i < len; i++){
//       let srtBtn = {
//         field: sortButtonsArray[i].split(":")[0],
//         display: sortButtonsArray[i].split(":")[1]
//       };
//       sortBtns.push(srtBtn);
//     }
//     configObject.sortBtns = sortBtns;
//   }
//
//   if(sortDirection){
//     configObject.sortDir = sortDirection;
//   }else{
//     configObject.sortDir = "desc";
//   }
// }
//
// if(tuningSettings){
//   let enable = tuningSettings.getAttribute("enable");
//   let tuningValues = tuningSettings.getAttribute("tuningValues");
//   if(enable){
//     configObject.enable = enable;
//   }
//   if(tuningValues){
//     let tuneValues = [];
//     let tuningValuesArray = tuningValues.split("|");
//     for(let i = 0, len = tuningValuesArray.length; i < len; i++){
//       let tuneObj = {
//         field: tuningValuesArray[i].split("=")[0],
//         display: tuningValuesArray[i].split("=")[1]
//       };
//       tuneValues.push(tuneObj);
//     }
//     configObject.tuneValues = tuneValues;
//   }
// }
//
// if(sbId){
//   let sbCustomerId = sbId.getAttribute("sb_id");
//   (sbCustomerId)?configObject.sb_id = sbCustomerId:null;
// }
//
// if(predictSearchSettings){
//   let predictSearch = predictSearchSettings.getAttribute("predictSearch");
//   let predictResultSize = predictSearchSettings.getAttribute("predictResultSize");
//   if(predictSearch){
//     configObject.predictSearch = predictSearch;
//   }
//   if(predictResultSize){
//     configObject.predictResultSize = predictResultSize;
//   }
// }
//
//
// configObject["facets"] = facetFilters;
//
// if(window.facets){
//   window.facets = {
//     ...window.facets,
//     ...configObject
//   };
// }else{
//   window.facets = configObject;
// }
