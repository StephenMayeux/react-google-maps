import {
  default as warning,
} from "warning";

import {
  default as invariant,
} from "invariant";

import {
  default as getDisplayName,
} from "react-display-name";

import {
  default as React,
  PropTypes,
  Component,
} from "react";

export const MAP = `__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`;

export default function withGoogleMap(WrappedComponent) {
  return class Container extends Component {
    static displayName = `withGoogleMap(${getDisplayName(WrappedComponent)})`;

    static propTypes = {
      containerElement: PropTypes.node.isRequired,
      mapElement: PropTypes.node.isRequired,
    };

    static childContextTypes = {
      [MAP]: PropTypes.object,
    };

    state = {
      map: null,
    };

    handleComponentMount = ::this.handleComponentMount;

    getChildContext() {
      return {
        [MAP]: this.state.map,
      };
    }

    componentWillMount() {
      const {
        containerElement,
        mapElement,
      } = this.props;
      invariant(!!containerElement && !!mapElement,
`Required props containerElement or mapElement is missing. You need to provide both of them.
 The \`google.maps.Map\` instance will be initialized on mapElement and it's wrapped by\
 containerElement.\nYou need to provide both of them since Google Map requires the DOM to\
 have height when initialized.`
      );
    }

    handleComponentMount(node) {
      if (this.state.map || node === null) {
        return;
      }
      warning(`undefined` !== typeof google,
`Make sure you've put a <script> tag in your <head> element to load Google Maps JavaScript API v3.
 If you're looking for built-in support to load it for you, use the "async/ScriptjsLoader" instead.
 See https://github.com/tomchentw/react-google-maps/pull/168`
      );
      // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
      const map = new google.maps.Map(node);
      this.setState({ map });
    }

    render() {
      const {
        containerElement,
        mapElement,
        ...restProps,
      } = this.props;

      const {
        map,
      } = this.state;

      if (map) {
        return (
          React.cloneElement(containerElement, {
          },
            React.cloneElement(mapElement, {
              ref: this.handleComponentMount,
            }),
            (<div>
              <WrappedComponent {...restProps} />
            </div>)
          )
        );
      } else {
        return (
          React.cloneElement(containerElement, {
          },
            React.cloneElement(mapElement, {
              ref: this.handleComponentMount,
            }),
            (<div />)
          )
        );
      }
    }
  };
}
