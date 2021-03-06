'use strict';

//import {log as logger} from './Log.js';
//let log = logger.Logger('ExtensionsPicker');

const React = require('react');
const {Component} = React;

import {InstallConnectorPrompt} from './InstallConnector.js';

class ExtensionsPicker extends Component {
	componentDidMount(){
		document.documentElement.className += ' react-mounted';
	}
	render(){
		return (
			<div id='extensions-container' className='extensions-picker react'>
				<InstallConnectorPrompt showStandalone={true} ref="installConnectorPrompt" />
			</div>
		);
	}
}

export {ExtensionsPicker};