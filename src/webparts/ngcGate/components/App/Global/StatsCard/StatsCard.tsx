import * as React from "react";
import "./styles.css";

function formatNumberWithCommas(number: any) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


type StatsCardProps = {
  label: string,
  value: string,
  perc: number,
  color?: string,
}

export const StatsCard = (props: StatsCardProps) => {
  
  return (
    <div id="stats-card" data-color={props.color} style={{ borderColor: props.color }}>
      <span 
        className="stats-label" 
        // style={{ color: props.color }}
      >
        {props.label || "0"}
      </span>
      <h1 className="stats-number" /* style={{ backgroundColor: props.color ? `${props.color}10` : "#f8f8f8" }} */>
        {formatNumberWithCommas(props.value || 0)}
      </h1>
      <span className={`stats-perc ${props.perc > 0 ? "up" : props.perc < 0 ? "down" : ""}`}>
        {/* {props.perc > 0 ? <CaretUpOutlined style={{ fontSize: 12 }} /> : props.perc < 0 ? <CaretDownOutlined style={{ fontSize: 12 }} /> : null}
        {props.perc}% */}
      </span>
    </div>
  )
}

type StatsCardDividedProps = {
  label: string,
  values: Array<{ label: string, value: string, color: string }>,
  perc: number,
  color?: string,
}
export const StatsCardDivided = (props: StatsCardDividedProps) => {
  return (
    <div id="stats-card" data-color={props.color} style={{ borderColor: props.color }}>
      <span className="stats-label">
        {props.label || "????"}
      </span>
      <div className="stats-numbers">
        {props.values.map((item, index) => (
          <div key={index} className="stats-item" title={`${item.label}: ${item.value || 0}`}>
            <span style={{ color: item.color }} className="item-label">{item.label}</span>
            <span className="item-value">{formatNumberWithCommas(item.value || 0)}</span>
          </div>
        ))}
      </div>
      <span className={`stats-perc ${props.perc > 0 ? "up" : props.perc < 0 ? "down" : ""}`}>
        {/* {props.perc > 0 ? <CaretUpOutlined style={{ fontSize: 12 }} /> : props.perc < 0 ? <CaretDownOutlined style={{ fontSize: 12 }} /> : null}
        {props.perc}% */}
      </span>
    </div>
  )
}