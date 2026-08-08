import React from 'react';
import ProductToolsCore from './ProductToolsCore';
import KiwangoInsights from './KiwangoInsights';

export default function ProductTools(props) {
  return <><ProductToolsCore {...props} /><KiwangoInsights allRates={props.allRates} currencies={props.currencies} lang={props.lang} /></>;
}
