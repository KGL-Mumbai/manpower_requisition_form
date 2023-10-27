import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';

/*const DropdownComponent = ({ optionLabel, optionValue, type, options, selectedOption, onChange }) => {
  const handleDropdownChange = (e) => {
    onChange(e);
  };

  return (
    <Dropdown
      optionLabel={optionLabel}
      optionValue={optionValue}
      value={selectedOption}
      options={options}
      onChange={handleDropdownChange}
      placeholder={`Select a ${type}`}
    />
  );
};*/



const DropdownComponent = ({ optionLabel, optionValue, options, placeholder, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownChange = (e) => {
    setSelectedOption(e.value);
    onChange(e);
  };

  return (
    <Dropdown
      optionLabel={optionLabel}
      optionValue={optionValue}
      value={selectedOption}
      options={options}
      onChange={handleDropdownChange}
      placeholder={placeholder}
    />
  );
};




DropdownComponent.propTypes = {
  optionLabel: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default DropdownComponent;
