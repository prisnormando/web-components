/* global CKEDITOR:false */
'use strict';

import {log as logger} from '../Log.js';
let log = logger.Logger('editable-rich');

import React from 'react';
import PropTypes from 'prop-types';

import {PencilIcon} from '../Icons.js';
import {Spinner} from '../LoadingSpinner.js';
import {Button} from 'reactstrap';
import cn from 'classnames';

class EditableRich extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			editing: false,
			processing: false
		};
		this.inputTextarea = React.createRef();
	}

	componentDidUpdate(prevProps) {
		if(this.props.value != prevProps.value){
			this.setState({value:this.props.value});
		}
	}

	edit = () => {
		const {id} = this.props;
		this.setState({
			editing: true
		}, () => {
			tinymce.init({
				selector: `#${id}`,
				toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | subscript superscript blockquote',
				branding:false,
				menubar:false,
				statusbar:true,
				auto_focus:this.props.id,
				setup:(ed)=>{
					//ed.on('blur', this.blurSave);
				}
			});
		});
	}

	save = async () => {
		let {value} = this.state;

		let {id, field} = this.props;
		let tinyInstance = tinymce.get(id);
		if(tinyInstance != null) {
			value = tinyInstance.getContent();
			tinyInstance.remove();
		} else {
			log.warn('no tinyMCE instance when saving editable-rich');
		}

		this.setState({
			editing: false,
			processing: true,
		});

		await this.props.saveField(this.props.field, value);
		this.setState({
			processing: false,
			editing: false,
			//value: respData.data[this.props.field]
		});
	}

	cancel = () => {
		let {id} = this.props;
		let tinyInstance = tinymce.get(id);
		if(tinyInstance != null) {
			tinyInstance.remove();
		}
		this.setState({
			editing: false
		});
	}

	getMarkup = () => {
		return {
			__html: this.state.value || this.props.emptytext
		};
	}

	saveHandler = (ev) => {
		ev.preventDefault();
		this.save();
	}

	cancelHandler = (ev) => {
		ev.preventDefault();
		this.cancel();
	}

	render() {
		const {processing, editing, value} = this.state;
		const {title, id, editable} = this.props;

		let cssClasses = cn({
			'profile-editable-rich':true,
			'profile-editable-value':(!!value),
			'profile-editable-emptytext':(!value)
		});

		if(processing) {
			return <div className={ cssClasses }>
				<h2>{ title }</h2>
				<Spinner />
			</div>;
		}

		if(editing) {
			return <form className="profile-editable-rich profile-editable-editing" onSubmit={ this.saveHandler }>
				<h2>{ title }</h2>
				<textarea ref={ this.inputTextarea } id={id} defaultValue={ value } />
				<div className="profile-timeline-form-actions">
					<Button outline size='sm' color='secondary' onClick={this.saveHandler} >Save</Button>{' '}
					<Button outline size='sm' color='secondary' onClick={this.cancelHandler} >Cancel</Button>
				</div>
			</form>;
		} else {
			return <div className={ cssClasses }>
				<h2>{ title }</h2>
				{editable ? <Button outline size='sm' color='secondary' onClick={this.edit} className='mb-2 ml-2'><PencilIcon /></Button> : null}
				<span dangerouslySetInnerHTML={ this.getMarkup() }></span>
			</div>;
		}	
	}
}


EditableRich.propTypes = {
	title: PropTypes.string,
	field: PropTypes.string,
	emptytext: PropTypes.string,
	value: PropTypes.string
};

export {EditableRich};