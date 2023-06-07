import React, { useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n-react';
import { BrowserRouter as Router } from 'react-router-dom';


import {
  EuiErrorBoundary,
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent_Deprecated as EuiPageContent,
  EuiPageContentBody_Deprecated as EuiPageContentBody,
  EuiPageContentHeader_Deprecated as EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiBasicTable
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

interface WindAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int) {
    characters(page: $page) {
      info {
        count
        pages
      }
      results {
        name
        status
        species
      }
    }
  }
`;

// Table columns
const columns = [
  {
    field: 'name',
    name: 'Name',
  },
  {
    field: 'status',
    name: 'Status',
  },
  {
    field: 'species',
    name: 'Species',
  },
];


export const WindApp = ({ basename, notifications, http, navigation }: WindAppDeps) => {
  // Use React hooks to manage state
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);

  //Issues on bundle seems to be related to Apollo Client caching
  const cache = new InMemoryCache();

  //Initialize Apollo Client - Rick and Morty Open API
  const client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql',
    cache: new InMemoryCache()
  });

  const fetchCharacters = async () => {

    const { data } = await client.query({
      query: GET_CHARACTERS,
      variables: { page }
    });

    setCharacters(data.characters.results);

  };

  const onClickHandler = async () => {
    console.log('onClickHandler has been called!');
    setPage((prevPage) => prevPage + 1);
    await fetchCharacters();
  };

  return (
    <Router basename={basename}>
      <EuiErrorBoundary>
        <I18nProvider>
          <>
            <navigation.ui.TopNavMenu
              appName={PLUGIN_ID}
              showSearchBar={true}
              useDefaultBehaviors={true}
            />
            <EuiPage restrictWidth="1000px">
              <EuiPageBody>
                <EuiPageHeader>
                  <EuiTitle size="l">
                    <h1>
                      <FormattedMessage
                        id="wind.helloWorldText"
                        defaultMessage="{name}"
                        values={{ name: PLUGIN_NAME }}
                      />
                    </h1>
                  </EuiTitle>
                </EuiPageHeader>
                <EuiPageContent>
                  <EuiPageContentHeader>
                    <EuiTitle>
                      <h2>
                        <FormattedMessage
                          id="wind.congratulationsTitle"
                          defaultMessage="Kibana Plugin is not able to bundle using GraphQL + Apollo Client!"
                        />
                      </h2>
                    </EuiTitle>
                  </EuiPageContentHeader>
                  <EuiPageContentBody>
                    <ApolloProvider client={client}>
                      <EuiText>
                        <EuiBasicTable
                          items={characters}
                          columns={columns}
                        />
                        <EuiHorizontalRule />
                        <EuiButton type="primary" size="s" onClick={onClickHandler}>
                          <FormattedMessage id="wind.buttonText" defaultMessage="Fetch data" />
                        </EuiButton>
                      </EuiText>
                    </ApolloProvider>
                  </EuiPageContentBody>
                </EuiPageContent>
              </EuiPageBody>
            </EuiPage>
          </>
        </I18nProvider>
      </EuiErrorBoundary>
    </Router>
  );
};
