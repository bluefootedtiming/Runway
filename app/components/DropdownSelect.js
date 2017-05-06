import React from 'react';
import PropTypes from 'prop-types';

const DropdownSelect = (props) => (
  <select
    defaultValue={props.defaultValue || props.placeHolder}
    onChange={props.onChange}
  >
    {(props.options.length === 0 || !props.defaultValue) &&
      <option>{props.placeHolder}</option>}
    {props.options.map(value => (
      <option key={value} label={value} value={value} />
    ))}
  </select>
);

DropdownSelect.defaultProps = {
  placeHolder: '',
  onChange: null
};

DropdownSelect.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeHolder: PropTypes.string,
  onChange: PropTypes.func
};

export default DropdownSelect;
