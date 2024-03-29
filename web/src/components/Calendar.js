// CalendarComponent.js
import React from "react";
import { Calendar } from "primereact/calendar";

const CalendarComponent = ({ value, onChange, minDate,inputClassName,disable, className,maxDate }) => {
  return (
    <Calendar
      value={value}
      onChange={onChange}
      showIcon={true}
      inputClassName={inputClassName}
      disabled ={disable}
      minDate={minDate} 
      maxDate={maxDate}
      className={className}
    />
  );
};

export default CalendarComponent;
