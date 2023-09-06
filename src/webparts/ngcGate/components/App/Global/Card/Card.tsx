import * as React from "react";
import "./styles.css";

type Props = {
  label: string | React.ReactNode | any,
  extra?: string | React.ReactNode | any,
  children?: React.ReactNode | any,
  className?: string,
  style?: React.CSSProperties,
}

const Card = (props: Props) => {
  return (
    <div id="custom-card" className={props.className} style={props.style}>
      {props.label ? 
        <div className="card-header">
          <span className="card-label">{props.label}</span>
          {props.extra ? <span className="card-extra">{props.extra}</span> : null}
        </div>
      : null}
      <div className="card-body">
        {props.children}
      </div>
    </div>
  )
}

export default Card