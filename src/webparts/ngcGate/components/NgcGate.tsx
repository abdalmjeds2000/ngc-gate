import * as React from 'react';
import { INgcGateProps } from './INgcGateProps';
import App from './App/App';
import './NgcGate.module.scss';
export default class NgcGate extends React.Component<INgcGateProps> {
  public render(): React.ReactElement<INgcGateProps> {
  //   const {
  //     context,
  //     spWebUrl
  // } = this.props;

    return <App {...this.props} />;
  }
}
