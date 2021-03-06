import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Flex, Box} from 'grid-emotion';
import styled from 'react-emotion';

import AsyncComponent from 'app/components/asyncComponent';
import OrganizationState from 'app/mixins/organizationState';
import OldDashboard from 'app/views/organizationDashboard/oldDashboard';
import ProjectNav from 'app/views/organizationDashboard/projectNav';
import TeamMembers from 'app/views/organizationDashboard/teamMembers';
import ProjectCard from 'app/views/organizationDashboard/projectCard';
import EmptyState from 'app/views/organizationDashboard/emptyState';
import getProjectsByTeams from 'app/utils/getProjectsByTeams';
import withTeams from 'app/utils/withTeams';
import withProjects from 'app/utils/withProjects';

class Dashboard extends AsyncComponent {
  static propTypes = {
    teams: PropTypes.array,
    projects: PropTypes.array,
  };

  componentWillMount() {
    $(document.body).addClass('org-dashboard');
    super.componentWillMount();
  }
  componentWillUnmount() {
    $(document.body).removeClass('org-dashboard');
    super.componentWillUnmount();
  }

  getEndpoints() {
    const {orgId} = this.props.params;
    return [['projectsWithStats', `/organizations/${orgId}/projects/?statsPeriod=24h`]];
  }

  renderBody() {
    const {teams, projects, params} = this.props;
    const {projectsByTeam} = getProjectsByTeams(teams, projects);
    const projectKeys = Object.keys(projectsByTeam);

    const {projectsWithStats} = this.state;
    const getStats = id => projectsWithStats.find(project => id === project.id).stats;

    return (
      <React.Fragment>
        {projectKeys.map((slug, index) => {
          const showBorder = index !== projectKeys.length - 1;
          return (
            <TeamSection key={slug} showBorder={showBorder}>
              <TeamTitleBar justify="space-between" align="center">
                <TeamName>{`#${slug}`}</TeamName>
                <TeamMembers teamId={slug} orgId={params.orgId} />
              </TeamTitleBar>
              <ProjectCards>
                {projectsByTeam[slug].map(project => {
                  return (
                    <ProjectCardWrapper
                      key={project.id}
                      width={['100%', '50%', '33%', '25%']}
                    >
                      <ProjectCard project={project} stats={getStats(project.id)} />
                    </ProjectCardWrapper>
                  );
                })}
              </ProjectCards>
            </TeamSection>
          );
        })}
        {!projectKeys.length && <EmptyState orgId={params.orgId} />}
      </React.Fragment>
    );
  }
}

const TeamSection = styled.div`
  border-bottom: ${p => (p.showBorder ? '1px solid ' + p.theme.borderLight : 0)};
`;

const TeamTitleBar = styled(Flex)`
  padding: 24px 24px 0;
  margin-bottom: 16px;
`;

const TeamName = styled.h4`
  margin: 0;
  font-size: ${p => p.theme.fontSizeExtraLarge};
`;

const ProjectCards = styled(Flex)`
  flex-wrap: wrap;
  padding: 0 16px 24px;
`;

const ProjectCardWrapper = styled(Box)`
  padding: 8px;
`;

const OrganizationDashboard = createReactClass({
  displayName: 'OrganizationDashboard',
  mixins: [OrganizationState],

  render() {
    const hasNewDashboardFeature = this.getFeatures().has('dashboard');

    if (hasNewDashboardFeature) {
      return (
        <Flex flex="1" direction="column">
          <ProjectNav />
          <Dashboard {...this.props} />
        </Flex>
      );
    } else {
      return <OldDashboard {...this.props} />;
    }
  },
});

export {Dashboard};
export default withTeams(withProjects(OrganizationDashboard));
