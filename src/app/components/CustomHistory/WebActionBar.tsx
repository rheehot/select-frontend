import { ConnectedUpButton } from 'app/components/CustomHistory/UpButtons';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { connect } from 'react-redux';

const WINDOW_HAS_WEB_ACTION_BAR = 'hasWebActionBar';

export interface WebActionBarStateProps {
  backgroundColor: string;
  isIosApp: boolean;
}

export class WebActionBar extends React.Component<WebActionBarStateProps> {
  public componentDidMount() {
    document.getElementsByTagName('body')[0].classList.add(WINDOW_HAS_WEB_ACTION_BAR);
  }

  public componentWillUnmount() {
    document.getElementsByTagName('body')[0].classList.remove(WINDOW_HAS_WEB_ACTION_BAR);
  }

  public render() {
    const { backgroundColor, isIosApp, children } = this.props;

    return (
      <div
        className="WebActionBar"
        style={isIosApp ? {} : { backgroundColor }}
      >
        <ConnectedUpButton />
        <h1 className="WebActionBar_Text">
          {children}
        </h1>
      </div>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState) => ({
  backgroundColor: getSolidBackgroundColorRGBString(rootState),
  isIosApp: getIsIosInApp(rootState),
});

export const ConnectedWebActionBar = connect(mapStateToProps)(WebActionBar);
