import React from 'react';
import PropTypes from 'prop-types';

import BaseBadge from 'app/components/idBadge/baseBadge';
import SentryTypes from 'app/proptypes';
import SlugOverflow from 'app/components/idBadge/slugOverflow';

export default class TeamBadge extends React.Component {
  static propTypes = {
    ...BaseBadge.propTypes,
    team: SentryTypes.Team.isRequired,
    avatarSize: PropTypes.number,
    hideAvatar: PropTypes.bool,
  };

  static defaultProps = {
    avatarSize: 24,
    hideAvatar: false,
  };

  render() {
    let {team} = this.props;

    return (
      <BaseBadge
        displayName={<SlugOverflow>#{team.slug}</SlugOverflow>}
        {...this.props}
      />
    );
  }
}
